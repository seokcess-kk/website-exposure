// @glitzy/web/(admin)/[instanceSlug]/articles/[slug] — 편집
// cycle2-3entity WEB-23: requirePageContext 통일
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { ArticleForm, type ArticleInitial } from "@/components/forms/ArticleForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { deleteArticle, saveArticle } from "../actions";

export default async function ArticleEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
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

  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
  let bundle: { initial: ArticleInitial; doctorOptions: ReadonlyArray<{ value: string; label: string }> } | null;
  try {
    bundle = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx): Promise<{ initial: ArticleInitial; doctorOptions: ReadonlyArray<{ value: string; label: string }> } | null> => {
      assertActionEligibility(ctx, "operator-edit-content");
      const articleRows = await tx<{
        slug: string;
        title: string;
        summary: string;
        body_markdown: string;
        status: string;
        risk_level: string | null;
        hero_image_url: string | null;
        author_doctor_id: string | null;
      }[]>`
        SELECT slug, title, summary, body_markdown,
               status::text AS status,
               risk_level::text AS risk_level,
               hero_image_url,
               author_doctor_id
          FROM article
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
         LIMIT 1
      `;
      const r = articleRows[0];
      if (!r) return null;
      // cycle1-3entity WEB-09: 현재 author 가 inactive 여도 option 포함
      const doctorRows = await tx<{ id: string; name: string; active: boolean }[]>`
        SELECT id, name, active FROM doctor_profile
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND (active = true OR id = ${r.author_doctor_id ?? null}::uuid)
         ORDER BY active DESC, display_order ASC, name ASC
      `;
      return {
        initial: {
          slug: r.slug,
          title: r.title,
          summary: r.summary,
          bodyMarkdown: r.body_markdown,
          status: r.status,
          riskLevel: r.risk_level ?? "",
          heroImageUrl: r.hero_image_url ?? "",
          authorDoctorId: r.author_doctor_id ?? "",
        },
        doctorOptions: doctorRows.map((d) => ({
          value: d.id,
          label: d.active ? d.name : `${d.name} (비활성)`,
        })),
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

  const boundSave = saveArticle.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteArticle.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">아티클 편집 · {bundle.initial.title}</h1>
        <Link href={`/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>

      <ArticleForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />

      <DeleteForm action={boundDelete} confirmMessage="정말 이 아티클을 삭제하시겠습니까?" />
    </main>
  );
}
