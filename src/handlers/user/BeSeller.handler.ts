import { Markup } from "telegraf";
import { bot } from "../../bot/bot";
import { config } from "../../config/config";
import path from "path";
import { updateUserState } from "../../services/authService";
import { BotContext, setContextState } from "../../types/botContext";

export function registerBeSellerHandler() {
  bot.command("be_seller", async (ctx) => {
    try {
      const botCtx = ctx as unknown as BotContext;
      const auth = botCtx.auth;
      if (!auth) {
        await ctx.reply("⚠️ I couldn’t load your account. Please try again.");
        return;
      }

      const username = ctx.from?.username || "unknown";

      try {
        const updatedUser = await updateUserState(auth.user.id, "TO_BE_SELLER", {}, auth.token);
        setContextState(botCtx, updatedUser.state ?? "TO_BE_SELLER", updatedUser.context ?? {});
        botCtx.auth = {
          ...auth,
          user: {
            ...auth.user,
            ...updatedUser
          }
        };
      } catch {
        setContextState(botCtx, "TO_BE_SELLER", {});
      }

    const token = auth.token;

      const howToUseUrl = `${config.WEBREQUEST_URL}?token=${token}`;

      const logoPath = path.join(__dirname, "../../../assets/logo4.png"); 

      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b>${username} fill the form to </b>\n<i>Become a seller</i>\n<code>after submiting the form restart the bot by send command /start</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [Markup.button.webApp("Fill in seller form", howToUseUrl)],
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