// @glitzy/web/(admin)/admin — instance 일람 (관리 중인 사이트 전체 + 콘텐츠 카운트 + release_state)
//
// 진입: /admin (instanceSlug 없음). (admin)/layout.tsx 가 cookie 부재 시 /sign-in redirect.
// 권한 정책:
//   - super-admin → 전체 instance 일람
//   - 일반 운영자 → 본인 instance_membership(active=true) 인 instance 만
//   - 어디에도 멤버 아님 → "관리 권한 없음" 안내
// RLS: 이 페이지의 모든 query 는 cross-tenant — instance/membership/콘텐츠 카운트 SQL 은 raw sqlBase 사용.
//   WEB_DATABASE_URL 의 admin role 이라 RLS policy(FOR ALL TO app_tenant_user) 가 적용 안 됨.

import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthDeniedError, getActiveSession } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { readSessionCookie } from "@/lib/session-cookie";
import {
  loadSuperAdminOverview,
  isStale,
  formatLlmCost,
  contractStatusLabel,
  type InstanceOverview,
  type SuperAdminTotals,
} from "@/lib/admin/super-admin-overview";

type ReleaseState = "draft" | "release-pending" | "published";

type InstanceRow = {
  id: string;
  slug: string;
  display_name: string;
  active: boolean;
  release_state: { state: ReleaseState; releasedAt: string | null } | null;
  created_at: Date;
  clinic_name: string | null;
  active_doctors: string;
  published_treatments: string;
  total_treatments: string;
  published_articles: string;
  published_faqs: string;
  published_publications: string;
  published_media: string;
  published_legals: string;
};

