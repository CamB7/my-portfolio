"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

function isRouteEnabled(pathname: string | null): boolean {
  if (!pathname) return false;

  if (pathname in routes && routes[pathname as keyof typeof routes]) {
    return true;
  }

  const dynamicRoutes = ["/blog", "/work"] as const;
  for (const route of dynamicRoutes) {
    if (pathname.startsWith(route) && routes[route]) {
      return true;
    }
  }

  return false;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();

  const routeEnabled = useMemo(() => isRouteEnabled(pathname), [pathname]);

  const passwordRequired = useMemo(() => {
    if (!pathname) return false;
    return Boolean(protectedRoutes[pathname as keyof typeof protectedRoutes]);
  }, [pathname]);

  const [checkingPassword, setCheckingPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!passwordRequired) {
      setCheckingPassword(false);
      setAuthenticated(false);
      setPassword("");
      setError(undefined);
      return;
    }

    let cancelled = false;
    setCheckingPassword(true);

    (async () => {
      try {
        const response = await fetch("/api/check-auth");
        if (!cancelled) {
          setAuthenticated(response.ok);
        }
      } finally {
        if (!cancelled) {
          setCheckingPassword(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, passwordRequired]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (!routeEnabled) {
    return <NotFound />;
  }

  if (passwordRequired && checkingPassword) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (passwordRequired && !authenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
