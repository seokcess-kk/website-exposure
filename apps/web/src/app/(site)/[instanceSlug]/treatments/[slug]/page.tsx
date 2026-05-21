// @glitzy/web/(site)/[instanceSlug]/treatments/[slug] — P-006 Treatment Detail v3 (M 스코프 · 사용자 검수 2026-05-20)
//
// 레이아웃:
//   1. Breadcrumb (홈 / 진료 / {Pillar} / {시술/진료})
//   2. Hero 2-col light (eyebrow=Pillar · H1 · lead · primary+secondary CTA · 우측 hero image)
//   3. KEY_EFFECTS 3-step row (다이트 표준 3원칙 — 사용자 v2 결정 보존)
//   4. 본문 2-col (좌 ArticleBody · 우 sticky aside 진료 정보)
//   5. 연관 시술/진료 grid (같은 Pillar 의 다른 Spoke 3개)
//   6. 마지막 예약 CTA (메인페이지 Card variant=tinted 패턴 정합)
//
// Pillar 매핑은 hardcoded — 향후 treatment_page.metadata jsonb 안 이관 권장.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeTreatment, formatAddress, type TreatmentPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { TreatmentCard } from "@/components/site/TreatmentCard";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { treatmentDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { Card, PillLink, Reveal, SectionHeading } from "@/components/site/ui";
import { EvidenceCard } from "@/components/site/EvidenceCard";
import { loadSiteEvidenceLinks, type SiteEvidenceLinks } from "@/lib/site-evidence-links";

export const revalidate = 60;

// C 하이브리드 fallback (DB clinic.metadata.standardPrinciples 부재 시)
const KEY_EFFECTS_FALLBACK: ReadonlyArray<{ icon: string; title: string; description: string }> = [
  { icon: "mdi:account-search",   title: "체질 진단", description: "사상체질 진단 · 신진대사 평가로 환자 개개인 분석" },
  { icon: "mdi:medical-bag",      title: "맞춤 처방", description: "체질에 맞춘 한약 · 약침 · 식이 코칭 종합 처방" },
  { icon: "mdi:calendar-check",   title: "사후 관리", description: "3개월 사후 관리 + 다이트앱 데일리 코칭으로 요요 방지" },
];

