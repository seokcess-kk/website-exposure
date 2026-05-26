// @glitzy/web/(site)/[instanceSlug]/conditions/[slug] — P-008 Condition Detail
// EXPOSURE_READINESS Phase B — 의료 증상 상세 (유입 페이지).
//   FloatingTOC + breadcrumb + 본문 + primary_treatment CTA + 관련 증상.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeCondition, type MedicalConditionPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { FloatingTOC } from "@/components/site/FloatingTOC";
import { extractTocHeadings, renderMarkdownToHtml } from "@/lib/markdown";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { conditionDetailGraph } from "@/lib/json-ld/builders";
import { faqPageEntity } from "@/lib/json-ld/entities";
import { siteBaseUrl } from "@/lib/site-url";
import { Card, PillLink, Reveal, SectionHeading } from "@/components/site/ui";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { FaqAccordion, type FaqAccordionItem } from "@/components/site/FaqAccordion";
import { loadInlineFaqsForEntity } from "@/lib/site-faq-inline";

export const revalidate = 60;

const loadConditionDetail = cache(async (instanceSlug: string, slug: string) => {
  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
    const rows = await tx<(MedicalConditionPageRow & { id: string; primary_treatment_slug: string | null; primary_treatment_title: string | null; primary_treatment_summary: string | null })[]>`
      SELECT mc.id::text AS id, mc.slug, mc.title, mc.summary, mc.body_markdown, mc.hero_image_url,
             mc.primary_treatment_id, mc.metadata, mc.published_at, mc.updated_at,
             tp.slug AS primary_treatment_slug,
             tp.title AS primary_treatment_title,
             tp.summary AS primary_treatment_summary
        FROM medical_condition_page mc
        LEFT JOIN treatment_page tp
          ON tp.id = mc.primary_treatment_id
         AND tp.instance_id = mc.instance_id
         AND tp.status = 'published'
       WHERE mc.instance_id = ${ctx.instanceId}::uuid
         AND mc.slug = ${slug}
         AND mc.status = 'published'
       LIMIT 1
    `;
    if (rows.length === 0) return null;
    const row = rows[0]!;
    const condition = normalizeCondition(row);

    // 관련 증상 — 같은 primary_treatment_id 의 다른 condition 3개 (없으면 최신 3개)
    const relatedRows = row.primary_treatment_id
      ? await tx<MedicalConditionPageRow[]>`
          SELECT slug, title, summary, body_markdown, hero_image_url, primary_treatment_id, metadata, published_at, updated_at
            FROM medical_condition_page
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND status = 'published'
             AND primary_treatment_id = ${row.primary_treatment_id}::uuid
             AND slug <> ${slug}
           ORDER BY published_at DESC NULLS LAST
           LIMIT 3
        `
      : await tx<MedicalConditionPageRow[]>`
          SELECT slug, title, summary, body_markdown, hero_image_url, primary_treatment_id, metadata, published_at, updated_at
            FROM medical_condition_page
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND status = 'published'
             AND slug <> ${slug}
           ORDER BY published_at DESC NULLS LAST
           LIMIT 3
        `;

    // EXPOSURE_READINESS Phase E — 인라인 FAQ (related-to FAQ link 의 question+answer)
    const inlineFaqs = await loadInlineFaqsForEntity(tx, "MedicalConditionPage", row.id);

    return {
      condition,
      primaryTreatment: row.primary_treatment_slug
        ? { slug: row.primary_treatment_slug, title: row.primary_treatment_title!, summary: row.primary_treatment_summary! }
        : null,
      related: relatedRows.map(normalizeCondition),
      inlineFaqs,
    };
  });
});

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const data = await loadConditionDetail(params.instanceSlug, params.slug);
  if (!data) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: data.condition.name,
    description: data.condition.summary,
    canonicalPath: `/conditions/${data.condition.slug}`,
    ogType: "article",
    imageUrl: data.condition.heroImageUrl ?? undefined,
  });
}

