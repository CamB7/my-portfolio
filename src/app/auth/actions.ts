"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export type OAuthDestination = "about" | "home";

export async function signInWithGoogleAction(destination: OAuthDestination = "home") {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const callbackURL = `${protocol}://${host}/auth/oauth-callback/${destination}`;

  const { data, error } = await auth.signIn.social({
    provider: "google",
    callbackURL,
  });

  if (error) {
    throw new Error(error.message ?? "Sign-in failed");
  }

  if (data?.url) {
    redirect(data.url);
  }

  throw new Error("Sign-in did not return a redirect URL.");
}
