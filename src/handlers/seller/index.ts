// src/handlers/seller/index.ts
import { registerAskAppealHandler } from "./askAppeal.handler";
import { registerNotificationsHandler } from "./notifications.handler";

import { registerStatisticsHandler } from "./statistics.handler";
import { registerSupportFAQHandler } from "./supportFAQ.handler";


export function registerSellerHandlers() {
  registerNotificationsHandler();
  registerStatisticsHandler();
  registerAskAppealHandler();
  registerSupportFAQHandler();
}