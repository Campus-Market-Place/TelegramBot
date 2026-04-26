import { Markup } from "telegraf";
import { bot } from "../../bot/bot";
import {
  getStatistics,
  StatisticsTimeFrame,
  EngagementStatisticsResponse
} from "../../services/engagement.service";
import { updateUserState } from "../../services/authService";
import { BotContext, setContextState } from "../../types/botContext";

const timeFrameLabels: Record<StatisticsTimeFrame, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year"
};

function formatPercent(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  if (value > 0) {
    return `Inc. by ${value.toFixed(2)}%`;
  }

  if (value < 0) {
    return `Dec. by ${Math.abs(value).toFixed(2)}%`;
  }

  return `${value.toFixed(2)}%`;
}

function formatRatio(value: number): string {
  return value.toFixed(2);
}

function buildStatsMessage(payload: EngagementStatisticsResponse): string {
  const { timeFrame, metrics, comparisons } = payload.data;

  return [
    `📊 Shop Statistics (${timeFrameLabels[timeFrame]})`,
    "",
    "Current Metrics",
    `• Views: ${metrics.views}`,
    `• Contacts: ${metrics.contacts}`,
    `• Social Media Clicks: ${metrics.socialMediaClicks}`,
    `• New Followers: ${metrics.newFollowers}`,
    `• Total Followers: ${metrics.totalFollowers}`,
    `• Contact/View Ratio: ${formatRatio(metrics.contactvsviewsRatio)}`,
    `• Followers/View Ratio: ${formatRatio(metrics.followersVsViewsRatio)}`,
    "",
    `Comparisons to Previous ${timeFrame}`,
    `• Views: ${formatPercent(comparisons.viewsPercent)}`,
    `• Contacts: ${formatPercent(comparisons.contactsPercent)}`,
    `• Social Media Clicks: ${formatPercent(comparisons.socialMediaClicksPercent)}`,
    `• New Followers: ${formatPercent(comparisons.newFollowersPercent)}`,
    `• Total Followers: ${formatPercent(comparisons.totalFollowersPercent)}`,
    "",
    "To get more detailed statistics, click /stats or the 📊 Statistics button again."
  ].join("\n");
}

function getAuthOrReply(ctx: BotContext) {
  const auth = ctx.auth;
  if (!auth) {
    ctx.reply("⚠️ I couldn’t load your account. Please try again.");
    return null;
  }

  return auth;
}

export async function showTimeFramePicker(ctx: BotContext): Promise<void> {
  const auth = getAuthOrReply(ctx);
  const chatId = ctx.chat?.id;

  if (!auth || !chatId) {
    return;
  }

  await ctx.reply("Select a time frame to view shop statistics:", {
    reply_markup: Markup.inlineKeyboard([
      [
        Markup.button.callback("Today", "stats_day"),
        Markup.button.callback("This Week", "stats_week")
      ],
      [
        Markup.button.callback("This Month", "stats_month"),
        Markup.button.callback("This Year", "stats_year")
      ],
      [Markup.button.callback("⬅️ Back to Menu", "BACK_TO_MENU")]
    ]).reply_markup
  });
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

async function sendStatisticsByTimeFrame(ctx: BotContext, timeFrame: StatisticsTimeFrame): Promise<void> {
  const auth = getAuthOrReply(ctx);
  if (!auth) {
    return;
  }

  if (auth.user.role !== "SELLER" || !auth.user.shopid) {
    await ctx.reply("This statistics view is only available for seller accounts with a shop.");
    return;
  }

  const stats = await getStatistics(auth.user.shopid, timeFrame, auth.token);
  const message = buildStatsMessage(stats);

  await setState(ctx, "STAT_CHECK", { timeFrame });
  await ctx.reply(message);
}

export function registerStatisticsHandler() {
  bot.command("stats", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    const auth = getAuthOrReply(botCtx);

    if (!auth) {
      return;
    }

    try {
      await setState(botCtx, "TIMEFRAME_SELECTION", {});
      await showTimeFramePicker(botCtx);
    } catch {
      await botCtx.reply("Could not fetch statistics right now.");
    }
  });

  bot.hears("📊 Statistics", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    const auth = getAuthOrReply(botCtx);

    if (!auth) {
      return;
    }

    try {
      await setState(botCtx, "TIMEFRAME_SELECTION", {});
      await showTimeFramePicker(botCtx);
    } catch {
      await botCtx.reply("Could not fetch statistics right now.");
    }
  });

  bot.action("stats_day", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    await ctx.answerCbQuery();
    try {
      await sendStatisticsByTimeFrame(botCtx, "day");
    } catch {
      await botCtx.reply("Could not fetch statistics right now.");
    }
  });

  bot.action("stats_week", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    await ctx.answerCbQuery();
    try {
      await sendStatisticsByTimeFrame(botCtx, "week");
    } catch {
      await botCtx.reply("Could not fetch statistics right now.");
    }
  });

  bot.action("stats_month", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    await ctx.answerCbQuery();
    try {
      await sendStatisticsByTimeFrame(botCtx, "month");
    } catch {
      await botCtx.reply("Could not fetch statistics right now.");
    }
  });

  bot.action("stats_year", async (ctx) => {
    const botCtx = ctx as unknown as BotContext;
    await ctx.answerCbQuery();
    try {
      await sendStatisticsByTimeFrame(botCtx, "year");
    } catch {
      await botCtx.reply("Could not fetch statistics right now.");
    }
  });
}
