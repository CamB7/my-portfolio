"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { HiOutlineChatBubbleLeftRight, HiXMark } from "react-icons/hi2";
import {
  loadChatSession,
  saveChatSession,
  type ChatMessage,
} from "@/lib/chat-session";
import styles from "./ChatWidget.module.scss";

function createMessageId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function TypingIndicator() {
  return (
    <span className={styles.typing} aria-label="Cameron is typing">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionReady, setSessionReady] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(loadChatSession());
    setSessionReady(true);
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    saveChatSession(messages);
  }, [messages, sessionReady]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isStreaming]);

  useEffect(() => {
    if (open) {
      textareaRef.current?.focus();
    }
  }, [open]);

  const updateAssistantMessage = useCallback((id: string, content: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, content } : message,
      ),
    );
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
    };
    const assistantId = createMessageId();
    const history = [...messages, userMessage];

    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const errText = (await response.text()) || `Request failed (${response.status}).`;
        setMessages(history);
        setError(errText);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setMessages(history);
        setError("Streaming is not supported in this browser.");
        return;
      }

      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        updateAssistantMessage(assistantId, assistantText);
      }

      assistantText += decoder.decode();
      updateAssistantMessage(assistantId, assistantText.trim());

      if (!assistantText.trim()) {
        setMessages(history);
        setError("The model returned an empty response.");
      }
    } catch {
      setMessages(history);
      setError("Network error — check your connection and try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className={styles.root}>
      {open && (
        <section
          className={styles.panel}
          role="dialog"
          aria-label="Chat with Cameron Boyer"
        >
          <header className={styles.header}>
            <div>
              <h2 className={styles.title}>Cameron Boyer</h2>
              <p className={styles.subtitle}>AI clone · Gemini 2.5 Flash</p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <HiXMark size={20} />
            </button>
          </header>

          <div className={styles.messages}>
            {messages.length === 0 && !error && (
              <p className={styles.empty}>
                Ask about my stack, Lando, portfolio work, or whether I&apos;m open
                for opportunities.
              </p>
            )}

            {messages.map((message) => {
              const isUser = message.role === "user";
              const isTyping =
                !isUser && isStreaming && message.content.length === 0;

              if (!isUser && !message.content && !isTyping) {
                return null;
              }

              return (
                <div
                  key={message.id}
                  className={`${styles.bubbleRow} ${isUser ? styles.user : styles.assistant}`}
                >
                  <div
                    className={`${styles.bubble} ${
                      isUser ? styles.userBubble : styles.assistantBubble
                    }`}
                  >
                    {isTyping ? (
                      <TypingIndicator />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              );
            })}

            {error && <p className={styles.error}>{error}</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className={styles.input}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask me something…"
              disabled={isStreaming}
              aria-label="Message"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isStreaming || input.trim().length === 0}
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? <HiXMark size={24} /> : <HiOutlineChatBubbleLeftRight size={24} />}
      </button>
    </div>
  );
}
