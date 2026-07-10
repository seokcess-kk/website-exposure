// @glitzy/web/api/cron/indexnow-articles — 아티클 IndexNow 자동 재제출 (NAVER_EXPOSURE 색인 루프)
//
// Vercel Cron 이 매일 호출(vercel.json crons). 최근 갱신된 published 아티클 URL 을 IndexNow
// (네이버 직접 + api.indexnow.org 팬아웃)에 배치 제출해 색인 신호를 유지한다.
// 발행 훅(notifyIndexNow)이 못 잡는 경로를 커버: 스크립트 일괄 시드(seed-articles-from-json ·
// sync-prod-from-dev), 훅 best-effort 실패, 도메인 전환 후 신규 host 재알림(scope=all).
//
// 인증: CRON_SECRET env — sync-visibility cron 과 동일 패턴 (Bearer · 미설정 시 503).
// scope: 기본 recent(최근 25h 갱신분 — 일 1회 cron 주기 + 여유), ?scope=all 은 published 전량
//   (도메인 전환·대량 시드 후 수동 트리거용 — 무변경 URL 상시 재제출은 프로토콜상 지양).

import { NextResponse } from "next/server";

import { getSqlBase } from "@/lib/db";
import { notifyIndexNowBatch, type IndexNowBatchResult } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ArticleRow = { instance_slug: string; category_slug: string; article_slug: string };

export async function GET(req: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET 미설정 — cron 비활성" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const scope = new URL(req.url).searchParams.get("scope") === "all" ? "all" : "recent";

  // active instance 전량의 published 아티클 (cross-tenant system read — service-role · sync-visibility 패턴 정합).
  const sql = getSqlBase();
  const rows = await sql<ArticleRow[]>`
    SELECT i.slug AS instance_slug, ac.slug AS category_slug, a.slug AS article_slug
      FROM article a
      JOIN article_category ac ON ac.id = a.category_id AND ac.instance_id = a.instance_id
      JOIN instance i ON i.id = a.instance_id AND i.active = true
     WHERE a.status = 'published' AND a.published_at IS NOT NULL AND a.published_at <= now()
       ${scope === "all" ? sql`` : sql`AND a.updated_at >= now() - interval '25 hours'`}
     ORDER BY i.slug ASC, a.updated_at DESC
  `;

  // 인스턴스별 그룹 → host 단위 배치 제출 (IndexNow payload 의 host 필드가 단일이라 인스턴스 단위가 경계).
  const byInstance = new Map<string, string[]>();
  for (const r of rows) {
    const paths = byInstance.get(r.instance_slug) ?? [];
    paths.push(`/insights/${r.category_slug}/${r.article_slug}`);
    byInstance.set(r.instance_slug, paths);
  }

  const results: Array<{ slug: string } & IndexNowBatchResult> = [];
  for (const [slug, paths] of byInstance) {
    // notifyIndexNowBatch 는 best-effort — 한 인스턴스 실패가 루프를 멈추지 않음.
    const outcome = await notifyIndexNowBatch(slug, paths);
    results.push({ slug, ...outcome });
  }

  return NextResponse.json({ ok: true, scope, articleCount: rows.length, results });
}
