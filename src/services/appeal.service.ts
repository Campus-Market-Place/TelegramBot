import axios from "axios";
import { config } from "../config/config";
import { withBackendAutoRetry } from "../util/wakeBackend";

export interface AppealResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export async function submitAppeal(
  shopId: string,
  reason: string,
  token: string
): Promise<AppealResponse> {
  const response = await withBackendAutoRetry(
    () =>
      axios.post(
        `${config.BACKEND_URL}/api/report/appeal/${shopId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 15000
        }
      ),
    {
      maxAttempts: 3,
      delayMs: 1500
    }
  );

  return response.data;
}