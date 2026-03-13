import { Markup } from "telegraf";
import { bot } from "../../bot/bot";
import { config } from "../../config/config";
import path from "path";

export function registerBeSellerHandler() {
  bot.command("be_seller", async (ctx) => {
    try {
      const telegramId = ctx.from?.id.toString()!;
      const username = ctx.from?.username || "unknown";

      // URLs for buttons
      const howToUseUrl = `${config.WEBREQUEST_URL}`;

      // Logo image path
      const logoPath = path.join(__dirname, "../../../assets/logo1.png"); // adjust relative path if needed

      // Send banner-like reply
      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b> ${username} fill the form to </b>\n<i>Become a seller</i>\n<code>after submiting the form restart the bot by send command /start</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
           // Markup.button.webApp("🛍fill the form ", howToUseUrl),
            [Markup.button.webApp("📖 How to use the bot", howToUseUrl)]
          ]).reply_markup,
        }
      );
    } catch (error) {
      console.error("BeSeller handler error:", error);
      await ctx.reply("⚠️ Something went wrong while opening the seller form.");
    }
  });
}