import { Markup } from "telegraf";

export function sellerMenuKeyboard() {
  return Markup.keyboard([
    ["🔔 Notifications", "📊 Statistics"],
    ["📦 Shop View", "📝 Ask Appeal"],
    ["🆘 Support & FAQ"]
  ]).resize();
}