import { Markup } from "telegraf";
import { bot } from "../../bot/bot";
import {
  getStatistics,
  StatisticsTimeFrame,
  EngagementStatisticsResponse
} from "../../services/engagement.service";
import { getAuthSession } from "../../services/authSession.service";

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

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
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
    "Comparison vs Previous Period",
    `• Views: ${formatPercent(comparisons.viewsPercent)}`,
    `• Contacts: ${formatPercent(comparisons.contactsPercent)}`,
    `• Social Media Clicks: ${formatPercent(comparisons.socialMediaClicksPercent)}`,
    `• New Followers: ${formatPercent(comparisons.newFollowersPercent)}`,
    `• Total Followers: ${formatPercent(comparisons.totalFollowersPercent)}`
  ].join("\n");
}

async function sendStatisticsByTimeFrame(
  chatId: number,
  timeFrame: StatisticsTimeFrame
): Promise<string> {
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

  const stats = await getStatistics(
    authSession.user.shopid,
    timeFrame,
    authSession.token
  );
  
  return buildStatsMessage(stats);
}

async function replyStatsError(ctx: Parameters<typeof bot.action>[1] extends never ? never : any, error: unknown): Promise<void> {
  if (error instanceof Error) {
    if (error.message === "AUTH_SESSION_MISSING") {
      await ctx.reply("Please send /start first so I can load your seller account.");
      return;
    }

    if (error.message === "SELLER_ONLY" || error.message === "SHOP_ID_MISSING") {
      await ctx.reply("This statistics view is only available for seller accounts with a shop.");
      return;
    }
  }

  await ctx.reply("Could not fetch statistics right now.");
}

async function showTimeFramePicker(chatId: number): Promise<void> {
  await bot.telegram.sendMessage(
    chatId,
    "Select a time frame to view shop statistics:",
    {
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.callback("Today", "stats_day"),
          Markup.button.callback("This Week", "stats_week")
        ],
        [
          Markup.button.callback("This Month", "stats_month"),
          Markup.button.callback("This Year", "stats_year")
        ]
      ]).reply_markup
    }
  );
}

export function registerStatisticsHandler() {
  bot.command("stats", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      await ctx.reply("Unable to find chat for statistics.");
      return;
    }

    await showTimeFramePicker(chatId);
  });

  bot.hears("📊 Statistics", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      await ctx.reply("Unable to find chat for statistics.");
      return;
    }

    await showTimeFramePicker(chatId);
  });

  bot.action("stats_day", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const message = await sendStatisticsByTimeFrame(ctx.chat!.id, "day");
      await ctx.reply(message);
    } catch (error) {
      await replyStatsError(ctx, error);
    }
  });

  bot.action("stats_week", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const message = await sendStatisticsByTimeFrame(ctx.chat!.id, "week");
      await ctx.reply(message);
    } catch (error) {
      await replyStatsError(ctx, error);
    }
  });

  bot.action("stats_month", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const message = await sendStatisticsByTimeFrame(ctx.chat!.id, "month");
      await ctx.reply(message);
    } catch (error) {
      await replyStatsError(ctx, error);
    }
  });

  bot.action("stats_year", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const message = await sendStatisticsByTimeFrame(ctx.chat!.id, "year");
      await ctx.reply(message);
    } catch (error) {
      await replyStatsError(ctx, error);
    }
  });
}