import { Telegraf } from "telegraf";
import { config } from "../config/config";
import { startCommand } from "../commands/start";
import { logger } from "../util/logger";
import { registerSellerHandlers } from "../handlers/seller";
import { registerUserHandlers } from "../handlers/user";

export const bot = new Telegraf(config.BOT_TOKEN);

// --- Register handlers first ---
registerUserHandlers();   // this includes registerBeSellerHandler
registerSellerHandlers();

// --- Start command ---
bot.start(startCommand);

// --- Launch bot ---
(async () => {
  await bot.launch();
  logger.info("Bot started and commands loaded...");
})();