import { bot } from "../../bot/bot";
import { submitAppeal } from "../../services/appeal.service";
import { Context, Markup } from "telegraf";
import { updateUserState } from "../../services/authService";
import { BotContext, getContextState, setContextState } from "../../types/botContext";

function getAuthOrReply(ctx: BotContext) {
  const auth = ctx.auth;
  if (!auth) {
    ctx.reply("⚠️ I couldn’t load your account. Please try again.");
    return null;
  }

  return auth;
}

async function setState(ctx: BotContext, state: string, nextContext: Record<string, unknown>) {
  const auth = ctx.auth;
  if (!auth) {
    return;
  }

  const updatedUser = await updateUserState(auth.user.id, state, nextContext, auth.token);
  setContextState(ctx, updatedUser.state ?? state, updatedUser.context ?? nextContext);
  ctx.auth = {
    ...auth,
    user: {
      ...auth.user,
      ...updatedUser
    }
  };
}

export async function promptAppealReason(ctx: BotContext): Promise<void> {
  const auth = getAuthOrReply(ctx);
  if (!auth) {
    return;
  }

  if (auth.user.role !== "SELLER" || !auth.user.shopid) {
    await ctx.reply("Appeals are only available for seller accounts with a shop.");
    return;
  }

  await ctx.reply("Please enter your appeal reason.");
}

async function submitAppealReason(ctx: BotContext, reason: string): Promise<void> {
  const auth = getAuthOrReply(ctx);
  if (!auth) {
    return;
  }

  if (auth.user.role !== "SELLER" || !auth.user.shopid) {
    await ctx.reply("Appeals are only available for seller accounts with a shop.");
    return;
  }

  await submitAppeal(auth.user.shopid, reason, auth.token);
  await setState(ctx, "APPEAL_SUMMITED", { lastAppealAt: new Date().toISOString() });

  await ctx.reply(
    "✅ Appeal submitted. Admin will review it.",
    Markup.inlineKeyboard([[Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]])
  );
}

export function registerAskAppealHandler() {
  bot.command("appeal", async (ctx: Context) => {
    const botCtx = ctx as BotContext;
    const auth = getAuthOrReply(botCtx);

    if (!auth) {
      return;
    }

    try {
      await setState(botCtx, "APPEALING", {});
      await promptAppealReason(botCtx);
    } catch {
      await botCtx.reply("Could not submit your appeal right now. Please try again.");
    }
  });

  bot.hears("📝 Ask Appeal", async (ctx) => {
    const botCtx = ctx as BotContext;
    const auth = getAuthOrReply(botCtx);

    if (!auth) {
      return;
    }

    try {
      await setState(botCtx, "APPEALING", {});
      await promptAppealReason(botCtx);
    } catch {
      await botCtx.reply("Could not submit your appeal right now. Please try again.");
    }
  });

  bot.on("text", async (ctx, next) => {
    const botCtx = ctx as unknown as BotContext;
    const text = ctx.message.text.trim();

    if (getContextState(botCtx) !== "APPEALING") {
      await next();
      return;
    }

    if (!text || text.startsWith("/")) {
      await next();
      return;
    }

    try {
      await submitAppealReason(botCtx, text);
    } catch {
      await botCtx.reply("Could not submit your appeal right now. Please try again.");
    }
  });
}
