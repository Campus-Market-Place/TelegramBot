import { Markup } from "telegraf";
import { bot } from "../../bot/bot";
import { config } from "../../config/config";
import path from "path";
import { loginOrSignup } from "../../services/authService";
import { setAuthSession } from "../../services/authSession.service";

export function registerBeSellerHandler() {
  bot.command("be_seller", async (ctx) => {
    try {
      const telegramId = ctx.from?.id.toString()!;
      const username = ctx.from?.username || "unknown";
      const chatId = ctx.chat?.id;

    if (!chatId) {
      await ctx.reply("Chat ID not found.");
      return;
    }
    const auth = await loginOrSignup(telegramId, username, chatId);
    setAuthSession(chatId, auth);
    const token = auth.token;
    const role = auth.user.role;
    console.log("AUTH RESPONSE:", auth);
    const shopId = auth.user.shopid ?? null;

     
      const howToUseUrl = `${config.WEBREQUEST_URL}?token=${token}`;

      const logoPath = path.join(__dirname, "../../../assets/logo1.png"); 

      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b> ${username} fill the form to </b>\n<i>Become a seller</i>\n<code>after submiting the form restart the bot by send command /start</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
           // Markup.button.webApp("🛍fill the form ", howToUseUrl),
            [Markup.button.webApp("📖 How to use the bot", howToUseUrl)],
            [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]
          ]).reply_markup,
        }
      );
    } catch (error) {
      console.error("BeSeller handler error:", error);
      await ctx.reply("⚠️ Something went wrong while opening the seller form.");
    }
  });
}