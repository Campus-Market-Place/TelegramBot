import { Telegraf } from "telegraf";
import { config } from "../config/config";
import { startCommand } from "../commands/start";
import { logger } from "../util/logger";
import { registerSellerHandlers } from "../handlers/seller";
import { registerUserHandlers } from "../handlers/user";
import { registerSupportHandler } from "../handlers/common/support.handler";
import { registerContactHandler } from "../handlers/common/contactus.handler";

export const bot = new Telegraf(config.BOT_TOKEN);

// --- Register handlers first ---
registerUserHandlers();   // this includes registerBeSellerHandler
registerSellerHandlers();
registerSupportHandler();
registerContactHandler();


// --- Start command ---
// Fixed: call your real startCommand

bot.command("start", startCommand);

// ✅ ADD THIS HERE (global action handler)
bot.action("BACK_TO_MENU", async (ctx) => {
  await ctx.answerCbQuery();

  // Reuse your start logic
  await startCommand(ctx as any);
});

// --- Launch bot ---
(async () => {
  await bot.launch();
  logger.info("Bot started and commands loaded...");
await bot.telegram.deleteMyCommands();
})();