const pendingAppeals = new Map<number, boolean>();

export function setPendingAppeal(chatId: number): void {
  pendingAppeals.set(chatId, true);
}

export function hasPendingAppeal(chatId: number): boolean {
  return pendingAppeals.get(chatId) === true;
}

export function clearPendingAppeal(chatId: number): void {
  pendingAppeals.delete(chatId);
}