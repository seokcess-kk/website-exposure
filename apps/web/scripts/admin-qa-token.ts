// Manual QA helper — magic-link issue + consume URL 출력
// `tsx --env-file=.env src/../scripts/admin-qa-token.ts`

import postgres from "postgres";
import { issueMagicLink, validateAuthConfig } from "@glitzy/auth";

const dbUrl = process.env.WEB_DATABASE_URL ?? "postgres://postgres:postgres@localhost:5435/glitzy_dev";
const authSecret = process.env.AUTH_SECRET ?? "local-development-secret-please-replace-32chars";

const sql = postgres(dbUrl);
const cfg = {
  authSecret,
  magicLinkTtlSeconds: 900,
  sessionTtlSeconds: 86400,
  sessionRefreshIntervalSeconds: 3600,
  resendMode: "mock" as const,
};
validateAuthConfig(cfg);

const result = await issueMagicLink(sql, cfg, "test@glitzy.kr");
console.log(JSON.stringify({
  identifier: result.identifier,
  tokenPlain: result.tokenPlain,
  consumeUrl: `http://localhost:3001/sign-in/consume?identifier=${encodeURIComponent(result.identifier)}&token=${encodeURIComponent(result.tokenPlain)}`,
}, null, 2));
await sql.end();
