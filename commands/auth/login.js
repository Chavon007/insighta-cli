import http from "http";
import crypto from "crypto";
import chalk from "chalk";
import ora from "ora";
import { exec } from "child_process";
import { saveCredentials } from "../../utils/credentials.js";

const BASE_URL = "https://identity-profile-api-service.vercel.app";

const generateCodeVerifier = () => crypto.randomBytes(32).toString("base64url");
const generateCodeChallenge = (verifier) =>
  crypto.createHash("sha256").update(verifier).digest("base64url");

export const loginCommand = async () => {
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);
  const state = crypto.randomBytes(16).toString("hex");

  const spinner = ora("Opening GitHub login...").start();

  const authUrl =
    `${BASE_URL}/auth/github?` +
    `code_challenge=${code_challenge}&code_challenge_method=S256&state=${state}&redirect_port=9876`;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost:9876");

    if (url.pathname === "/callback") {
      // tokens come directly in the URL from backend redirect
      const access_token = url.searchParams.get("access_token");
      const refresh_token = url.searchParams.get("refresh_token");
      const username = url.searchParams.get("username");
      const role = url.searchParams.get("role");
      const error = url.searchParams.get("error");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Login successful! You can close this tab.</h1>");
      server.close();

      if (error || !access_token) {
        spinner.fail(
          chalk.red("Login failed: " + (error || "no token received")),
        );
        return;
      }

      saveCredentials({ access_token, refresh_token, username, role });
      spinner.succeed(chalk.green(`Logged in as @${username}`));
    }
  });

  server.listen(9876, () => {
    const cmd =
      process.platform === "win32"
        ? `start "" "${authUrl}"`
        : process.platform === "darwin"
          ? `open "${authUrl}"`
          : `xdg-open "${authUrl}"`;

    exec(cmd);
    spinner.text = "Browser opened. Complete login in GitHub...";
  });
};
