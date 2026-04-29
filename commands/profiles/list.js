import chalk from "chalk";
import ora from "ora";
import Table from "cli-table3";
import api from "../../utils/api.js";

export const listProfiles = async (options) => {
  const spinner = ora("Fetching profiles...").start();

  try {
    const params = {};
    if (options.gender) params.gender = options.gender;
    if (options.country) params.country_id = options.country;
    if (options.ageGroup) params.age_group = options.ageGroup;
    if (options.minAge) params.min_age = options.minAge;
    if (options.maxAge) params.max_age = options.maxAge;
    if (options.sortBy) params.sort_by = options.sortBy;
    if (options.order) params.order = options.order;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;

    const { data } = await api.get("/api/profiles", { params });

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
    console.log(chalk.gray(`Page ${data.page} of ${data.total_pages} — Total: ${data.total}`));
  } catch (err) {
    spinner.fail(chalk.red("Failed to fetch profiles: " + err.message));
  }
};