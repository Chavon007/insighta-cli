import { Command } from "commander";
import { listProfiles } from "./list.js";
import { getProfile } from "./get.js";
import { searchProfiles } from "./search.js";
import { createProfile } from "./create.js";
import { exportProfiles } from "./export.js";

export const profilesCommand = new Command("profiles").description(
  "Manage profiles",
);

profilesCommand
  .command("list")
  .description("List all profiles")
  .option("--gender <gender>", "Filter by gender")
  .option("--country <country>", "Filter by country")
  .option("--age-group <ageGroup>", "Filter by age group")
  .option("--min-age <minAge>", "Minimum age")
  .option("--max-age <maxAge>", "Maximum age")
  .option("--sort-by <sortBy>", "Sort by field")
  .option("--order <order>", "Sort order (asc/desc)")
  .option("--page <page>", "Page number")
  .option("--limit <limit>", "Results per page")
  .action(listProfiles);

profilesCommand
  .command("get <id>")
  .description("Get a profile by ID")
  .action(getProfile);

profilesCommand
  .command("search <query>")
  .description("Search profiles with natural language")
  .action(searchProfiles);

profilesCommand
  .command("create")
  .description("Create a new profile")
  .requiredOption("--name <name>", "Name of the profile")
  .action(createProfile);

profilesCommand
  .command("export")
  .description("Export profiles to CSV")
  .option("--format <format>", "Export format (csv)", "csv")
  .option("--gender <gender>", "Filter by gender")
  .option("--country <country>", "Filter by country")
  .action(exportProfiles);
