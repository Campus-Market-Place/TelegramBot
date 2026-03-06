//npx ts-node src/bot.ts

import { Telegraf } from "telegraf";
import { config } from "./config/config";
import { startCommand } from "./commands/start";
import { wakeBackend } from "./util/wakeBackend";
import { menuCommand } from "./commands/menu";

console.log("Bot starting...");

const bot = new Telegraf(config.BOT_TOKEN);

bot.start(startCommand);

(async () => {

  await wakeBackend();
  bot.hears("☰ Menu", menuCommand);

  await bot.launch();

  console.log("Bot is running...");

})();