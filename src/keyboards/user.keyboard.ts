import { Markup } from "telegraf";

export function userMenuKeyboard(sellerFormUrl: string) {
  return Markup.keyboard([
    ["🔔 Notifications", "🆘 Support & FAQ"],
    ["📦 Information", Markup.button.webApp("Be seller", sellerFormUrl)]
  ]).resize();
}