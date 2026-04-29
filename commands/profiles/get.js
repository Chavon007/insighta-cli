import chalk from "chalk";
import ora from "ora";
import api from "../../utils/api.js";

export const getProfile = async (id) => {
  const spinner = ora("Fetching profile...").start();

  try {
    const { data } = await api.get(`/api/profiles/${id}`);
    spinner.stop();

    const profile = data.data;
    console.log(chalk.green("\nProfile Details:"));
    console.log(`ID:          ${profile.id}`);
    console.log(`Name:        ${profile.name}`);
    console.log(
      `Gender:      ${profile.gender} (${profile.gender_probability})`,
    );
    console.log(`Age:         ${profile.age} (${profile.age_group})`);
    console.log(`Country:     ${profile.country_name} (${profile.country_id})`);
    console.log(`Created at:  ${profile.created_at}`);
  } catch (err) {
    spinner.fail(chalk.red("Failed to fetch profile: " + err.message));
  }
};
