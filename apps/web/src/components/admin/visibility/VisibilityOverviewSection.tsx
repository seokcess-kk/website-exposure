// @glitzy/web/components/admin/visibility/VisibilityOverviewSection — 6 카드 wrapping section
// SEO_VISIBILITY_OPS_PLAN v0.2 § 4

import Link from "next/link";
import type { VisibilityOverview, ListedItem } from "@/lib/admin/visibility-overview";
import type { ConversionSummary } from "@/lib/admin/conversion-summary";
import type { LlmUsageSummary } from "@/lib/admin/llm-usage-summary";
import { RecomputeReadinessButton } from "./RecomputeReadinessButton";
import { ConversionTrafficCard } from "./ConversionTrafficCard";
import { LlmUsageCard } from "./LlmUsageCard";

const GRADE_COLOR: Record<string, string> = {
  A: "text-success",
  B: "text-success",
  C: "text-warning",
  D: "text-warning",
  F: "text-error",
};

const DETAIL_PATH: Record<string, string> = {
  Article: "articles",
  TreatmentPage: "treatments",
  // FAQ 어드민 라우트는 MVP 단순화에서 제거됨 — DETAIL_PATH 미포함 시 clinic-profile fallback.
  Publication: "publications",
  MediaAppearance: "media-appearances",
  DoctorProfile: "doctors",
  ClinicProfile: "clinic-profile",
};

function entityLink(instanceSlug: string, item: ListedItem): string {
  const path = DETAIL_PATH[item.entityType] ?? "";
  if (!path || item.entityType === "ClinicProfile") return `/admin/${instanceSlug}/clinic-profile`;
  return `/admin/${instanceSlug}/${path}/${item.slug}`;
}