export default async function AdminRootPage() {
  const signedToken = readSessionCookie();
  if (!signedToken) {
    // Demo auto-login (2026-05-22): DEMO env set 시 default slug 의 demo-admin-enter 자동 진입.
    // 프로젝트 개발 단계 한정 — env 미설정 시 기존대로 /sign-in.
    if (process.env.DEMO_ADMIN_AUTO_LOGIN_EMAIL) {
      const defaultSlug = process.env.DEMO_DEFAULT_INSTANCE_SLUG ?? "demo";
      redirect(`/${defaultSlug}/demo-admin-enter`);
    }
    redirect("/sign-in");
  }

  const sql = getSqlBase();
  const cfg = getAuthCfg();

  // === 세션 → user 검증 ===
  let userId: string;
  try {
    const session = await getActiveSession(sql, cfg, signedToken);
    userId = session.userId;
  } catch (err) {
    if (err instanceof AuthDeniedError) redirect(`/sign-in/cleanup?reason=${err.reason}`);
    throw err;
  }

  // === super-admin 여부 ===
  const userRows = await sql<{ is_super_admin: boolean; display_name: string }[]>`
    SELECT is_super_admin, display_name FROM admin_user WHERE id = ${userId}::uuid LIMIT 1
  `;
  if (userRows.length === 0) redirect("/sign-in/cleanup?reason=admin-user-not-found");
  const { is_super_admin: isSuperAdmin, display_name: userDisplayName } = userRows[0]!;

  // === instance 일람 + 콘텐츠 카운트 (단일 쿼리) ===
  // super-admin: 모든 active instance / 일반: membership active=true 인 것만
  const rows = await sql<InstanceRow[]>`
    SELECT
      i.id, i.slug, i.display_name, i.active, i.release_state, i.created_at,
      cp.name AS clinic_name,
      (SELECT count(*) FROM doctor_profile WHERE instance_id = i.id AND active = true)::text AS active_doctors,
      (SELECT count(*) FROM treatment_page WHERE instance_id = i.id AND status = 'published')::text AS published_treatments,
      (SELECT count(*) FROM treatment_page WHERE instance_id = i.id)::text AS total_treatments,
      (SELECT count(*) FROM article WHERE instance_id = i.id AND status = 'published')::text AS published_articles,
      (SELECT count(*) FROM faq WHERE instance_id = i.id AND status = 'published')::text AS published_faqs,
      (SELECT count(*) FROM publication WHERE instance_id = i.id AND status = 'published')::text AS published_publications,
      (SELECT count(*) FROM media_appearance WHERE instance_id = i.id AND status = 'published')::text AS published_media,
      (SELECT count(*) FROM legal_document WHERE instance_id = i.id AND status = 'published')::text AS published_legals
    FROM instance i
    LEFT JOIN LATERAL (
      SELECT name FROM clinic_profile WHERE instance_id = i.id AND slug = 'clinic' LIMIT 1
    ) cp ON true
    WHERE ${isSuperAdmin}
       OR EXISTS (
         SELECT 1 FROM instance_membership im
          WHERE im.instance_id = i.id
            AND im.user_id = ${userId}::uuid
            AND im.active = true
       )
    ORDER BY i.created_at DESC
  `;

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-6">
        <main className="flex flex-col gap-4">
          <header>
            <h1 className="text-2xl font-semibold text-fg-default">관리 중인 사이트</h1>
            <p className="text-sm text-fg-muted">{userDisplayName} 님, 환영합니다.</p>
          </header>
          <section className="rounded-md border border-border bg-elevated p-6 text-center text-sm text-fg-muted">
            아직 멤버로 등록된 사이트가 없습니다. 운영자에게 인스턴스 권한을 요청해 주세요.
          </section>
        </main>
      </div>
    );
  }

  // ADMIN_PERMISSION_SEPARATION v1 § Q2 — operator (super-admin X) + 멤버 instance 1개 → 자동 진입.
  // 클라이언트(웹사이트 관리자) 가 매번 일람 클릭 거치는 번거로움 회피. super-admin 은 일람 유지.
  if (!isSuperAdmin && rows.length === 1) {
    redirect(`/admin/${rows[0]!.slug}`);
  }

  // ADMIN_PERMISSION_SEPARATION v1 § R1·R2 (2026-05-27) — cross-instance KPI.
  const overview = await loadSuperAdminOverview(sql, rows.map((r) => r.id));

  const totalPublished = rows.filter((r) => releaseStateOf(r) === "published").length;
  const totalDraft = rows.filter((r) => releaseStateOf(r) === "draft").length;
  const totalReleasePending = rows.filter((r) => releaseStateOf(r) === "release-pending").length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <main className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-semibold text-fg-default">관리 중인 사이트</h1>
            <span className="text-xs text-fg-muted">{userDisplayName}{isSuperAdmin && " · super-admin"}</span>
          </div>
          <p className="text-sm text-fg-muted">
            총 <strong className="text-fg-default">{rows.length}</strong>개 사이트 ·{" "}
            발행 <strong className="text-fg-default">{totalPublished}</strong> ·{" "}
            출시 검수 <strong className="text-fg-default">{totalReleasePending}</strong> ·{" "}
            작성 중 <strong className="text-fg-default">{totalDraft}</strong>
          </p>
        </header>

        {/* ADMIN_PERMISSION_SEPARATION v1 § R2 — cross-instance KPI banner (super-admin only) */}
        {isSuperAdmin && <KpiBanner totals={overview.totals} />}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <InstanceCard
              key={r.id}
              row={r}
              isSuperAdmin={isSuperAdmin}
              overview={overview.perInstance.get(r.id) ?? null}
            />
          ))}
        </section>

        {/* ADMIN_PERMISSION_SEPARATION v1 § 5 (reposition · 2026-05-27)
            super-admin tier 를 사이트별 dashboard 에서 본 상위 hub 로 이동. */}
        {isSuperAdmin && (
          <section className="rounded-md border border-violet-300 bg-violet-50 p-4">
            <header className="mb-2 flex items-center gap-2">
              <span aria-hidden className="text-base">🛡️</span>
              <h2 className="text-sm font-semibold text-fg-default">운영자 도구</h2>
            </header>
            <p className="mb-3 text-xs text-fg-muted">
              사이트 단위로 동작하는 운영 도구는 각 사이트 카드의 점 메뉴 (복제) 또는 사이트 진입 후{" "}
              <strong className="text-fg-default">정보·설정 그룹</strong> 에서 사용합니다. 운영자는 이 영역에서 사이트들을 한눈에 관리합니다.
            </p>
            <ul className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
              <li className="flex flex-col gap-0.5 rounded-md border border-violet-200 bg-white p-3">
                <span className="font-medium text-fg-default">사이트 복제</span>
                <span className="text-fg-muted">
                  원본으로 쓸 사이트의 카드에서 <strong>복제</strong> 를 눌러 새 instance 생성. 디자인·시술 카탈로그·약관 그대로 복사.
                </span>
              </li>
              <li className="flex flex-col gap-0.5 rounded-md border border-violet-200 bg-white p-3">
                <span className="font-medium text-fg-default">검색 노출 property 등록</span>
                <span className="text-fg-muted">
                  GSC · 네이버 서치어드바이저 site verification 은 사이트 진입 후{" "}
                  <strong>검색 노출</strong> 메뉴에서 super-admin 만 가능.
                </span>
              </li>
            </ul>
          </section>
        )}

        <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
          {isSuperAdmin
            ? "신규 사이트 추가는 위 운영자 도구 안내를 참고하세요. 본 화면 안 각 사이트 카드 의 복제 link 로 진입할 수 있습니다."
            : "새 사이트 생성은 운영자(super-admin) 만 가능합니다. 권한이 필요하면 운영자에게 요청해 주세요."}
        </footer>
      </main>
    </div>
  );
}

