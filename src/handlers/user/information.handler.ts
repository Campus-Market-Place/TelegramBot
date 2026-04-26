// src/handlers/user/information.handler.ts
import { Context, Markup } from "telegraf";
import { getMockUserInformation } from "../../services/mockAuth.service";
import { bot } from "../../bot/bot";
import { BotContext } from "../../types/botContext";

export function registerUserInformationHandler() {
  
  bot.command("information", async (ctx: Context) => {
    try {
      const auth = (ctx as BotContext).auth;
      if (!auth) {
        await ctx.reply("⚠️ I couldn’t load your account. Please try again.");
        return;
      }

      const info = await getMockUserInformation();

      await ctx.reply(
        "Information:\n\n" + info.join("\n\n"),
        Markup.inlineKeyboard([
          [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]
        ])
      );
    } catch (err) {
      console.error("Error in /information:", err);
      await ctx.reply("Failed to fetch information.");
    }
  });
}