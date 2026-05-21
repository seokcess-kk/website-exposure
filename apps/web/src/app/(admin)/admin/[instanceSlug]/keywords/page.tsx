// @glitzy/web/(admin)/[instanceSlug]/keywords — Phase 2 placeholder (404 회피)
// SEO_VISIBILITY_OPS_PLAN v0.2 § 7 task #9.5 (cycle 1 critique #3)
//
// 본 페이지는 KeywordCoverageCard 의 "전체 관리 →" link 가 가는 곳.
// Phase 2 (SEO_KEYWORD_STRATEGY_PLAN) 합류 시 실제 키워드 CRUD UI 로 교체.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

export default async function KeywordsPage({
  params,
}: {
  params: { instanceSlug: string };
}) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      return <main className="p-6"><p>{a.message}</p></main>;
    }
    throw err;
  }

  // 현재 등록된 키워드 개수만 간단히 표시 (실제 CRUD 는 Phase 2)
  const counts = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx) => {
      const rows: Array<{ total: string; primary: string; secondary: string }> = await tx`
        SELECT
          count(*)::text AS total,
          count(*) FILTER (WHERE keyword_type = 'primary')::text AS primary,
          count(*) FILTER (WHERE keyword_type = 'secondary')::text AS secondary
        FROM keyword_target
        WHERE instance_id = ${pageCtx.instanceId}::uuid
      `;
      const r = rows[0];
      return r
        ? { total: Number(r.total), primary: Number(r.primary), secondary: Number(r.secondary) }
        : { total: 0, primary: 0, secondary: 0 };
    },
  );

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-fg-default">타깃 키워드</h1>
        <p className="text-sm text-fg-muted">
          현재 등록 <strong className="text-fg-default">{counts.total}</strong>개
          (primary {counts.primary} · secondary {counts.secondary})
        </p>
      </header>

      <section className="rounded-md border border-dashed border-border bg-bg-default/30 p-6">
        <h2 className="mb-2 text-base font-semibold text-fg-default">Phase 2 — 키워드/토픽 클러스터 (예정)</h2>
        <p className="mb-3 text-sm text-fg-muted">
          본 페이지는 Phase 0 (DB schema) 만 도입된 상태입니다. 실제 키워드 CRUD UI · 클러스터 매핑 ·
          gap 분석은 별 plan <code className="rounded bg-bg-default px-1 font-mono text-xs">SEO_KEYWORD_STRATEGY_PLAN</code>{" "}
          합류 시 추가됩니다.
        </p>
        <p className="text-sm text-fg-muted">
          Phase 1 안 readiness 계산은 이미 keyword_target · keyword_content_link 테이블의 데이터를 활용합니다.
          DB 안 직접 INSERT 한 키워드가 있다면 readiness 의{" "}
          <code className="rounded bg-bg-default px-1 font-mono text-xs">title-has-target-keyword</code> 체크에 반영됩니다.
        </p>
      </section>

      <footer>
        <Link
          href={`/admin/${params.instanceSlug}`}
          className="text-sm text-brand-primary hover:underline"
        >
          ← 대시보드로 돌아가기
        </Link>
      </footer>
    </main>
  );
}
