export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "cameron-portfolio-chat-session-v1";

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as ChatMessage;
  return (
    typeof message.id === "string" &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string"
  );
}

export function loadChatSession(): ChatMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isValidMessage)
      .map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content.trim(),
      }))
      .filter((message) => message.content.length > 0);
  } catch {
    return [];
  }
}

export function saveChatSession(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;

  const persisted = messages.filter((message) => message.content.trim().length > 0);

  try {
    if (persisted.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Ignore quota or privacy-mode errors.
  }
}
