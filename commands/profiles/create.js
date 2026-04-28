import chalk from "chalk";
import ora from "ora";
import api from "../../utils/api.js";

export const createProfile = async (options) => {
  const spinner = ora(`Creating profile for ${options.name}...`).start();

  try {
    const { data } = await api.post("/api/profiles", { name: options.name });
    spinner.stop();

    const profile = data.data;
    console.log(chalk.green("\nProfile created successfully:"));
    console.log(`ID:      ${profile.id}`);
    console.log(`Name:    ${profile.name}`);
    console.log(`Gender:  ${profile.gender}`);
    console.log(`Age:     ${profile.age}`);
    console.log(`Country: ${profile.country_name}`);
  } catch (err) {
    spinner.fail(chalk.red("Failed to create profile: " + err.message));
  }
};