function releaseStateOf(row: InstanceRow): ReleaseState {
  return row.release_state?.state ?? "draft";
}

function InstanceCard({
  row,
  isSuperAdmin,
  overview,
}: {
  row: InstanceRow;
  isSuperAdmin: boolean;
  overview: InstanceOverview | null;
}) {
  const state = releaseStateOf(row);
  const stateLabel = state === "published" ? "발행" : state === "release-pending" ? "출시 검수" : "작성 중";
  const stateTone =
    state === "published"
      ? "border-success/40 bg-success/10 text-success"
      : state === "release-pending"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-border bg-bg-default text-fg-muted";

  const releasedAt = row.release_state?.releasedAt
    ? new Date(row.release_state.releasedAt).toLocaleDateString("ko-KR")
    : null;

  return (
    <article className={`flex flex-col gap-3 rounded-md border bg-elevated p-4 transition hover:border-brand-primary ${row.active ? "border-border" : "border-border opacity-60"}`}>
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-fg-default">{row.display_name}</h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
            <code className="font-mono">/{row.slug}</code>
            {row.clinic_name && row.clinic_name !== row.display_name && (
              <span className="truncate">· {row.clinic_name}</span>
            )}
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${stateTone}`}>
          {stateLabel}
        </span>
      </header>

      <dl className="grid grid-cols-3 gap-2 text-xs">
        <CountCell label="의료진" value={Number(row.active_doctors)} />
        <CountCell
          label="시술"
          value={Number(row.published_treatments)}
          sub={`/ ${Number(row.total_treatments)}`}
        />
        <CountCell label="아티클" value={Number(row.published_articles)} />
        <CountCell label="논문" value={Number(row.published_publications)} />
        <CountCell label="미디어" value={Number(row.published_media)} />
        <CountCell label="FAQ" value={Number(row.published_faqs)} />
      </dl>

      {overview && <HealthIndicators overview={overview} />}

      {overview && (overview.visibility7days.impressions > 0 || overview.conversion7days > 0 || overview.llmCostMonthly > 0) && (
        <MetricStrip overview={overview} />
      )}

      <footer className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
        <span className="text-fg-muted">
          {releasedAt ? `발행 ${releasedAt}` : `생성 ${row.created_at.toLocaleDateString("ko-KR")}`}
        </span>
        <div className="flex gap-2">
          {isSuperAdmin && (
            <Link
              href={`/admin/${row.slug}/clone`}
              className="rounded-md border border-violet-300 px-2 py-1 text-violet-700 hover:bg-violet-50"
              title="이 사이트를 원본으로 새 instance 생성"
            >
              복제
            </Link>
          )}
          <Link
            href={`/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-2 py-1 text-fg-default hover:bg-bg-hover"
          >
            사이트
          </Link>
          <Link
            href={`/admin/${row.slug}`}
            className="rounded-md bg-brand-primary px-3 py-1 font-medium text-fg-inverse hover:bg-brand-primary-hover"
          >
            어드민 →
          </Link>
        </div>
      </footer>
    </article>
  );
}

