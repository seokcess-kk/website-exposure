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
  type SearchPropertyRow,
  type SearchSyncStateRow,
  type VisibilitySnapshotSummary,
} from "@/lib/admin/search-visibility";
import { VisibilityMetricsView } from "@/components/admin/visibility/VisibilityMetricsView";

export default async function VisibilityMetricsPage({
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

  const gscConfigured = isSearchConsoleConfigured();
  const isSuperAdmin = pageCtx.ctx.isSuperAdmin;

  const { properties, syncStates } = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx) => {
      const [properties, syncStates] = await Promise.all([
        loadSearchProperties(tx, ctx.instanceId),
        loadSyncStates(tx, ctx.instanceId),
      ]);
      return { properties, syncStates };
    },
  );

  // 첫 verified property 의 요약 (v1 단순화 — multi-property summary 는 후속 cycle)
  const firstVerified: SearchPropertyRow | null =
    properties.find((p) => p.verificationStatus === "verified") ?? null;
  let summary: VisibilitySnapshotSummary | null = null;
  if (firstVerified) {
    summary = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => loadVisibilitySummary(tx, ctx.instanceId, firstVerified.id, 7),
    );
  }

  return (
    <VisibilityMetricsView
      instanceSlug={params.instanceSlug}
      gscConfigured={gscConfigured}
      isSuperAdmin={isSuperAdmin}
      properties={properties}
      syncStates={syncStates as SearchSyncStateRow[]}
      summary={summary}
      summaryPropertyId={firstVerified?.id ?? null}
    />
  );
}
