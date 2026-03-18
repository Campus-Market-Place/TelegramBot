// src/handlers/seller/askAppeal.handler.ts
import { bot } from "../../bot/bot";
import { Context } from "telegraf";
import { getMockAskAppealResponse } from "../../services/mockAuth.service";

export function registerAskAppealHandler() {
  bot.command("appeal", async (ctx: Context) => {
  //bot.hears("appeal", async (ctx: Context) => {
    const response = await getMockAskAppealResponse();
    await ctx.reply(response);
  });
}