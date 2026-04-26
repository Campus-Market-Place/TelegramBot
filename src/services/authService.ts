import axios from "axios";
import { config } from "../config/config";
import { withBackendAutoRetry } from "../util/wakeBackend";

export type Role = "USER" | "SELLER";

export interface AuthUser {
  id: string;
  telegram_id?: string;
  username: string;
  telegramChatId?: string;
  chatId?: number;
  role: Role;
  shopid?: string | null;
  state?: string;
  context?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function loginOrSignup(
  telegramId: string,
  username: string,
  chatId: number,
  onRetryStart?: () => Promise<void> | void
): Promise<AuthResponse> {
  const response = await withBackendAutoRetry(
    () =>
      axios.post(
        `${config.BACKEND_URL}/auth/login`,
        {
          telegram_id: telegramId,
          telegram_username: username,
          telegram_chat_id: String(chatId)
        },
        {
          timeout: 60000
        }
      ),
    {
      maxAttempts: 4,
      delayMs: 2000,
      onRetryStart
    }
  );

  return response.data;
}

export async function updateUserState(
  userId: string,
  state: string,
  context: Record<string, unknown>,
  token: string
): Promise<AuthResponse["user"]> {
  const endpoint = `${config.BACKEND_URL}/auth/users/${userId}/state`;

  const payload = {
    userId,
    state,
    context
  };

  const response = await withBackendAutoRetry(
    () =>
      axios.patch(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 20000
      }),
    {
      maxAttempts: 3,
      delayMs: 1500
    }
  );

  return response.data?.user ?? response.data?.data ?? response.data;
}

  


