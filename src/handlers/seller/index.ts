// src/handlers/seller/index.ts
import { registerAskAppealHandler } from "./askAppeal.handler";
import { registerMyShopHandler } from "./myshop.handler";

import { registerStatisticsHandler } from "./statistics.handler";
import { registerSupportFAQHandler } from "./supportFAQ.handler";


export function registerSellerHandlers() {
  registerMyShopHandler();
  registerStatisticsHandler();
  registerAskAppealHandler();
  registerSupportFAQHandler();
}