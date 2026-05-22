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
    // Dev convenience (2026-05-22): DEMO env set 시 default slug 로 자동 진입.
    // 부모 (admin)/layout.tsx 가 dev mode 만 통과시키므로 production 영향 없음.
    if (process.env.NODE_ENV !== "production" && process.env.DEMO_ADMIN_AUTO_LOGIN_EMAIL) {
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
      <main className="flex flex-col gap-4">
        <header>
          <h1 className="text-2xl font-semibold text-fg-default">관리 중인 사이트</h1>
          <p className="text-sm text-fg-muted">{userDisplayName} 님, 환영합니다.</p>
        </header>
        <section className="rounded-md border border-border bg-elevated p-6 text-center text-sm text-fg-muted">
          아직 멤버로 등록된 사이트가 없습니다. 운영자에게 인스턴스 권한을 요청해 주세요.
        </section>
      </main>
    );
  }

  const totalPublished = rows.filter((r) => releaseStateOf(r) === "published").length;
  const totalDraft = rows.filter((r) => releaseStateOf(r) === "draft").length;
  const totalReleasePending = rows.filter((r) => releaseStateOf(r) === "release-pending").length;

  return (
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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <InstanceCard key={r.id} row={r} />
        ))}
      </section>

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        새 사이트를 만들려면 기존 사이트 어드민의 <strong className="text-fg-default">대시보드 하단</strong> 에 있는
        “이 사이트 복제” 섹션을 사용하세요. 디자인·시술 카탈로그·약관 템플릿은 그대로 복사되고 병원·의료진·기사·논문 등 클라이언트 입력 콘텐츠는 비워진 상태로 새 instance 가 만들어집니다.
      </footer>
    </main>
  );
}

function releaseStateOf(row: InstanceRow): ReleaseState {
  return row.release_state?.state ?? "draft";
}

function InstanceCard({ row }: { row: InstanceRow }) {
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

      <footer className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
        <span className="text-fg-muted">
          {releasedAt ? `발행 ${releasedAt}` : `생성 ${row.created_at.toLocaleDateString("ko-KR")}`}
        </span>
        <div className="flex gap-2">
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
