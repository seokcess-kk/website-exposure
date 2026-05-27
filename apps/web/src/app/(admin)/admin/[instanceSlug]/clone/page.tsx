// @glitzy/web/(admin)/[instanceSlug]/clone — 사이트 복제 (ADMIN_SIMPLIFY S3 + ADMIN_PERMISSION_SEPARATION v1 § 3)
// 대시보드 에서 분리. super-admin only.

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { CloneInstanceSection } from "@/components/admin/CloneInstanceSection";

export default async function CloneInstancePage({
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
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  // ADMIN_PERMISSION_SEPARATION v1 § 3 — super-admin only.
  // URL 직접 진입한 operator (클라이언트) 안 형식적 안내. 서버 액션 안 lib 안 이중 가드.
  if (!pageCtx.ctx.isSuperAdmin) {
    return (
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-fg-default">사이트 복제</h1>
        <section className="rounded-md border border-warning bg-warning-subtle p-4 text-sm text-fg-default">
          <p className="font-medium">권한이 필요합니다.</p>
          <p className="mt-1 text-fg-muted">
            새 사이트 생성은 운영자(super-admin) 만 가능합니다. 권한이 필요하면 운영자에게 요청해 주세요.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-fg-default">사이트 복제</h1>
        <p className="text-sm text-fg-muted">
          현재 사이트를 원본으로 새 사이트를 만듭니다. 디자인·시술 카탈로그·약관 템플릿은 그대로
          복사되고, 병원 식별 정보와 콘텐츠는 비워진 상태로 시작합니다.
        </p>
      </header>

      <CloneInstanceSection sourceSlug={params.instanceSlug} />
    </main>
  );
}
