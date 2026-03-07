// src/handlers/seller/askAppeal.handler.ts
import { bot } from "../../bot/bot";
import { Context } from "telegraf";
import { getMockAskAppealResponse } from "../../services/mockAuth.service";

export function registerAskAppealHandler() {
  bot.hears("📝 Ask Appeal", async (ctx: Context) => {
    const response = await getMockAskAppealResponse();
    await ctx.reply(response);
  });
}