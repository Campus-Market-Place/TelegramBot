import { showMainMenu } from "../commands/start";
import { showTimeFramePicker } from "../handlers/seller/statistics.handler";
import { promptAppealReason } from "../handlers/seller/askAppeal.handler";
import { sendSupportInfo } from "../handlers/common/support.handler";
import { BotContext, getContextState } from "../types/botContext";

export async function routeByState(ctx: BotContext): Promise<void> {
  const state = getContextState(ctx);

  switch (state) {
    case "IDLE":
      await showMainMenu(ctx);
      return;

    case "BROWSING":
      await showMainMenu(ctx);
      return;

    case "TIMEFRAME_SELECTION":
      await showTimeFramePicker(ctx);
      return;

    case "APPEALING":
      await promptAppealReason(ctx);
      return;

    case "SUPPORT_CONTACT":
      await sendSupportInfo(ctx);
      return;

    default:
      await showMainMenu(ctx);
      return;
  }
}
