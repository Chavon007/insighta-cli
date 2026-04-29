#!/usr/bin/env node
import { program } from "commander";
import { loginCommand } from "../commands/auth/login.js";
import { logoutCommand } from "../commands/auth/logout.js";
import { whoamiCommand } from "../commands/auth/whoami.js";
import { profilesCommand } from "../commands/profiles/index.js";

program.name("insighta").description("Insighta Labs CLI").version("1.0.0");

program.command("login").description("Login with GitHub").action(loginCommand);

program
  .command("logout")
  .description("Logout from Insighta")
  .action(logoutCommand);

program
  .command("whoami")
  .description("Show current logged in user")
  .action(whoamiCommand);

program.addCommand(profilesCommand);

program.parse(process.argv);
