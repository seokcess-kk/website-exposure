// @glitzy/auth — config object (env에 직접 의존 안 함·caller가 주입)

export type AuthConfig = {
  /** HMAC signing secret — 32+ chars */
  readonly authSecret: string;
  /** session TTL (seconds) */
  readonly sessionTtlSeconds: number;
  /** session refresh interval (seconds) — sinceLastRefreshed > interval일 때 refresh */
  readonly sessionRefreshIntervalSeconds: number;
};

export function validateAuthConfig(cfg: AuthConfig): void {
  if (cfg.authSecret.length < 32) throw new Error("authSecret must be at least 32 chars");
  if (cfg.sessionTtlSeconds <= 0) throw new Error("sessionTtlSeconds must be positive");
  if (cfg.sessionRefreshIntervalSeconds <= 0 || cfg.sessionRefreshIntervalSeconds >= cfg.sessionTtlSeconds) {
    throw new Error("sessionRefreshIntervalSeconds must be positive and less than sessionTtlSeconds");
  }
}
