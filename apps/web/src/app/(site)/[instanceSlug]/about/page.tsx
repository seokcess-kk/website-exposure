// @glitzy/web/(site)/[instanceSlug]/about — P-002 About v2.0 (Brand Story + 4 Pillars + KeyStats + Vancouver)
// 사용자 결정 2026-05-20: 미디어 섹션은 별도 메뉴로 이관되어 제거. 보충 내용(KeyStats·System Strengths) 추가.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  normalizePublication,
  type PublicationRow,
} from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { aboutGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { SectionHeading, Card, Reveal } from "@/components/site/ui";
import { TreatmentPillarsGrid, type TreatmentPillar } from "@/components/site/TreatmentPillarsGrid";

export const revalidate = 300;

// C 하이브리드 fallback (DB clinic_profile.metadata.* 부재 시 사용)
const TREATMENT_PILLARS_FALLBACK: ReadonlyArray<TreatmentPillar & { slug: string }> = [
  { slug: "diet-treatment",    icon: "mdi:scale-bathroom",        title: "다이어트 치료",   subtitle: "굿바이 다이어트 · 당질조절 · 요요방지" },
  { slug: "personalized-diet", icon: "mdi:account-heart-outline", title: "개인맞춤 다이어트", subtitle: "3GO · 갱년기 · 산후 · 마른비만 · 소아비만" },
  { slug: "body-shaping",      icon: "mdi:human-male-height",     title: "체형관리",        subtitle: "지방분해약침 · 다이트라인 · 밀착 코칭" },
  { slug: "herbal-medicine",   icon: "mdi:leaf",                  title: "다이트 한약",     subtitle: "원외탕전 · 엄선된 한약 재료" },
];
const SYSTEM_STRENGTHS_FALLBACK: ReadonlyArray<{ icon: string; title: string; description: string }> = [
  { icon: "mdi:test-tube",      title: "의학적 다이어트 시스템", description: "학술 근거에 기반한 진료 프로토콜로 한약·약침·식이 코칭을 결합한 표준화된 시스템을 운영합니다." },
  { icon: "mdi:account-search", title: "체질 진단 맞춤 처방",    description: "사상체질 진단과 신진대사 평가를 통해 환자 개개인의 체질에 맞춘 한약을 처방합니다." },
  { icon: "mdi:calendar-check", title: "사후 관리 시스템",       description: "다이트앱과 데일리 코칭으로 본 치료 종료 후에도 평생 유지되는 결과를 약속합니다." },
  { icon: "mdi:flask",          title: "원외탕전 한약",          description: "GMP 기준 원외탕전실에서 엄선된 한약재로 안전성과 품질을 보증합니다." },
];

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "진료 철학",
    description: initial.clinic.description,
    canonicalPath: "/about",
    ogType: "website",
  });
}

