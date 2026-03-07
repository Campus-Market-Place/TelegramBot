// src/handlers/seller/shopView.handler.ts
import { bot } from "../../bot/bot";
import { Context } from "telegraf";
import { getMockShopView } from "../../services/mockAuth.service";

export function registerShopViewHandler() {
  bot.hears("📦 Shop View", async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString()!;
    const views = await getMockShopView(telegramId);

    const messages = views
      .map((v) => `• ${v.name} at ${v.time}`)
      .join("\n");

    await ctx.reply("Your shop views:\n" + messages);
  });
}