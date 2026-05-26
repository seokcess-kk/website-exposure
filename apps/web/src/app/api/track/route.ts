// @glitzy/web/app/api/track — MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 § 4
// 자체 beacon POST endpoint. PIPA anonymized session_token + Origin allowlist + page_path 첫 segment slug mapping.
//
// 보안 정책:
//  - INSERT only · state-changing X → CSRF token 미적용 (§ 4.2.2)
//  - Origin allowlist 안 cross-origin attacker 차단 (§ 4.2.0)
//  - zod 실패 / instance 미존재 / rate limit 차단 / Origin 차단 → 204 silent (정상 사용자 노출 X)

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  checkRateLimit,
  deriveSessionToken,
  extractSlugFromPagePath,
  generateVisitorSeed,
  isOriginAllowed,
  normalizeUtmSource,
  parseOriginAllowlist,
  parseReferrerHost,
  parseUserAgentFamily,
} from "@/lib/site-tracking/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// SESSION_SALT_SECRET fail-fast (§ 4.2.1) — module load 시점.
if (!process.env.SESSION_SALT_SECRET) {
  // dev/prod 모두 fail-fast. test env (vitest) 안 인식 위해 SESSION_SALT_SECRET 미설정 시 lazy throw 하지 않고
  // deriveSessionToken 호출 시점에 throw — 본 검증은 server.ts deriveSessionToken 안.
  console.warn("[track] SESSION_SALT_SECRET env not set — /api/track will fail at request time");
}

const CTA_ID_WHITELIST = [
  "hero-call",
  "hero-booking",
  "footer-call",
  "treatment-detail-call",
  "consult-form-default",
] as const;

const trackRequestSchema = z.object({
  event_name: z.enum([
    "phone_click",
    "kakao_click",
    "booking_click",
    "consult_form_start",
    "consult_form_complete",
  ]),
  page_path: z.string().min(2).max(512).regex(/^\/[a-zA-Z0-9_\-/.]*$/),
  utm: z
    .object({
      utm_source: z.string().max(128).optional(),
      utm_medium: z.string().max(64).optional(),
      utm_campaign: z.string().max(128).optional(),
      utm_term: z.string().max(128).optional(),
      utm_content: z.string().max(128).optional(),
      gclid: z.string().max(256).optional(),
      fbclid: z.string().max(256).optional(),
    })
    .default({}),
  referrer: z.string().url().optional(),
  metadata: z
    .object({
      cta_id: z.enum(CTA_ID_WHITELIST).optional(),
      form_step: z.string().max(64).optional(),
    })
    .default({}),
});

const VISITOR_COOKIE = "glitzy_visitor";
const VISITOR_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;  // 30d

function silentNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. body parse (sendBeacon 의 text/plain 정합 — Content-Type 무시 + 직접 text() 호출) ──
  let raw: unknown;
  try {
    const text = await req.text();
    raw = text ? JSON.parse(text) : {};
  } catch {
    return silentNoContent();
  }

  const parsed = trackRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return silentNoContent();
  }
  const body = parsed.data;

  // ── 2. page_path 첫 segment → instance.slug ──
  const slug = extractSlugFromPagePath(body.page_path);
  if (!slug) return silentNoContent();

  // ── 3. Origin/Referer host allowlist 검증 ──
  const allowlist = parseOriginAllowlist();
  const originHeader = req.headers.get("origin") || req.headers.get("referer");
  let originHost: string | null = null;
  if (originHeader) {
    try {
      originHost = new URL(originHeader).host;
    } catch {
      originHost = null;
    }
  }
  if (!originHost || !isOriginAllowed(originHost, allowlist)) {
    return silentNoContent();
  }

  // ── 4. visitor_seed cookie 회수 or 신규 발급 ──
  const existingSeed = req.cookies.get(VISITOR_COOKIE)?.value;
  const visitorSeed = existingSeed && /^[a-f0-9]{32}$/.test(existingSeed)
    ? existingSeed
    : generateVisitorSeed();
  const issuedNewSeed = !existingSeed || existingSeed !== visitorSeed;

  // ── 5. ua_family · referrer_host ──
  const uaFamily = parseUserAgentFamily(req.headers.get("user-agent"));
  const requestHost = req.headers.get("host");
  const referrerHost = parseReferrerHost(body.referrer, requestHost);

  // ── 6. utm normalize ──
  const normalizedUtm: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.utm)) {
    if (typeof v !== "string") continue;
    normalizedUtm[k] = k === "utm_source" ? (normalizeUtmSource(v) ?? v) : v;
  }

  // ── 7. withPublicTenantTransaction — instance lookup + INSERT ──
  let inserted = false;
  try {
    const result = await withPublicTenantTransaction(slug, async (tx, ctx) => {
      // 7-a. rate limit (ctx 안 resolved instanceId 사용)
      // session_token 산출 전 rate limit (visitor_seed 기반)
      // visitor_seed 직접 사용 — session_token 의 dailySalt 영향 회피 (운영자 trace 와 무관한 spam 차단)
      if (!checkRateLimit(ctx.instanceId, visitorSeed)) {
        return false;
      }

      // 7-b. session_token 산출
      const sessionToken = deriveSessionToken({
        instanceId: ctx.instanceId,
        visitorSeed,
        date: new Date(),
      });

      // 7-c. INSERT
      await tx`
        INSERT INTO conversion_event (
          instance_id, event_name, page_path, session_token, utm, referrer_host, ua_family, metadata
        ) VALUES (
          ${ctx.instanceId}::uuid,
          ${body.event_name},
          ${body.page_path},
          ${sessionToken},
          ${tx.json(normalizedUtm)},
          ${referrerHost},
          ${uaFamily},
          ${tx.json(body.metadata)}
        )
      `;
      return true;
    });

    // helper return null (instance 미존재/inactive) or rate-limited (false) → silent
    inserted = result === true;
  } catch (err) {
    console.error("[track] insert error", err);
    return silentNoContent();
  }

  // ── 8. 응답 — 신규 visitor_seed 발급 시 Set-Cookie ──
  const res = silentNoContent();
  if (inserted && issuedNewSeed) {
    res.cookies.set({
      name: VISITOR_COOKIE,
      value: visitorSeed,
      httpOnly: true,
      sameSite: "lax",
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}