export default async function AboutPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const longDesc = initial.clinic.longDescription;

  const eatData = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const publicationRows = await tx<PublicationRow[]>`
      SELECT slug, title, authors, journal,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id, published_at, updated_at
        FROM publication
       WHERE instance_id = ${ctx.instanceId}::uuid
       ORDER BY published_date DESC`;
    return { publications: publicationRows.map(normalizePublication) };
  });
  const publications = eatData?.publications ?? [];

  const graph = aboutGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/about" },
    initial.clinic, initial.locationMain,
    `진료 철학 | ${initial.clinic.name}`,
    initial.clinic.description, publications, [],
  );

  // C 하이브리드: clinic.metadata 우선, 부재 시 fallback hardcode
  const treatmentPillars = initial.clinic.metadata.treatmentPillars.length > 0
    ? initial.clinic.metadata.treatmentPillars
    : TREATMENT_PILLARS_FALLBACK;
  const systemStrengths = initial.clinic.metadata.systemStrengths.length > 0
    ? initial.clinic.metadata.systemStrengths
    : SYSTEM_STRENGTHS_FALLBACK;
  // keyStats — metadata 우선, value="__publications_count__" 같은 sentinel 은 publications.length 로 치환
  const statsRaw = initial.clinic.metadata.keyStats.length > 0
    ? initial.clinic.metadata.keyStats
    : [
        { value: "9",  suffix: "개", label: "전국 직영 지점" },
        { value: "31", suffix: "명", label: "전국 다이트 의료진" },
        { value: "__publications_count__", suffix: "편", label: "발표 학술 논문" },
      ];
  const stats = statsRaw.map((s) =>
    s.value === "__publications_count__"
      ? { ...s, value: String(publications.length) }
      : s,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "진료 철학", href: null }]} />

      {/* 1. SectionHeading + description */}
      <section className="bg-canvas py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow="OUR PHILOSOPHY"
            title="진료 철학"
            description={initial.clinic.description}
          />
          {longDesc ? (
            <Reveal delayMs={120}>
              <div className="mx-auto mt-12 max-w-prose">
                <ArticleBody markdown={longDesc} hostOrigin={hostOrigin} />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* 2. 4 Pillars (홈과 일관) */}
      <section className="bg-subtle/40 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="TREATMENT DOMAINS"
              title="다이트한의원의 4대 진료 영역"
              description="환자의 체질과 라이프스타일에 맞춰 4가지 영역으로 진료를 구성합니다."
            />
          </Reveal>
          <Reveal delayMs={120}>
            <div className="mt-10">
              <TreatmentPillarsGrid pillars={treatmentPillars} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. KeyStats — 임상 점수 카운터 */}
      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="BY THE NUMBERS"
              title="임상 데이터로 검증된 진료"
              showDivider={false}
            />
          </Reveal>
          <Reveal delayMs={120}>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-serif-heading text-4xl font-bold tracking-tight text-brand-primary md:text-5xl">
                    {s.value}
                    {s.suffix ? <span className="text-2xl md:text-3xl">{s.suffix}</span> : null}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-wider text-fg-muted md:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. System Strengths — 다이트가 다른 이유 */}
      <section className="bg-subtle/40 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="WHAT MAKES US DIFFERENT"
              title="다이트한의원의 강점"
              description="단순한 체중 감량을 넘어 평생 유지되는 결과를 위한 4가지 시스템."
            />
          </Reveal>
          <Reveal delayMs={120}>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {systemStrengths.map((s) => (
                <div
                  key={s.title}
                  className="flex gap-4 rounded-2xl bg-elevated p-6 ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-0.5 hover:shadow-supanova-lg"
                >
                  <div className="shrink-0">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary ring-1 ring-brand-primary/10">
                      <iconify-icon icon={s.icon} width="26" height="26" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-ink-strong">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Vancouver Publications (doctor detail 과 일관) */}
      {publications.length > 0 ? (
        <section className="bg-canvas py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="PUBLICATIONS"
                title={`논문 (${publications.length})`}
                description="다이트한의원 의료진이 학술지에 발표한 연구 논문 목록입니다."
                showDivider={false}
              />
            </Reveal>
            <Reveal delayMs={120}>
              <ol className="mt-10 flex flex-col">
                {publications.map((p, idx) => {
                  const year = p.publishedDate.slice(0, 4);
                  const firstAuthor = p.authors[0] ?? "";
                  const others = p.authors.length > 1 ? " 외" : "";
                  return (
                    <li key={p.slug} className="flex gap-3 border-b border-border py-4 last:border-b-0">
                      <span className="shrink-0 pt-0.5 font-mono text-sm tabular-nums text-fg-muted">
                        [{String(idx + 1).padStart(2, "0")}]
                      </span>
                      <div className="flex-1">
                        <h3 className="text-base font-medium leading-snug text-ink-strong">{p.title}</h3>
                        <p className="mt-1.5 text-xs text-fg-muted">
                          {firstAuthor}{others}.{p.journal ? <> <em className="not-italic font-medium text-fg-default">{p.journal}</em>.</> : null} {year}.
                        </p>
                        <p className="mt-2 text-sm text-fg-default">{p.summary}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {p.doi ? (
                            <a
                              href={`https://doi.org/${p.doi}`}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="rounded border border-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted hover:border-brand-primary hover:text-brand-primary"
                            >
                              DOI
                            </a>
                          ) : null}
                          {p.pubmedId ? (
                            <a
                              href={`https://pubmed.ncbi.nlm.nih.gov/${p.pubmedId}`}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="rounded border border-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted hover:border-brand-primary hover:text-brand-primary"
                            >
                              PubMed
                            </a>
                          ) : null}
                          {!p.doi && !p.pubmedId && p.journal ? (
                            <span className="rounded border border-border bg-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-fg-muted">
                              학회지
                            </span>
                          ) : null}
                          <a
                            href={p.url}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="ml-auto text-xs text-brand-primary hover:text-brand-primary-hover"
                          >
                            원문 보기 →
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* 6. 사업자 정보 Card (기존 유지) */}
      {(initial.clinic.founder || initial.clinic.foundingDate || initial.clinic.legalEntityName || initial.clinic.businessRegistrationNumber) ? (
        <section className="bg-subtle/40 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="LEGAL"
                title="의료기관 사업자 정보"
                showDivider={false}
              />
            </Reveal>
            <Reveal delayMs={120}>
              <Card padding="lg" variant="tinted" className="mt-10">
                <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {initial.clinic.founder ? (
                    <div><dt className="text-eyebrow text-xs">FOUNDER</dt><dd className="mt-1 font-medium text-ink-strong">{initial.clinic.founder}</dd></div>
                  ) : null}
                  {initial.clinic.foundingDate ? (
                    <div><dt className="text-eyebrow text-xs">FOUNDED</dt><dd className="mt-1 font-medium text-ink-strong">{initial.clinic.foundingDate}</dd></div>
                  ) : null}
                  {initial.clinic.legalEntityName ? (
                    <div><dt className="text-eyebrow text-xs">LEGAL ENTITY</dt><dd className="mt-1 font-medium text-ink-strong">{initial.clinic.legalEntityName}</dd></div>
                  ) : null}
                  {initial.clinic.businessRegistrationNumber ? (
                    <div><dt className="text-eyebrow text-xs">BUSINESS REG</dt><dd className="mt-1 font-medium text-ink-strong">{initial.clinic.businessRegistrationNumber}</dd></div>
                  ) : null}
                </dl>
              </Card>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
