// src/handlers/user/supportFAQ.handler.ts
import { bot } from "../../bot/bot";
import { Context } from "telegraf";
import { getMockSupportFAQ } from "../../services/mockAuth.service";

export function registerSupportFAQHandler() {

  bot.command("support", async (ctx: Context) => {
  //bot.hears("🆘 Support & FAQ", async (ctx: Context) => {
    const faq = await getMockSupportFAQ();
    await ctx.reply("Support & FAQ:\n\n" + faq.join("\n\n"));
  });
}