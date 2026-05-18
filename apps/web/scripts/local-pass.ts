// @glitzy/web/scripts/local-pass — automated LOCAL_PASS verification
// 게이트 #4·#5 자동 검증: magic-link 발급 → consume URL 호출 → cookie → dashboard
//
// 사용: pnpm --filter @glitzy/web exec tsx --env-file=.env scripts/local-pass.ts
// 사전 조건: dev 서버가 http://localhost:<port> 에서 기동 중 (기본 3001), seed 적용 완료

import postgres from "postgres";
import { issueMagicLink, validateAuthConfig } from "@glitzy/auth";

const DEV_BASE_URL = process.env.DEV_BASE_URL ?? "http://localhost:3001";
const TARGET_EMAIL = process.env.TARGET_EMAIL ?? "op@example.com";

async function main(): Promise<void> {
  const seedUrl = process.env.SEED_DATABASE_URL;
  if (!seedUrl) {
    console.error("SEED_DATABASE_URL required");
    process.exit(1);
  }
  const cfg = {
    authSecret: process.env.AUTH_SECRET ?? "",
    magicLinkTtlSeconds: Number(process.env.MAGIC_LINK_TTL_SECONDS ?? 900),
    sessionTtlSeconds: Number(process.env.SESSION_TTL_SECONDS ?? 86400),
    sessionRefreshIntervalSeconds: Number(process.env.SESSION_REFRESH_INTERVAL_SECONDS ?? 3600),
    resendMode: (process.env.RESEND_MODE ?? "mock") as "mock" | "suppress-mock",
  };
  validateAuthConfig(cfg);

  const sql = postgres(seedUrl, { max: 1, onnotice: () => {} });

  try {
    console.log("=== Gate #4: magic-link 발급 ===");
    const issued = await issueMagicLink(sql, cfg, TARGET_EMAIL);
    console.log(`  identifier: ${issued.identifier}`);
    console.log(`  tokenPlain: ${issued.tokenPlain.slice(0, 12)}…`);
    console.log(`  expiresAt:  ${issued.expiresAt.toISOString()}`);

    console.log("\n=== Gate #4: /sign-in/consume GET ===");
    const consumeUrl = `${DEV_BASE_URL}/sign-in/consume?identifier=${encodeURIComponent(issued.identifier)}&token=${encodeURIComponent(issued.tokenPlain)}`;
    const consumeRes = await fetch(consumeUrl, { redirect: "manual" });
    console.log(`  status: ${consumeRes.status}`);
    const location = consumeRes.headers.get("location");
    const setCookie = consumeRes.headers.get("set-cookie");
    console.log(`  location: ${location}`);
    console.log(`  set-cookie: ${setCookie ? "glitzy_session=…" : "(none)"}`);
    if (consumeRes.status !== 307 && consumeRes.status !== 303 && consumeRes.status !== 302) {
      throw new Error(`unexpected status: ${consumeRes.status}`);
    }
    if (!setCookie || !setCookie.includes("glitzy_session=")) {
      throw new Error("session cookie not set");
    }
    if (location !== "/demo" && location !== `${DEV_BASE_URL}/demo`) {
      throw new Error(`unexpected redirect: ${location}`);
    }

    // cookie 추출 (HttpOnly 이지만 fetch 응답에는 노출)
    const cookieMatch = setCookie.match(/glitzy_session=([^;]+)/);
    const cookieVal = cookieMatch?.[1];
    if (!cookieVal) throw new Error("could not extract cookie value");

    console.log("\n=== Gate #5: /demo dashboard GET ===");
    const dashRes = await fetch(`${DEV_BASE_URL}/demo`, {
      headers: { cookie: `glitzy_session=${cookieVal}` },
      redirect: "manual",
    });
    console.log(`  status: ${dashRes.status}`);
    if (dashRes.status !== 200) {
      const body = await dashRes.text();
      console.error(`  body sample: ${body.slice(0, 500)}`);
      throw new Error(`dashboard status: ${dashRes.status}`);
    }
    const dashBody = await dashRes.text();
    const hasCtx = dashBody.includes("op@example.com") && dashBody.includes("operator");
    console.log(`  ctx (email + role) visible: ${hasCtx}`);
    if (!hasCtx) throw new Error("dashboard ctx not visible");

    console.log("\n=== Gate #4·#5 PASS ===");

    console.log("\n=== audit_event 신규 row 확인 ===");
    const events = await sql<{ event_type: string; payload: Record<string, unknown> }[]>`
      SELECT event_type, payload FROM audit_event
       WHERE event_type IN ('magic-link-consumed','session-created','first-active-membership-resolved','tenant-resolved')
         AND occurred_at > now() - interval '5 minutes'
       ORDER BY occurred_at
    `;
    for (const e of events) {
      console.log(`  ${e.event_type}: ${JSON.stringify(e.payload)}`);
    }
    // magic-link-issued 는 sign-in Server Action 만 emit (script 가 packages/auth.issueMagicLink 직접 호출이므로 skip)
    const expected = ["magic-link-consumed", "session-created", "first-active-membership-resolved", "tenant-resolved"];
    const missing = expected.filter((t) => !events.some((e) => e.event_type === t));
    if (missing.length > 0) {
      console.error(`  MISSING audit events: ${missing.join(", ")}`);
      throw new Error("audit events incomplete");
    }
    console.log("\n=== Gate #7 PASS (audit_event 4종 row 확인) ===");

    console.log("\n=== 시나리오 13: HMAC tampering ===");
    const tampered = cookieVal.slice(0, -2) + (cookieVal.endsWith("a") ? "bb" : "aa");
    const tamperRes = await fetch(`${DEV_BASE_URL}/demo`, {
      headers: { cookie: `glitzy_session=${tampered}` },
      redirect: "manual",
    });
    console.log(`  status: ${tamperRes.status}`);
    const tamperLoc = tamperRes.headers.get("location");
    console.log(`  location: ${tamperLoc}`);
    if (tamperRes.status !== 307 && tamperRes.status !== 303 && tamperRes.status !== 302) {
      throw new Error(`tampered should redirect: got ${tamperRes.status}`);
    }
    if (!tamperLoc?.includes("/sign-in/cleanup")) {
      throw new Error(`tampered should redirect to cleanup: got ${tamperLoc}`);
    }
    console.log("  → cleanup route 경유 PASS");

    console.log("\n=== 시나리오 3: slug-lookup not found ===");
    const notFoundRes = await fetch(`${DEV_BASE_URL}/no-such-instance`, {
      headers: { cookie: `glitzy_session=${cookieVal}` },
      redirect: "manual",
    });
    console.log(`  status: ${notFoundRes.status}`);
    if (notFoundRes.status !== 404) {
      throw new Error(`slug not-found should return 404: got ${notFoundRes.status}`);
    }
    console.log("  → 404 PASS");

    console.log("\n========================================");
    console.log("✅ LOCAL_PASS — 핵심 시나리오 모두 통과");
    console.log("========================================");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("❌ LOCAL_PASS FAILED", err);
  process.exit(1);
});
