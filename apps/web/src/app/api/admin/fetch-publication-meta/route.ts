// @glitzy/web/api/admin/fetch-publication-meta — DOI/URL → Publication 자동 채우기
// 사용자 검수 2026-05-20 — 어드민 PublicationForm 안 URL 입력만으로 메타데이터 자동 추출
// site-meta-fetch 패턴 정합 (auth + slugResolver + assertActionEligibility + audit)

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
import { fetchPublicationMeta } from "@/lib/publication-meta";
import { slugResolver } from "@/lib/slug-resolver";

const BodySchema = z.object({
  input: z.string().min(1).max(2048),  // DOI 또는 URL
  instanceSlug: z.string().min(3).max(64),
});

async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
  try {
    await emitAuditEvent(sqlBase, input);
  } catch (err) {
    console.error("[fetch-publication-meta] audit emit failed", err);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Origin 체크
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
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    await emitBestEffort(sqlBase, { eventType: "fetch-publication-meta-failed", reason });
    const res = NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
    res.cookies.delete("glitzy_session");
    return res;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "input 또는 instanceSlug 필드가 필요합니다." }, { status: 400 });
  }

  const instanceId = await slugResolver(sqlBase, parsed.data.instanceSlug, userId);
  if (instanceId === null) {
    return NextResponse.json({ ok: false, error: "인스턴스를 찾을 수 없습니다." }, { status: 404 });
  }

  let ctx;
  try {
    ctx = await resolveTenantContext(sqlBase, cfg, signedToken, instanceId);
  } catch (err) {
    const reason = err instanceof TenantResolveError ? err.reason : "tenant-resolve-failed";
    await emitBestEffort(sqlBase, { eventType: "fetch-publication-meta-failed", actorUserId: userId, reason });
    return NextResponse.json({ ok: false, error: "인스턴스 접근 권한이 없습니다." }, { status: 403 });
  }

  try {
    assertActionEligibility(ctx, "operator-edit-content");
  } catch (err) {
    if (err instanceof AuthDeniedError) {
      await emitBestEffort(sqlBase, { eventType: "fetch-publication-meta-failed", actorUserId: userId, reason: err.reason });
      return NextResponse.json({ ok: false, error: "콘텐츠 편집 권한이 없습니다." }, { status: 403 });
    }
    throw err;
  }

  const meta = await fetchPublicationMeta(parsed.data.input);
  await emitBestEffort(sqlBase, {
    eventType: "fetch-publication-meta-ok",
    actorUserId: userId,
    payload: { source: meta.source, hasTitle: meta.title !== null, hasDoi: meta.doi !== null },
  });

  return NextResponse.json({ ok: true, meta });
}
