// @glitzy/web/components/admin/ui/PageStatusBar — ADMIN_UX_REDESIGN v1.0 § 8.3 (UX-NOTIFY-04)
// 각 entity edit page 상단 안 통일 status bar. StatusBadge + lifecycle + nextActions + reviewStatus.

import Link from "next/link";
import { StatusBadge, type ContentStatus } from "./StatusBadge";

export type EntityType =
  | "Article"
  | "TreatmentPage"
  | "FAQ"
  | "Publication"
  | "MediaAppearance"
  | "LegalDocument"
  | "DoctorProfile"
  | "ClinicProfile"
  | "LocationProfile";

export type PageStatusBarProps = {
  entityType: EntityType;
  entityStatus: ContentStatus;
  lifecycle?: "draft" | "ready" | "release-pending" | "published";  // ClinicProfile 만 (instance level)
  nextActions: Array<{ label: string; href: string; variant: "primary" | "secondary" | "ghost" }>;
  reviewStatus?: { entriesOpen: number; assignedTo?: string };
};

const ENTITY_LABEL: Record<EntityType, string> = {
  Article: "아티클",
  TreatmentPage: "시술 페이지",
  FAQ: "FAQ",
  Publication: "학술 인용",
  MediaAppearance: "미디어 출현",
  LegalDocument: "정책 문서",
  DoctorProfile: "의료진",
  ClinicProfile: "병원 정보",
  LocationProfile: "본원 위치",
};

const LIFECYCLE_LABEL: Record<NonNullable<PageStatusBarProps["lifecycle"]>, string> = {
  draft: "초기 설정 중",
  ready: "출시 준비 완료",
  "release-pending": "검수 대기 중",
  published: "발행됨",
};

export function PageStatusBar({ entityType, entityStatus, lifecycle, nextActions, reviewStatus }: PageStatusBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-subtle px-4 py-3 text-sm">
      <span className="text-xs font-medium text-fg-muted">{ENTITY_LABEL[entityType]} 상태:</span>
      <StatusBadge status={entityStatus} />

      {lifecycle && (
        <>
          <span className="text-fg-muted">·</span>
          <span className="text-xs text-fg-muted">사이트:</span>
          <span className="rounded-md bg-elevated px-2 py-0.5 text-xs font-medium text-fg-default">
            {LIFECYCLE_LABEL[lifecycle]}
          </span>
        </>
      )}

      {reviewStatus && reviewStatus.entriesOpen > 0 && (
        <>
          <span className="text-fg-muted">·</span>
          <span className="text-xs text-warning">
            검수 큐 {reviewStatus.entriesOpen}건 진행 중
            {reviewStatus.assignedTo && ` (담당: ${reviewStatus.assignedTo})`}
          </span>
        </>
      )}

      {nextActions.length > 0 && (
        <div className="ml-auto flex items-center gap-2">
          {nextActions.map((action, i) => {
            const colorClass = action.variant === "primary"
              ? "bg-brand-primary text-fg-inverse hover:bg-brand-primary-hover"
              : action.variant === "secondary"
              ? "border border-border bg-elevated text-fg-default hover:bg-subtle"
              : "text-brand-primary hover:underline";
            return (
              <Link
                key={`${action.href}-${i}`}
                href={action.href}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${colorClass}`}
              >
                {action.label}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
