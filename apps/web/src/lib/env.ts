// @glitzy/web/lib/env — env 검증 + AuthConfig 주입 (Plan v1.0 § 7)
// server-side only — NEXT_PUBLIC_* 사용 안 함 (ADMIN-UI-19)

import { z } from "zod";
import { validateAuthConfig, type AuthConfig } from "@glitzy/auth";

const EnvSchema = z.object({
  WEB_DATABASE_URL: z.string().min(1, "WEB_DATABASE_URL required"),
  // PUBLIC_SITE_RENDER_PLAN v1.0 § 6 — 공개 사이트 SSR 용 app_public_reader connection
  WEB_PUBLIC_DATABASE_URL: z.string().min(1, "WEB_PUBLIC_DATABASE_URL required"),
  SEED_DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 chars"),
  MAGIC_LINK_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(86400),
  SESSION_REFRESH_INTERVAL_SECONDS: z.coerce.number().int().positive().default(3600),
  RESEND_MODE: z.enum(["mock", "suppress-mock"]).default("mock"),
  DEV_MOCK_MAILBOX_VIEW: z.string().optional(),
  NEXT_SERVER_ACTIONS_BODY_SIZE_LIMIT: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 3 — Google Search Console service account
  //   둘 다 unset 이면 ingestion feature disabled (page 안 안내 카드 노출).
  //   둘 중 하나만 set 이면 invalid (boot-time fail).
  GOOGLE_SEARCH_CONSOLE_SA_EMAIL: z.string().email().optional(),
  GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY: z.string().optional(),
});

type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;
let cachedAuthCfg: AuthConfig | null = null;

export function getEnv(): Env {
  if (cachedEnv !== null) return cachedEnv;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`env validation failed: ${issues}`);
  }
  // SVI § 3 — GSC creds 는 pair 강제 (둘 다 또는 둘 다 unset)
  const hasEmail = !!parsed.data.GOOGLE_SEARCH_CONSOLE_SA_EMAIL;
  const hasKey = !!parsed.data.GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY;
  if (hasEmail !== hasKey) {
    throw new Error(
      "env validation failed: GOOGLE_SEARCH_CONSOLE_SA_EMAIL and GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY must be both set or both unset",
    );
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

/** SVI § 3 — GSC ingestion 가용 여부. false → page 안 안내 카드 + sync 액션 차단. */
export function isSearchConsoleConfigured(): boolean {
  const env = getEnv();
  return !!env.GOOGLE_SEARCH_CONSOLE_SA_EMAIL && !!env.GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY;
}

/** SVI § 3 — GSC JWT 발급용 SA credentials. unconfigured 면 null 반환 (caller 가 guard). */
export function getSearchConsoleCredentials(): { saEmail: string; privateKey: string } | null {
  const env = getEnv();
  if (!env.GOOGLE_SEARCH_CONSOLE_SA_EMAIL || !env.GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY) return null;
  // 환경 변수에 PEM 을 한 줄로 저장할 때 \n 이 literal 로 들어오는 경우가 흔함 — 정규화.
  const privateKey = env.GOOGLE_SEARCH_CONSOLE_SA_PRIVATE_KEY.replace(/\\n/g, "\n");
  return { saEmail: env.GOOGLE_SEARCH_CONSOLE_SA_EMAIL, privateKey };
}

export function getAuthCfg(): AuthConfig {
  if (cachedAuthCfg !== null) return cachedAuthCfg;
  const env = getEnv();
  const cfg: AuthConfig = {
    authSecret: env.AUTH_SECRET,
    magicLinkTtlSeconds: env.MAGIC_LINK_TTL_SECONDS,
    sessionTtlSeconds: env.SESSION_TTL_SECONDS,
    sessionRefreshIntervalSeconds: env.SESSION_REFRESH_INTERVAL_SECONDS,
    resendMode: env.RESEND_MODE,
  };
  // cycle1-code WEB-12: packages/auth.validateAuthConfig 호출 — refresh interval < session TTL 등 invariant 검증
  validateAuthConfig(cfg);
  cachedAuthCfg = cfg;
  return cachedAuthCfg;
}

/** Plan § 7 ADMIN-UI-19: server-side 3중 가드 — dev mode + mock + flag 모두 true 일 때만 mailbox UI 노출 */
export function isMockMailboxVisible(): boolean {
  const env = getEnv();
  return env.NODE_ENV !== "production" && env.RESEND_MODE === "mock" && env.DEV_MOCK_MAILBOX_VIEW === "true";
}
