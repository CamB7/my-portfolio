"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth/client";

const SESSION_VERIFIER_PARAM = "neon_auth_session_verifier";

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // OAuth exchange runs in /auth/oauth-callback route handler — skip client fetch here.
    if (params.has(SESSION_VERIFIER_PARAM)) {
      return;
    }

    void authClient.getSession().catch(() => {
      // Ignore transient session fetch errors on public pages.
    });
  }, []);

  return <>{children}</>;
}
