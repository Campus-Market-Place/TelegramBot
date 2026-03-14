// src/handlers/seller/myshop.handler.ts

import path from "path";
import { existsSync } from "fs";
import { bot } from "../../bot/bot";
import { Context, Markup } from "telegraf";
import { config } from "../../config/config";
import { getAuthSession } from "../../services/authSession.service";


export function registerMyShopHandler() {
  const sendMyShop = async (ctx: Context) => {
    const logoPath = path.join(process.cwd(), "assets", "logo1.png");
    const authSession = getAuthSession(ctx.chat!.id);
    const sellerWebUrl = `${config.WEBSELLER_URL}?token=${authSession?.token}`;
    const message = `\n<i>Welcome to Campus Gebeya</i>\n<code>Buy & sell inside AASTU</code>`;
    const replyMarkup = Markup.inlineKeyboard([
      [Markup.button.webApp("🛍 seller dahsboard", sellerWebUrl)],
    ]).reply_markup;

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
  };

  bot.hears("🏪 My Shop", sendMyShop);
  bot.command("myshop", sendMyShop);
}