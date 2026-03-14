import { Context, Markup } from "telegraf";
import { bot } from "../bot/bot";
import { mockLogin } from "../services/mockAuth.service";
import { config } from "../config/config"; // to get WEBAPP_URL / WEBSELLER_URL

export async function menuCommand(ctx: Context) {

  const telegramId = ctx.from?.id.toString()!;
  const username = ctx.from?.username || "unknown";
  const chatId = ctx.chat?.id;

  if (!chatId) {
    await ctx.reply("Chat ID not found.");
    return;
  }

  // Authenticate user
  const auth = await mockLogin(telegramId, username);
  const role = auth.user.role;

  // Remove old commands
  await bot.telegram.deleteMyCommands({
    scope: { type: "chat", chat_id: chatId }
  });

  if (role === "USER") {

    await bot.telegram.setMyCommands(
      [
        { command: "notifications", description: "🔔 Notifications" },
        { command: "information", description: "📦 Shop information" },
        { command: "be_seller", description: "📝 Become a seller" },
        { command: "support", description: "🆘 Support & FAQ" }
      ],
      { scope: { type: "chat", chat_id: chatId } }
    );

    const marketplaceUrl = `${config.WEBAPP_URL}?token=${auth.token}`;

    await ctx.reply("✅ Seller menu activated.", {
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.webApp("🛒 Open Market place", marketplaceUrl)]
      ]) as any
    });


  } else if (role === "SELLER") {

    await bot.telegram.setMyCommands(
      [
        { command: "myshop", description: "🏪 My Shop" },
        { command: "stats", description: "📊 Statistics" },
        { command: "appeal", description: "📝 Ask Appeal" },
        { command: "support", description: "🆘 Support & FAQ" }
      ],
      { scope: { type: "chat", chat_id: chatId } }
    );

    const sellerWebUrl = `${config.WEBSELLER_URL}?token=${auth.token}`;

    await ctx.reply("✅ Seller menu activated.", {
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.webApp("🛒 Open Seller Dashboard", sellerWebUrl)],
        [Markup.button.webApp("🛒 Open Seller Dashboard", sellerWebUrl)]
      ]) as any
    });

  }
}