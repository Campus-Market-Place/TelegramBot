import { Markup } from "telegraf";

export function sellerMenuKeyboard() {
  return Markup.keyboard([
    ["🏪 My Shop", "📊 Statistics"],
    ["📦 Shop View", "📝 Ask Appeal"],
    ["🆘 Support & FAQ"]
  ]).resize();
}