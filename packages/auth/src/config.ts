// @glitzy/auth — config object (env에 직접 의존 안 함·caller가 주입)

export type AuthConfig = {
  /** HMAC signing secret — 32+ chars */
  readonly authSecret: string;
  /** magic link TTL (seconds) */
  readonly magicLinkTtlSeconds: number;
  /** session TTL (seconds) */
  readonly sessionTtlSeconds: number;
  /** session refresh interval (seconds) — sinceLastRefreshed > interval일 때 refresh */
  readonly sessionRefreshIntervalSeconds: number;
  /** Mailbox mode — mock (in-memory)·suppress-mock (token만 발급·delivery 미수행). 실 delivery는 별도 mail adapter (v0.3+ — package에서 미구현) */
  readonly resendMode: "mock" | "suppress-mock";
};

export function validateAuthConfig(cfg: AuthConfig): void {
  if (cfg.authSecret.length < 32) throw new Error("authSecret must be at least 32 chars");
  if (cfg.magicLinkTtlSeconds <= 0) throw new Error("magicLinkTtlSeconds must be positive");
  if (cfg.sessionTtlSeconds <= 0) throw new Error("sessionTtlSeconds must be positive");
  if (cfg.sessionRefreshIntervalSeconds <= 0 || cfg.sessionRefreshIntervalSeconds >= cfg.sessionTtlSeconds) {
    throw new Error("sessionRefreshIntervalSeconds must be positive and less than sessionTtlSeconds");
  }
}
