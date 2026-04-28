import chalk from "chalk";
import { getCredentials, clearCredentials } from "../../utils/credentials.js";
import api from "../../utils/api.js";

export const logoutCommand = async () => {
  const credentials = getCredentials();

  if (!credentials) {
    console.log(chalk.yellow("You are not logged in."));
    return;
  }

  try {
    await api.post("/auth/logout", {
      refresh_token: credentials.refresh_token,
    });
  } catch {}

  clearCredentials();
  console.log(chalk.green("Logged out successfully."));
};
