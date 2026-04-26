import axios from "axios";
import { config } from "../config/config";

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
  chatId: number
): Promise<AuthResponse> {
  const response = await axios.post(
    `${config.BACKEND_URL}/auth/login`,
    {
      telegram_id: telegramId,
      telegram_username: username,
      telegram_chat_id: String(chatId)
    },
    {
      timeout: 60000
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
  const endpoints = [
    `${config.BACKEND_URL}/auth/users/${userId}/state`,
    `${config.BACKEND_URL}/auth/state/${userId}`,
    `${config.BACKEND_URL}/auth/state`
  ];

  const payload = {
    userId,
    state,
    context
  };

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await axios.patch(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 20000
      });

      return response.data?.user ?? response.data?.data ?? response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

