import axios from "axios";
import { config } from "../config/config";

export type StatisticsTimeFrame = "day" | "week" | "month" | "year";

export interface EngagementStatisticsResponse {
  success: boolean;
  data: {
    timeFrame: StatisticsTimeFrame;
    period: {
      currentStart: string;
      currentEnd: string;
      previousStart: string;
      previousEnd: string;
    };
    metrics: {
      views: number;
      contacts: number;
      socialMediaClicks: number;
      newFollowers: number;
      totalFollowers: number;
      contactvsviewsRatio: number;
      followersVsViewsRatio: number;
    };
    trend: {
      views: "up" | "down" | "same";
      contacts: "up" | "down" | "same";
    };
    comparisons: {
      viewsPercent: number | null;
      contactsPercent: number | null;
      socialMediaClicksPercent: number | null;
      newFollowersPercent: number | null;
      totalFollowersPercent: number | null;
    };
  };
}

export async function getStatistics(
  shopId: string,
  timeFrame: StatisticsTimeFrame,
  token?: string
): Promise<EngagementStatisticsResponse> {
  const response = await axios.get(
    `${config.BACKEND_URL}/api/engagement/${shopId}/statistics`,
    {
      params: { timeFrame },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      timeout: 15000
    }
  );

  return response.data as EngagementStatisticsResponse;
}