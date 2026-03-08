// src/handlers/user/notifications.handler.ts

import { Context } from "telegraf";
import { bot } from "../../bot/bot";
import { getMockUserNotifications } from "../../services/mockAuth.service";


export function registerUserNotificationsHandler() {
  bot.hears("🔔 Notifications", async (ctx: Context) => {
    const telegramId = ctx.from?.id.toString()!;
    const notifications = await getMockUserNotifications(telegramId);
    await ctx.reply("Your notifications:\n" + notifications.join("\n"));
  });
}