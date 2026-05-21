// @glitzy/web/(admin)/[instanceSlug]/keywords/[kid] — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 3·4

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { KeywordTargetForm, type KeywordTargetInitial } from "@/components/forms/KeywordTargetForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import {
  loadKeywordParentOptions,
  loadKeywordContentOptions,
  type KeywordParentOption,
  type EvidenceLinkOptions,
} from "@/lib/admin/keyword-parent-options";
import { loadKeywordContentLinks, type KeywordContentLink } from "@/lib/admin/keyword-content-link";
import type {
  KeywordIntent,
  KeywordPriority,
  KeywordStatus,
  KeywordType,
} from "@glitzy/core-content";
import { deleteKeywordTarget, saveKeywordTarget } from "../actions";

export default async function KeywordEditPage({
  params,
}: {
  params: { instanceSlug: string; kid: string };
}) {
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

  let bundle: {
    initial: KeywordTargetInitial;
    parentOptions: ReadonlyArray<KeywordParentOption>;
    evidenceOptions: EvidenceLinkOptions;
    existingLinks: ReadonlyArray<KeywordContentLink>;
  } | null;
  try {
    bundle = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx): Promise<{
        initial: KeywordTargetInitial;
        parentOptions: ReadonlyArray<KeywordParentOption>;
        evidenceOptions: EvidenceLinkOptions;
        existingLinks: ReadonlyArray<KeywordContentLink>;
      } | null> => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<Array<{
          id: string;
          slug: string;
          label: string;
          keyword_type: KeywordType;
          parent_id: string | null;
          intent: KeywordIntent;
          priority: KeywordPriority;
          difficulty: number | null;
          region_scope: string | null;
          status: KeywordStatus;
        }>>`
          SELECT id, slug, label, keyword_type, parent_id, intent, priority, difficulty, region_scope, status
            FROM keyword_target
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${params.kid}::uuid
           LIMIT 1
        `;
        const r = rows[0];
        if (!r) return null;
        const [parents, content, links] = await Promise.all([
          loadKeywordParentOptions(tx, ctx.instanceId, r.id),
          loadKeywordContentOptions(tx, ctx.instanceId),
          loadKeywordContentLinks(tx, ctx.instanceId, r.id),
        ]);
        return {
          initial: {
            slug: r.slug,
            label: r.label,
            keywordType: r.keyword_type,
            parentId: r.parent_id ?? "",
            intent: r.intent,
            priority: r.priority,
            difficulty: r.difficulty !== null ? String(r.difficulty) : "",
            regionScope: r.region_scope ?? "",
            status: r.status,
          },
          parentOptions: parents,
          evidenceOptions: content,
          existingLinks: links,
        };
      },
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
  if (bundle === null) notFound();

  const boundSave = saveKeywordTarget.bind(null, params.instanceSlug, params.kid);
  const boundDelete = deleteKeywordTarget.bind(null, params.instanceSlug, params.kid);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">키워드 편집 · {bundle.initial.label}</h1>
        <Link href={`/admin/${params.instanceSlug}/keywords`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <KeywordTargetForm
        action={boundSave}
        initial={bundle.initial}
        isNew={false}
        parentOptions={bundle.parentOptions}
        evidenceOptions={bundle.evidenceOptions}
        existingLinks={bundle.existingLinks}
      />
      <DeleteForm
        action={boundDelete}
        confirmMessage="정말 이 키워드를 삭제하시겠습니까? (보조 키워드가 있으면 삭제 차단됩니다.)"
      />
    </main>
  );
}
