import axios from "axios";
import { config } from "../config/config";

const WAKE_POLL_TIMEOUT_MS = 30_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableBackendError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;
  const code = error.code;

  if (status && [408, 425, 429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  return ["ECONNABORTED", "ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "ENOTFOUND"].includes(
    String(code)
  );
}

export async function wakeBackend(maxAttempts = 4, intervalMs = 3_000): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await axios.get(`${config.BACKEND_URL}/health`, {
        timeout: WAKE_POLL_TIMEOUT_MS
      });

      return true;
    } catch {
      if (attempt < maxAttempts) {
        await sleep(intervalMs);
      }
    }
  }

  return false;
}

export async function withBackendAutoRetry<T>(
  request: () => Promise<T>,
  options?: {
    maxAttempts?: number;
    delayMs?: number;
    onRetryStart?: () => Promise<void> | void;
  }
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 3;
  const delayMs = options?.delayMs ?? 1_500;
  let lastError: unknown;
  let hasTriggeredRetryStart = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;

      if (!isRetryableBackendError(error) || attempt === maxAttempts) {
        break;
      }

      if (!hasTriggeredRetryStart) {
        hasTriggeredRetryStart = true;
        await options?.onRetryStart?.();
      }

      await wakeBackend();
      await sleep(delayMs);
    }
  }

  throw lastError;
}