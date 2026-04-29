import chalk from "chalk";
import ora from "ora";
import Table from "cli-table3";
import api from "../../utils/api.js";

export const searchProfiles = async (query) => {
  const spinner = ora("Searching profiles...").start();

  try {
    const { data } = await api.get("/api/profiles/search", {
      params: { q: query },
    });

    spinner.stop();

    const table = new Table({
      head: [
        chalk.cyan("ID"),
        chalk.cyan("Name"),
        chalk.cyan("Gender"),
        chalk.cyan("Age"),
        chalk.cyan("Country"),
      ],
    });

    data.data.forEach((profile) => {
      table.push([
        profile.id,
        profile.name,
        profile.gender,
        profile.age,
        profile.country_id,
      ]);
    });

    console.log(table.toString());
  } catch (err) {
    spinner.fail(chalk.red("Search failed: " + err.message));
  }
};