export function VisibilityOverviewSection({
  data,
  conversion,
  llmUsage,
  instanceSlug,
}: {
  data: VisibilityOverview;
  conversion: ConversionSummary;
  llmUsage: LlmUsageSummary;
  instanceSlug: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-fg-default">노출 운영 현황</h2>
        <RecomputeReadinessButton instanceSlug={instanceSlug} />
      </header>

      {/* Option A v1.0 — UnlinkedEvidence · Stale · LowReadinessPublished 3 카드 제거.
          모두 "오늘 할 일" 카드 + improvement-queue 안 deep link 안 중복 표시되어 운영자 신호 분산 회피.
          남은 5 카드 = 데이터 source 유일한 KPI (KeywordCoverage · AverageReadiness · JsonLdDefect ·
          ConversionTraffic · LlmUsage). */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <KeywordCoverageCard data={data.keywordCoverage} instanceSlug={instanceSlug} />
        <AverageReadinessCard data={data.averageReadiness} />
        <JsonLdDefectCard data={data.jsonLdDefect} instanceSlug={instanceSlug} />
        <ConversionTrafficCard data={conversion} instanceSlug={instanceSlug} />
        <LlmUsageCard data={llmUsage} />
      </div>
    </section>
  );
}

function CardShell({
  title,
  primary,
  secondary,
  children,
}: {
  title: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border bg-elevated p-4">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{title}</h3>
        {secondary}
      </header>
      <div className="text-2xl font-semibold text-fg-default">{primary}</div>
      {children}
    </article>
  );
}

function ListedItems({ items, instanceSlug }: { items: ListedItem[]; instanceSlug: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-1 flex flex-col gap-1 border-t border-border pt-2 text-xs text-fg-muted">
      {items.map((item) => (
        <li key={`${item.entityType}-${item.entityId}`} className="flex items-center justify-between gap-2">
          <Link href={entityLink(instanceSlug, item)} className="truncate hover:text-fg-default hover:underline">
            <span className="text-[10px] uppercase tracking-wide text-fg-muted">[{item.entityType}]</span>{" "}
            {item.title}
          </Link>
          {item.daysOld !== undefined && <span className="shrink-0">{item.daysOld}일</span>}
          {item.score !== undefined && (
            <span className={`shrink-0 font-medium ${GRADE_COLOR[item.grade ?? "F"] ?? ""}`}>
              {item.score}점 {item.grade}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function KeywordCoverageCard({
  data,
  instanceSlug,
}: {
  data: VisibilityOverview["keywordCoverage"];
  instanceSlug: string;
}) {
  const ratio = data.totalKeywords > 0
    ? `${data.keywordsWithPrimary}/${data.totalKeywords}`
    : "0/0";
  return (
    <CardShell
      title="타깃 키워드 커버리지"
      primary={ratio}
      secondary={
        <Link
          href={`/admin/${instanceSlug}/keywords`}
          className="text-xs text-brand-primary hover:underline"
        >
          전체 관리 →
        </Link>
      }
    >
      <p className="text-xs text-fg-muted">
        {data.totalKeywords === 0
          ? "아직 등록된 active 타깃 키워드가 없습니다."
          : `${data.totalKeywords - data.keywordsWithPrimary}개 active 키워드가 primary 콘텐츠 없음`}
        {data.wonCount > 0 && <span className="ml-1 text-success">· 확보 {data.wonCount}건</span>}
      </p>
      {data.unlinkedTopKeywords.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1 border-t border-border pt-2 text-xs text-fg-muted">
          {data.unlinkedTopKeywords.map((k) => (
            <li key={k.id} className="truncate">
              <Link
                href={`/admin/${instanceSlug}/keywords/${k.id}`}
                className="hover:text-fg-default hover:underline"
              >
                <span className="font-medium text-fg-default">{k.label}</span>
                <span className="ml-1 text-[10px]">— primary 미연결</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

function AverageReadinessCard({ data }: { data: VisibilityOverview["averageReadiness"] }) {
  if (data.sampleSize === 0) {
    return (
      <CardShell title="평균 SEO readiness" primary="—" >
        <p className="text-xs text-fg-muted">아직 readiness 계산이 안 됐습니다. 우측 상단 "전체 재계산" 버튼을 눌러주세요.</p>
      </CardShell>
    );
  }
  const total = data.sampleSize;
  return (
    <CardShell
      title="평균 SEO readiness"
      primary={
        <span>
          {data.score}
          <span className="ml-1 text-base font-normal text-fg-muted">/ 100</span>
          {data.grade && (
            <span className={`ml-2 text-base font-semibold ${GRADE_COLOR[data.grade] ?? ""}`}>{data.grade}</span>
          )}
        </span>
      }
    >
      <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-bg-default">
        {(["A", "B", "C", "D", "F"] as const).map((g) => {
          const w = (data.distribution[g] / total) * 100;
          if (w === 0) return null;
          const cls = g === "A" || g === "B" ? "bg-success" : g === "C" ? "bg-warning" : g === "D" ? "bg-warning/60" : "bg-error";
          return <div key={g} className={cls} style={{ width: `${w}%` }} title={`${g}: ${data.distribution[g]}건`} />;
        })}
      </div>
      <p className="mt-1 text-[11px] text-fg-muted">
        A {data.distribution.A} · B {data.distribution.B} · C {data.distribution.C} · D {data.distribution.D} · F {data.distribution.F}
      </p>
    </CardShell>
  );
}

function JsonLdDefectCard({
  data,
  instanceSlug,
}: {
  data: VisibilityOverview["jsonLdDefect"];
  instanceSlug: string;
}) {
  return (
    <CardShell title="JSON-LD 결함 의심" primary={data.count}>
      <p className="text-xs text-fg-muted">
        {data.count === 0
          ? "blocking 항목 없음 (v1 — JSON-LD validator 합류 후 정밀화)"
          : "schema.org 검증 실패 가능 entity"}
      </p>
      <ListedItems items={data.items} instanceSlug={instanceSlug} />
    </CardShell>
  );
}