function CountCell({ label, value, sub }: { label: string; value: number; sub?: string }) {
  const isEmpty = value === 0;
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-bg-default/40 px-2 py-1.5">
      <span className="text-[10px] uppercase tracking-wide text-fg-muted">{label}</span>
      <span className={isEmpty ? "text-sm font-semibold text-fg-muted" : "text-sm font-semibold text-fg-default"}>
        {value}
        {sub && <span className="ml-1 text-[10px] font-normal text-fg-muted">{sub}</span>}
      </span>
    </div>
  );
}

// === ADMIN_PERMISSION_SEPARATION v1 § R2 — cross-instance KPI banner ===

function KpiBanner({ totals }: { totals: SuperAdminTotals }) {
  const cards: Array<{ label: string; value: string; tone: "alert" | "warn" | "neutral"; hint?: string }> = [
    {
      label: "검색 노출 미연결",
      value: `${totals.unconnectedPropertyCount}건`,
      tone: totals.unconnectedPropertyCount > 0 ? "alert" : "neutral",
      hint: "GSC/네이버 서치어드바이저 등록 필요",
    },
    {
      label: "정책 5종 미완성",
      value: `${totals.legalIncompleteCount}건`,
      tone: totals.legalIncompleteCount > 0 ? "alert" : "neutral",
      hint: "의료법 risk · 사이트 진입 후 정책 문서 발행",
    },
    {
      label: "계약 만료 임박 (30일)",
      value: `${totals.contractExpiringSoonCount}건`,
      tone: totals.contractExpiringSoonCount > 0 ? "alert" : "neutral",
      hint: totals.contractIssueCount > 0
        ? `정지/종료 ${totals.contractIssueCount}건 · 미등록 ${totals.contractMissingCount}건`
        : `정지/종료 0건 · 미등록 ${totals.contractMissingCount}건`,
    },
    {
      label: "30일+ 휴면 사이트",
      value: `${totals.staleCount}건`,
      tone: totals.staleCount > 0 ? "warn" : "neutral",
      hint: "클라이언트 활성화 또는 운영자 갱신 필요",
    },
    {
      label: "콘텐츠 손볼 entity",
      value: `${totals.readinessLowSum.toLocaleString("ko-KR")}건`,
      tone: totals.readinessLowSum > 0 ? "warn" : "neutral",
      hint: "사이트별 개선 큐 안 grade C/D/F 합산",
    },
  ];
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((c, i) => (
        <KpiCard key={i} {...c} />
      ))}
    </section>
  );
}

function KpiCard({ label, value, tone, hint }: { label: string; value: string; tone: "alert" | "warn" | "neutral"; hint?: string }) {
  const toneClass =
    tone === "alert"
      ? "border-rose-300 bg-rose-50"
      : tone === "warn"
        ? "border-amber-300 bg-amber-50"
        : "border-border bg-bg-default/40";
  const valueClass =
    tone === "alert" ? "text-rose-700" : tone === "warn" ? "text-amber-700" : "text-fg-default";
  return (
    <div className={`flex flex-col gap-0.5 rounded-md border p-3 ${toneClass}`}>
      <span className="text-[11px] uppercase tracking-wide text-fg-muted">{label}</span>
      <span className={`text-lg font-semibold ${valueClass}`}>{value}</span>
      {hint && <span className="text-[11px] text-fg-muted">{hint}</span>}
    </div>
  );
}

