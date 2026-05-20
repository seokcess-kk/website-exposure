// @glitzy/web/(admin)/[instanceSlug] — 대시보드 (단순화 · 사용자 검수 2026-05-20)
// 즉시 발행 모드 정합 — readiness/quality/notifications 제거. 메인 노출 entity 진입 + count 만.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { loadDashboardData } from "@/lib/admin/dashboard-data";

export default async function DashboardPage({
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
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  try {
    const data = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        const dashboard = await loadDashboardData(tx, ctx.instanceId, params.instanceSlug, ctx.userId);
        return { ctx, dashboard };
      },
    );

    const { ctx, dashboard } = data;
    const slug = params.instanceSlug;

    return (
      <main className="flex flex-col gap-6">
        {/* === Header === */}
        <header className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-semibold text-fg-default">
              {dashboard.clinic?.name ?? "대시보드"}
            </h1>
            {dashboard.clinic && (
              <Link
                href={`/admin/${slug}/clinic-profile`}
                className="text-xs text-brand-primary hover:underline"
              >
                병원 정보 편집
              </Link>
            )}
          </div>
          <div className="text-xs text-fg-muted">
            {ctx.email} · {ctx.role}{ctx.isSuperAdmin && " · super-admin"}
          </div>
        </header>

        {/* === Quick actions — 메인 노출 entity 추가 진입 (6건) === */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg-muted">빠른 작업</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <QuickActionCard
              href={`/admin/${slug}/doctors/new`}
              icon="👨‍⚕️"
              title="의료진 추가"
              description="의료진 정보 등록"
            />
            <QuickActionCard
              href={`/admin/${slug}/treatments/new`}
              icon="🏥"
              title="시술/진료 추가"
              description="진료 페이지 작성"
            />
            <QuickActionCard
              href={`/admin/${slug}/articles/new`}
              icon="📝"
              title="아티클 작성"
              description="블로그/인사이트"
            />
            <QuickActionCard
              href={`/admin/${slug}/publications/new`}
              icon="📚"
              title="논문 추가"
              description="학술 인용"
            />
            <QuickActionCard
              href={`/admin/${slug}/media-appearances/new`}
              icon="🎬"
              title="미디어 추가"
              description="유튜브 · 방송 · 언론"
            />
            <QuickActionCard
              href={`/admin/${slug}/faqs/new`}
              icon="💬"
              title="FAQ 추가"
              description="자주 묻는 질문"
            />
          </div>
        </section>

        {/* === Entity counts (메인 노출 entity 일목요연) === */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg-muted">콘텐츠 현황</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <EntityCountCard href={`/admin/${slug}/doctors`} label="공개 의료진" count={dashboard.readiness.evalInput.doctors.filter((d) => d.active).length} />
            <EntityCountCard href={`/admin/${slug}/treatments`} label="시술/진료 페이지" count={dashboard.readiness.evalInput.treatments.length} />
            <EntityCountCard href={`/admin/${slug}/articles`} label="아티클" count={dashboard.readiness.evalInput.articles.length} />
            <EntityCountCard href={`/admin/${slug}/faqs`} label="FAQ" count={dashboard.readiness.evalInput.faqs.length} />
            <EntityCountCard href={`/admin/${slug}/publications`} label="논문" count={dashboard.readiness.evalInput.publications.length} />
            <EntityCountCard href={`/admin/${slug}/media-appearances`} label="미디어" count={dashboard.readiness.evalInput.media.length} />
            <EntityCountCard href={`/admin/${slug}/clinic-profile#legal`} label="공개 정책 문서" count={dashboard.readiness.evalInput.legals.filter((l) => l.status === "published").length} />
            <EntityCountCard href={`/${slug}`} label="공개 사이트" count={null} extraLabel="새 탭으로 열기" external />
          </div>
        </section>
      </main>
    );
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") {
        return <ForbiddenView message={action.message} />;
      }
      if (action.kind === "info") {
        return <InfoView message={action.message} />;
      }
    }
    throw err;
  }
}

function QuickActionCard({ href, icon, title, description, highlighted }: { href: string; icon: string; title: string; description: string; highlighted?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-start gap-1 rounded-md border p-4 text-sm transition hover:shadow-sm ${
        highlighted
          ? "border-warning bg-warning-subtle hover:border-warning"
          : "border-border bg-elevated hover:border-brand-primary"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-semibold text-fg-default">{title}</span>
      <span className="text-xs text-fg-muted">{description}</span>
    </Link>
  );
}

function EntityCountCard({
  href,
  label,
  count,
  extraLabel,
  external,
}: {
  href: string;
  label: string;
  count: number | null;
  extraLabel?: string;
  external?: boolean;
}) {
  const className = "flex flex-col gap-1 rounded-md border border-border bg-elevated p-3 text-sm transition hover:border-brand-primary";
  const inner = (
    <>
      <span className="text-xs text-fg-muted">{label}</span>
      {count !== null ? (
        <span className="text-2xl font-semibold text-fg-default">{count}</span>
      ) : (
        <span className="text-sm font-medium text-brand-primary">{extraLabel ?? "→"}</span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }
  return <Link href={href} className={className}>{inner}</Link>;
}

function ForbiddenView({ message }: { message: string }) {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-fg-default">접근 거부</h1>
      <p className="text-sm text-fg-default">{message}</p>
    </main>
  );
}

function InfoView({ message }: { message: string }) {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-fg-default">안내</h1>
      <p className="text-sm text-fg-default">{message}</p>
    </main>
  );
}
