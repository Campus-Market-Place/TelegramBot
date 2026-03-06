//8637601787:AAHjXCJ-VSRqaKD8Fm4apWPShKkMNMlypc0

import { Telegraf } from "telegraf";

// ⚠ Replace with your real token directly for testing
const BOT_TOKEN = "8637601787:AAHjXCJ-VSRqaKD8Fm4apWPShKkMNMlypc0";

console.log("Starting bot...");

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  console.log("Received /start from:", ctx.from.username);
  ctx.reply("Hello! Bot is working ✅");
});

bot.launch().then(() => {
  console.log("Bot launched successfully!");
}).catch((err) => {
  console.error("Bot failed to launch:", err);
});