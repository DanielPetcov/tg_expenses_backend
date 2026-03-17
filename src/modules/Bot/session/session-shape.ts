export interface SessionData {
  lastListMessageId?: number;
}

export function initial(): SessionData {
  return {};
}
