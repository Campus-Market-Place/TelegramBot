// src/handlers/user/index.ts
import { registerUserInformationHandler } from "./information.handler";
import { registerBeSellerHandler } from "./BeSeller.handler";

export function registerUserHandlers() {
  // registerUserNotificationsHandler();
  registerUserInformationHandler();
  
  registerBeSellerHandler();
}