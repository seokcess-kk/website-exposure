// @glitzy/web/components/site/DoctorIntroSection — 대표원장 이야기 (편집 매거진 톤)
// 사용자 결정 2026-05-20 — 신수용 대표원장 개인 페이지의 최상단 섹션.
// 출처: incheon.daeatdiet.com/bbs/content.php?co_id=05_02&me_code=5090

import { Reveal, SectionHeading } from "@/components/site/ui";
import { ArticleBody } from "@/components/site/ArticleBody";
import type { DoctorProjection } from "@/lib/db-projection";

export type DoctorIntroQuote = { text: string; caption?: string };

export type DoctorIntroData = {
  /** 메인 인용구 (영문 또는 한글 큰 따옴표 인용) */
  pullQuote?: DoctorIntroQuote;
  /** 본문 paragraph 배열 (markdown 가능) */
  paragraphs?: ReadonlyArray<string>;
  /** 핵심 메시지 카드 3-4개 (eyebrow + headline + body) */
  philosophyCards?: ReadonlyArray<{ eyebrow: string; headline: string; body: string }>;
};

export function DoctorIntroSection({
  doctor,
  hostOrigin,
  intro,
}: {
  doctor: DoctorProjection;
  hostOrigin: string;
  intro: DoctorIntroData;
}) {
  const fullTitle = doctor.title ? `${doctor.title} ${doctor.name}` : doctor.name;

  return (
    <section id="doctor-intro" className="scroll-mt-32 bg-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="DOCTOR'S STORY"
            title="대표원장 이야기"
            description={`${fullTitle}이 환자에게 전하는 진료 철학과 이야기입니다.`}
          />
        </Reveal>

        {/* Pull quote — 매거진 inline 인용 */}
        {intro.pullQuote ? (
          <Reveal delayMs={120}>
            <figure className="mx-auto mt-12 max-w-3xl text-center">
              <blockquote className="relative font-serif-display text-2xl leading-relaxed tracking-tight text-ink-strong md:text-3xl lg:text-4xl">
                <span aria-hidden className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif-display text-6xl text-brand-primary/30">
                  &ldquo;
                </span>
                {intro.pullQuote.text}
              </blockquote>
              {intro.pullQuote.caption ? (
                <figcaption className="mt-6 text-sm text-fg-muted">— {intro.pullQuote.caption}</figcaption>
              ) : null}
            </figure>
          </Reveal>
        ) : null}

        {/* 본문 paragraphs */}
        {intro.paragraphs && intro.paragraphs.length > 0 ? (
          <Reveal delayMs={180}>
            <div className="mx-auto mt-12 max-w-3xl">
              {intro.paragraphs.map((p, i) => (
                <p key={i} className="mt-5 whitespace-pre-line text-base leading-[1.85] text-fg-default md:text-lg first:mt-0">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* 진료 철학 3-4 카드 */}
        {intro.philosophyCards && intro.philosophyCards.length > 0 ? (
          <Reveal delayMs={240}>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {intro.philosophyCards.map((c) => (
                <div
                  key={c.headline}
                  className="rounded-2xl bg-subtle/60 p-6 ring-1 ring-border/40 transition-all duration-500 ease-supanova hover:bg-elevated hover:shadow-supanova"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-primary">
                    {c.eyebrow}
                  </span>
                  <h3 className="mt-3 font-serif-heading text-lg font-semibold leading-snug text-ink-strong">
                    {c.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* 약력 (doctor.bio markdown) */}
        {doctor.bio ? (
          <Reveal delayMs={300}>
            <div id="doctor-cv" className="scroll-mt-32 mx-auto mt-16 max-w-3xl border-t border-border pt-12">
              <h3 className="mb-6 text-eyebrow">CV · 약력</h3>
              <ArticleBody markdown={doctor.bio} hostOrigin={hostOrigin} />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
