// @glitzy/web/(site)/[instanceSlug]/page — Home (Supanova premium aesthetic v1.0)
// Vibe: Clean Structural · Layout: Editorial Split + Asymmetric Bento + Z-Axis · Pill CTA + Double-Bezel + Eyebrow pill
//
// 섹션 순서 (사용자 검수 2026-05-20 정합):
//   1. Hero (위치/전화 신뢰 라인 포함)
//   2. 신뢰 시그널 strip (footnote 안 출처/기준 명시 — 의료법 제56조 정합)
//   3. 굿바이 다이어트 — 핵심 프로그램 (id="principles" 3원칙)
//   4. 의료진
//   5. 진료 철학 (논문 카드 분리 — 신뢰 자료 묶음으로 이동)
//   6. FAQ
//   7. 신뢰 자료 묶음 (기사 + 미디어 + 논문)
//   8. 1:1 비밀 상담소
//   9. 마지막 예약 CTA (위치 + 전화 + 채널)

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  normalizeDoctor,
  normalizeArticle,
  normalizePublication,
  normalizeMediaAppearance,
  normalizeTreatment,
  formatAddress,
  type DoctorProfileRow,
  type TreatmentPageRow,
  type ArticleRow,
  type PublicationRow,
  type MediaAppearanceRow,
  type MediaAppearanceProjection,
} from "@/lib/db-projection";
import { Hero } from "@/components/site/Hero";
import { DoctorCard } from "@/components/site/DoctorCard";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { homeGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { SectionHeading, Card, PillLink, Reveal } from "@/components/site/ui";
import { ArticleCarousel } from "@/components/site/ArticleCarousel";
import { MediaShortsMarquee } from "@/components/site/MediaShortsMarquee";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { ArticleBody } from "@/components/site/ArticleBody";
import { TreatmentPillarsGrid, type TreatmentPillar } from "@/components/site/TreatmentPillarsGrid";
import { renderMarkdownToHtml } from "@/lib/markdown";

// C 하이브리드 fallback (DB clinic_profile.metadata.treatmentPillars 부재 시 사용)
const TREATMENT_PILLARS_FALLBACK: ReadonlyArray<TreatmentPillar & { slug: string }> = [
  { slug: "diet-treatment",   icon: "mdi:scale-bathroom",        title: "다이어트 치료",   subtitle: "굿바이 다이어트 · 당질조절 · 요요방지" },
  { slug: "personalized-diet", icon: "mdi:account-heart-outline", title: "개인맞춤 다이어트", subtitle: "3GO · 갱년기 · 산후 · 마른비만 · 소아비만" },
  { slug: "body-shaping",     icon: "mdi:human-male-height",     title: "체형관리",        subtitle: "지방분해약침 · 다이트라인 · 밀착 코칭" },
  { slug: "herbal-medicine",  icon: "mdi:leaf",                  title: "다이트 한약",     subtitle: "원외탕전 · 엄선된 한약 재료" },
];
const STANDARD_PRINCIPLES_FALLBACK: ReadonlyArray<{ n: string; title: string; desc: string; icon: string }> = [
  { n: "01", title: "체질 진단", desc: "사상체질 진단으로 환자 개개인의 체질을 정확히 파악합니다.", icon: "solar:user-id-bold-duotone" },
  { n: "02", title: "맞춤 처방", desc: "체질에 맞춘 한약 처방으로 무리 없는 감량을 진행합니다.", icon: "solar:leaf-bold-duotone" },
  { n: "03", title: "사후 관리", desc: "3개월 사후 관리로 감량 이후 체중 관리를 지원합니다.", icon: "solar:medal-star-bold-duotone" },
];

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: initial.clinic.slogan ?? initial.clinic.name,
    description: initial.clinic.description,
    canonicalPath: "/",
    ogType: "website",
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _CHANNEL_LABEL: Record<MediaAppearanceProjection["channelType"], string> = {
  broadcast: "방송", youtube: "유튜브", podcast: "팟캐스트", press: "언론",
};

export default async function HomePage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const doctorRows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile WHERE active = true
       ORDER BY display_order ASC, id ASC LIMIT 3`;
    const articleRows = await tx<(ArticleRow & { external_url: string | null })[]>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url, a.published_at, a.author_doctor_id,
             a.category_id, ac.slug AS category_slug, a.updated_at, a.external_url
        FROM article a
        JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE a.status = 'published'
       ORDER BY a.published_at DESC NULLS LAST LIMIT 12`;
    const publicationRows = await tx<PublicationRow[]>`
      SELECT slug, title, authors, journal,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id, published_at, updated_at
        FROM publication WHERE status = 'published'
       ORDER BY published_date DESC LIMIT 4`;
    const mediaRows = await tx<MediaAppearanceRow[]>`
      SELECT slug, title, channel_name, channel_type::text AS channel_type,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             duration_seconds, url, thumbnail_url, summary, author_doctor_id, published_at, updated_at
        FROM media_appearance WHERE status = 'published'
       ORDER BY published_date DESC LIMIT 12`;
    const faqRows = await tx<{ slug: string; question: string; answer: string }[]>`
      SELECT slug, question, answer FROM faq WHERE status = 'published'
       ORDER BY display_order ASC LIMIT 6`;
    const goodbyeDiet = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, pillar_slug, metadata, published_at, updated_at
        FROM treatment_page WHERE status = 'published' AND slug = 'goodbye-diet' LIMIT 1`;
    const consultationRows = await tx<{
      id: string; title: string; display_name: string; is_locked: boolean; status: string; created_at: Date;
    }[]>`
      SELECT id, title, display_name, is_locked, status, created_at
        FROM consultation_request
       ORDER BY created_at DESC LIMIT 8`;
    return {
      doctors: doctorRows.map(normalizeDoctor),
      articles: articleRows.map((r) => ({ ...normalizeArticle(r), externalUrl: r.external_url })),
      publications: publicationRows.map(normalizePublication),
      media: mediaRows.map(normalizeMediaAppearance),
      faqs: faqRows,
      goodbyeDiet: goodbyeDiet.length > 0 ? normalizeTreatment(goodbyeDiet[0]!) : null,
      consultations: consultationRows.map((c) => ({
        id: c.id,
        title: c.title,
        displayName: c.display_name,
        isLocked: c.is_locked,
        status: c.status,
        createdAt: c.created_at,
      })),
    };
  });

  if (!data) notFound();
  const baseHref = `/${params.instanceSlug}`;
  const cta = initial.clinic.primaryCtas[0] ?? null;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  // FAQ answer 안 SSR 안 미리 markdown → sanitized HTML render (client component 안 전달)
  const faqAccordionItems = data.faqs.map((f) => ({
    id: f.slug,
    question: f.question,
    answerHtml: renderMarkdownToHtml(f.answer, hostOrigin),
  }));
  const graph = homeGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
    initial.clinic, initial.locationMain,
  );

  const hasTrustContent =
    data.articles.length > 0 || data.media.length > 0 || data.publications.length > 0;

  // C 하이브리드: clinic.metadata 우선, 부재 시 fallback hardcode
  const treatmentPillars = initial.clinic.metadata.treatmentPillars.length > 0
    ? initial.clinic.metadata.treatmentPillars
    : TREATMENT_PILLARS_FALLBACK;
  const standardPrinciples = initial.clinic.metadata.standardPrinciples.length > 0
    ? initial.clinic.metadata.standardPrinciples
    : STANDARD_PRINCIPLES_FALLBACK;
  const sectionCopy = initial.clinic.metadata.sectionCopy;

  return (
    <>
      <JsonLdScript graph={graph} />

      {/* === 1. Hero (위치/전화 prop 신뢰 라인) === */}
      <Hero
        clinic={initial.clinic}
        cta={cta}
        doctors={data.doctors}
        location={initial.locationMain}
        secondaryCtaHref={`${baseHref}/doctors`}
        secondaryCtaLabel="원장 소개 보기"
      />

      {/* === 2. (삭제됨) 신뢰 시그널 strip — 검증 불가 수치(20년+·152,300+) 및 주체 혼동 risk(ICHEI 방민우 개인) 사유로 사용자 결정에 따라 제거 (2026-05-20). 3원칙은 § 3 굿바이 다이어트 섹션에 그대로 있음. === */}

      {/* === 3. 굿바이 다이어트 — 핵심 프로그램 (id="principles" 3원칙) === */}
      {data.goodbyeDiet ? (
        <section id="goodbye-diet" className="scroll-mt-32 bg-subtle/50 py-20 md:py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="Signature Program"
                title="굿바이 다이어트"
                description={data.goodbyeDiet.summary}
              />
            </Reveal>

            {/* 3원칙 — id="principles" · C 하이브리드 metadata.standardPrinciples 사용 (fallback 유지) */}
            <div id="principles" className="mt-10 grid scroll-mt-32 grid-cols-1 gap-6 md:grid-cols-3">
              {standardPrinciples.map((p, i) => (
                <Reveal key={p.n} delayMs={120 + i * 80}>
                  <Card padding="lg" className="h-full">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-primary-soft text-brand-primary">
                        <iconify-icon icon={p.icon} width="28" />
                      </span>
                      <span className="font-serif-display text-4xl text-brand-primary/30">{p.n}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold tracking-tight text-ink-strong">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{p.desc}</p>
                  </Card>
                </Reveal>
              ))}
            </div>

            <Reveal delayMs={360}>
              <div className="mt-10 flex justify-center">
                <PillLink href={`${baseHref}/treatments/${data.goodbyeDiet.slug}`} variant="secondary" size="md">
                  프로그램 자세히 보기
                </PillLink>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* === 4. 의료진 — 핵심 === */}
      {data.doctors.length > 0 ? (
        <section className="bg-canvas py-20 md:py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="의료진"
                title="진료의 깊이"
                description="환자 한 분 한 분의 체질을 진단하고 맞춤 처방을 제공합니다."
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {data.doctors.map((d, i) => (
                <Reveal key={d.slug} delayMs={120 + i * 80}>
                  <DoctorCard doctor={d} baseHref={baseHref} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <PillLink href={`${baseHref}/doctors`} variant="secondary" size="md">
                전체 의료진 보기
              </PillLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* === 5. 진료 철학 — 슬로건 hero + 4 영역 카드 + 본문 === */}
      <section id="philosophy" className="scroll-mt-32 bg-subtle/50 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="진료 철학"
              title="환자 맞춤 한방 진료"
              description={initial.clinic.description}
            />
          </Reveal>

          {/* 4 영역 카드 그리드 — C 하이브리드 metadata.treatmentPillars 사용 (fallback 유지). */}
          <Reveal delayMs={120}>
            <div className="mt-10">
              <TreatmentPillarsGrid pillars={treatmentPillars} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* === 6. FAQ — 보조 === */}
      {faqAccordionItems.length > 0 ? (
        <section className="bg-canvas py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow="자주 묻는 질문"
                title="궁금증을 풀어드립니다"
                description="다이트한의원 진료와 프로그램, 비용 등 환자들이 자주 물어보시는 질문과 답변을 정리했습니다."
              />
            </Reveal>
            <Reveal delayMs={120}>
              <div className="mt-10">
                <FaqAccordion items={faqAccordionItems} />
                <p className="mt-6 text-center text-sm text-fg-muted">
                  찾으시는 답변이 없으신가요?{" "}
                  <Link href={`${baseHref}/community/consultation`} className="font-medium text-brand-primary hover:underline">
                    1:1 비밀 상담소
                  </Link>
                  로 직접 문의해 주세요.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* === 7. 신뢰 자료 묶음 — 기사 + 미디어 + 논문 (보조) ===
           외부 wrapper 헤더 제거 (sub-block 자체 헤더 보유 — 사용자 검수 2026-05-20) */}
      {hasTrustContent ? (
        <section id="media" className="scroll-mt-32 bg-subtle/50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            {/* 7.1 기사 카드 캐러셀 — "모두 보기" CTA 가 헤더 우측 상단 (action prop) */}
            {data.articles.length > 0 ? (
              <Reveal>
                <div>
                  <ArticleCarousel
                    eyebrow=""
                    title="기사 및 칼럼"
                    description="굿바이 다이어트, 사상체질, 출산 전후 케어 등 한방 다이어트 인사이트 모음."
                    items={data.articles.map((a) => ({
                      id: a.slug,
                      title: a.headline,
                      description: a.summary,
                      href: `${baseHref}/insights/${a.categorySlug}/${a.slug}`,
                      image: a.heroImageUrl,
                      externalUrl: a.externalUrl,
                    }))}
                    action={
                      <PillLink href={`${baseHref}/insights`} variant="secondary" size="md">
                        기사 및 칼럼 모두 보기
                      </PillLink>
                    }
                  />
                </div>
              </Reveal>
            ) : null}

            {/* 7.2 미디어 출연 marquee — "모두 보기" CTA 가 헤더 우측 상단 슬롯 (action prop) */}
            {data.media.length > 0 ? (
              <Reveal delayMs={200}>
                <div className="mt-12">
                  <MediaShortsMarquee
                    eyebrow=""
                    title="미디어 출연"
                    description="방송 · 유튜브 · 언론 인터뷰 — 의료진의 실제 사례와 인사이트."
                    items={data.media.map((m) => ({
                      id: m.slug,
                      thumbnail: m.thumbnailUrl,
                      title: m.title,
                      channelName: m.channelName,
                      channelType: m.channelType,
                      href: `${baseHref}/media-appearances/${m.slug}`,
                      externalUrl: m.url,
                    }))}
                    action={
                      <PillLink href={`${baseHref}/media-appearances`} variant="secondary" size="md">
                        미디어 출연 모두 보기
                      </PillLink>
                    }
                  />
                </div>
              </Reveal>
            ) : null}

            {/* 7.3 참여 논문 (기존 진료 철학 우측 카드 → 신뢰 자료로 이동) */}
            {data.publications.length > 0 ? (
              <Reveal delayMs={280}>
                <div className="mt-12">
                  <Card padding="lg" variant="tinted">
                    <div className="flex items-start gap-5">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-fg-inverse">
                        <iconify-icon icon="solar:diploma-verified-bold-duotone" width="28" />
                      </span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold tracking-tight text-ink-strong">참여 논문</h3>
                        <p className="mt-2 leading-relaxed text-fg-muted">학술 활동 및 학회 발표 논문 모음.</p>
                      </div>
                    </div>
                    <ul className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-6">
                      {data.publications.map((p) => (
                        <li key={p.slug}>
                          <a
                            href={`${baseHref}/publications/${p.slug}`}
                            className="group block rounded-xl px-2 py-2 transition-all duration-500 ease-supanova hover:bg-elevated"
                          >
                            <div className="text-sm font-medium text-fg-default group-hover:text-brand-primary">{p.title}</div>
                            <div className="mt-0.5 text-xs italic text-fg-muted">{p.journal} · {p.publishedDate}</div>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <PillLink href={`${baseHref}/publications`} variant="ghost" size="md">
                        논문 모두 보기
                      </PillLink>
                    </div>
                  </Card>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* === 8. 1:1 비밀 상담소 — 보조 === */}
      <section id="community" className="scroll-mt-32 bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="소통 공간"
              title="1:1 비밀 상담소"
              description={sectionCopy.communityDescription ?? "민감한 증상이나 진료 가능 여부, 비용 문의를 의료진에게 비공개로 전달합니다.\n본문 내용은 작성자와 의료진만 확인할 수 있습니다."}
            />
          </Reveal>

          <Reveal delayMs={120}>
            <div className="mt-10 overflow-hidden rounded-2xl bg-elevated shadow-supanova ring-1 ring-border/60">
              <ul className="divide-y divide-border/60">
                {data.consultations.length === 0 ? (
                  <li className="px-6 py-12 text-center text-sm text-fg-muted">아직 등록된 상담이 없습니다. 첫 상담을 시작해보세요.</li>
                ) : data.consultations.map((c) => (
                  <li key={c.id}>
                    <div className="flex items-center gap-4 px-6 py-4 transition-colors duration-500 ease-supanova hover:bg-brand-primary-soft/40">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        c.status === 'resolved' ? 'bg-success-subtle text-success'
                          : c.status === 'in-progress' ? 'bg-brand-accent-soft text-ink-strong'
                          : 'bg-brand-primary-soft text-brand-primary'
                      }`}>
                        <iconify-icon icon={c.isLocked ? 'solar:lock-keyhole-minimalistic-bold-duotone' : 'solar:unlock-bold-duotone'} width="18" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <h3 className="truncate text-sm font-medium text-ink-strong md:text-base">{c.title}</h3>
                          {c.isLocked && <span className="hidden text-[10px] uppercase tracking-wider text-fg-muted sm:inline">비공개</span>}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-fg-muted">
                          <span>{c.displayName}</span>
                          <span aria-hidden>·</span>
                          <time dateTime={c.createdAt.toISOString()}>{formatRelativeKo(c.createdAt)}</time>
                        </div>
                      </div>
                      <span className={`hidden shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider md:inline-block ${
                        c.status === 'resolved' ? 'bg-success-subtle text-success'
                          : c.status === 'in-progress' ? 'bg-brand-accent-soft text-ink-strong'
                          : 'bg-brand-primary-soft text-brand-primary'
                      }`}>
                        {c.status === 'resolved' ? '답변 완료' : c.status === 'in-progress' ? '답변 중' : '대기'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delayMs={200}>
            <div className="mt-8 flex justify-center">
              <PillLink href={`${baseHref}/community/consultation`} variant="primary" size="md">
                상담 글 작성하기
              </PillLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* === 9. 마지막 예약 CTA — 작은 섹션 (위치 + 전화 + 채널) === */}
      {(initial.locationMain || initial.clinic.primaryCtas.length > 0) ? (
        <section id="program-reservation" className="scroll-mt-32 bg-subtle/50 py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <Card padding="lg" variant="tinted">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr_auto] md:items-center">
                  {/* 아이콘 */}
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-fg-inverse shadow-supanova">
                    <iconify-icon icon="solar:calendar-mark-bold-duotone" width="32" />
                  </span>

                  {/* 정보 */}
                  <div>
                    <div className="text-eyebrow mb-2">예약 안내</div>
                    <h3 className="text-2xl font-bold tracking-tight text-ink-strong">지금 바로 상담을 시작하세요</h3>
                    {initial.locationMain ? (
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
                        <span className="inline-flex items-center gap-2">
                          <iconify-icon icon="solar:map-point-bold-duotone" width="18" className="text-brand-primary" />
                          {formatAddress(initial.locationMain)}
                        </span>
                        {initial.locationMain.telephone ? (
                          <span className="inline-flex items-center gap-2">
                            <iconify-icon icon="solar:phone-calling-bold-duotone" width="18" className="text-brand-primary" />
                            <a href={`tel:${initial.locationMain.telephone}`} className="font-semibold text-ink-strong hover:text-brand-primary">
                              {initial.locationMain.telephone}
                            </a>
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {/* CTA */}
                  {initial.clinic.primaryCtas.length > 0 ? (
                    <div className="md:ml-auto">
                      <ReservationChannels ctas={initial.clinic.primaryCtas} />
                    </div>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}

function formatRelativeKo(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}주 전`;
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

// TrustItem 컴포넌트는 § 2 신뢰 시그널 strip 제거(2026-05-20)와 함께 미사용. 추후 검증된 stat strip 필요 시 복원 가능.
