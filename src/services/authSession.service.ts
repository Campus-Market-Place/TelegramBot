import { AuthResponse } from "./authService";

const authSessions = new Map<number, AuthResponse>();

export function setAuthSession(chatId: number, auth: AuthResponse): void {
  authSessions.set(chatId, auth);
}

export function getAuthSession(chatId: number): AuthResponse | undefined {
  return authSessions.get(chatId);
}

export function clearAuthSession(chatId: number): void {
  authSessions.delete(chatId);
}