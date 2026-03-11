import { Context, Markup } from "telegraf";
import { loginOrSignup } from "../services/authService";
//import { mockLogin } from "../services/mockAuth.service";
import { config } from "../config/config";
import { userMenuKeyboard } from "../keyboards/user.keyboard";
import { sellerMenuKeyboard } from "../keyboards/seller.keyboard";

export async function menuCommand(ctx: Context) {

  const telegramId = ctx.from?.id.toString()!;
  const username = ctx.from?.username || "unknown";
  const chatId = ctx.chat?.id;

  if (!chatId) {
    await ctx.reply("Chat ID not found.");
    return;
  }

  const auth = await loginOrSignup(telegramId, username, chatId);

  //const auth = await mockLogin(telegramId, username);
  //const auth = await mockLogin(telegramId, username);
  const role = auth.user.role;

  if (role === "USER") {

    const sellerFormUrl =
      `${config.WEBREQUEST_URL}?token=${auth.token}`;
      console.log("Seller form URL:", sellerFormUrl);

    await ctx.reply(
      "User Menu:",
      userMenuKeyboard(sellerFormUrl)
    );
  }

  if (role === "SELLER") {

    await ctx.reply(
      "Seller Menu:",
      sellerMenuKeyboard()
    );
  }
}
