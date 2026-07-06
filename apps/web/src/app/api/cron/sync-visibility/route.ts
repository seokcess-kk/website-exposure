// @glitzy/web/api/cron/sync-visibility — GSC 성과 자동 sync (NAVER_EXPOSURE Tier 3)
//
// Vercel Cron 이 매일 호출(vercel.json crons). verified GSC property 전량을 최근 7일 윈도우로 sync 해
// 키워드 성과 배지·검색노출 지표를 운영자 수동 sync 없이 최신 유지한다(모니터링 루프 자동화).
//
// 인증: CRON_SECRET env 설정 시 Vercel Cron 이 Authorization: Bearer <CRON_SECRET> 를 자동 첨부.
//   env 미설정이면 503(비활성). 수동 트리거도 같은 헤더 필요.
// 네이버(NSA)는 paste ingestion 이라 cron 대상 아님 — GSC(google-search-console) property 만.

import { NextResponse } from "next/server";

import { getSqlBase } from "@/lib/db";
import { isSearchConsoleConfigured, getSearchConsoleCredentials } from "@/lib/env";
import { runGscSyncForProperty } from "@/lib/admin/gsc-sync-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}
function shiftDate(base: string, deltaDays: number): string {
  const d = new Date(`${base}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET 미설정 — cron 비활성" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isSearchConsoleConfigured()) {
    return NextResponse.json({ ok: false, error: "GSC 환경 변수 미설정" }, { status: 503 });
  }
  const creds = getSearchConsoleCredentials()!;

  // GSC 데이터는 보통 2일 지연 → 최근 7일 윈도우(UPSERT 이므로 늦게 확정되는 데이터도 재수집).
  const endDate = shiftDate(todayUtc(), -2);
  const startDate = shiftDate(endDate, -6);

  // verified GSC property 전량 (cross-tenant system read — service-role · sync-actions.ts:381 패턴 정합).
  const sql = getSqlBase();
  const properties = await sql<{ property_id: string; property_url: string; instance_id: string; slug: string }[]>`
    SELECT sp.id AS property_id, sp.property_url, sp.instance_id, i.slug
      FROM search_property sp
      JOIN instance i ON i.id = sp.instance_id
     WHERE sp.source = 'google-search-console'
       AND sp.verification_status = 'verified'
  `;

  const results: Array<Record<string, unknown>> = [];
  for (const p of properties) {
    // runGscSyncForProperty 는 내부에서 lock/실패를 처리 → 한 property 실패가 루프를 멈추지 않음.
    const outcome = await runGscSyncForProperty({
      instanceId: p.instance_id,
      propertyId: p.property_id,
      propertyUrl: p.property_url,
      startDate,
      endDate,
      creds,
    });
    results.push({ slug: p.slug, propertyId: p.property_id, ...outcome });
  }

  return NextResponse.json({
    ok: true,
    range: { startDate, endDate },
    propertyCount: properties.length,
    results,
  });
}
