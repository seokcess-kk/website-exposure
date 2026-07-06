// @glitzy/web/(admin)/[instanceSlug]/articles/categories — NAVER_EXPOSURE Tier 2
// 아티클 카테고리 ↔ Pillar 매핑 UI. article_category.pillar 를 clinic.metadata.treatmentPillars slug 로 설정 →
// 렌더타임 클러스터 교차링크(아티클↔시술)를 seed SQL 없이 운영자가 활성화. articles/bulk 서브라우트 선례.
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { loadSiteInitial } from "@/lib/site-initial";
import { CategoryPillarForm } from "@/components/forms/CategoryPillarForm";
import { saveCategoryPillars } from "./actions";

// article_count 는 COUNT(int8) → postgres.js 가 string 으로 반환.
type CategoryRow = { id: string; name: string; slug: string; pillar: string | null; article_count: string };

export default async function ArticleCategoriesPage({ params }: { params: { instanceSlug: string } }) {
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

  let categories: CategoryRow[];
  try {
    categories = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        // GROUP BY ac.id (PK) → 나머지 ac.* 는 함수 종속으로 SELECT/ORDER BY 허용.
        return tx<CategoryRow[]>`
          SELECT ac.id, ac.name, ac.slug, ac.pillar,
                 COUNT(a.id) FILTER (WHERE a.status = 'published') AS article_count
            FROM article_category ac
            LEFT JOIN article a
              ON a.category_id = ac.id AND a.instance_id = ac.instance_id
           WHERE ac.instance_id = ${ctx.instanceId}::uuid
           GROUP BY ac.id
           ORDER BY ac.display_order ASC, ac.name ASC
        `;
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

  // pillar 옵션 = clinic.metadata.treatmentPillars (시술 폼 treatments/new 과 동일 소스).
  const siteInitial = await loadSiteInitial(params.instanceSlug);
  const pillarOptions = (siteInitial?.clinic.metadata.treatmentPillars ?? [])
    .map((p) => ({ value: p.slug, label: p.title }));

  const bound = saveCategoryPillars.bind(null, params.instanceSlug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">카테고리 · Pillar 매핑</h1>
        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <p className="text-sm text-slate-500">
        각 아티클 카테고리를 진료 영역(Pillar)에 연결하면, 그 카테고리의 아티클과 해당 Pillar 시술/진료가 공개 사이트에서{" "}
        <strong>자동으로 서로 링크</strong>됩니다(&ldquo;관련 진료&rdquo; · &ldquo;관련 칼럼&rdquo;). 연결하지 않으면(미지정) 공유 키워드가 있을 때만 링크됩니다.
      </p>
      {pillarOptions.length === 0 ? (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          진료 영역(Pillar)이 아직 정의되지 않았습니다. 먼저{" "}
          <Link href={`/admin/${params.instanceSlug}/clinic-profile`} className="font-medium underline">의원 정보 → 진료 영역(treatmentPillars)</Link>
          {" "}에서 Pillar 를 추가한 뒤 여기서 카테고리에 연결하세요.
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          아직 아티클 카테고리가 없습니다.
        </div>
      ) : (
        <CategoryPillarForm
          action={bound}
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            pillar: c.pillar ?? "",
            articleCount: Number(c.article_count),
          }))}
          pillarOptions={pillarOptions}
        />
      )}
    </main>
  );
}
