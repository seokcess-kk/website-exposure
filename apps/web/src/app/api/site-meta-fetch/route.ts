// @glitzy/web/api/site-meta-fetch — 외부 사이트 URL meta scrape
// cycle7-8-code (URL scrape patch) v0.3:
//   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
//   - WEB-110: code 클라이언트 노출 제거 (audit reason 만)
//   - WEB-111: body reader 직접 4KB 제한 (chunked 우회 차단)
//   - WEB-113: audit payload sanitizeUrlForAudit (userinfo/query 제거)

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  AuthDeniedError,
  assertActionEligibility,
  emitAuditEvent,
  getActiveSession,
  resolveTenantContext,
  TenantResolveError,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { fetchSiteMeta, sanitizeUrlForAudit, SiteMetaFetchError } from "@/lib/site-meta-fetch";
import { slugResolver } from "@/lib/slug-resolver";

const BodySchema = z.object({
  url: z.string().min(1).max(2048),
  instanceSlug: z.string().min(3).max(64),
});

const MAX_REQUEST_BYTES = 4 * 1024;

async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
  try {
    await emitAuditEvent(sqlBase, input);
  } catch (err) {
    console.error("[site-meta-fetch] audit emit failed", err);
  }
}

// cycle8 WEB-111: body reader 로 4KB strict (chunked content-length 우회 차단)
async function readBodyWithLimit(req: NextRequest): Promise<string | null> {
  const reader = req.body?.getReader();
  if (!reader) return null;
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // cycle3-3entity WEB-40: Origin 누락도 차단 (브라우저 전용 endpoint)
  const origin = req.headers.get("origin");
  if (!origin || origin !== req.nextUrl.origin) {
    return NextResponse.json({ ok: false, error: "외부 도메인 요청은 차단됩니다." }, { status: 403 });
  }

  const signedToken = req.cookies.get("glitzy_session")?.value ?? null;
  if (!signedToken) {
    return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  }

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();
  let userId: AdminUserId;
  try {
    const session = await getActiveSession(sqlBase, cfg, signedToken);
    // cycle3-3entity WEB-34: branded UUID narrow
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    await emitBestEffort(sqlBase, {
      eventType: "site-meta-fetch-failed",
      reason,
      payload: { origin: "auth" },
    });
    // cycle3-3entity WEB-42: invalid/tampered session — cookie clear 도 함께 (page 경로의 cleanup 과 동등 처리)
    const res = NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
    res.cookies.delete("glitzy_session");
    return res;
  }

  // cycle8 WEB-111: body reader 직접 제한 (chunked content-length 무시 우회 차단)
  const rawBody = await readBodyWithLimit(req);
  if (rawBody === null) {
    return NextResponse.json({ ok: false, error: "요청 본문이 너무 큽니다." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "url 또는 instanceSlug 필드가 필요합니다." }, { status: 400 });
  }

  // cycle8 WEB-109: slugResolver + resolveTenantContext + assertActionEligibility 재검증
  const instanceId = await slugResolver(sqlBase, parsed.data.instanceSlug, userId);
  if (instanceId === null) {
    return NextResponse.json({ ok: false, error: "인스턴스를 찾을 수 없습니다." }, { status: 404 });
  }

  let ctx;
  try {
    ctx = await resolveTenantContext(sqlBase, cfg, signedToken, instanceId);
  } catch (err) {
    const reason = err instanceof TenantResolveError ? err.reason : "tenant-resolve-failed";
    await emitBestEffort(sqlBase, {
      eventType: "site-meta-fetch-failed",
      actorUserId: userId,
      reason,
      payload: { origin: "tenant-resolve", instanceSlug: parsed.data.instanceSlug },
    });
    return NextResponse.json({ ok: false, error: "접근 권한이 없습니다." }, { status: 403 });
  }
  try {
    assertActionEligibility(ctx, "operator-edit-content");
  } catch (err) {
    const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
    await emitBestEffort(sqlBase, {
      eventType: "site-meta-fetch-failed",
      actorUserId: userId,
      toInstanceId: ctx.instanceId,
      reason,
      payload: { origin: "eligibility", instanceSlug: parsed.data.instanceSlug },
    });
    return NextResponse.json({ ok: false, error: "운영자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const meta = await fetchSiteMeta(parsed.data.url);
    await emitBestEffort(sqlBase, {
      eventType: "site-meta-fetched",
      actorUserId: userId,
      toInstanceId: ctx.instanceId,
      payload: {
        // cycle8 WEB-113: audit payload sanitize
        input: sanitizeUrlForAudit(parsed.data.url),
        resolved: sanitizeUrlForAudit(meta.resolvedUrl),
      },
    });
    return NextResponse.json({ ok: true, meta });
  } catch (err) {
    if (err instanceof SiteMetaFetchError) {
      await emitBestEffort(sqlBase, {
        eventType: "site-meta-fetch-failed",
        actorUserId: userId,
        toInstanceId: ctx.instanceId,
        reason: err.code,
        payload: { input: sanitizeUrlForAudit(parsed.data.url) },
      });
      // cycle8 WEB-110: code 응답 제거 — generic 메시지만
      return NextResponse.json({ ok: false, error: "사이트 분석에 실패했습니다." }, { status: 400 });
    }
    console.error("[site-meta-fetch] unexpected", err);
    await emitBestEffort(sqlBase, {
      eventType: "site-meta-fetch-failed",
      actorUserId: userId,
      toInstanceId: ctx.instanceId,
      reason: "unexpected",
      payload: { input: sanitizeUrlForAudit(parsed.data.url) },
    });
    return NextResponse.json({ ok: false, error: "사이트 분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
