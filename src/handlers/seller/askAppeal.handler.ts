// src/handlers/seller/askAppeal.handler.ts
import { bot } from "../../bot/bot";
import { getAuthSession } from "../../services/authSession.service";
import {
  clearPendingAppeal,
  hasPendingAppeal,
  setPendingAppeal
} from "../../services/appealSession.service";
import { submitAppeal } from "../../services/appeal.service";

async function startAppealFlow(chatId: number): Promise<string> {
  const authSession = getAuthSession(chatId);

  if (!authSession) {
    throw new Error("AUTH_SESSION_MISSING");
  }

  if (authSession.user.role !== "SELLER") {
    throw new Error("SELLER_ONLY");
  }

  if (!authSession.user.shopid) {
    throw new Error("SHOP_ID_MISSING");
  }

  setPendingAppeal(chatId);
  return "Please enter your appeal reason.";
}

async function submitAppealReason(chatId: number, reason: string): Promise<void> {
  const authSession = getAuthSession(chatId);

  if (!authSession) {
    throw new Error("AUTH_SESSION_MISSING");
  }

  if (authSession.user.role !== "SELLER") {
    throw new Error("SELLER_ONLY");
  }

  if (!authSession.user.shopid) {
    throw new Error("SHOP_ID_MISSING");
  }

  await submitAppeal(authSession.user.shopid, reason, authSession.token);
}

async function replyAppealError(ctx: any, error: unknown): Promise<void> {
  if (error instanceof Error) {
    if (error.message === "AUTH_SESSION_MISSING") {
      await ctx.reply("Please send /start first so I can load your seller account.");
      return;
    }

    if (error.message === "SELLER_ONLY" || error.message === "SHOP_ID_MISSING") {
      await ctx.reply("Appeals are only available for seller accounts with a shop.");
      return;
    }
  }

  await ctx.reply(`Could not submit your appeal right now (appeal work when your shop status is warning or suspended). Please try again.`);
}

export function registerAskAppealHandler() {
  bot.command("appeal", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      await ctx.reply("Unable to find chat for appeal submission.");
      return;
    }

    try {
      const message = await startAppealFlow(chatId);
      await ctx.reply(message);
    } catch (error) {
      clearPendingAppeal(chatId);
      await replyAppealError(ctx, error);
    }
  });

  bot.hears("📝 Ask Appeal", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      await ctx.reply("Unable to find chat for appeal submission.");
      return;
    }

    try {
      const message = await startAppealFlow(chatId);
      await ctx.reply(message);
    } catch (error) {
      clearPendingAppeal(chatId);
      await replyAppealError(ctx, error);
    }
  });

  bot.on("text", async (ctx, next) => {
    const chatId = ctx.chat?.id;
    const text = ctx.message.text.trim();

    if (!chatId || !hasPendingAppeal(chatId)) {
      return next();
    }

    if (!text || text.startsWith("/")) {
      await ctx.reply("Please enter the reason for your appeal as a message.");
      return;
    }

    try {
      await submitAppealReason(chatId, text);
      clearPendingAppeal(chatId);
      await ctx.reply("Thank you. The admin will review it.");
    } catch (error) {
      clearPendingAppeal(chatId);
      await replyAppealError(ctx, error);
    }
  });
}