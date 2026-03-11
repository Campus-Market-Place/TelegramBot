import { Context, Markup } from "telegraf";
import { loginOrSignup } from "../services/authService";
import { config } from "../config/config";
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

    const auth = await loginOrSignup(telegramId, username,chatId);
    //const auth = await mockLogin(telegramId, username);
    const token = auth.token;
    const role = auth.user.role;

    const marketplaceUrl = `${config.WEBAPP_URL}?token=${token}`;
    console.log("Marketplace URL:", marketplaceUrl);
    const sellerDashboardUrl = `${config.WEBSELLER_URL}?token=${token}`;


    console.log("Seller Dashboard URL:", sellerDashboardUrl);

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
       
          `Open the marketplace`,
          Markup.inlineKeyboard([
            [Markup.button.webApp("Open Marketplace", marketplaceUrl)]
          ])
        );
           
       
     
    }

    // --- BOT MENU button ---
    await ctx.reply(
      "Use menu below ⬇️",
      Markup.keyboard([["☰ Menu"]]).resize()
     //await menuCommand(ctx);
    );

  } catch (error: any) {
    console.error("START ERROR:", error?.message);
    await ctx.reply("⚠️ Server is waking up. Please press /start again.");
  }
}
