// @glitzy/web/lib/session-cookie — read/set/clear helper (Plan v1.0 § 5.1)
// Asymmetric refresh: cookie fixed window + DB session sliding window (ADMIN-UI-50·83)
// sliding cookie refresh 는 packages/auth v0.3 sessionRefreshed 반환 후 cascade

import { cookies } from "next/headers";
import { getAuthCfg } from "./env";

const COOKIE_NAME = "glitzy_session";

export function readSessionCookie(): string | null {
  const store = cookies();
  const c = store.get(COOKIE_NAME);
  return c?.value ?? null;
}

/** Route Handler / Server Action 응답에서만 호출 가능 (Server Component render 중 unsafe) */
export function setSessionCookie(signedToken: string): void {
  const cfg = getAuthCfg();
  cookies().set(COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cfg.sessionTtlSeconds,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(COOKIE_NAME);
}
