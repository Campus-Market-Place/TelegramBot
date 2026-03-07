//npx ts-node src/bot.ts

import { Telegraf } from "telegraf";
import { config } from "../config/config";
import { startCommand } from "../commands/start";
import { wakeBackend } from "../util/wakeBackend";
import { menuCommand } from "../commands/menu";
import { logger } from "../util/logger";
import { registerSellerHandlers } from "../handlers/seller";

//console.log("Bot starting...");
logger.info("Bot starting...");
export const bot = new Telegraf(config.BOT_TOKEN);

bot.start(startCommand);

(async () => {

  await wakeBackend();
  bot.hears("☰ Menu", menuCommand);

  // Register all seller button handlers **once**
registerSellerHandlers();

  await bot.launch();

  logger.info("Bot commands loaded...");

})();