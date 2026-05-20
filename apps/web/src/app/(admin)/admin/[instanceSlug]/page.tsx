// @glitzy/web/(admin)/[instanceSlug] — 대시보드 (ADMIN_UX_REDESIGN v1.0 § 4.2)
// "출시 워크스페이스" 패러다임 — readiness + quality score + nextActions + 5 quick actions + notification inbox.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { loadDashboardData } from "@/lib/admin/dashboard-data";
import { QualityScoreCard } from "@/components/admin/ui/QualityScoreCard";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { NotificationInbox } from "@/components/admin/NotificationInbox";

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

        {/* === 2-column: ReleaseReadiness + QualityScore === */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DashboardClient readiness={dashboard.readiness} instanceSlug={slug} isSuperAdmin={ctx.isSuperAdmin} />
          <QualityScoreCard score={dashboard.qualityScore} />
        </section>

        {/* === Quick actions (5건) === */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg-muted">빠른 작업</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <QuickActionCard
              href={`/admin/${slug}/doctors/new`}
              icon="👨‍⚕️"
              title="의료진 추가"
              description="DoctorProfile 등록"
            />
            <QuickActionCard
              href={`/admin/${slug}/treatments/new`}
              icon="🏥"
              title="시술/진료 추가"
              description="TreatmentPage 작성"
            />
            <QuickActionCard
              href={`/admin/${slug}/articles/new`}
              icon="📝"
              title="아티클 작성"
              description="블로그/인사이트"
            />
            <QuickActionCard
              href={`/admin/${slug}/faqs/new`}
              icon="💬"
              title="FAQ 추가"
              description="자주 묻는 질문"
            />
            <QuickActionCard
              href={`/admin/${slug}/review-queue`}
              icon="✅"
              title="검수 큐"
              description={`${dashboard.warningQueueOpenCount}건 진행 중`}
              highlighted={dashboard.warningQueueOpenCount > 0}
            />
          </div>
        </section>

        {/* === Entity counts (보조 정보) === */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-fg-muted">콘텐츠 현황</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            <EntityCountCard href={`/admin/${slug}/doctors`} label="의료진 (active)" count={dashboard.readiness.evalInput.doctors.filter((d) => d.active).length} />
            <EntityCountCard href={`/admin/${slug}/treatments`} label="시술/진료 페이지" count={dashboard.readiness.evalInput.treatments.length} />
            <EntityCountCard href={`/admin/${slug}/articles`} label="아티클" count={dashboard.readiness.evalInput.articles.length} />
            <EntityCountCard href={`/admin/${slug}/faqs`} label="FAQ" count={dashboard.readiness.evalInput.faqs.length} />
            <EntityCountCard href={`/admin/${slug}/publications`} label="논문 (E-A-T)" count={dashboard.readiness.evalInput.publications.length} />
            <EntityCountCard href={`/admin/${slug}/media-appearances`} label="미디어" count={dashboard.readiness.evalInput.media.length} />
            <EntityCountCard href={`/admin/${slug}/categories`} label="카테고리" count={dashboard.readiness.evalInput.categories.length} />
            <EntityCountCard href={`/admin/${slug}/clinic-profile#legal`} label="정책 문서 (published)" count={dashboard.readiness.evalInput.legals.filter((l) => l.status === "published").length} />
          </div>
        </section>

        {/* === NotificationInbox === */}
        <NotificationInbox notifications={dashboard.notifications} instanceSlug={slug} />
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

function EntityCountCard({ href, label, count }: { href: string; label: string; count: number }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-md border border-border bg-elevated p-3 text-sm transition hover:border-brand-primary"
    >
      <span className="text-xs text-fg-muted">{label}</span>
      <span className="text-2xl font-semibold text-fg-default">{count}</span>
    </Link>
  );
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
