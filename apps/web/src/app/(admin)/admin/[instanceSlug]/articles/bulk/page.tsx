// @glitzy/web/(admin)/[instanceSlug]/articles/bulk — 아티클 다발 생성 (CONTENT_BULK)
// 키워드 목록 → AI 초안 다발 생성 → draft 저장. 검수/발행은 아티클 목록에서.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { BulkDraftGenerator } from "@/components/admin/BulkDraftGenerator";

export default async function BulkArticlesPage({ params }: { params: { instanceSlug: string } }) {
  try {
    await requirePageContext(params.instanceSlug);
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

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">아티클 다발 생성</h1>
          <p className="text-sm text-slate-500">
            키워드 목록으로 AI 칼럼 초안을 한 번에 생성합니다. 생성물은 <strong>draft</strong> 로 저장되며, 검수 후 목록에서 발행하세요.
          </p>
        </div>
        <Link href={`/admin/${params.instanceSlug}/articles`} className="shrink-0 text-sm text-blue-700 underline">
          ← 아티클 목록
        </Link>
      </header>
      <BulkDraftGenerator instanceSlug={params.instanceSlug} />
    </main>
  );
}
