// Spike E — PROVIDER_PASS smoke (Vercel preview·Day 10)
// 본 smoke는 preview URL에 HTTP request 시리즈로 검증
// 실 Resend 발송·callback round-trip은 수동 절차 — 본 스크립트는 자동 가능 영역만

const PREVIEW_BASE_URL = process.env.PREVIEW_BASE_URL;
const TEST_EMAIL = process.env.TEST_EMAIL_ADDRESS;

if (!PREVIEW_BASE_URL || !TEST_EMAIL) {
  throw new Error("Missing PREVIEW_BASE_URL or TEST_EMAIL_ADDRESS");
}

type HttpProbe = {
  label: string;
  method: string;
  path: string;
  body?: Record<string, unknown>;
  cookie?: string;
  expectedStatusOneOf: number[];
};

async function probe(p: HttpProbe): Promise<{ status: number; bodyText: string; setCookie: string | null }> {
  const url = `${PREVIEW_BASE_URL}${p.path}`;
  const headers: Record<string, string> = {};
  if (p.body) headers["content-type"] = "application/json";
  if (p.cookie) headers["cookie"] = p.cookie;
  const res = await fetch(url, { method: p.method, body: p.body ? JSON.stringify(p.body) : undefined, headers, redirect: "manual" });
  const text = await res.text().catch(() => "");
  const setCookie = res.headers.get("set-cookie");
  if (!p.expectedStatusOneOf.includes(res.status)) {
    throw new Error(`[${p.label}] expected status in ${p.expectedStatusOneOf.join("|")}, got ${res.status}\n${text.slice(0, 500)}`);
  }
  return { status: res.status, bodyText: text, setCookie };
}

async function main(): Promise<void> {
  console.log(`[provider-smoke] target preview: ${PREVIEW_BASE_URL}`);

  // Phase 1: preview health check
  const health = await probe({
    label: "preview health",
    method: "GET",
    path: "/",
    expectedStatusOneOf: [200, 301, 302, 307, 308],
  });
  console.log(`[provider-smoke] phase1 preview health: ${health.status} (PASS)`);

  // Phase 2: Auth.js signin GET — magic link 발송 트리거
  // next-auth v5 표준: GET /api/auth/signin/email?email=<email>·CSRF token 필요
  // 본 smoke는 CSRF token 자동 처리 없이 단순 endpoint 존재 검증
  const signinPage = await probe({
    label: "auth signin page",
    method: "GET",
    path: "/api/auth/signin",
    expectedStatusOneOf: [200, 302],
  });
  console.log(`[provider-smoke] phase2 /api/auth/signin: ${signinPage.status} (PASS — endpoint exists)`);

  // Phase 3: CSRF token endpoint
  const csrf = await probe({
    label: "auth csrf",
    method: "GET",
    path: "/api/auth/csrf",
    expectedStatusOneOf: [200],
  });
  let csrfToken: string | null = null;
  try {
    const parsed = JSON.parse(csrf.bodyText) as { csrfToken?: string };
    csrfToken = parsed.csrfToken ?? null;
  } catch { /* ignore */ }
  if (!csrfToken) throw new Error("csrf token not returned");
  console.log(`[provider-smoke] phase3 /api/auth/csrf: token=${csrfToken.slice(0, 8)}...·secure cookie set=${csrf.setCookie ? "yes" : "no"} (PASS)`);

  // Phase 4: requestedInstanceId tampering — protected endpoint에 잘못된 UUID
  // (가정: apps/web에 /api/instance/[instanceId] 같은 endpoint 구현·LOCAL과 동일 path validation)
  const tamper = await probe({
    label: "tampering invalid UUID",
    method: "GET",
    path: "/api/instance/not-a-uuid",
    expectedStatusOneOf: [400, 401, 403, 404],  // 미인증 시 401·UUID validation 시 400
  });
  console.log(`[provider-smoke] phase4 invalid UUID tampering: ${tamper.status} (PASS)`);

  // Phase 5: session 없는 protected endpoint → 401
  const unauth = await probe({
    label: "unauth protected",
    method: "GET",
    path: "/api/instance/aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
    expectedStatusOneOf: [401, 403],
  });
  console.log(`[provider-smoke] phase5 unauth protected: ${unauth.status} (PASS)`);

  console.log("\n✅ provider-smoke (Vercel preview): 5 automated phases PASS");
  console.log("ℹ️  추가 수동 검증 (PROVIDER_RUNBOOK.md):");
  console.log("    - magic link email 수신 + callback round-trip → session cookie 발급");
  console.log("    - session DB row 검증 (psql)");
  console.log("    - DevTools cookie attributes (Secure·HttpOnly·SameSite=Lax)");
  console.log("    - membership active=false 후 next request 403");
  console.log("    - super-admin instance switch + audit");
}

main().catch((err) => {
  console.error("[provider-smoke] FAIL:", err);
  process.exit(1);
});
