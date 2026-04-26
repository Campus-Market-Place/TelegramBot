//npx ts-node src/server.ts

//https://client-side-self.vercel.app/
import express from "express";
import { Request, Response } from "express";
import { bot } from "./bot/bot";
import { logger } from "./util/logger";
import { config } from "./config/config";
// import { Update } from "telegraf/typings/core/types/typegram";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// app.post("/telegram/webhook", async (req: Request, res: Response) => {
//   try {
//     await bot.handleUpdate(req.body);
//     res.sendStatus(200);
//   } catch (error) {
//     logger.error("Webhook error");
//     res.sendStatus(500);
//   }
// });

app.get("/", (_req: Request, res: Response) => {
  res.send("Bot running");
});

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);

  await bot.telegram.setWebhook(
    `${config.WEBHOOK_URL}/telegram/webhook`
  );

  logger.info("Webhook set successfully");
});

//process.once("SIGINT", () => bot.stop("SIGINT"));
//process.once("SIGTERM", () => bot.stop("SIGTERM"));

app.post("/telegram/webhook", async (req: Request, res: Response) => {
  console.log("Incoming update:", req.body);
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
});