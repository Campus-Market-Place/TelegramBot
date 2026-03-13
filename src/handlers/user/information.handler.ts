
// src/handlers/user/information.handler.ts
import { Context } from "telegraf";
import { getMockUserInformation } from "../../services/mockAuth.service";
import { bot } from "../../bot/bot";

export function registerUserInformationHandler() {
  
  bot.command("information", async (ctx) => {
    try {
      const info = await getMockUserInformation();
      await ctx.reply("Information:\n\n" + info.join("\n\n"));
    } catch (err) {
      console.error("Error in /information:", err);
      await ctx.reply("Failed to fetch information.");
    }
  });
}