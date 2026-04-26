import { Context } from "telegraf";
import { AuthResponse } from "../services/authService";

export const VALID_USER_STATES = [
  "IDLE",
  "BROWSING",
  "SHOP_VIEW",
  "TIMEFRAME_SELECTION",
  "STAT_CHECK",
  "APPEALING",
  "APPEAL_SUMMITED",
  "SUPPORT_CONTACT",
  "SHOP_INFO",
  "TO_BE_SELLER"
] as const;

export type UserState = (typeof VALID_USER_STATES)[number];

export type BotContext = Context & {
  auth?: AuthResponse;
};

export function setContextState(
  ctx: Context,
  state: UserState | string,
  context: Record<string, unknown>
): void {
  (ctx as any).state = state;
  (ctx as any).context = context;
}

export function getContextState(ctx: Context): UserState | string {
  return ((ctx as any).state as UserState | string | undefined) ?? "IDLE";
}

export function getContextData(ctx: Context): Record<string, unknown> {
  return ((ctx as any).context as Record<string, unknown> | undefined) ?? {};
}
