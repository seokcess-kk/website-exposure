// @glitzy/web/(admin)/[instanceSlug]/keywords/new — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 3

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { KeywordTargetForm } from "@/components/forms/KeywordTargetForm";
import {
  loadKeywordParentOptions,
  loadKeywordContentOptions,
  type KeywordParentOption,
  type EvidenceLinkOptions,
} from "@/lib/admin/keyword-parent-options";
import { saveKeywordTarget } from "../actions";

export default async function KeywordNewPage({ params }: { params: { instanceSlug: string } }) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      return <main className="p-6"><p>{a.message}</p></main>;
    }
    throw err;
  }

  let parentOptions: ReadonlyArray<KeywordParentOption> = [];
  let evidenceOptions: EvidenceLinkOptions = {
    publications: [], mediaAppearances: [], faqs: [], treatmentPages: [], articles: [], medicalConditionPages: [],
  };
  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        const [parents, content] = await Promise.all([
          loadKeywordParentOptions(tx, ctx.instanceId, null),
          loadKeywordContentOptions(tx, ctx.instanceId),
        ]);
        return { parents, content };
      },
    );
    parentOptions = result.parents;
    evidenceOptions = result.content;
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
    }
    throw err;
  }

  const bound = saveKeywordTarget.bind(null, params.instanceSlug, null);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">키워드 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/keywords`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <KeywordTargetForm
        action={bound}
        initial={null}
        isNew
        parentOptions={parentOptions}
        evidenceOptions={evidenceOptions}
        existingLinks={[]}
      />
    </main>
  );
}
