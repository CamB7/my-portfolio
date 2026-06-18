"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Avatar, Button, Column, Heading, Text } from "@once-ui-system/core";
import { postGuestbookMessage } from "@/app/about/actions";
import { SignInWithGoogle } from "@/components/SignInWithGoogle";
import { authClient } from "@/lib/auth/client";
import type { GuestbookMessage } from "@/lib/guestbook/types";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import styles from "./guestbook.module.scss";

const MAX_BODY_LENGTH = 500;

function avatarProps(userImage: string | null | undefined, userName: string) {
  const src = userImage?.trim();
  if (src && (src.startsWith("https://") || src.startsWith("/"))) {
    return { src };
  }
  return { value: userName.slice(0, 1) };
}

type GuestbookUser = {
  id: string;
  name: string;
  image?: string | null;
};

type GuestbookProps = {
  initialMessages: GuestbookMessage[];
  initialUser?: GuestbookUser | null;
};

export function Guestbook({ initialMessages, initialUser = null }: GuestbookProps) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user ?? initialUser;
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    initialMessages,
    (state, newMessage: GuestbookMessage) => [newMessage, ...state],
  );

  const trimmedLength = body.trim().length;
  const canPost = trimmedLength >= 1 && trimmedLength <= MAX_BODY_LENGTH && !isPending;

  function handlePost() {
    const trimmed = body.trim();
    if (!user || trimmed.length < 1 || trimmed.length > MAX_BODY_LENGTH) {
      return;
    }

    setError(null);

    const optimisticMessage: GuestbookMessage = {
      id: -Date.now(),
      body: trimmed,
      createdAt: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userImage: user.image ?? null,
    };

    startTransition(() => {
      addOptimisticMessage(optimisticMessage);
    });

    void (async () => {
      const result = await postGuestbookMessage(trimmed);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setBody("");
    })();
  }

  return (
    <Column className={styles.guestbook} fillWidth gap="m" marginTop="40" marginBottom="40">
      <Heading as="h2" variant="display-strong-s">
        Guestbook
      </Heading>

      {sessionPending && !user ? (
        <Text variant="body-default-s" onBackground="neutral-weak">
          Loading…
        </Text>
      ) : user ? (
        <div className={styles.form}>
          <p className={styles.postingAs}>posting as {user.name}</p>
          <textarea
            className={styles.textarea}
            value={body}
            onChange={(event) => setBody(event.target.value.slice(0, MAX_BODY_LENGTH))}
            maxLength={MAX_BODY_LENGTH}
            placeholder="Leave a message…"
            rows={3}
            disabled={isPending}
          />
          <div className={styles.metaRow}>
            <span className={styles.counter}>
              {body.length}/{MAX_BODY_LENGTH}
            </span>
            <Button
              onClick={handlePost}
              disabled={!canPost}
              size="s"
              variant="primary"
              label={isPending ? "Posting…" : "Post"}
            />
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>
      ) : (
        <div className={styles.signInWrap}>
          <SignInWithGoogle
            destination="about"
            label="Sign in with Google to leave a message"
            size="s"
          />
        </div>
      )}

      <div className={styles.messages}>
        {optimisticMessages.length === 0 ? (
          <p className={styles.empty}>No messages yet. Be the first to say hello.</p>
        ) : (
          optimisticMessages.map((message) => {
            const isOwn = user?.id === message.userId;

            return (
              <article
                key={message.id}
                className={`${styles.message} ${isOwn ? styles.messageOwn : ""}`}
              >
                <Avatar size="m" {...avatarProps(message.userImage, message.userName)} />
                <div className={styles.messageBody}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageName}>{message.userName}</span>
                    <time
                      className={styles.messageTime}
                      dateTime={message.createdAt}
                      title={new Date(message.createdAt).toLocaleString()}
                    >
                      {formatRelativeTime(message.createdAt)}
                    </time>
                  </div>
                  <p className={styles.messageText}>{message.body}</p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </Column>
  );
}
