// @glitzy/web/(admin)/[instanceSlug]/improvement-queue — CONTENT_IMPROVEMENT_QUEUE_PLAN v0.2

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import {
  loadImprovementQueue,
  type ImprovementCategory,
  type ImprovementQueueItem,
  type ImprovementQueueOverview,
} from "@/lib/admin/improvement-queue";
import {
  loadConversionImprovements,
  type ConversionImprovementItem,
  type ConversionImprovementsOverview,
} from "@/lib/admin/conversion-improvements";
import { RecomputeReadinessButton } from "@/components/admin/visibility/RecomputeReadinessButton";
import type { SeoReadinessEntityType } from "@glitzy/core-content";

type CategorySpec = {
  anchor: string;
  bucketKey: keyof Omit<
    ImprovementQueueOverview,
    "totalImprovementItems" | "affectedEntityCount" | "healthyCount"
  >;
  icon: string;
  title: string;
  description: string;
  toneClass: string;
};

// priority 순 (cycle 1 #3)
const CATEGORIES: ReadonlyArray<CategorySpec> = [
  {
    anchor: "low-readiness",
    bucketKey: "lowReadiness",
    icon: "🔴",
    title: "발행 중 readiness 낮음",
    description: "이미 발행된 콘텐츠 중 readiness 점수가 C/D/F. 가장 가시 손해.",
    toneClass: "border-rose-300 bg-rose-50",
  },
  {
    anchor: "evidence-missing",
    bucketKey: "evidenceMissing",
    icon: "🔴",
    title: "근거 부족",
    description: "논문/미디어 인용 또는 의료진 저자가 미연결 — E-E-A-T 시그널 부재.",
    toneClass: "border-rose-300 bg-rose-50",
  },
  {
    anchor: "seo-improve",
    bucketKey: "seoImprove",
    icon: "🟠",
    title: "SEO 개선 필요",
    description: "제목/요약이 타깃 키워드 또는 권장 길이와 맞지 않음.",
    toneClass: "border-orange-300 bg-orange-50",
  },
  {
    anchor: "stale",
    bucketKey: "stale",
    icon: "🟡",
    title: "30일+ 미업데이트",
    description: "신선도 시그널 약화 — 갱신 권장.",
    toneClass: "border-amber-300 bg-amber-50",
  },
  {
    anchor: "relations-thin",
    bucketKey: "relationsThin",
    icon: "🟢",
    title: "관계성 부족",
    description: "관련 FAQ 또는 내부 링크 부족 — 사이트 안 entity 그래프 강화 필요.",
    toneClass: "border-emerald-300 bg-emerald-50",
  },
];

const ENTITY_PATH_PREFIX: Record<SeoReadinessEntityType, string | null> = {
  Article: "articles",
  TreatmentPage: "treatments",
  FAQ: "faqs",
  Publication: "publications",
  MediaAppearance: "media-appearances",
  DoctorProfile: "doctors",
  ClinicProfile: null, // clinic-profile path 단수
};

function entityEditHref(instanceSlug: string, item: ImprovementQueueItem): string {
  if (item.entityType === "ClinicProfile") return `/admin/${instanceSlug}/clinic-profile`;
  const prefix = ENTITY_PATH_PREFIX[item.entityType];
  if (!prefix) return `/admin/${instanceSlug}`;
  return `/admin/${instanceSlug}/${prefix}/${item.slug}`;
}

