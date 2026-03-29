import { Context, Markup } from "telegraf";
import { config } from "../config/config";
import path from "path";
import { bot } from "../bot/bot";
import { loginOrSignup } from "../services/authService";
import { setAuthSession } from "../services/authSession.service";

export async function startCommand(ctx: Context) {
  try {
    const telegramId = ctx.from?.id.toString()!;
    const username = ctx.from?.username || "unknown";
    const chatId = ctx.chat?.id;

    if (!chatId) {
      await ctx.reply("Chat ID not found.");
      return;
    }

    // ✅ Clear old commands (only per chat, REMOVE global delete)
    await bot.telegram.deleteMyCommands({
      scope: { type: "chat", chat_id: chatId },
    });

    await ctx.reply("...", Markup.removeKeyboard());

    const auth = await loginOrSignup(telegramId, username, chatId);
    setAuthSession(chatId, auth);

    const token = auth.token;
    const role = auth.user.role;
    const shopId = auth.user.shopid ?? null;

    const marketplaceUrl = `${config.WEBAPP_URL}?token=${token}`;
    const sellerplaceurl = `${config.WEBSELLER_URL}?token=${token}`;

    console.log("MARKETPLACE URL:", marketplaceUrl);
    console.log("SELLERPLACE URL:", sellerplaceurl);
    const howToUseUrl = `${config.WEBREQUEST_URL}?token=${token}`;

    const logoPath = path.join(process.cwd(), "assets", "logo1.png");

    // ================= USER =================
    if (role === "USER") {
      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b>👋 ሰላም ${username}!</b>\n<i>Welcome to Campus Gebeya</i>\n<code>Buy & sell inside AASTU</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.webApp("🛍 Open Marketplace", marketplaceUrl),
              Markup.button.webApp("📖 How to use", howToUseUrl),
            ],
            [
              Markup.button.callback("📞 Contact Us", "CONTACT_US"), // ✅ NEW
            ],
          ]).reply_markup,
        }
      );

      await bot.telegram.setMyCommands(
        [
          { command: "notifications", description: "🔔 Notifications" },
          { command: "information", description: "📦 Shop info" },
          { command: "be_seller", description: "Become a seller" },
          { command: "support", description: "🆘 Support" },
        ],
        { scope: { type: "chat", chat_id: chatId } }
      );
    }

    // ================= SELLER =================
    if (role === "SELLER") {
      if (!shopId) {
        await ctx.reply("⚠️ Shop ID not found.");
        return;
      }

      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b>👋 ሰላም ${username}!</b>\n<i>Welcome to Campus Gebeya</i>\n<code>Manage your shop</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.webApp("🛍 Marketplace", marketplaceUrl),
              Markup.button.webApp("📊 Seller Dashboard", sellerplaceurl),
            ],
            [
              Markup.button.webApp("📖 How to use", howToUseUrl),
            ],
            [
              Markup.button.callback("📞 Contact Us", "CONTACT_US"), // ✅ NEW
            ],
          ]).reply_markup,
        }
      );

      await bot.telegram.setMyCommands(
        [
          { command: "myshop", description: "🏪 My Shop" },
          { command: "stats", description: "📊 Stats" },
          { command: "appeal", description: "📝 Appeal" },
          { command: "support", description: "🆘 Support" },
        ],
        { scope: { type: "chat", chat_id: chatId } }
      );
    }
  } catch (error: any) {
    console.error("START ERROR:", error?.message);
    await ctx.reply("⚠️ Server is waking up. Please try again.");
  }
}