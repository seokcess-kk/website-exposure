import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { ArticleCategoryForm, type ArticleCategoryInitial } from "@/components/forms/ArticleCategoryForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { deleteCategory, saveCategory } from "../actions";

export default async function CategoryEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
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

  let initial: ArticleCategoryInitial | null;
  try {
    initial = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx): Promise<ArticleCategoryInitial | null> => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{
          slug: string;
          name: string;
          description: string | null;
          display_order: number;
        }[]>`
          SELECT slug, name, description, display_order
            FROM article_category
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
           LIMIT 1
        `;
        const r = rows[0];
        if (!r) return null;
        return {
          slug: r.slug,
          name: r.name,
          description: r.description ?? "",
          displayOrder: String(r.display_order),
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
  if (initial === null) notFound();

  const boundSave = saveCategory.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteCategory.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">카테고리 편집 · {initial.name}</h1>
        <Link href={`/admin/${params.instanceSlug}/categories`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <ArticleCategoryForm action={boundSave} initial={initial} isNew={false} isDefault={initial.slug === "general"} />
      {initial.slug !== "general" && (
        <DeleteForm action={boundDelete} confirmMessage="정말 이 카테고리를 삭제하시겠습니까? 카테고리를 사용 중인 아티클이 있으면 삭제가 차단됩니다." />
      )}
    </main>
  );
}
