"use client";

import { useState } from "react";
import { Button, Flex, Text } from "@once-ui-system/core";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth/client";

type SignInWithGoogleProps = {
  callbackURL?: string;
  label?: string;
  size?: "s" | "m" | "l";
};

export function SignInWithGoogle({
  callbackURL = "/",
  label = "Sign in with Google",
  size = "m",
}: SignInWithGoogleProps) {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const absoluteCallback = new URL(callbackURL, window.location.origin).toString();
      await authClient.signIn.social({
        provider: "google",
        callbackURL: absoluteCallback,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      await authClient.signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-out failed");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <Text variant="body-default-s">Checking session…</Text>;
  }

  if (session?.user) {
    return (
      <Flex gap="12" vertical="center" wrap>
        <Text variant="body-default-s">Signed in as {session.user.name}</Text>
        <Button onClick={handleSignOut} disabled={loading} variant="secondary" size="s">
          {loading ? "Signing out…" : "Sign out"}
        </Button>
      </Flex>
    );
  }

  return (
    <div>
      <Button onClick={handleSignIn} disabled={loading} size={size} variant="secondary">
        <Flex gap="8" vertical="center">
          <FcGoogle size={18} />
          {loading ? "Redirecting…" : label}
        </Flex>
      </Button>
      {error ? (
        <p style={{ color: "var(--danger-on-background-strong)", marginTop: "0.5rem" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
