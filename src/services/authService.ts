import axios from "axios";
import { config } from "../config/config";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: "USER" | "SELLER";
  };
}

export async function loginOrSignup(
  telegramId: string,
  username: string
): Promise<AuthResponse> {

  console.log("Calling backend login...");

  const response = await axios.post(
    `${config.BACKEND_URL}/auth/login`,
    {
      telegram_id: telegramId,
      telegram_username: username
    },
    {
      timeout: 15000 // ✅ VERY IMPORTANT
    }
  );

  console.log("Backend responded!");
  console.log("Auth response:", response.data);

  return response.data;
}