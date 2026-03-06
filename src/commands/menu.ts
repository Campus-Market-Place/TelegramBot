import { Context, Markup } from "telegraf";
import { loginOrSignup } from "../services/authService";
import { config } from "../config/config";

export async function menuCommand(ctx: Context) {
  try {
    const telegramId = ctx.from?.id.toString()!;
    const username = ctx.from?.username || "unknown";

    // Get user role from backend
    const auth = await loginOrSignup(telegramId, username);
    const role = auth.user.role;

    // --- USER MENU ---
    if (role === "USER") {

      const sellerFormUrl = `${config.WEBREQUEST_URL}?telegramId=${telegramId}&username=${encodeURIComponent(username)}`;

      await ctx.reply(
        "User Menu:",
        Markup.keyboard([
          ["🔔 Notifications", "🆘 Support & FAQ"],
          ["📦 Help", Markup.button.webApp("Be seller", sellerFormUrl)]
        ]).resize()
      );
    }

    // --- SELLER MENU ---
    if (role === "SELLER") {
      // Make sure we use auth.user.username here, not 'user' (which was undefined)
      const sellerUsername = auth.user.username;

      await ctx.reply(
        `Congrats ${sellerUsername}! You are now a seller 🏪`,
        Markup.keyboard([
          ["🔔 Notifications", "📊 Statistics"],
          ["📦 Shop View", "📝 Ask Appeal"],
          ["🆘 Support & FAQ"]
        ]).resize()
      );
    }

  } catch (error) {
    console.error("Menu error:", error);
    await ctx.reply("Failed to load menu.");
  }
}