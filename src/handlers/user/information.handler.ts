// src/handlers/user/information.handler.ts

import { Context } from "telegraf";
import { getMockUserInformation } from "../../services/mockAuth.service";
import { bot } from "../../bot/bot";

export function registerUserInformationHandler() {
  bot.hears("📦 Information", async (ctx: Context) => {
    const info = await getMockUserInformation();
    await ctx.reply("Information:\n\n" + info.join("\n\n"));
  });
}