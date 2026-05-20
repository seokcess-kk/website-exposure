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
import { DoctorIntroSection, type DoctorIntroData } from "@/components/site/DoctorIntroSection";
import { FloatingTOC, type TocItem } from "@/components/site/FloatingTOC";
import { renderMarkdownToHtml } from "@/lib/markdown";

// 신수용 대표원장 이야기 (출처: incheon.daeatdiet.com /bbs/content.php?co_id=05_02&me_code=5090)
// 추후 DoctorProfile.metadata.story 로 이관 가능 — 현재는 1호 instance (다이트 인천 부평점) 자산이라 hardcode.
const DOCTOR_INTRO_DATA: DoctorIntroData = {
  pullQuote: {
    text: "다이어트는 불치병이 아니에요.\n예방과 치료, 그리고 재활까지가 한 세트입니다.",
  },
  paragraphs: [
    "어린 시절의 꿈은 '다른 사람을 살려주는 의사'였습니다. 침 하나로 근본을 한 번에 다루는 한의학의 매력에 이끌려 한의사의 길을 선택했고, 삼형제 모두 의료 현장에서 환자를 만나고 있습니다.",
    "서울 강남구 본원에서 쌓은 풍부한 감량 임상 경험을 바탕으로, 지금은 인천 부평점에서 다이어트만 집중 진료하고 있습니다. 하나를 제대로 잘 하고 싶기 때문입니다. 다이어트만 전문으로 다루는 한의원이기에 더 깊이 있는 진료가 가능하다고 믿습니다.",
    "초진 때 눈을 마주치지 못하던 30대 환자가 104kg에서 40kg 이상을 감량하고, 마주 앉아 환하게 이야기 나누던 순간을 기억합니다. 다이어트는 약을 쓰는 치료뿐 아니라, 환자의 소리에 귀 기울이는 마음을 쓰는 진료입니다.",
    "더 고민하지 마시고, 인천 부평점에서 많은 분들이 건강한 삶을 되찾으시기를 바랍니다.",
  ],
  philosophyCards: [
    {
      eyebrow: "FOCUS",
      headline: "다이어트 단일 영역 집중",
      body: "여러 진료를 동시에 다루지 않습니다. 하나를 제대로 — 다이어트만 전문으로 진료하기에 깊이 있는 임상 경험과 표준화된 처방이 가능합니다.",
    },
    {
      eyebrow: "PROCESS",
      headline: "예방·치료·재활 한 세트",
      body: "감량만이 아니라 그 이후의 요요 관리까지 한 세트로 봅니다. 본 치료 12주 + 사후 관리 12주 = 24주 여정으로 평생 유지되는 결과를 약속합니다.",
    },
    {
      eyebrow: "VOICE",
      headline: "환자 소리에 귀 기울이는 진료",
      body: "약을 쓰는 치료보다 환자의 일상·관계·감정을 듣는 시간을 더 길게 가집니다. 진료는 마음을 쓰는 일이라고 생각합니다.",
    },
  ],
};

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
const DUMMY_CONSULTATIONS = [
  { id: "dummy-1", title: "체질에 따라 한약 처방이 달라지는지 궁금합니다", displayName: "김**", isLocked: true, status: "resolved", createdAt: new Date("2026-05-20T00:10:00+09:00") },
  { id: "dummy-2", title: "출산 후 체중이 잘 빠지지 않는데 상담 가능할까요?", displayName: "박**", isLocked: true, status: "in-progress", createdAt: new Date("2026-05-19T18:30:00+09:00") },
  { id: "dummy-3", title: "요요가 반복되는 경우에도 프로그램을 받을 수 있나요?", displayName: "이**", isLocked: true, status: "resolved", createdAt: new Date("2026-05-19T10:20:00+09:00") },
  { id: "dummy-4", title: "야근이 잦은 직장인도 식단 관리가 가능한지 문의드립니다", displayName: "최**", isLocked: true, status: "pending", createdAt: new Date("2026-05-18T21:00:00+09:00") },
  { id: "dummy-5", title: "복용 중인 약이 있는데 한약 다이어트를 병행해도 될까요?", displayName: "정**", isLocked: true, status: "resolved", createdAt: new Date("2026-05-18T14:45:00+09:00") },
  { id: "dummy-6", title: "방문 전 준비해야 할 검사나 자료가 있는지 알고 싶습니다", displayName: "윤**", isLocked: true, status: "pending", createdAt: new Date("2026-05-17T16:15:00+09:00") },
] as const;
const FALLBACK_FAQS = [
  {
    id: "fallback-faq-1",
    question: "한약 다이어트는 어떤 방식으로 진행되나요?",
    answer: "처음 상담에서는 체질, 생활 패턴, 식사 습관, 수면, 복용 중인 약 등을 함께 확인합니다. 이후 개인 상태에 맞춰 한약 처방과 생활 관리 방향을 정하고, 감량 이후에는 요요를 줄이기 위한 사후 관리까지 함께 안내합니다.",
  },
  {
    id: "fallback-faq-2",
    question: "체질에 따라 처방이 달라지나요?",
    answer: "네. 같은 체중 고민이라도 식욕, 소화 상태, 부종, 피로감, 수면 상태가 다르면 접근이 달라질 수 있습니다. 신수용 대표원장은 초진 상담에서 개인별 상태를 확인한 뒤 무리 없는 방향으로 처방을 설계합니다.",
  },
  {
    id: "fallback-faq-3",
    question: "요요가 반복되는 경우에도 상담할 수 있나요?",
    answer: "가능합니다. 요요는 단순 의지 문제가 아니라 감량 방식, 식사 리듬, 스트레스, 수면, 활동량이 함께 영향을 줍니다. 반복되는 패턴을 확인하고 감량 이후 유지 계획까지 함께 잡는 방식으로 상담합니다.",
  },
  {
    id: "fallback-faq-4",
    question: "출산 후 또는 갱년기 체중 증가도 상담 가능한가요?",
    answer: "상담 가능합니다. 출산 후, 갱년기, 직장 생활 등 시기별 체중 변화는 몸 상태와 생활 환경을 함께 봐야 합니다. 현재 건강 상태와 회복 정도를 확인한 뒤 개인에게 맞는 감량 계획을 안내합니다.",
  },
  {
    id: "fallback-faq-5",
    question: "상담 전에 준비할 것이 있나요?",
    answer: "최근 복용 중인 약, 건강검진 결과, 기존 다이어트 경험, 평소 식사 패턴을 간단히 정리해 오시면 상담에 도움이 됩니다. 준비 자료가 없어도 초진 상담에서 필요한 내용을 함께 확인합니다.",
  },
  {
    id: "fallback-faq-6",
    question: "부평점 예약은 어떻게 하나요?",
    answer: "홈페이지의 예약 버튼, 전화, 네이버 예약 등 등록된 예약 채널을 통해 문의하실 수 있습니다. 개인 증상이나 비용처럼 공개하기 어려운 내용은 1:1 비밀 상담소를 이용해 남겨주세요.",
  },
] as const;

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
    // 사용자 결정 2026-05-20 — 신수용 대표원장 1인 노출 (개인 페이지 컨셉). slug=shin-soo-yong 우선, fallback display_order.
    const doctorRows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile WHERE active = true
       ORDER BY CASE WHEN slug = 'shin-soo-yong' THEN 0 ELSE 1 END, display_order ASC, id ASC
       LIMIT 1`;
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
       ORDER BY published_date DESC LIMIT 10`;
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
  const faqAccordionItems = (data.faqs.length > 0
    ? data.faqs.map((f) => ({ id: f.slug, question: f.question, answer: f.answer }))
    : FALLBACK_FAQS
  ).map((f) => ({
    id: f.id,
    question: f.question,
    answerHtml: renderMarkdownToHtml(f.answer, hostOrigin),
  }));
  const graph = homeGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
    initial.clinic, initial.locationMain,
  );
  const consultations = data.consultations.length > 0 ? data.consultations : DUMMY_CONSULTATIONS;

  const hasTrustContent =
    data.articles.length > 0 || data.media.length > 0 || data.publications.length > 0;
  const showReservation = Boolean(initial.locationMain || initial.clinic.primaryCtas.length > 0);
  const tocItems: TocItem[] = [];
  if (data.doctors[0]) {
    tocItems.push({ id: "doctor-intro", label: "대표원장 이야기", level: 1 });
    if (data.doctors[0].bio) tocItems.push({ id: "doctor-cv", label: "약력", level: 2 });
  }
  if (hasTrustContent) {
    tocItems.push({ id: "trust", label: "기사·논문·미디어", level: 1 });
    if (data.articles.length > 0) tocItems.push({ id: "trust-articles", label: "기사 및 칼럼", level: 2 });
    if (data.media.length > 0) tocItems.push({ id: "trust-media", label: "미디어", level: 2 });
    if (data.publications.length > 0) tocItems.push({ id: "trust-papers", label: "논문", level: 2 });
  }
  tocItems.push(
    { id: "community", label: "소통 공간", level: 1 },
    { id: "community-faq", label: "자주 묻는 질문", level: 2 },
    { id: "community-1on1", label: "1:1 비밀 상담소", level: 2 },
  );
  if (data.goodbyeDiet) tocItems.push({ id: "goodbye-diet", label: "굿바이 다이어트", level: 1 });
  tocItems.push({ id: "philosophy", label: "진료 철학", level: 1 });
  if (showReservation) tocItems.push({ id: "reservation", label: "예약 / 상담", level: 1 });

  // C 하이브리드: clinic.metadata 우선, 부재 시 fallback hardcode
  const clinicMetadata = initial.clinic.metadata;
  const treatmentPillars = clinicMetadata.treatmentPillars.length > 0
    ? clinicMetadata.treatmentPillars
    : TREATMENT_PILLARS_FALLBACK;
  const standardPrinciples = clinicMetadata.standardPrinciples.length > 0
    ? clinicMetadata.standardPrinciples
    : STANDARD_PRINCIPLES_FALLBACK;
  const sectionCopy = clinicMetadata.sectionCopy;

  return (
    <>
      <JsonLdScript graph={graph} />

      {/* 좌측 플로팅 TOC — 위키/나무위키 패턴 (lg+ 만 표시) */}
      <FloatingTOC items={tocItems} />

      {/* === 1. Hero — 신수용 1인 노출 (사용자 결정 2026-05-20) === */}
      <Hero
        clinic={initial.clinic}
        cta={cta}
        doctors={data.doctors}
        location={initial.locationMain}
        secondaryCtaHref={`${baseHref}/doctors/shin-soo-yong`}
        secondaryCtaLabel="대표원장 자세히"
      />

      {/* === 2. 대표원장 이야기 (신수용 개인 페이지 컨셉, 사용자 결정 2026-05-20) === */}
      {data.doctors[0] ? (
        <DoctorIntroSection
          doctor={data.doctors[0]}
          hostOrigin={hostOrigin}
          intro={DOCTOR_INTRO_DATA}
        />
      ) : null}

      {/* === 3. 기사·논문·미디어 (구 § 7 신뢰 자료) — 개인 페이지 컨셉상 상단 이동 (사용자 결정 2026-05-20). id="media" → id="trust" === */}
      {hasTrustContent ? (
        <section id="trust" className="scroll-mt-32 border-t border-border/60 bg-subtle/50 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            {/* 3.1 기사 카드 캐러셀 */}
            {data.articles.length > 0 ? (
              <Reveal>
                <div id="trust-articles" className="scroll-mt-32">
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

            {/* 3.2 미디어 marquee */}
            {data.media.length > 0 ? (
              <Reveal delayMs={200}>
                <div id="trust-media" className="scroll-mt-32 mt-8">
                  <MediaShortsMarquee
                    eyebrow=""
                    title="미디어"
                    description="방송 · 유튜브 · 언론 인터뷰 — 신수용 대표원장의 실제 사례와 인사이트."
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
                        미디어 모두 보기
                      </PillLink>
                    }
                  />
                </div>
              </Reveal>
            ) : null}

            {/* 3.3 논문 */}
            {data.publications.length > 0 ? (
              <Reveal delayMs={280}>
                <div id="trust-papers" className="scroll-mt-32 mt-8">
                  <Card padding="lg" variant="tinted">
                    <div className="flex items-start gap-5">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-fg-inverse">
                        <iconify-icon icon="solar:diploma-verified-bold-duotone" width="28" />
                      </span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold tracking-tight text-ink-strong">논문</h3>
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

      {/* === 4. 소통 공간 — FAQ + 1:1 비밀 상담소 통합 (사용자 결정 2026-05-20) === */}
      <section id="community" className="scroll-mt-32 border-t border-border/60 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow="소통 공간"
              title="자주 묻는 질문"
              description={sectionCopy.communityDescription ?? "자주 묻는 질문은 아래에서 확인하시고, 개인 증상이나 비용 문의는 1:1 비밀 상담소로 전달해 주세요."}
            />
          </Reveal>

          {/* 4.1 FAQ accordion sub-block — sub-block 헤더 제거 (사용자 결정 2026-05-20). SectionHeading title 이 이미 "자주 묻는 질문". */}
          {faqAccordionItems.length > 0 ? (
            <Reveal delayMs={120}>
              <div id="community-faq" className="scroll-mt-32 mt-8">
                <FaqAccordion items={faqAccordionItems} />
                <p className="mt-6 text-center text-sm text-fg-muted">
                  찾으시는 답변이 없으신가요?{" "}
                  <a href="#community-1on1" className="font-medium text-brand-primary hover:underline">
                    1:1 비밀 상담소
                  </a>
                  로 직접 문의해 주세요.
                </p>
              </div>
            </Reveal>
          ) : null}

          {/* 4.2 1:1 비밀 상담소 sub-block */}
          <Reveal delayMs={180}>
            <div id="community-1on1" className="scroll-mt-32 mt-10 border-t border-border pt-8">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-bold tracking-tight text-ink-strong">1:1 비밀 상담소</h3>
                <span className="text-xs text-fg-muted">PRIVATE</span>
              </div>
              <div className="overflow-hidden rounded-2xl bg-elevated shadow-supanova ring-1 ring-border/60">
                <ul className="divide-y divide-border/60">
                  {consultations.length === 0 ? (
                    <li className="px-6 py-12 text-center text-sm text-fg-muted">아직 등록된 상담이 없습니다. 첫 상담을 시작해보세요.</li>
                  ) : consultations.map((c) => (
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
                            <h4 className="truncate text-sm font-medium text-ink-strong md:text-base">{c.title}</h4>
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
              <div className="mt-8 flex justify-center">
                <PillLink href={`${baseHref}/community/consultation`} variant="primary" size="md">
                  상담 글 작성하기
                </PillLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* === 5. 굿바이 다이어트 — 시그니처 프로그램 (사용자 결정 2026-05-20: 한의원 프로그램을 하단 배치, 원장 개인 컨텐츠 위쪽 강조) === */}
      {data.goodbyeDiet ? (
        <section id="goodbye-diet" className="scroll-mt-32 border-t border-border/60 bg-subtle/50 py-12 md:py-16">
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

      {/* === 6. 진료 철학 — 4 영역 카드 (한의원 차원 — 최하단 배치) === */}
      <section id="philosophy" className="scroll-mt-32 border-t border-border/60 bg-canvas py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
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

      {/* === 7. 예약 CTA — 마지막 작은 섹션 (위치 + 전화 + 채널). id="program-reservation" → id="reservation" === */}
      {showReservation ? (
        <section id="reservation" className="scroll-mt-32 bg-subtle/50 py-10 md:py-12">
          <div className="mx-auto max-w-6xl px-6">
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
