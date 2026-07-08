// @glitzy/web/(admin)/[instanceSlug]/keywords/bulk — 키워드 대량 등록
// 줄 단위 라벨 붙여넣기 → slug 자동 파생 + 공통 속성 일괄 적용. 기존 slug 는 skip.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { KeywordBulkForm } from "@/components/forms/KeywordBulkForm";
import { loadKeywordParentOptions, type KeywordParentOption } from "@/lib/admin/keyword-parent-options";
import { bulkCreateKeywordTargets } from "../actions";

export default async function KeywordBulkPage({ params }: { params: { instanceSlug: string } }) {
  let parentOptions: ReadonlyArray<KeywordParentOption> = [];
  try {
    const pageCtx = await requirePageContext(params.instanceSlug);
    parentOptions = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => loadKeywordParentOptions(tx, ctx.instanceId, null),
    );
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

  const bound = bulkCreateKeywordTargets.bind(null, params.instanceSlug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">키워드 대량 등록</h1>
          <p className="text-sm text-slate-500">
            한 줄에 하나씩 붙여넣으면 slug 자동 생성 + 공통 속성으로 한 번에 등록합니다. 이미 등록된 키워드는 건너뜁니다.
          </p>
        </div>
        <Link href={`/admin/${params.instanceSlug}/keywords`} className="shrink-0 text-sm text-slate-600 hover:underline">
          ← 목록
        </Link>
      </header>
      <KeywordBulkForm action={bound} parentOptions={parentOptions} />
    </main>
  );
}
