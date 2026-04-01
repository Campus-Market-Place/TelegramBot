import dotenv from "dotenv";

dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  BACKEND_URL: process.env.BACKEND_URL as string,
  WEBAPP_URL: process.env.WEBAPP_URL as string,
  WEBREQUEST_URL: process.env.WEBREQUEST_URL as string,
  WEBSELLER_URL: process.env.WEBSELLER_URL as string,
  WEBHOOK_URL: process.env.WEBHOOK_URL as string,
  How_TO_USE_WEBHOOK: process.env.How_TO_USE_WEBHOOK as string,
};