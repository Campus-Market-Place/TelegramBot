import { Markup } from "telegraf";

export function userMenuKeyboard(WEBREQUEST_URL: string) {
  return Markup.keyboard([
    ["🔔 Notifications", "🆘 Support & FAQ"],
    ["📦 Information", Markup.button.webApp("Be seller", WEBREQUEST_URL)]
  ]).resize();
}