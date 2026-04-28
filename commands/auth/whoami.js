import chalk from "chalk";
import { getCredentials } from "../../utils/credentials.js";

export const whoamiCommand = () => {
  const credentials = getCredentials();

  if (!credentials) {
    console.log(chalk.red("You are not logged in. Run: insighta login"));
    return;
  }

  console.log(chalk.green(`Logged in as @${credentials.username}`));
  console.log(chalk.blue(`Role: ${credentials.role}`));
};
