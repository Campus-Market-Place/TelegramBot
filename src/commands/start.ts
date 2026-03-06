import { Context, Markup } from "telegraf";
import { loginOrSignup } from "../services/authService";
import { config } from "../config/config";

export async function startCommand(ctx: Context) {
  try {
    const telegramId = ctx.from?.id.toString()!;
    const username = ctx.from?.username || "unknown";

    const auth = await loginOrSignup(telegramId, username);
    const token = auth.token;
    const role = auth.user.role;

    const marketplaceUrl = `${config.WEBAPP_URL}?token=${token}`;
    const sellerDashboardUrl = `${config.WEBAPP_URL}/seller?token=${token}`;

    // --- MINI APP buttons ---
    if (role === "SELLER") {
      await ctx.reply(
        `Welcome back, ${username} 🏪`,
        Markup.inlineKeyboard([
          [Markup.button.webApp("🛍 Open Marketplace", marketplaceUrl)],
          [Markup.button.webApp("🏪 My Shop", sellerDashboardUrl)]
        ])
      );
    } else {
      await ctx.reply(
        `Hi ${username} 👋\nWelcome to Campus Marketplace 🛍`,
        Markup.inlineKeyboard([
          [Markup.button.webApp("🛍 Open Marketplace", marketplaceUrl)]
        ])
      );
    }

    // --- BOT MENU button ---
    await ctx.reply(
      "Use menu below ⬇️",
      Markup.keyboard([["☰ Menu"]]).resize()
    );

  } catch (error: any) {
    console.error("START ERROR:", error?.message);
    await ctx.reply("⚠️ Server is waking up. Please press /start again.");
  }
}
