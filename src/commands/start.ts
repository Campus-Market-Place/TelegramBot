import { Markup } from "telegraf";
import { config } from "../config/config";
import path from "path";
import { bot } from "../bot/bot";
import { updateUserState } from "../services/authService";
import { BotContext, setContextState } from "../types/botContext";

function getAuthOrReply(ctx: BotContext) {
  const auth = ctx.auth;
  if (!auth) {
    ctx.reply("⚠️ I couldn’t load your account. Please try again.");
    return null;
  }

  return auth;
}

export async function showMainMenu(ctx: BotContext): Promise<void> {
  const chatId = ctx.chat?.id;
  const username = ctx.from?.username || "unknown";
  const auth = getAuthOrReply(ctx);

  if (!auth || !chatId) {
    if (!chatId) {
      await ctx.reply("Chat ID not found.");
    }
    return;
  }

  const token = auth.token;
  const role = auth.user.role;
  const shopId = auth.user.shopid ?? null;

  const marketplaceUrl = `${config.WEBAPP_URL}?token=${token}`;
  const sellerplaceurl = `${config.WEBSELLER_URL}?token=${token}`;
  const howToUseUrl = `${config.HOW_TO_USE_WEBHOOK}?token=${token}`;
  const logoPath = path.join(process.cwd(), "assets", "logo2.png");

  await bot.telegram.deleteMyCommands({
    scope: { type: "chat", chat_id: chatId }
  });

  await ctx.reply("...", Markup.removeKeyboard());

  if (role === "USER") {
    await ctx.replyWithPhoto(
      { source: logoPath },
      {
        caption: `<b>👋 ${username}! ሰላም</b>\n<i>Welcome to Campus Gebeya</i>\n<code>Buy & sell inside AASTU</code>`,
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.webApp("🛍 Open Marketplace", marketplaceUrl),
            Markup.button.webApp("📖 How to use", howToUseUrl)
          ],
          [Markup.button.callback("📞 Contact Us", "CONTACT_US")]
        ]).reply_markup
      }
    );

    await bot.telegram.setMyCommands(
      [
       /*  { command: "notifications", description: "🔔 Notifications" }, */
        { command: "information", description: "📦 Shop info" },
        { command: "be_seller", description: "Become a seller" },
        { command: "support", description: "🆘 Support" }
      ],
      { scope: { type: "chat", chat_id: chatId } }
    );
  }

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
            Markup.button.webApp("📊 Seller Dashboard", sellerplaceurl)
          ],
          [
            Markup.button.webApp("📖 How to use", howToUseUrl),
            Markup.button.callback("📞 Contact Us", "CONTACT_US")
          ]
        ]).reply_markup
      }
    );

    await bot.telegram.setMyCommands(
      [
        { command: "myshop", description: "🏪 My Shop" },
        { command: "stats", description: "📊 Stats" },
        { command: "appeal", description: "📝 Appeal" },
        { command: "support", description: "🆘 Support" }
      ],
      { scope: { type: "chat", chat_id: chatId } }
    );
  }
}

export async function startCommand(ctx: BotContext) {
  try {
    const auth = getAuthOrReply(ctx);
    if (!auth) {
      return;
    }

    try {
      const updatedUser = await updateUserState(auth.user.id, "IDLE", {}, auth.token);
      setContextState(ctx, updatedUser.state ?? "IDLE", updatedUser.context ?? {});
      ctx.auth = {
        ...auth,
        user: {
          ...auth.user,
          ...updatedUser
        }
      };
    } catch {
      setContextState(ctx, "IDLE", {});
    }

    await showMainMenu(ctx);
  } catch (error: any) {
    console.error("START ERROR:", error?.message);
    await ctx.reply("⚠️ I couldn’t load your account. Please try again.");
  }
}