// === InstanceCard 안 health indicator pill (dot + count) ===

function HealthIndicators({ overview }: { overview: InstanceOverview }) {
  const propertyMissing = overview.searchPropertyCount === 0;
  const legalMissing = 5 - overview.legalPublishedCount;
  const stale = isStale(overview.lastUpdatedAt);
  const readinessLow = overview.readinessLowCount;
  const placeMissing = !overview.naverPlaceSet;

  // ADMIN_BUSINESS_ENTITIES v1 § 2 — 계약 pill
  const c = overview.contract;
  const now = Date.now();
  const contractItem = (() => {
    if (c === null) return { label: "계약 미등록", tone: "warn" as const };
    if (c.status === "terminated") return { label: `계약 종료`, tone: "alert" as const };
    if (c.status === "suspended") return { label: `계약 정지`, tone: "alert" as const };
    if (c.endDate !== null) {
      const daysLeft = Math.ceil((c.endDate.getTime() - now) / (24 * 60 * 60 * 1000));
      if (daysLeft >= 0 && daysLeft <= 30) {
        return { label: `만료 D-${daysLeft} (${contractStatusLabel(c.status)})`, tone: "alert" as const };
      }
    }
    if (c.status === "trial") return { label: `${c.planTier} · 체험`, tone: "warn" as const };
    return { label: `${c.planTier} · 정상`, tone: "neutral" as const };
  })();

  const items: Array<{ label: string; tone: "alert" | "warn" | "neutral"; show: boolean }> = [
    { ...contractItem, show: true },
    { label: propertyMissing ? "GSC/네이버 미연결" : "검색 노출 ✓", tone: propertyMissing ? "alert" : "neutral", show: true },
    { label: legalMissing > 0 ? `정책 ${overview.legalPublishedCount}/5` : "정책 5/5", tone: legalMissing > 0 ? "alert" : "neutral", show: true },
    { label: readinessLow > 0 ? `손볼 entity ${readinessLow}` : "콘텐츠 ✓", tone: readinessLow > 0 ? "warn" : "neutral", show: true },
    { label: stale ? "30일+ 미업데이트" : "최근 활동 ✓", tone: stale ? "warn" : "neutral", show: true },
    { label: "네이버 플레이스 미설정", tone: "warn", show: placeMissing },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
      {items.filter((it) => it.show).map((it, i) => <Pill key={i} {...it} />)}
    </div>
  );
}

function Pill({ label, tone }: { label: string; tone: "alert" | "warn" | "neutral" }) {
  const dotClass =
    tone === "alert" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-emerald-500";
  const textClass =
    tone === "alert" ? "text-rose-700" : tone === "warn" ? "text-amber-700" : "text-fg-muted";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-border bg-bg-default/40 px-2 py-0.5 ${textClass}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}

// === 7일 metrics + LLM cost (MEDIUM) ===

function MetricStrip({ overview }: { overview: InstanceOverview }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-dashed border-border bg-bg-default/30 px-3 py-2 text-[11px] text-fg-muted">
      <span title="외부 검색 노출 7일 (GSC + 네이버 합산)">
        🔎 7일 노출 <strong className="text-fg-default">{overview.visibility7days.impressions.toLocaleString("ko-KR")}</strong>
        {" / 클릭 "}
        <strong className="text-fg-default">{overview.visibility7days.clicks.toLocaleString("ko-KR")}</strong>
      </span>
      <span title="자체 beacon /api/track 기반 7일 conversion event">
        🎯 전환 <strong className="text-fg-default">{overview.conversion7days.toLocaleString("ko-KR")}</strong>
      </span>
      {overview.llmCostMonthly > 0 && (
        <span title="이번달 (KST) Claude Haiku 4.5 API 비용">
          💸 LLM <strong className="text-fg-default">{formatLlmCost(overview.llmCostMonthly)}</strong>
        </span>
      )}
    </div>
  );
}
