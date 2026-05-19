import Link from "next/link";
import { TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { ArticleCategoryForm } from "@/components/forms/ArticleCategoryForm";
import { saveCategory } from "../actions";

export default async function CategoryNewPage({ params }: { params: { instanceSlug: string } }) {
  try {
    await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  const bound = saveCategory.bind(null, params.instanceSlug, null);
  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">카테고리 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/categories`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <ArticleCategoryForm action={bound} initial={null} isNew />
    </main>
  );
}
