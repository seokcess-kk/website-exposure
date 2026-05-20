// @glitzy/web/components/site/ArticleCarousel — Gallery4 패턴 정합 (사용자 제공 코드)
// SoT: 사용자 요청 (2026-05-20) — "기사 및 칼럼" 섹션 안 carousel 적용.
//
// === 어드민 entity 매핑 ===
//   items: Article (status='published') · 최신순
//   - id ← article.slug
//   - title ← article.headline
//   - description ← article.summary
//   - href ← `${baseHref}/insights/general/${slug}`
//   - image ← article.heroImageUrl (fallback brand gradient)

"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { SectionHeading } from "@/components/site/ui";

export type ArticleCarouselItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string | null;
  externalUrl?: string | null;
};

export type ArticleCarouselProps = {
  title?: string;
  description?: string;
  items: ArticleCarouselItem[];
};

export function ArticleCarousel({
  title = "기사 및 칼럼",
  description = "의료진이 직접 작성한 인사이트 — 학술 근거와 임상 경험 기반.",
  items,
  eyebrow = "기사 및 칼럼",
  action,
}: ArticleCarouselProps & { eyebrow?: string; action?: ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-6">
        {action ? (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} align="left" />
            <div className="shrink-0 md:pb-2">{action}</div>
          </div>
        ) : (
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        )}

        <div className="mt-8 flex justify-center gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="이전 슬라이드"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-elevated text-ink-strong transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="22" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="다음 슬라이드"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-elevated text-ink-strong transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <iconify-icon icon="solar:alt-arrow-right-linear" width="22" />
          </button>
        </div>
      </div>

      {/* embla viewport — page container width 와 동일하게 정렬 */}
      <div className="relative mx-auto mt-6 max-w-6xl overflow-hidden px-6" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_calc((100%_-_1.5rem)/2)] lg:flex-[0_0_calc((100%_-_3rem)/3)]"
            >
              <ArticleCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* dot pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-2 rounded-full transition-all duration-500 ease-supanova ${
              currentSlide === index ? "w-8 bg-brand-primary" : "w-2 bg-brand-primary/20"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`${index + 1}번째 슬라이드로 이동`}
          />
        ))}
      </div>
    </section>
  );
}

function ArticleCard({ item }: { item: ArticleCarouselItem }) {
  // external_url 우선 — 다이트 보도 자료 안 외부 매체 안 새 탭 안 open
  const isExternal = Boolean(item.externalUrl);
  const targetHref = item.externalUrl ?? item.href;
  const CardWrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a
        href={targetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        {children}
      </a>
    ) : (
      <Link href={targetHref} className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
        {children}
      </Link>
    );

  return (
    <CardWrapper>
      <div className="relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-2xl md:aspect-[5/4] lg:aspect-[16/9]">
        {item.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-supanova group-hover:scale-105"
          />
        ) : (
          // 다이트 brand color gradient placeholder
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary-hover" />
        )}
        {/* purple-to-transparent overlay (브랜드 #501A84 정합) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(51, 0, 94, 0.92) 0%, rgba(51, 0, 94, 0.5) 45%, rgba(51, 0, 94, 0) 100%)",
          }}
        />
        {/* 외부 link hint badge (보도 자료) */}
        {isExternal ? (
          <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-canvas/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary backdrop-blur">
            <iconify-icon icon="solar:arrow-right-up-bold" width="11" />
            언론 보도
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-fg-inverse md:p-8">
          <h3 className="mb-3 line-clamp-3 text-xl font-bold leading-snug md:text-2xl">{item.title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-fg-inverse/85 md:text-base">{item.description}</p>
        </div>
      </div>
    </CardWrapper>
  );
}
