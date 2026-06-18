"use client";

import { useState, useTransition } from "react";
import { Button, Flex, Text } from "@once-ui-system/core";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth/client";
import {
  signInWithGoogleAction,
  type OAuthDestination,
} from "@/app/auth/actions";

type SignInWithGoogleProps = {
  destination?: OAuthDestination;
  label?: string;
  size?: "s" | "m" | "l";
};

export function SignInWithGoogle({
  destination = "home",
  label = "Sign in with Google",
  size = "m",
}: SignInWithGoogleProps) {
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, startSignIn] = useTransition();
  const [isSigningOut, startSignOut] = useTransition();

  const handleSignIn = () => {
    setError(null);
    startSignIn(async () => {
      try {
        await signInWithGoogleAction(destination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-in failed");
      }
    });
  };

  const handleSignOut = () => {
    setError(null);
    startSignOut(async () => {
      try {
        await authClient.signOut();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign-out failed");
      }
    });
  };

  if (isPending) {
    return <Text variant="body-default-s">Checking session…</Text>;
  }

  if (session?.user) {
    return (
      <Flex gap="12" vertical="center" wrap>
        <Text variant="body-default-s">Signed in as {session.user.name}</Text>
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="secondary"
          size="s"
        >
          {isSigningOut ? "Signing out…" : "Sign out"}
        </Button>
      </Flex>
    );
  }

  return (
    <div>
      <Button
        onClick={handleSignIn}
        disabled={isSigningIn}
        size={size}
        variant="secondary"
      >
        <Flex gap="8" vertical="center">
          <FcGoogle size={18} />
          {isSigningIn ? "Redirecting…" : label}
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
