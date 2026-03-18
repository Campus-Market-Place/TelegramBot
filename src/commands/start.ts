import { Context, Markup } from "telegraf";
import { config } from "../config/config";
import path from "path";
import { bot } from "../bot/bot"; // import bot to set commands
import { loginOrSignup } from "../services/authService";
import { setAuthSession } from "../services/authSession.service";
//import { mockLogin } from "../services/mockAuth.service";


export async function startCommand(ctx: Context) {
  try {
    const telegramId = ctx.from?.id.toString()!;
    const username = ctx.from?.username || "unknown";
    const chatId = ctx.chat?.id;

    if (!chatId) {
      await ctx.reply("Chat ID not found.");
      return;
    }

    // --- Clear old cached commands ---
    await bot.telegram.deleteMyCommands({ scope: { type: "chat", chat_id: chatId } });
    await bot.telegram.deleteMyCommands();

    await ctx.reply("...", Markup.removeKeyboard());

    // --- Authenticate / get role (mock or real) ---
    //const auth = await mockLogin(telegramId, username);
     //const auth = await loginOrSignup(telegramId, username, chatId); // uncomment for real backend
    // --- Authenticate / get role from backend ---
    const auth = await loginOrSignup(telegramId, username, chatId);
    setAuthSession(chatId, auth);
    const token = auth.token;
    const role = auth.user.role;
    console.log("AUTH RESPONSE:", auth);
    const shopId = auth.user.shopid ?? null;

    // --- URLs for inline buttons ---
    const marketplaceUrl = `${config.WEBAPP_URL}?token=${token}`;
    const sellerplaceurl = `${config.WEBSELLER_URL}?token=${token}`;
    const howToUseUrl = `${config.WEBREQUEST_URL}?token=${token}`;



    // --- Remove any old persistent keyboard ---
    //await ctx.reply("Preparing your menu...", Markup.removeKeyboard());



    // --- Set menu commands and show keyboard based on role ---
    if (role === "USER") {
      const logoPath = path.join(process.cwd(), "assets", "logo1.png");
      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b>👋 ሰላም ${username}!</b>\n<i>Welcome to Campus Gebeya</i>\n<code>Buy & sell inside AASTU</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [

              Markup.button.webApp("🛍 Open Marketplace", marketplaceUrl),
              Markup.button.webApp("📖 How to use the bot", howToUseUrl)

            ],

          ]).reply_markup,
        }
      );
      // ✅ Valid Telegram commands (lowercase, no spaces)
      await bot.telegram.setMyCommands(
        [
          { command: "notifications", description: "🔔 Notifications" },
          { command: "information", description: "📦 Get information about the shop" },
          { command: "be_seller", description: "Fill form to become seller" },
          { command: "support", description: "🆘 Support & FAQ" }
        ],
        { scope: { type: "chat", chat_id: chatId } }
      );


      //await ctx.reply("User Menu:", userMenuKeyboard(sellerFormUrl));
    }

    if (role === "SELLER") {

      if (!shopId) {
        await ctx.reply("⚠️ Shop ID not found. Please contact support.");
        return;
      }

      const logoPath = path.join(process.cwd(), "assets", "logo1.png");
      await ctx.replyWithPhoto(
        { source: logoPath },
        {
          caption: `<b>👋 ሰላም ${username}!</b>\n<i>Welcome to Campus Gebeya</i>\n<code>Buy & sell inside AASTU</code>`,
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [

              Markup.button.webApp("🛍 Open Marketplace", marketplaceUrl),
              Markup.button.webApp("🛍 seller dahsboard", sellerplaceurl)
            ],
            [Markup.button.webApp("📖 How to use the bot", howToUseUrl),]
          ]).reply_markup,
        }
      );
      await bot.telegram.setMyCommands(
        [
          { command: "myshop", description: "🏪 My Shop" },
          { command: "stats", description: "📊 Statistics" },
          { command: "appeal", description: "📝 Ask Appeal" },
          { command: "support", description: "🆘 Support & FAQ" }
        ],
        { scope: { type: "chat", chat_id: chatId } }
      );

      // await ctx.reply("Seller Menu:", sellerMenuKeyboard());
    }

  } catch (error: any) {
    console.error("START ERROR:", error?.message);
    await ctx.reply("⚠️ Server is waking up. Please press /start again.");
  }
}