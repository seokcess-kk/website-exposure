// @glitzy/web/components/site/Hero — Hero v2.2 (신수용 대표원장 개인 페이지 hero)
//
// 레퍼런스: incheon.daeatdiet.com Hero + 사용자 제공 FinancialHero React 컴포넌트.
// 핵심: 좌측 헤드라인/설명/CTA · 우측 의료진 사진 stacked carousel (활성 1장 + 뒤 흐릿한 사진 + 4.5초 자동 회전)
//
// === 어드민 entity 매핑 (템플릿 SoT) ===
//   title      ← clinic.slogan (없으면 clinic.name)
//   subtitle   ← clinic.name (slogan 사용 시 sub)
//   description ← clinic.description
//   buttonText ← clinic.primaryCtas[0].label
//   buttonLink ← clinic.primaryCtas[0].targetUrl
//   imageUrls  ← doctors[0..2].photoUrl (최대 3명) · 4.5초마다 활성 카드 순환 (prefers-reduced-motion 시 중단)
//                — 1명만 있을 때는 단일 카드, doctors 0명 시 clinic.logoUrl fallback.
//   이렇게 매핑되어 있어 어드민 안 ClinicProfile · DoctorProfile 만 입력하면 Hero 자동 생성됨.

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ClinicProjection, PrimaryCta, DoctorProjection, LocationProjection } from "@/lib/db-projection";
import { PillAnchor } from "@/components/site/ui";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/site-tracking/beacon";
import { extractLocalModifier } from "@/lib/local-keywords";

