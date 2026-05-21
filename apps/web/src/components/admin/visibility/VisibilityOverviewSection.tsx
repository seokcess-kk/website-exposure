// @glitzy/web/components/admin/visibility/VisibilityOverviewSection — 6 카드 wrapping section
// SEO_VISIBILITY_OPS_PLAN v0.2 § 4

import Link from "next/link";
import type { VisibilityOverview, ListedItem } from "@/lib/admin/visibility-overview";
import { RecomputeReadinessButton } from "./RecomputeReadinessButton";

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
  FAQ: "faqs",
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
  instanceSlug,
}: {
  data: VisibilityOverview;
  instanceSlug: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-fg-default">노출 운영 현황</h2>
        <RecomputeReadinessButton instanceSlug={instanceSlug} />
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <KeywordCoverageCard data={data.keywordCoverage} instanceSlug={instanceSlug} />
        <AverageReadinessCard data={data.averageReadiness} />
        <UnlinkedEvidenceCard data={data.unlinkedEvidence} instanceSlug={instanceSlug} />
        <StaleContentCard data={data.staleContent} instanceSlug={instanceSlug} />
        <JsonLdDefectCard data={data.jsonLdDefect} instanceSlug={instanceSlug} />
        <LowReadinessPublishedCard data={data.lowReadinessPublished} instanceSlug={instanceSlug} />
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
          ? "아직 등록된 타깃 키워드가 없습니다."
          : `${data.totalKeywords - data.keywordsWithPrimary}개 키워드가 primary 콘텐츠 없음`}
      </p>
      {data.unlinkedTopKeywords.length > 0 && (
        <ul className="mt-1 flex flex-col gap-1 border-t border-border pt-2 text-xs text-fg-muted">
          {data.unlinkedTopKeywords.map((k) => (
            <li key={k.id} className="truncate">
              <span className="font-medium text-fg-default">{k.label}</span>
              <span className="ml-1 text-[10px]">— primary 미연결</span>
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

function UnlinkedEvidenceCard({
  data,
  instanceSlug,
}: {
  data: VisibilityOverview["unlinkedEvidence"];
  instanceSlug: string;
}) {
  return (
    <CardShell title="근거 미연결 콘텐츠" primary={data.count}>
      <p className="text-xs text-fg-muted">논문(cites)·임상 근거(derived-from) 가 연결되지 않은 article·treatment</p>
      <ListedItems items={data.items} instanceSlug={instanceSlug} />
    </CardShell>
  );
}

function StaleContentCard({
  data,
  instanceSlug,
}: {
  data: VisibilityOverview["staleContent"];
  instanceSlug: string;
}) {
  return (
    <CardShell title="30일+ 미업데이트" primary={data.count}>
      <p className="text-xs text-fg-muted">한 달 이상 갱신 없는 발행 콘텐츠</p>
      <ListedItems items={data.items} instanceSlug={instanceSlug} />
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

function LowReadinessPublishedCard({
  data,
  instanceSlug,
}: {
  data: VisibilityOverview["lowReadinessPublished"];
  instanceSlug: string;
}) {
  return (
    <CardShell title="발행 중 품질 개선 대상" primary={data.count}>
      <p className="text-xs text-fg-muted">발행됐지만 readiness 가 C/D/F 인 콘텐츠</p>
      <ListedItems items={data.items} instanceSlug={instanceSlug} />
    </CardShell>
  );
}
