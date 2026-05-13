"use client";

import { useState, type FormEvent } from "react";
import { Button, Column, Heading, Input, Row, Text } from "@once-ui-system/core";

type Status = "idle" | "loading" | "error";

export const Chat: React.FC<React.ComponentProps<typeof Column>> = ({
  ...flex
}) => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [lastAsked, setLastAsked] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || status === "loading") return;

    setStatus("loading");
    setErrorText("");
    setLastAsked(trimmed);
    setReply("");
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data: { reply?: string; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorText(data.error || `Request failed (${res.status}).`);
        return;
      }

      setReply(data.reply || "");
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorText("Network error — check your connection and try again.");
    }
  };

  return (
    <Column
      fillWidth
      maxWidth="m"
      padding="xl"
      radius="l"
      gap="m"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Column gap="4">
        <Heading variant="display-strong-xs">Ask me anything</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          A small chat trained on my About page. Replies use Gemini 2.5 Flash.
        </Text>
      </Column>

      <form onSubmit={handleSubmit}>
        <Row fillWidth gap="8" vertical="end">
          <Column fillWidth>
            <Input
              id="chat-input"
              label="Your question"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "loading"}
            />
          </Column>
          <Button
            type="submit"
            variant="primary"
            size="m"
            disabled={status === "loading" || message.trim().length === 0}
          >
            {status === "loading" ? "Sending…" : "Send"}
          </Button>
        </Row>
      </form>

      {(lastAsked || reply || status !== "idle") && (
        <Column
          fillWidth
          gap="s"
          padding="m"
          radius="m"
          background="neutral-alpha-weak"
          border="neutral-alpha-weak"
        >
          {lastAsked && (
            <Column gap="2">
              <Text
                variant="label-default-s"
                onBackground="neutral-weak"
                style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
              >
                You
              </Text>
              <Text variant="body-default-m" wrap="balance">
                {lastAsked}
              </Text>
            </Column>
          )}

          <Column gap="2">
            <Text
              variant="label-default-s"
              onBackground="brand-medium"
              style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              Cameron
            </Text>
            {status === "loading" && (
              <Text variant="body-default-m" onBackground="neutral-weak">
                Thinking…
              </Text>
            )}
            {status === "error" && (
              <Text variant="body-default-m" onBackground="neutral-strong">
                {errorText}
              </Text>
            )}
            {status === "idle" && reply && (
              <Text
                variant="body-default-m"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {reply}
              </Text>
            )}
          </Column>
        </Column>
      )}
    </Column>
  );
};
