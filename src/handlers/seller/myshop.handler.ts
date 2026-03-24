// src/handlers/seller/myshop.handler.ts

import path from "path";
import { existsSync } from "fs";
import { bot } from "../../bot/bot";
import { Context, Markup } from "telegraf";
import { config } from "../../config/config";
import { getAuthSession } from "../../services/authSession.service";

export function registerMyShopHandler() {

  const sendMyShop = async (ctx: Context) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      await ctx.reply("Unable to load your shop.");
      return;
    }

    const logoPath = path.join(process.cwd(), "assets", "logo1.png");

    const authSession = getAuthSession(chatId);
    if (!authSession) {
      await ctx.reply("Please send /start first.");
      return;
    }

    const sellerWebUrl = `${config.WEBSELLER_URL}?token=${authSession.token}`;

    const message = `<i>Welcome to Campus Gebeya</i>\n<code>Buy & sell inside AASTU</code>`;

    // ✅ Inline keyboard with BOTH buttons
    const replyMarkup = Markup.inlineKeyboard([
      [Markup.button.webApp("🛍 Seller Dashboard", sellerWebUrl)],
      [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]
    ]).reply_markup;

    // ✅ Send photo if exists
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

    // ✅ Fallback if no image
    await ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    });
  };

  // ✅ Support both command and text trigger
  bot.command("myshop", sendMyShop);
  bot.hears("🏪 My Shop", sendMyShop);
}