// === Carousel 안 slot 정의 (diff = (i - activeIdx + N) % N) ===
//   diff 0 = 활성 (정면, 불투명) · diff 1 = 다음 (살짝 뒤, 반투명+blur) · diff 2 = 그 다음 (더 뒤)
const CAROUSEL_INTERVAL_MS = 4500;
const CARD_SLOTS: ReadonlyArray<{ x: number; rotate: number; scale: number; opacity: number; filter: string }> = [
  { x: -32, rotate: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
  { x: 72, rotate: -6, scale: 0.94, opacity: 0.46, filter: "blur(1.5px)" },
  { x: 132, rotate: -12, scale: 0.88, opacity: 0.22, filter: "blur(3px)" },
];
const CARD_SLOT_HIDDEN = { x: 200, rotate: -18, scale: 0.85, opacity: 0, filter: "blur(4px)" };
// zIndex 는 framer-motion animate property 안 두지 않고 inline style 안 따로 (motion 보간 충돌 회피)
const CARD_Z_INDEX = [30, 20, 10] as const;

function getCardSlot(diff: number) {
  return CARD_SLOTS[diff] ?? CARD_SLOT_HIDDEN;
}
function getCardZIndex(diff: number) {
  return CARD_Z_INDEX[diff] ?? 0;
}

export type HeroProps = {
  clinic: ClinicProjection;
  cta: PrimaryCta | null;
  doctors: DoctorProjection[];  // active 의료진 — 최대 2명까지 우측 카드 사용
  location?: LocationProjection | null;  // 본원 — 신뢰 라인 안 도시/전화 노출 (있을 때만)
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  className?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const carouselContainerVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

export function Hero({
  clinic,
  cta,
  doctors,
  location,
  secondaryCtaHref,
  secondaryCtaLabel,
  className,
}: HeroProps) {
  // === 어드민 매핑 ===
  const leadDoctor = doctors[0] ?? null;
  // 지역 토큰 — clinic.metadata.localKeywords[0] 첫 단어 (예: "부평 다이어트 한의원" → "부평").
  // 네이버 웹문서는 h1-키워드 정합 비중이 커서 h1 에 지역 신호 주입 (규칙 SoT: lib/local-keywords.ts).
  const modifier = extractLocalModifier(clinic.metadata.localKeywords);
  const regionToken = modifier && !"다이어트 한방 진료".includes(modifier) ? modifier : null;
  const headline = leadDoctor
    ? `${leadDoctor.name} 대표원장의\n${regionToken ? `${regionToken} ` : ""}다이어트 한방 진료`
    : (clinic.slogan && clinic.slogan.trim().length > 0 ? clinic.slogan : clinic.name);
  const sub = leadDoctor ? `한의사 ${leadDoctor.name} · 다이트한의원 인천 부평점` : clinic.name;
  const description = leadDoctor
    ? "단순한 체중 감량보다 환자의 생활과 마음을 함께 듣습니다. 체질 진단, 맞춤 처방, 사후 관리까지 신수용 대표원장이 직접 설명하는 다이어트 진료 이야기입니다."
    : clinic.description;
  const buttonText = cta?.label ?? "예약 문의";
  const buttonLink = cta?.targetUrl ?? "#contact";

  // 의료진 사진 (최대 3장) · 모두 fallback 시 logoUrl 안 단일 카드
  const heroImages: Array<{ src: string; alt: string }> = [];
  for (const d of doctors.slice(0, 3)) {
    if (d.photoUrl) heroImages.push({ src: d.photoUrl, alt: `${d.name} ${d.title ?? ""}`.trim() });
  }
  if (heroImages.length === 0 && clinic.logoUrl) {
    heroImages.push({ src: clinic.logoUrl, alt: `${clinic.name} 로고` });
  }

  // === Stacked auto-rotating carousel state ===
  //   reducedMotion 사용자도 carousel 자체는 동작 (사이트 UX 의도 정합) — transition duration 만 짧게
  const [activeIdx, setActiveIdx] = useState(0);
  const reducedMotion = useReducedMotion();
  const carouselTransitionDuration = reducedMotion ? 0.3 : 0.9;
  useEffect(() => {
    if (heroImages.length < 2) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % heroImages.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(id);
    // heroImages.length 만 deps — heroImages 자체는 매 렌더 새 배열 (reference 변경) → 길이 기반 비교
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroImages.length]);

  // grid background (border token CSS var 정합)
  const gridBackgroundStyle = {
    backgroundImage:
      "linear-gradient(var(--color-border-default) 1px, transparent 1px), linear-gradient(to right, var(--color-border-default) 1px, transparent 1px)",
    backgroundSize: "3rem 3rem",
  };

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-canvas text-fg-default",
        className,
      )}
    >
      {/* === 배경 layer === */}
      <div aria-hidden className="absolute inset-0 opacity-15" style={gridBackgroundStyle} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/95 to-canvas" />
      <div
        aria-hidden
        className="supanova-float pointer-events-none absolute -left-32 top-20 h-[28rem] w-[28rem] rounded-full bg-brand-primary-soft opacity-25 blur-3xl"
      />
      <div
        aria-hidden
        className="supanova-float pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-secondary opacity-8 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <motion.div
        className="relative mx-auto flex min-h-[68vh] max-w-6xl flex-col items-center justify-between gap-10 px-6 py-16 md:py-20 lg:flex-row lg:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* === 좌측: 텍스트 === */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2">
          <motion.span id="hero-sub-badge" variants={itemVariants} className="text-eyebrow mb-5">
            <iconify-icon icon="solar:user-id-bold" width="14" />
            {sub}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="whitespace-pre-line font-serif-display text-4xl tracking-tightest text-ink-strong md:text-5xl"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl whitespace-pre-line text-base leading-[1.75] text-fg-muted md:text-lg"
          >
            {description}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <PillAnchor
              href={buttonLink}
              variant="primary"
              size="lg"
              onClick={() => trackEvent("booking_click", { cta_id: "hero-booking" })}
            >
              {buttonText}
            </PillAnchor>
            {secondaryCtaHref ? (
              <PillAnchor href={secondaryCtaHref} variant="secondary" size="lg">
                {secondaryCtaLabel ?? "원장 소개 보기"}
              </PillAnchor>
            ) : null}
          </motion.div>

          {/* 신뢰 라인 — 원장명 · 위치 · 전화 (있을 때만 노출) */}
          {(doctors[0] || location) ? (
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-fg-muted lg:justify-start"
            >
              {doctors[0] ? (
                <span className="inline-flex items-center gap-2">
                  <iconify-icon icon="solar:user-circle-bold-duotone" width="18" className="text-brand-primary" />
                  <span className="text-eyebrow !bg-transparent !p-0">대표원장</span>
                  <span className="font-semibold text-ink-strong">{doctors[0].name}</span>
                </span>
              ) : null}
              {(location?.addressRegion || location?.addressLocality) ? (
                <span className="inline-flex items-center gap-2">
                  <iconify-icon icon="solar:map-point-bold-duotone" width="18" className="text-brand-primary" />
                  <span>
                    {location?.addressRegion ?? ""}
                    {location?.addressRegion && location?.addressLocality ? " " : ""}
                    {location?.addressLocality ?? ""}
                  </span>
                </span>
              ) : null}
              {location?.telephone ? (
                <span className="inline-flex items-center gap-2">
                  <iconify-icon icon="solar:phone-calling-bold-duotone" width="18" className="text-brand-primary" />
                  <a
                    href={`tel:${location.telephone}`}
                    className="font-semibold text-ink-strong hover:text-brand-primary"
                    onClick={() => trackEvent("phone_click", { cta_id: "hero-call" })}
                  >
                    {location.telephone}
                  </a>
                </span>
              ) : null}
            </motion.div>
          ) : null}
        </div>

        {/* === 우측: 의료진 사진 stacked auto-rotating carousel === */}
        <motion.div
          className="relative flex h-[28rem] w-full items-center justify-center md:h-[32rem] lg:h-[36rem] lg:w-1/2"
          variants={carouselContainerVariants}
        >
          {heroImages.length === 0 ? null : heroImages.length === 1 ? (
            // 단일 카드 (의료진 1명 또는 logo fallback) — 정적 fade-in
            <motion.img
              src={heroImages[0]!.src}
              alt={heroImages[0]!.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              className="relative h-[26rem] w-72 rounded-3xl object-cover shadow-supanova-lg ring-1 ring-border/40 md:h-[30rem] md:w-80 lg:h-[34rem] lg:w-96"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            // 다중 카드 — stacked carousel · 활성(diff 0) 불투명 + 뒤 카드(diff 1,2) 반투명+blur
            heroImages.map((img, i) => {
              const diff = (i - activeIdx + heroImages.length) % heroImages.length;
              const slot = getCardSlot(diff);
              const isActive = diff === 0;
              return (
                <motion.img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  initial={{ opacity: 0, x: 60, rotate: -6, scale: 0.95, filter: "blur(2px)" }}
                  // spread 안 새 object 안 framer-motion 변경 인식 보장
                  animate={{
                    x: slot.x,
                    rotate: slot.rotate,
                    scale: slot.scale,
                    opacity: slot.opacity,
                    filter: slot.filter,
                  }}
                  transition={{ duration: carouselTransitionDuration, ease: [0.16, 1, 0.3, 1] }}
                  style={{ zIndex: getCardZIndex(diff) }}
                  className="absolute h-[26rem] w-72 rounded-3xl object-cover shadow-supanova-lg ring-1 ring-border/40 md:h-[30rem] md:w-80 lg:h-[34rem] lg:w-96"
                  loading={isActive ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={isActive ? "high" : "low"}
                  aria-hidden={!isActive}
                />
              );
            })
          )}

          {/* 라벤더 halo glow (cream 안 10% 한정 정합) */}
          <div aria-hidden className="supanova-float pointer-events-none absolute -inset-8 -z-10 rounded-full bg-brand-secondary/15 blur-3xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}
