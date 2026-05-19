// @glitzy/web/(site)/[instanceSlug]/faq — P-011 FAQ public page
// SoT: EAT_CONTENT_PLAN v1.0 § 5.1 (EC-RENDER-01 · PSR-DEFER-11 부분 해소)
//   - 데이터: faq published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21).
//   - 표시: Q&A 카드 list (display_order asc, id asc) — <details> collapsible.
//   - 빈 페이지 처리: 0 row 도 200 (404 아님) · 빈 상태 UI · JSON-LD mainEntity = [].
//   - JSON-LD: FAQPage + Question/Answer (renderMarkdownToPlainText helper).

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeFaq, type FaqRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { faqPageGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { renderMarkdownToHtml } from "@/lib/markdown";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "자주 묻는 질문",
    description: `${initial.clinic.name} 의 자주 묻는 질문 모음입니다.`,
    canonicalPath: "/faq",
    ogType: "website",
  });
}

export default async function FaqPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const faqsOrNull = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<FaqRow[]>`
      SELECT slug, question, answer, display_order, category_id, related_treatment_id,
             author_doctor_id, published_at, updated_at
        FROM faq
       ORDER BY display_order ASC, id ASC
    `;
    return rows.map(normalizeFaq);
  });
  // EC-RENDER-01 (cycle 1 ECP-21): 빈 페이지 200 (404 아님). instance 자체가 없으면 위에서 notFound 처리됨.
  const faqs = faqsOrNull ?? [];

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const description = `${initial.clinic.name} 의 자주 묻는 질문 모음입니다.`;
  const graph = faqPageGraph(
    { siteBaseUrl: hostOrigin, pagePath: "/faq" },
    initial.clinic,
    faqs,
    description,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "자주 묻는 질문", href: null }]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-fg-default">자주 묻는 질문</h1>
        <p className="mt-2 text-base text-fg-muted">{description}</p>

        {faqs.length === 0 ? (
          <div className="mt-8 rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-fg-muted">
            자주 묻는 질문이 아직 등록되지 않았습니다.
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-3">
            {faqs.map((f) => (
              <li key={f.slug} className="rounded-md border border-slate-200 bg-white">
                {/* cycle 1 ECC-06 patch: disclosure affordance — chevron 아이콘 (aria-hidden) + open 상태 회전 + open 배경 강조.
                    native <details> keyboard a11y 유지 + 시각적 펼침/접힘 신호 강화. */}
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-medium text-fg-default group-open:bg-slate-50">
                    <span>
                      <span className="mr-2 text-blue-700">Q.</span>
                      {f.question}
                    </span>
                    <span aria-hidden="true" className="select-none text-sm text-slate-500 transition-transform group-open:rotate-180">
                      ⌃
                    </span>
                  </summary>
                  <div
                    className="prose prose-sm max-w-none px-4 pb-4 pt-1 text-fg-default"
                    // sanitize-html SSR 정합 — XSS 안전.
                    dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(f.answer, hostOrigin) }}
                  />
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
