// src/handlers/seller/statistics.handler.ts

import { Context } from "telegraf";
import { bot } from "../../bot/bot";
import { getMockStatistics } from "../../services/mockAuth.service";


export function registerStatisticsHandler() {
  bot.command("stats", async (ctx: Context) => {
  //bot.hears("", async (ctx) => {
    const telegramId = ctx.from?.id.toString()!;
    const stats = await getMockStatistics(telegramId);
    await ctx.reply(
      `Your shop statistics:\n` +
        `🛒 Products Sold: ${stats.productsSold}\n` +
        `💰 Total Revenue: $${stats.totalRevenue}\n` +
        `📦 Active Listings: ${stats.activeListings}`
    );
  });
}