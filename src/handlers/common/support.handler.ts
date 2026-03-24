import { bot } from "../../bot/bot";
import { Context, Markup } from "telegraf";
import { getMockSupportFAQ } from "../../services/mockAuth.service";
import { getAuthSession } from "../../services/authSession.service";

export function registerSupportHandler() {
  bot.command("support", async (ctx: Context) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const session = getAuthSession(chatId);
    const role = session?.user?.role;

    let faq: string[] = [];

    if (role === "SELLER") {
      faq = await getMockSupportFAQ(); // seller FAQ
    } else {
      faq = await getMockSupportFAQ(); // user FAQ (replace later)
    }

    await ctx.reply(
      "Support & FAQ:\n\n" + faq.join("\n\n"),
      Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]
      ])
    );
  });
}