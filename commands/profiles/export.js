import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";
import api from "../../utils/api.js";

export const exportProfiles = async (options) => {
  const spinner = ora("Exporting profiles...").start();

  try {
    const params = { format: options.format };
    if (options.gender) params.gender = options.gender;
    if (options.country) params.country_id = options.country;

    const { data } = await api.get("/api/profiles/export", {
      params,
      responseType: "text",
    });

    const filename = `profiles_${Date.now()}.csv`;
    const filepath = path.join(process.cwd(), filename);
    fs.writeFileSync(filepath, data);

    spinner.succeed(chalk.green(`Exported to ${filepath}`));
  } catch (err) {
    spinner.fail(chalk.red("Export failed: " + err.message));
  }
};
