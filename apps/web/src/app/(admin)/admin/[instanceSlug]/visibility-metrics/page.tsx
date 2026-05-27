// @glitzy/web/(admin)/[instanceSlug]/visibility-metrics — SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 7
// v1 acceptance: 헤더 + property 표 + sync 버튼 + 7일 요약 + 페이지/키워드별 표 + sparkline (inline svg).

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { isSearchConsoleConfigured } from "@/lib/env";
import {
  loadSearchProperties,
  loadSyncStates,
  loadVisibilitySummary,
  type SearchSyncStateRow,
} from "@/lib/admin/search-visibility";
import { loadVisibilityGap } from "@/lib/admin/search-visibility-gap";
import { VisibilityMetricsView } from "@/components/admin/visibility/VisibilityMetricsView";

export type VisibilitySourceFilter = "all" | "google" | "naver";

function parseSourceFilter(raw: string | string[] | undefined): VisibilitySourceFilter {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "google" || v === "naver") return v;
  return "all";
}

function sourceFilterToColumn(filter: VisibilitySourceFilter): "google-search-console" | "naver-searchadvisor" | undefined {
  if (filter === "google") return "google-search-console";
  if (filter === "naver") return "naver-searchadvisor";
  return undefined;  // all
}

export default async function VisibilityMetricsPage({
  params,
  searchParams,
}: {
  params: { instanceSlug: string };
  searchParams?: { source?: string | string[] };
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

  const gscConfigured = isSearchConsoleConfigured();
  const isSuperAdmin = pageCtx.ctx.isSuperAdmin;
  const sourceFilter = parseSourceFilter(searchParams?.source);
  const sourceColumn = sourceFilterToColumn(sourceFilter);

  // properties / syncStates / summary / gap 한 transaction 합산
  const { properties, syncStates, summary, gap } = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx) => {
      const [properties, syncStates, gap] = await Promise.all([
        loadSearchProperties(tx, ctx.instanceId),
        loadSyncStates(tx, ctx.instanceId),
        loadVisibilityGap(tx, ctx.instanceId, { days: 7, topLimit: 30 }),
      ]);
      // source filter 적용 — propertyId 미지정 (모든 property 합산), source 만 분기
      const summary = await loadVisibilitySummary(tx, ctx.instanceId, {
        source: sourceColumn,
        days: 7,
      });
      return { properties, syncStates, summary, gap };
    },
  );

  return (
    <VisibilityMetricsView
      instanceSlug={params.instanceSlug}
      gscConfigured={gscConfigured}
      isSuperAdmin={isSuperAdmin}
      properties={properties}
      syncStates={syncStates as SearchSyncStateRow[]}
      summary={summary}
      sourceFilter={sourceFilter}
      gap={gap}
    />
  );
}
