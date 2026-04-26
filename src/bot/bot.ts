import { Telegraf } from "telegraf";
import { config } from "../config/config";
import { startCommand } from "../commands/start";
import { registerSellerHandlers } from "../handlers/seller";
import { registerUserHandlers } from "../handlers/user";
import { registerSupportHandler } from "../handlers/common/support.handler";
import { registerContactHandler } from "../handlers/common/contactus.handler";
import { loginOrSignup } from "../services/authService";
import { BotContext, setContextState } from "../types/botContext";
import { routeByState } from "./stateRouter";

export const bot = new Telegraf(config.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const botCtx = ctx as BotContext;
  const telegramId = ctx.from?.id;
  const username = ctx.from?.username;
  const chatId = ctx.chat?.id;

  if (!telegramId || !chatId) {
    await next();
    return;
  }

  try {
    const auth = await loginOrSignup(
      String(telegramId),
      username || "unknown",
      chatId,
      async () => {
        await ctx.reply("⏳ Processing your request...");
      }
    );
    botCtx.auth = auth;
    setContextState(botCtx, auth.user.state ?? "IDLE", auth.user.context ?? {});
  } catch {
    botCtx.auth = undefined;
    setContextState(botCtx, "IDLE", {});
  }

  await next();
});

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

  await startCommand(ctx as unknown as BotContext);
});

bot.on("text", async (ctx, next) => {
  if (ctx.message.text.startsWith("/")) {
    await next();
    return;
  }

  await routeByState(ctx as unknown as BotContext);
});

// --- Launch bot ---
/*(async () => {
  await bot.launch();
  logger.info("Bot started and commands loaded...");
await bot.telegram.deleteMyCommands();
})();*/