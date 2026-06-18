import Link from "next/link";
import { Column, Heading, Text } from "@once-ui-system/core";

type OAuthFailedPageProps = {
  searchParams: Promise<{ next?: string; reason?: string }>;
};

export default async function OAuthFailedPage({ searchParams }: OAuthFailedPageProps) {
  const { next = "/about", reason } = await searchParams;
  const returnPath = next.startsWith("/") ? next : "/about";

  return (
    <Column fillWidth paddingY="128" horizontal="center" gap="16">
      <Heading variant="display-strong-s">Sign-in could not be completed</Heading>
      <Text onBackground="neutral-weak" variant="body-default-m">
        {reason === "missing_challenge"
          ? "Your sign-in session cookie was missing when Google redirected back. Try signing in again from the same browser tab."
          : "Your Google sign-in session expired or was already used. Please try again."}
      </Text>
      <Link href={returnPath}>Back to {returnPath === "/" ? "home" : returnPath}</Link>
    </Column>
  );
}
