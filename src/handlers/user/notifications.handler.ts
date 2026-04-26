// // src/handlers/user/notifications.handler.ts
// import { Context } from "telegraf";
// import { bot } from "../../bot/bot";
// import { getMockUserNotifications } from "../../services/mockAuth.service";
// import { BotContext } from "../../types/botContext";

// export function registerUserNotificationsHandler() {
//   // Handle both the command and the menu button if needed
//   bot.command("notifications", sendUserNotifications);
//  // bot.hears("🔔 Notifications", sendUserNotifications);

//   async function sendUserNotifications(ctx: Context) {
//     try {
//       const auth = (ctx as BotContext).auth;
//       if (!auth) {
//         await ctx.reply("⚠️ I couldn’t load your account. Please try again.");
//         return;
//       }

//       const telegramId = ctx.from?.id.toString();
//       if (!telegramId) return; // safety check

//       const notifications = await getMockUserNotifications(telegramId);
//       await ctx.reply("Your notifications:\n" + notifications.join("\n"));
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//       await ctx.reply("Failed to fetch notifications. Please try again later.");
//     }
//   }
// }