export default async function ConditionDetailPage({ params }: { params: { instanceSlug: string; slug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const base = `/${params.instanceSlug}`;
  const data = await loadConditionDetail(params.instanceSlug, params.slug);
  if (!data) notFound();
  const { condition, primaryTreatment, related, inlineFaqs } = data;

  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const ctx = { siteBaseUrl: hostOrigin, pagePath: `/conditions/${condition.slug}` };
  const graph = conditionDetailGraph(
    ctx,
    initial.clinic,
    condition,
    condition.summary,
    primaryTreatment?.slug ?? null,
  );
  // EXPOSURE_READINESS Phase E — 인라인 FAQ 있으면 graph 안 FAQPage entity 병합.
  if (inlineFaqs.length > 0) {
    graph["@graph"].push(faqPageEntity(ctx, inlineFaqs));
  }

  const tocItems = extractTocHeadings(condition.body);
  const breadcrumbItems = [
    { label: "홈", href: base },
    { label: "증상", href: `${base}/conditions` },
    { label: condition.name, href: null },
  ];

  return (
    <>
      <JsonLdScript graph={graph} />
      <FloatingTOC items={tocItems} eyebrow="목차" />
      <Breadcrumb items={breadcrumbItems} />

      {/* === Hero 2-col === */}
      <section className="bg-subtle/50 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <span className="text-eyebrow">증상</span>
                <h1 className="mt-5 font-serif-display text-4xl tracking-tightest text-ink-strong md:text-5xl lg:text-6xl">
                  {condition.name}
                </h1>
                <p className="mt-6 text-lg leading-[1.7] text-fg-muted md:text-xl">{condition.summary}</p>
                {primaryTreatment ? (
                  <PillLink href={`${base}/treatments/${primaryTreatment.slug}`} variant="primary" size="lg" className="mt-7">
                    {primaryTreatment.title} 살펴보기 →
                  </PillLink>
                ) : null}
              </div>
            </Reveal>
            <Reveal delayMs={120}>
              <div className="relative">
                {condition.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={condition.heroImageUrl} alt={condition.name} loading="eager" decoding="async" fetchPriority="high"
                       className="aspect-[4/3] w-full rounded-3xl object-cover shadow-supanova-lg ring-1 ring-border/40" />
                ) : (
                  <div aria-hidden className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated shadow-supanova-lg ring-1 ring-border/40">
                    <iconify-icon icon="solar:medical-kit-bold-duotone" width="72" className="text-brand-primary/40" />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === 본문 2-col + sticky aside === */}
      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            <article className="min-w-0">
              <ArticleBody markdown={condition.body} hostOrigin={hostOrigin} />
              {inlineFaqs.length > 0 ? (
                <section id="inline-faq" className="mt-12 scroll-mt-24">
                  <h2 className="mb-4 text-2xl font-semibold text-fg-default">자주 묻는 질문</h2>
                  <FaqAccordion
                    items={inlineFaqs.map<FaqAccordionItem>((f) => ({
                      id: `faq-${f.slug}`,
                      question: f.question,
                      answerHtml: renderMarkdownToHtml(f.answer, hostOrigin),
                    }))}
                  />
                </section>
              ) : null}
            </article>

            <aside className="lg:sticky lg:top-32 lg:self-start space-y-4">
              {primaryTreatment ? (
                <Card padding="lg" variant="tinted">
                  <div className="text-eyebrow mb-3">관련 진료</div>
                  <h3 className="text-xl font-bold tracking-tight text-ink-strong">{primaryTreatment.title}</h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-fg-muted">{primaryTreatment.summary}</p>
                  <div className="mt-4">
                    <PillLink href={`${base}/treatments/${primaryTreatment.slug}`} variant="ghost" size="md">
                      진료 자세히 보기
                    </PillLink>
                  </div>
                </Card>
              ) : null}

              <Card padding="lg" variant="tinted">
                <div className="text-eyebrow mb-3">상담 / 예약</div>
                {initial.clinic.primaryCtas.length > 0 ? (
                  <ReservationChannels ctas={initial.clinic.primaryCtas} />
                ) : null}
              </Card>

              <p className="text-xs leading-relaxed text-fg-muted/80">
                * 본 페이지는 일반 정보 제공 목적이며 진료 결정 대체가 아닙니다. 개별 진료는 한의사 진료 후 결정됩니다.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* === 관련 증상 grid === */}
      {related.length > 0 ? (
        <section className="bg-subtle/50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="관련 증상"
                title="함께 살펴볼 만한 증상"
                description={primaryTreatment ? `${primaryTreatment.title} 와 관련된 다른 상황·증상.` : "최근 등록된 다른 증상 안내."}
              />
            </Reveal>
            <Reveal delayMs={120}>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`${base}/conditions/${r.slug}`}
                    className="group block overflow-hidden rounded-2xl bg-elevated ring-1 ring-border/40 p-6 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-brand-primary">증상</span>
                    <h3 className="mt-2 text-lg font-bold tracking-tight text-ink-strong group-hover:text-brand-primary">{r.name}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{r.summary}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal delayMs={240}>
              <div className="mt-10 flex justify-center">
                <PillLink href={`${base}/conditions`} variant="secondary" size="md">증상 안내 전체 보기</PillLink>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
