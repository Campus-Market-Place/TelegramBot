import path from "path";
import { existsSync } from "fs";
import { bot } from "../../bot/bot";
import { Context, Markup } from "telegraf";
import { getAuthSession } from "../../services/authSession.service";

export function registerContactHandler() {
    bot.action("CONTACT_US", async (ctx: Context) => {
      const chatId = ctx.chat?.id;
  
      if (!chatId) {
        await ctx.reply("Unable to load contact info.");
        return;
      }
  
      const authSession = getAuthSession(chatId);
      if (!authSession) {
        await ctx.reply("Please send /start first.");
        return;
      }
  
      const logoPath = path.join(process.cwd(), "assets", "logo2.png");
  
      const message = `
  <i>📞 Contact Us</i>
  <code>For any questions or support, reach out to us on Telegram.</code>
      `;
  
      const replyMarkup = Markup.inlineKeyboard([
        [
          Markup.button.url(
            "💬 Contact on Telegram",
            "https://t.me/Usernameisusername10" // 👈 replace this
          ),
        ],
        [
          Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU"),
        ],
      ]).reply_markup;
  
      // ✅ VERY IMPORTANT (removes loading state)
      await ctx.answerCbQuery();
  
      if (existsSync(logoPath)) {
        await ctx.replyWithPhoto(
          { source: logoPath },
          {
            caption: message,
            parse_mode: "HTML",
            reply_markup: replyMarkup,
          }
        );
        return;
      }
  
      await ctx.reply(message, {
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
    });
  }