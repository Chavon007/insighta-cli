import http from "http";
import crypto from "crypto";
import open from "open";
import chalk from "chalk";
import ora from "ora";
import axios from "axios";
import { saveCredentials } from "../../utils/credentials";

const BASE_URL = process.env.API_URL || "http://localhost:5000";
const PORT = 9876;

const generateCodeVerifier = () => {
  return crypto.randomBytes(32).toString("base64url");
};

const generateCodeChallenge = (verifier) => {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
};

export const loginCommand = async () => {
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);

  const spinner = ora("Opening GitHub login...").start();

  const authUrl =
    `${BASE_URL}/auth/github?` +
    `code_challenge=${code_challenge}&code_challenge_method=S256`;
  // start local callback server

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Login successful! You can close this tab.</h1>");
      server.close();

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/github/callback`, {
          code,
          state,
          code_verifier,
        });

        saveCredentials({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          username: data.user.username,
          role: data.user.role,
        });
        spinner.succeed(chalk.green(`Logged in as @${data.user.username}`));
      } catch (err) {
        spinner.fail(chalk.red("Login failed: " + err.message));
      }
    }
  });

  server.listen(PORT, () => {
    open(authUrl);
  });
};
