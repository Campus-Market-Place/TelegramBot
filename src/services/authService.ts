import axios from "axios";
import { config } from "../config/config";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    telegram_id?: string;
    username: string;
    telegramChatId?: string;
    chatId?: number;
    role: "USER" | "SELLER";
    shopid?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export async function loginOrSignup(
  telegramId: string,
  username: string,
  chatId: number
): Promise<AuthResponse> {

  console.log("Calling backend login...");

  const response = await axios.post(
    `${config.BACKEND_URL}/auth/login`,
    {
      telegram_id: telegramId,
      telegram_username: username,
      telegram_chat_id:String(chatId)
    },
    {
      timeout: 60000 // ✅ VERY IMPORTANT
    }
  );

  console.log("Backend responded!");
  console.log("Auth response:", response.data);

  return response.data;
}