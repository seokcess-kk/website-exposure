// @glitzy/web/(site)/[instanceSlug]/faq — P-011 FAQ (Radix Accordion · 사용자 요청 2026-05-20)

import { notFound } from "next/navigation";
import Link from "next/link";
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
import { FaqAccordion } from "@/components/site/FaqAccordion";

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

  const faqsOrNull = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<FaqRow[]>`
      SELECT slug, question, answer, display_order, category_id, related_treatment_id,
             author_doctor_id, published_at, updated_at
        FROM faq
       WHERE instance_id = ${ctx.instanceId}::uuid
       ORDER BY display_order ASC, id ASC`;
    return rows.map(normalizeFaq);
  });
  const faqs = faqsOrNull ?? [];

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const description = `${initial.clinic.name} 의 자주 묻는 질문 모음입니다.`;
  const graph = faqPageGraph(
    { siteBaseUrl: hostOrigin, pagePath: "/faq" }, initial.clinic, faqs, description,
  );

  // 답변 안 sanitized HTML 안 미리 render (Accordion 안 client component 안 안전 전달)
  const faqItems = faqs.map((f) => ({
    id: f.slug,
    question: f.question,
    answerHtml: renderMarkdownToHtml(f.answer, hostOrigin),
  }));

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "자주 묻는 질문", href: null }]} />
      <section className="bg-subtle/40 py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div>
            <span className="text-eyebrow">자주 묻는 질문</span>
            <h1 className="mt-4 text-section-title font-serif-heading text-ink-strong">
              궁금증을 풀어드립니다
            </h1>
            <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-fg-muted md:text-lg">{description}</p>
          </div>

          <div className="mt-12">
            {faqItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-elevated p-12 text-center text-sm text-fg-muted">
                자주 묻는 질문이 아직 등록되지 않았습니다.
              </div>
            ) : (
              <FaqAccordion items={faqItems} />
            )}

            <p className="mt-8 text-sm text-fg-muted">
              찾으시는 답변이 없으신가요?{" "}
              <Link href={`${base}/community/consultation`} className="font-medium text-brand-primary hover:underline">
                1:1 비밀 상담소
              </Link>
              {" "}또는{" "}
              <Link href={`${base}/contact`} className="font-medium text-brand-primary hover:underline">
                연락처
              </Link>
              로 문의해 주세요.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