const loadTreatmentDetail = cache(async (instanceSlug: string, slug: string) => {
  return withPublicTenantTransaction(instanceSlug, async (tx) => {
    const treatRows = await tx<(TreatmentPageRow & { id: string })[]>`
      SELECT id, slug, title, summary, body_markdown, hero_image_url, pillar_slug, metadata, published_at, updated_at
        FROM treatment_page
       WHERE slug = ${slug}
       LIMIT 1
    `;
    if (treatRows.length === 0) return null;
    const treatmentRow = treatRows[0]!;
    const treatment = normalizeTreatment(treatmentRow);
    const treatmentId = treatmentRow.id;

    // EVIDENCE_LINKING_PLAN Phase A — published target 만 회수
    const evidence = await loadSiteEvidenceLinks(tx, "TreatmentPage", treatmentId);

    if (!treatment.pillarSlug) return { treatment, related: [], evidence };
    const relatedRows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, pillar_slug, metadata, published_at, updated_at
        FROM treatment_page
       WHERE status = 'published'
         AND pillar_slug = ${treatment.pillarSlug}
         AND slug <> ${slug}
       ORDER BY published_at DESC NULLS LAST
       LIMIT 3
    `;
    return { treatment, related: relatedRows.map(normalizeTreatment), evidence };
  });
});

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const data = await loadTreatmentDetail(params.instanceSlug, params.slug);
  if (!data) return {};
  const t = data.treatment;
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: t.name,
    description: t.summary,
    canonicalPath: `/treatments/${t.slug}`,
    ogType: "article",
    imageUrl: t.heroImageUrl ?? undefined,
  });
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: { instanceSlug: string; slug: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const base = `/${params.instanceSlug}`;
  const data = await loadTreatmentDetail(params.instanceSlug, params.slug);

  if (!data) notFound();
  const { treatment, related, evidence } = data as typeof data & { evidence: SiteEvidenceLinks };
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = treatmentDetailGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
    initial.clinic,
    initial.locationMain,
    treatment,
    treatment.summary,
  );

  // C 하이브리드: pillar label 은 clinic.metadata.treatmentPillars 매칭. principles 은 treatment 별 override 우선.
  const pillarSlug = treatment.pillarSlug;
  const pillarLabel = pillarSlug
    ? initial.clinic.metadata.treatmentPillars.find((p) => p.slug === pillarSlug)?.title ?? null
    : null;
  const selfIsPillar = !pillarSlug;  // pillar_slug 가 null 이면 자체가 Pillar (Spoke 의 부모)
  const heroEyebrow = pillarLabel ?? "진료";
  const keyEffects = treatment.principles.length > 0
    ? treatment.principles.map((p) => ({ icon: p.icon, title: p.title, description: p.desc }))
    : initial.clinic.metadata.standardPrinciples.length > 0
      ? initial.clinic.metadata.standardPrinciples.map((p) => ({ icon: p.icon, title: p.title, description: p.desc }))
      : KEY_EFFECTS_FALLBACK;

  const breadcrumbItems: Array<{ label: string; href: string | null }> = [
    { label: "홈", href: base },
    { label: "진료", href: `${base}/treatments` },
    ...(pillarSlug && pillarLabel
      ? [{ label: pillarLabel, href: `${base}/treatments/${pillarSlug}` }]
      : []),
    { label: treatment.name, href: null },
  ];

  const primaryCta = initial.clinic.primaryCtas[0] ?? null;

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={breadcrumbItems} />

      {/* === 1. Hero 2-col light === */}
      <section className="bg-subtle/50 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* 좌측 텍스트 */}
            <Reveal>
              <div>
                <span className="text-eyebrow">{heroEyebrow}</span>
                <h1 className="mt-5 font-serif-display text-4xl tracking-tightest text-ink-strong md:text-5xl lg:text-6xl">
                  {treatment.name}
                </h1>
                <p className="mt-6 text-lg leading-[1.7] text-fg-muted md:text-xl">
                  {treatment.summary}
                </p>
                {primaryCta ? (
                  <div className="mt-9 flex flex-wrap gap-3">
                    <PillLink href={primaryCta.targetUrl} variant="primary" size="lg">
                      {primaryCta.label}
                    </PillLink>
                    <PillLink href={`${base}/treatments`} variant="secondary" size="lg">
                      전체 진료 보기
                    </PillLink>
                  </div>
                ) : null}
              </div>
            </Reveal>

            {/* 우측 hero image */}
            <Reveal delayMs={120}>
              <div className="relative">
                {treatment.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={treatment.heroImageUrl}
                    alt={`${treatment.name} 시술/진료 안내`}
                    className="aspect-[4/3] w-full rounded-3xl object-cover shadow-supanova-lg ring-1 ring-border/40"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated shadow-supanova-lg ring-1 ring-border/40"
                  >
                    <iconify-icon icon="solar:leaf-bold-duotone" width="72" className="text-brand-primary/40" />
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === 2. KEY_EFFECTS 3-step row (다이트 표준 3원칙) === */}
      <section className="border-b border-border bg-canvas py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {keyEffects.map((e, idx) => (
                <div key={e.title} className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary ring-1 ring-brand-primary/10">
                      <iconify-icon icon={e.icon} width="22" height="22" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs tabular-nums text-fg-muted">
                        0{idx + 1}
                      </span>
                      <h2 className="text-base font-semibold tracking-tight text-ink-strong">{e.title}</h2>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* === EVIDENCE_LINKING_PLAN Phase A § 8 — 임상 근거 (derived-from 우선) === */}
      {(evidence.derivedFrom.length > 0 || evidence.cites.length > 0) ? (
        <section className="border-b border-border bg-subtle/30 py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="Clinical Evidence"
                title="임상 근거"
                description="이 진료의 기반이 되는 임상 연구·미디어 자료입니다."
              />
            </Reveal>

            {evidence.derivedFrom.length > 0 ? (
              <Reveal delayMs={120}>
                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-muted">기반 연구</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {evidence.derivedFrom.map((item) => (
                      <EvidenceCard key={`df-${item.targetId}`} item={item} instanceSlug={params.instanceSlug} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : null}

            {evidence.cites.length > 0 ? (
              <Reveal delayMs={180}>
                <div className="mt-8">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-muted">참고 자료</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {evidence.cites.map((item) => (
                      <EvidenceCard key={`cites-${item.targetId}`} item={item} instanceSlug={params.instanceSlug} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* === 3. 본문 2-col + sticky aside === */}
      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            {/* 좌측 ArticleBody */}
            <article className="min-w-0">
              <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
            </article>

            {/* 우측 sticky aside — 진료 안내 카드 */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Card padding="lg" variant="tinted">
                <div className="text-eyebrow mb-3">예약 / 상담</div>
                <h3 className="text-xl font-bold tracking-tight text-ink-strong">진료 안내</h3>

                {initial.locationMain ? (
                  <ul className="mt-5 space-y-3 text-sm text-fg-muted">
                    <li className="flex items-start gap-2">
                      <iconify-icon
                        icon="solar:map-point-bold-duotone"
                        width="18"
                        className="mt-0.5 shrink-0 text-brand-primary"
                      />
                      <span>{formatAddress(initial.locationMain)}</span>
                    </li>
                    {initial.locationMain.telephone ? (
                      <li className="flex items-start gap-2">
                        <iconify-icon
                          icon="solar:phone-calling-bold-duotone"
                          width="18"
                          className="mt-0.5 shrink-0 text-brand-primary"
                        />
                        <a
                          href={`tel:${initial.locationMain.telephone}`}
                          className="font-semibold text-ink-strong hover:text-brand-primary"
                        >
                          {initial.locationMain.telephone}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                ) : null}

                {initial.clinic.primaryCtas.length > 0 ? (
                  <div className="mt-6 border-t border-border/60 pt-6">
                    <ReservationChannels ctas={initial.clinic.primaryCtas} />
                  </div>
                ) : null}
              </Card>

              <p className="mt-4 text-xs leading-relaxed text-fg-muted/80">
                * 결과는 환자 체질·생활 습관에 따라 개인차가 있을 수 있습니다.<br />
                * 진료 시간 외 문의는 1:1 비밀 상담소를 이용해 주세요.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* === 4. 연관 시술/진료 grid === */}
      {related.length > 0 ? (
        <section className="bg-subtle/50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="연관 진료"
                title={selfIsPillar ? "세부 진료" : "같은 영역의 다른 진료"}
                description={pillarLabel ? `${pillarLabel} 영역의 다른 진료를 함께 살펴보세요.` : undefined}
              />
            </Reveal>
            <Reveal delayMs={120}>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((t) => (
                  <TreatmentCard key={t.slug} treatment={t} baseHref={base} />
                ))}
              </div>
            </Reveal>
            <Reveal delayMs={240}>
              <div className="mt-10 flex justify-center">
                <PillLink href={`${base}/treatments`} variant="secondary" size="md">
                  전체 진료 보기
                </PillLink>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* === 5. 마지막 예약 CTA (메인페이지 program-reservation 패턴 정합) === */}
      {initial.locationMain || initial.clinic.primaryCtas.length > 0 ? (
        <section className="bg-canvas py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Card padding="lg" variant="tinted">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-fg-inverse shadow-supanova">
                  <iconify-icon icon="solar:calendar-mark-bold-duotone" width="32" />
                </span>
                <div>
                  <div className="text-eyebrow mb-2">예약 안내</div>
                  <h3 className="text-2xl font-bold tracking-tight text-ink-strong">진료 일정을 잡으세요</h3>
                  {initial.locationMain ? (
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
                      <span className="inline-flex items-center gap-2">
                        <iconify-icon icon="solar:map-point-bold-duotone" width="18" className="text-brand-primary" />
                        {formatAddress(initial.locationMain)}
                      </span>
                      {initial.locationMain.telephone ? (
                        <span className="inline-flex items-center gap-2">
                          <iconify-icon icon="solar:phone-calling-bold-duotone" width="18" className="text-brand-primary" />
                          <a
                            href={`tel:${initial.locationMain.telephone}`}
                            className="font-semibold text-ink-strong hover:text-brand-primary"
                          >
                            {initial.locationMain.telephone}
                          </a>
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {initial.clinic.primaryCtas.length > 0 ? (
                  <div className="md:ml-auto">
                    <ReservationChannels ctas={initial.clinic.primaryCtas} />
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </section>
      ) : null}
    </>
  );
}
