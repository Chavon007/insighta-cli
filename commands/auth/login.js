import http from "http";
import crypto from "crypto";
import chalk from "chalk";
import ora from "ora";
import axios from "axios";
import { exec } from "child_process";
import { saveCredentials } from "../../utils/credentials.js";

const BASE_URL = "https://identity-profile-api-service.vercel.app";

const generateCodeVerifier = () => crypto.randomBytes(32).toString("base64url");
const generateCodeChallenge = (verifier) =>
  crypto.createHash("sha256").update(verifier).digest("base64url");

export const loginCommand = async () => {
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);
  const state = crypto.randomBytes(16).toString("hex"); // 👈 generate state

  const spinner = ora("Opening GitHub login...").start();

  const authUrl =
    `${BASE_URL}/auth/github?` +
    `code_challenge=${code_challenge}&code_challenge_method=S256&state=${state}`; // 👈 include state

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost:9876");

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Login successful! You can close this tab.</h1>");
      server.close();

      // 👈 validate state to prevent CSRF
      if (returnedState !== state) {
        spinner.fail(chalk.red("State mismatch. Possible CSRF attack."));
        return;
      }

      try {
        const { data } = await axios.get(`${BASE_URL}/auth/github/callback`, {
          params: {
            code,
            state,
            code_verifier, // 👈 send code_verifier so backend can verify PKCE
          },
        });

        saveCredentials({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          username: data.user.username,
          role: data.user.role,
        });

        spinner.succeed(chalk.green(`Logged in as @${data.user.username}`));
      } catch (err) {
        spinner.fail(
          chalk.red(
            "Login failed: " +
              (err.response?.data?.message || err.message)
          )
        );
      }
    }
  });

  server.listen(9876, () => {
    // cross-platform browser open
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