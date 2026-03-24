// src/handlers/seller/index.ts
import { registerAskAppealHandler } from "./askAppeal.handler";
import { registerMyShopHandler } from "./myshop.handler";

import { registerStatisticsHandler } from "./statistics.handler";



export function registerSellerHandlers() {
  registerMyShopHandler();
  registerStatisticsHandler();
  registerAskAppealHandler();
 
}