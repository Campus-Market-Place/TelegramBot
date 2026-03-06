import axios from "axios";
import { config } from "../config/config";

export async function wakeBackend() {
  try {

    console.log("Waking backend...");

    await axios.get(`${config.BACKEND_URL}/health`);

    console.log("Backend is awake");

  } catch {

    console.log("Backend wake failed (will retry later)");

  }
}