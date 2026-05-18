// @glitzy/web/(admin)/[instanceSlug] — 대시보드 (Plan v1.0 § 3.2 step 3)
// slug resolve → tenant resolve → ClinicProfile 존재 표시

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

export default async function DashboardPage({
  params,
}: {
  params: { instanceSlug: string };
}) {
  // cycle3-3entity WEB-35: requirePageContext 통일 + branded UUID narrow + eligibility 통과
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

  // tenant resolve + 각 entity 카운트 조회
  try {
    const data = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
      const clinicRows = await tx<{ id: string; name: string; updated_at: Date }[]>`
        SELECT id, name, updated_at FROM clinic_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
         LIMIT 1
      `;
      const counts = await tx<{ doctors: string; treatments: string; articles: string }[]>`
        SELECT
          (SELECT count(*) FROM doctor_profile WHERE instance_id = ${ctx.instanceId}::uuid AND active = true) AS doctors,
          (SELECT count(*) FROM treatment_page WHERE instance_id = ${ctx.instanceId}::uuid) AS treatments,
          (SELECT count(*) FROM article WHERE instance_id = ${ctx.instanceId}::uuid) AS articles
      `;
      return { ctx, clinic: clinicRows[0] ?? null, counts: counts[0]! };
    });

    return (
      <main className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">대시보드</h1>
        <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-2 text-base font-medium">세션 컨텍스트</h2>
          <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
            <dt className="text-slate-500">이메일</dt>
            <dd>{data.ctx.email}</dd>
            <dt className="text-slate-500">역할</dt>
            <dd>{data.ctx.role}</dd>
            <dt className="text-slate-500">인스턴스 ID</dt>
            <dd className="break-all font-mono text-xs">{data.ctx.instanceId}</dd>
            <dt className="text-slate-500">슬러그</dt>
            <dd>{params.instanceSlug}</dd>
            <dt className="text-slate-500">super-admin</dt>
            <dd>{data.ctx.isSuperAdmin ? "true" : "false"}</dd>
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-2 text-base font-medium">ClinicProfile</h2>
          {data.clinic ? (
            <div className="flex items-center justify-between">
              <span>
                <strong>{data.clinic.name}</strong> · 마지막 수정 {new Date(data.clinic.updated_at).toISOString()}
              </span>
              <Link
                href={`/${params.instanceSlug}/clinic-profile`}
                className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800"
              >
                편집
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">아직 작성되지 않음.</span>
              <Link
                href={`/${params.instanceSlug}/clinic-profile`}
                className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800"
              >
                작성
              </Link>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <EntityCard
            href={`/${params.instanceSlug}/doctors`}
            title="의료진"
            count={Number(data.counts.doctors)}
            description="DoctorProfile · 활성"
          />
          <EntityCard
            href={`/${params.instanceSlug}/treatments`}
            title="시술/진료 페이지"
            count={Number(data.counts.treatments)}
            description="TreatmentPage"
          />
          <EntityCard
            href={`/${params.instanceSlug}/articles`}
            title="아티클"
            count={Number(data.counts.articles)}
            description="Article"
          />
        </section>
      </main>
    );
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      // cycle2-code WEB-27: session 계열 deny 는 cleanup route 경유 (cookie clear + audit)
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

function EntityCard({ href, title, count, description }: { href: string; title: string; count: number; description: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-md border border-slate-200 bg-white p-4 text-sm transition hover:border-slate-900 hover:shadow-sm"
    >
      <span className="text-base font-medium">{title}</span>
      <span className="text-3xl font-semibold text-slate-900">{count}</span>
      <span className="text-xs text-slate-500">{description}</span>
    </Link>
  );
}

function ForbiddenView({ message }: { message: string }) {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">접근 거부</h1>
      <p className="text-sm text-slate-700">{message}</p>
    </main>
  );
}

function InfoView({ message }: { message: string }) {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">안내</h1>
      <p className="text-sm text-slate-700">{message}</p>
    </main>
  );
}
