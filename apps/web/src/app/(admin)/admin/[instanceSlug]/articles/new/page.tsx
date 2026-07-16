// @glitzy/web/(admin)/[instanceSlug]/articles/new
// cycle1-3entity WEB-03: page-level eligibility + withSkeletonTx catch
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { assertActionEligibility } from "@glitzy/auth";

import { withSkeletonTx } from "@/lib/tenant";
import { requirePageContext } from "@/lib/page-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { ArticleForm } from "@/components/forms/ArticleForm";
import { loadEvidenceLinkOptions, type EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import { saveArticle } from "../actions";

export default async function ArticleNewPage({ params }: { params: { instanceSlug: string } }) {
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

  let doctorOptions: ReadonlyArray<{ value: string; label: string }> = [];
  let categoryOptions: ReadonlyArray<{ value: string; label: string }> = [];
  let keywordOptions: ReadonlyArray<{ id: string; label: string }> = [];
  let defaultPrimaryKeyword = "";
  let evidenceOptions: EvidenceLinkOptions = {
    publications: [], mediaAppearances: [], faqs: [], treatmentPages: [], articles: [], medicalConditionPages: [],
  };
  try {
    const result = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
      // cycle2-3entity WEB-17: withSkeletonTx 안 첫 줄에서도 eligibility 재확인 (role race 보호)
      assertActionEligibility(ctx, "operator-edit-content");
      // 병렬화 — doctors + categories + keyword + evidence options 동시
      const [doctorRows, categoryRows, keywordRows, defaultKeywordRows, evidenceOpts] = await Promise.all([
        tx<{ id: string; name: string }[]>`
          SELECT id, name FROM doctor_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND active = true
           ORDER BY display_order ASC, name ASC
        `,
        tx<{ id: string; name: string }[]>`
          SELECT id, name FROM article_category
           WHERE instance_id = ${ctx.instanceId}::uuid
           ORDER BY display_order ASC, name ASC
        `,
        // CONTENT_AI_DRAFT_PLAN v1.0 — AI Draft panel 안 primary/secondary keyword 자동완성 source.
        tx<{ id: string; label: string }[]>`
          SELECT id, label FROM keyword_target
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND status = 'active'
           ORDER BY label ASC
           LIMIT 50
        `,
        // 노출 희망 키워드 프리필 (방식 A) — 최우선 primary active 키워드 1건을 AI Draft primary 초기값으로.
        //   1순위: 아직 콘텐츠가 연결 안 된 키워드 (keyword_content_link 부재) → 배치 발행 시 발행 후
        //          autoLinkOnPublish 가 link 를 만들면 자동으로 다음 미소진 키워드로 넘어감.
        //   2순위: priority ASC (P0<P1<P2) = 가장 밀고 있는 키워드. 3순위: 최근 갱신순. 없으면 "" (수동 입력).
        tx<{ label: string }[]>`
          SELECT kt.label FROM keyword_target kt
           WHERE kt.instance_id = ${ctx.instanceId}::uuid
             AND kt.status = 'active'
             AND kt.keyword_type = 'primary'
           ORDER BY
             (EXISTS (
               SELECT 1 FROM keyword_content_link kcl
                WHERE kcl.instance_id = kt.instance_id AND kcl.keyword_id = kt.id
             )) ASC,
             kt.priority ASC,
             kt.updated_at DESC
           LIMIT 1
        `,
        loadEvidenceLinkOptions(tx, ctx.instanceId),
      ]);
      return {
        doctors: doctorRows.map((r) => ({ value: r.id, label: r.name })),
        categories: categoryRows.map((r) => ({ value: r.id, label: r.name })),
        keywords: keywordRows,
        defaultPrimaryKeyword: defaultKeywordRows[0]?.label ?? "",
        evidence: evidenceOpts,
      };
    });
    doctorOptions = result.doctors;
    categoryOptions = result.categories;
    keywordOptions = result.keywords;
    defaultPrimaryKeyword = result.defaultPrimaryKeyword;
    evidenceOptions = result.evidence;
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

  const bound = saveArticle.bind(null, params.instanceSlug, null);
  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">아티클 작성</h1>
        <Link href={`/admin/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <ArticleForm
        action={bound}
        initial={null}
        isNew
        doctorOptions={doctorOptions}
        categoryOptions={categoryOptions}
        instanceSlug={params.instanceSlug}
        evidenceOptions={evidenceOptions}
        existingEvidenceLinks={[]}
        keywordOptions={keywordOptions}
        defaultPrimaryKeyword={defaultPrimaryKeyword}
      />
    </main>
  );
}
