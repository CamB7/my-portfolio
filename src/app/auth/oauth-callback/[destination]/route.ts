import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const SESSION_VERIFIER_PARAM = "neon_auth_session_verifier";

const DESTINATIONS: Record<string, string> = {
  about: "/about",
  home: "/",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ destination: string }> },
) {
  const { destination } = await context.params;
  const next = DESTINATIONS[destination] ?? "/about";
  const verifier = request.nextUrl.searchParams.get(SESSION_VERIFIER_PARAM);

  if (!verifier) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const challengeCookie = "__Secure-neon-auth.session_challange";
  const hasChallenge = (request.headers.get("cookie") ?? "").includes(challengeCookie);

  if (!hasChallenge) {
    const failed = new URL("/auth/oauth-failed", request.url);
    failed.searchParams.set("next", next);
    failed.searchParams.set("reason", "missing_challenge");
    return NextResponse.redirect(failed);
  }

  const { GET: authGet } = auth.handler();
  const sessionResponse = await authGet(
    new Request(request.url, {
      method: "GET",
      headers: request.headers,
    }),
    { params: Promise.resolve({ path: ["get-session"] }) },
  );

  const setCookies = sessionResponse.headers.getSetCookie();

  if (!sessionResponse.ok || setCookies.length === 0) {
    const failed = new URL("/auth/oauth-failed", request.url);
    failed.searchParams.set("next", next);
    return NextResponse.redirect(failed);
  }

  const redirect = NextResponse.redirect(new URL(next, request.url));

  for (const cookie of setCookies) {
    redirect.headers.append("Set-Cookie", cookie);
  }

  return redirect;
}
