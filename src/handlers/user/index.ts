// src/handlers/user/index.ts
import { registerUserNotificationsHandler } from "./notifications.handler";
import { registerUserInformationHandler } from "./information.handler";
import { registerSupportFAQHandler } from "./supportFAQ.handler";

export function registerUserHandlers() {
  registerUserNotificationsHandler();
  registerUserInformationHandler();
  registerSupportFAQHandler();
}