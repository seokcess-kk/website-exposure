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

// 행동 중심 문구 — 운영자가 보고 무엇을 해야 할 지 즉시 판단 가능하도록 rewrite.
// priority 순 (cycle 1 #3) — anchor/bucketKey 는 호환 위해 유지.
const CATEGORIES: ReadonlyArray<CategorySpec> = [
  {
    anchor: "low-readiness",
    bucketKey: "lowReadiness",
    icon: "🔴",
    title: "발행된 페이지 손보기",
    description: "이미 공개 중이지만 검색 노출에 불리한 페이지 — 제목·요약·본문 보강.",
    toneClass: "border-rose-300 bg-rose-50",
  },
  {
    anchor: "evidence-missing",
    bucketKey: "evidenceMissing",
    icon: "🔴",
    title: "근거 연결하기",
    description: "논문·미디어 인용이나 의료진 저자가 비어 있는 페이지 — 신뢰도 시그널 보강.",
    toneClass: "border-rose-300 bg-rose-50",
  },
  {
    anchor: "seo-improve",
    bucketKey: "seoImprove",
    icon: "🟠",
    title: "제목·요약 다듬기",
    description: "제목이나 요약이 타깃 키워드를 못 담고 있거나 권장 길이를 벗어난 페이지.",
    toneClass: "border-orange-300 bg-orange-50",
  },
  {
    anchor: "stale",
    bucketKey: "stale",
    icon: "🟡",
    title: "본문 갱신하기",
    description: "30일 넘게 손대지 않은 페이지 — 정보 최신화 후 저장.",
    toneClass: "border-amber-300 bg-amber-50",
  },
  {
    anchor: "relations-thin",
    bucketKey: "relationsThin",
    icon: "🟢",
    title: "관련 FAQ·링크 추가하기",
    description: "관련 FAQ 나 내부 링크가 부족한 페이지 — 같이 보면 좋은 콘텐츠 묶기.",
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
              손볼 항목 <strong className="text-fg-default">{overview.totalImprovementItems}</strong>건
              · 영향 콘텐츠 <strong className="text-fg-default">{overview.affectedEntityCount}</strong>개
              {conversionOverview.totalItems > 0 && (
                <>
                  {" "}· 검색·전환 신호 <strong className="text-fg-default">{conversionOverview.totalItems}</strong>건
                </>
              )}
              {overview.healthyCount > 0 && (
                <>
                  {" "}· <span className="text-emerald-700">손볼 곳 없는 콘텐츠 {overview.healthyCount}건</span>
                </>
              )}
            </p>
          ) : (
            <p className="mt-1 text-sm text-fg-muted">
              아직 점검 데이터가 없거나 모든 콘텐츠가 손볼 곳 없음 상태입니다.
            </p>
          )}
        </div>
        <RecomputeReadinessButton instanceSlug={params.instanceSlug} />
      </header>

      {!hasAnyItem ? (
        <section className="rounded-md border border-dashed border-border bg-bg-default/30 p-8 text-center">
          <p className="text-sm text-fg-muted">
            아직 점검할 항목이 없습니다. 우상단 <strong>“전체 재계산”</strong> 을 눌러 콘텐츠 점검을 새로 돌릴 수 있습니다.
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
            title="방문은 있는데 예약·전화로 이어지지 않음"
            description="검색에서 들어온 방문은 있지만 예약·전화 액션이 없는 페이지 — CTA 버튼 위치·문구 점검."
            items={conversionOverview.lowConversionTraffic}
            toneClass="border-orange-300 bg-orange-50"
            icon="🟠"
          />
          <ConversionSection
            anchor="low-ctr"
            title="네이버 노출은 되는데 클릭이 안 됨"
            description="네이버 평균 순위 top 10 인데 클릭 0 — 검색 결과에서 보이는 제목·요약 매력도 점검."
            items={conversionOverview.lowCtr}
            toneClass="border-amber-300 bg-amber-50"
            icon="🟡"
          />
          <ConversionSection
            anchor="naver-only-weak"
            title="네이버에서만 보이고 노출 적음"
            description="구글에는 안 잡히고 네이버 노출도 약함 — JSON-LD·sitemap·콘텐츠 보강 검토."
            items={conversionOverview.naverOnlyWeak}
            toneClass="border-violet-300 bg-violet-50"
            icon="🟣"
          />
        </>
      )}

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        위 5개 묶음은 콘텐츠 점검 결과 (제목·근거·갱신·관련 링크) 입니다. 아래 3개 묶음은 최근 7일간 검색/방문 데이터 기반 신호입니다.
        키워드·근거 link 변경 또는 페이지 편집 시 자동 갱신되며, 데이터가 오래됐다면 우상단{" "}
        <strong>“전체 재계산”</strong> 을 눌러 즉시 다시 점검할 수 있습니다.
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
