import { bot } from "../../bot/bot";
import { Markup } from "telegraf";
import { getMockSupportFAQ } from "../../services/mockAuth.service";
import { BotContext, setContextState } from "../../types/botContext";
import { updateUserState } from "../../services/authService";

export async function sendSupportInfo(ctx: BotContext): Promise<void> {
  const auth = ctx.auth;
  if (!auth) {
    await ctx.reply("⚠️ I couldn’t load your account. Please try again.");
    return;
  }

  const role = auth.user?.role;
  let faq: string[] = [];

  if (role === "SELLER") {
    faq = await getMockSupportFAQ();
  } else {
    faq = await getMockSupportFAQ();
  }

  await ctx.reply(
    "Support & FAQ:\n\n" + faq.join("\n\n"),
    Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]])
  );
}

export function registerSupportHandler() {
  bot.command("support", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    const auth = botCtx.auth;

    if (!auth) {
      await botCtx.reply("⚠️ I couldn’t load your account. Please try again.");
      return;
    }

    try {
      const updatedUser = await updateUserState(auth.user.id, "SUPPORT_CONTACT", {}, auth.token);
      setContextState(botCtx, updatedUser.state ?? "SUPPORT_CONTACT", updatedUser.context ?? {});
      botCtx.auth = {
        ...auth,
        user: {
          ...auth.user,
          ...updatedUser
        }
      };
    } catch {
      setContextState(botCtx, "SUPPORT_CONTACT", {});
    }

    await sendSupportInfo(botCtx);
  });
}