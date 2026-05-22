// @glitzy/web/(admin)/[instanceSlug]/visibility-metrics/upload page
// NAVER_SEARCH_INGEST_PLAN v0.4 § 7.4 task #4 — paste UI (기준 날짜 + textarea).

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { loadSearchProperties, type SearchPropertyRow } from "@/lib/admin/search-visibility";
import { UploadNaverPasteForm } from "./UploadNaverPasteForm";

type Props = { params: { instanceSlug: string } };

export const dynamic = "force-dynamic";

export default async function UploadNaverPastePage({ params }: Props) {
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

  const properties = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx) => loadSearchProperties(tx, ctx.instanceId),
  );
  const naverProperties = properties.filter(
    (p: SearchPropertyRow) => p.source === "naver-searchadvisor" && p.verificationStatus === "verified",
  );

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold text-fg-default">네이버 검색 데이터 업로드</h1>
          <Link
            href={`/admin/${params.instanceSlug}/visibility-metrics`}
            className="text-xs text-fg-muted underline hover:text-fg-default"
          >
            ← 검색 노출
          </Link>
        </div>
        <p className="text-sm text-fg-muted">
          네이버 서치어드바이저 콘솔의 <strong>콘텐츠 노출/클릭 → 검색 키워드 TOP30</strong> 표 데이터를
          클립보드에 복사한 뒤 아래 영역에 붙여넣어 ingestion 합니다.
        </p>
        <div className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-fg-default">
          <strong className="text-warning">⚠️ 데이터 특성</strong> · NSA TOP30 은 <strong>일별 시계열이 아닌 누적 스냅샷</strong>입니다.
          기준 날짜는 운영자가 직접 지정 — 매번 ingestion 시 그 시점의 TOP30 누적이 저장됩니다.
          페이지별 · 평균 순위 데이터는 NSA 가 제공하지 않으므로 비어있게 표시됩니다.
        </div>
      </header>

      {naverProperties.length === 0 ? (
        <section className="rounded-md border border-border bg-elevated p-6 text-sm text-fg-muted">
          이 instance 에 등록된 verified 네이버 property 가 없습니다. 먼저{" "}
          <Link href={`/admin/${params.instanceSlug}/visibility-metrics`} className="text-fg-default underline">
            검색 노출
          </Link>{" "}
          페이지에서 super-admin 으로 네이버 property 를 추가하세요 (소유 확인은
          searchadvisor.naver.com 외부 콘솔에서 완료).
        </section>
      ) : (
        <UploadNaverPasteForm
          instanceSlug={params.instanceSlug}
          properties={naverProperties}
          defaultReferenceDate={today}
        />
      )}

      <section className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        <h2 className="text-sm font-semibold text-fg-default">붙여넣기 절차</h2>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>
            <a
              href="https://searchadvisor.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-default underline"
            >
              네이버 서치어드바이저
            </a>{" "}
            → 등록한 사이트 → <strong>콘텐츠 노출/클릭</strong> 메뉴
          </li>
          <li>검색 키워드 TOP30 표 영역을 마우스로 전체 드래그 (header 행 포함)</li>
          <li>
            <code className="rounded bg-bg-hover px-1 py-0.5">Ctrl+C</code> 로 복사
          </li>
          <li>위 textarea 안 <code className="rounded bg-bg-hover px-1 py-0.5">Ctrl+V</code> 로 붙여넣기</li>
          <li>기준 날짜 (default 오늘) 확인 → 제출</li>
        </ol>
      </section>
    </main>
  );
}
