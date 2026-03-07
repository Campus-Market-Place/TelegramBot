// src/handlers/seller/notifications.handler.ts

import { bot } from "../../bot/bot";
import { getMockNotifications } from "../../services/mockAuth.service";


export function registerNotificationsHandler() {
  bot.hears("🔔 Notifications", async (ctx) => {
    const telegramId = ctx.from?.id.toString()!;
    const notifications = await getMockNotifications(telegramId);
    await ctx.reply("Your notifications:\n" + notifications.join("\n"));
  });
}