export default async function ImprovementQueuePage({
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

  const { overview, conversionOverview } = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx) => {
      const [overview, conversionOverview] = await Promise.all([
        loadImprovementQueue(tx, ctx.instanceId),
        loadConversionImprovements(tx, ctx.instanceId, { days: 7 }),
      ]);
      return { overview, conversionOverview };
    },
  );

  const hasAnyItem = overview.totalImprovementItems > 0 || conversionOverview.totalItems > 0;

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg-default">콘텐츠 개선 큐</h1>
          {hasAnyItem ? (
            <p className="mt-1 text-sm text-fg-muted">
              개선 항목 <strong className="text-fg-default">{overview.totalImprovementItems}</strong>건
              (readiness 기반 · 카테고리 중복 포함) · 영향 콘텐츠{" "}
              <strong className="text-fg-default">{overview.affectedEntityCount}</strong>개
              {conversionOverview.totalItems > 0 && (
                <>
                  {" "}· 검색·전환 시그널 <strong className="text-fg-default">{conversionOverview.totalItems}</strong>건
                </>
              )}
              {overview.healthyCount > 0 && (
                <>
                  {" "}· <span className="text-emerald-700">안정권 콘텐츠 {overview.healthyCount}건</span>
                </>
              )}
            </p>
          ) : (
            <p className="mt-1 text-sm text-fg-muted">
              readiness 계산이 아직 안 됐거나 모든 콘텐츠가 안정권입니다.
            </p>
          )}
        </div>
        <RecomputeReadinessButton instanceSlug={params.instanceSlug} />
      </header>

      {!hasAnyItem ? (
        <section className="rounded-md border border-dashed border-border bg-bg-default/30 p-8 text-center">
          <p className="text-sm text-fg-muted">
            아직 표시할 개선 항목이 없습니다. 우상단 <strong>“전체 재계산”</strong> 을 눌러
            readiness 를 산정하세요.
          </p>
        </section>
      ) : (
        CATEGORIES.map((spec) => {
          const items = overview[spec.bucketKey];
          if (items.length === 0) return null;
          return (
            <section key={spec.anchor} id={spec.anchor} className={`rounded-md border ${spec.toneClass} p-4`}>
              <header className="mb-3 flex flex-col gap-1">
                <h2 className="flex items-center gap-2 text-base font-semibold text-fg-default">
                  <span>{spec.icon}</span>
                  <span>{spec.title}</span>
                  <span className="text-xs text-fg-muted">— {items.length}건</span>
                </h2>
                <p className="text-xs text-fg-muted">{spec.description}</p>
              </header>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={`${item.entityType}-${item.entityId}`}>
                    <Link
                      href={entityEditHref(params.instanceSlug, item)}
                      className="flex flex-col gap-1 rounded-md border border-border bg-white/70 p-3 transition hover:border-fg-default"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase tracking-wide text-fg-muted">
                            [{item.entityType}]
                          </span>{" "}
                          <span className="text-sm font-medium text-fg-default">{item.title}</span>
                        </div>
                        <span className="shrink-0 text-xs text-fg-muted">
                          점수 {item.score} · <span className="font-semibold">{item.grade}</span>
                        </span>
                      </div>
                      {item.failedChecks.length > 0 && (
                        <ul className="ml-3 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-fg-muted">
                          {item.failedChecks.map((c) => (
                            <li key={c.key}>
                              <span className={c.status === "fail" ? "text-rose-700" : "text-amber-700"}>
                                {c.status === "fail" ? "✗" : "△"}
                              </span>{" "}
                              {c.label}
                              {c.detail && <span className="text-fg-muted"> · {c.detail}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      {/* MTL-DEFER-04 — 검색·전환 시그널 기반 신규 3 카테고리 (search_visibility + conversion_event). */}
      {conversionOverview.totalItems > 0 && (
        <>
          <ConversionSection
            anchor="low-conversion-traffic"
            title="검색 click 있는데 전환 0"
            description="외부 검색에서 click 은 들어오는데 conversion event 발생 안 — CTA / 페이지 안내 점검."
            items={conversionOverview.lowConversionTraffic}
            toneClass="border-orange-300 bg-orange-50"
            icon="🟠"
          />
          <ConversionSection
            anchor="low-ctr"
            title="네이버 top 10 노출인데 click 0"
            description="네이버 안 평균 순위 top 10 인데 click 0 — title/description/snippet 매력도 점검."
            items={conversionOverview.lowCtr}
            toneClass="border-amber-300 bg-amber-50"
            icon="🟡"
          />
          <ConversionSection
            anchor="naver-only-weak"
            title="네이버 만 노출 + 노출량 낮음"
            description="네이버에만 노출이 잡혔지만 노출량 낮음 — Google JSON-LD/sitemap 보강 또는 콘텐츠 재배포 검토."
            items={conversionOverview.naverOnlyWeak}
            toneClass="border-violet-300 bg-violet-50"
            icon="🟣"
          />
        </>
      )}

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        본 큐는 readiness check fail/warn (위 5 카테고리) + 외부 검색/conversion 시그널 (아래 3 카테고리) 기반입니다.
        키워드/근거 link 변경 또는 article 편집 시 readiness 가 자동으로 갱신되며, 데이터가 오래됐다면 우상단{" "}
        <strong>“전체 재계산”</strong> 으로 즉시 갱신할 수 있습니다. 검색/conversion 시그널은 7일 윈도우 안 svs +
        conversion_event 합산 기반 — 데이터 누적 시점부터 actionable.
      </footer>
    </main>
  );
}

function ConversionSection({
  anchor,
  title,
  description,
  items,
  toneClass,
  icon,
}: {
  anchor: string;
  title: string;
  description: string;
  items: ConversionImprovementItem[];
  toneClass: string;
  icon: string;
}) {
  if (items.length === 0) return null;
  return (
    <section id={anchor} className={`rounded-md border ${toneClass} p-4`}>
      <header className="mb-3 flex flex-col gap-1">
        <h2 className="flex items-center gap-2 text-base font-semibold text-fg-default">
          <span>{icon}</span>
          <span>{title}</span>
          <span className="text-xs text-fg-muted">— {items.length}건</span>
        </h2>
        <p className="text-xs text-fg-muted">{description}</p>
      </header>
      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={it.pageUrl}>
            <div className="rounded-md border border-border bg-white/70 p-3">
              <div className="truncate text-sm font-medium text-fg-default" title={it.pageUrl}>
                {it.pageUrl}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-fg-muted">
                <span>
                  Google {it.googleImpressions.toLocaleString("ko-KR")} 노출 / {it.googleClicks.toLocaleString("ko-KR")} click
                </span>
                <span>
                  네이버 {it.naverImpressions.toLocaleString("ko-KR")} 노출 / {it.naverClicks.toLocaleString("ko-KR")} click
                </span>
                <span>전환 {it.conversions.toLocaleString("ko-KR")} 건</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
