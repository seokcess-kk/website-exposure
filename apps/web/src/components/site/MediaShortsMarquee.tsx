// @glitzy/web/components/site/MediaShortsMarquee — 미디어 출연 carousel (autoplay + nav button + hover preview)
// SoT: 사용자 요청 (2026-05-20)
//   1) Marquee → embla-carousel + autoplay (3.5s · loop · pause on hover)
//   2) 좌/우 nav button 안 carousel navigation
//   3) decoration SVG (squiggle · 우하단 curve) 안 제거 — 텍스트 가림 회피
//
// === 어드민 entity 매핑 ===
//   items: MediaAppearance (status='published')

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SectionHeading } from "@/components/site/ui";

export type MediaShortsItem = {
  id: string;
  thumbnail: string | null;
  title: string;
  channelName: string;
  channelType: "broadcast" | "youtube" | "podcast" | "press";
  href: string;
  externalUrl: string;
};

const CHANNEL_LABEL: Record<MediaShortsItem["channelType"], string> = {
  broadcast: "방송", youtube: "유튜브", podcast: "팟캐스트", press: "언론",
};

const CHANNEL_ICON: Record<MediaShortsItem["channelType"], string> = {
  broadcast: "solar:videocamera-record-bold",
  youtube: "solar:play-circle-bold",
  podcast: "solar:microphone-3-bold",
  press: "solar:document-text-bold",
};

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1]! : null;
}

export function MediaShortsMarquee({
  items,
  title = "미디어 출연",
  description = "방송 · 유튜브 · 언론 인터뷰 · 다이트한의원 의료진의 진짜 다이어트 이야기.",
  eyebrow = "미디어 출연",
  action,
}: {
  items: MediaShortsItem[];
  title?: string;
  description?: string;
  eyebrow?: string;
  // action: 헤더 우측 상단 슬롯 (예: "모두 보기" CTA). 있을 시 SectionHeading align="left", 모바일 안 stack.
  action?: ReactNode;
}) {
  const autoplay = useRef(Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, dragFree: false, containScroll: false },
    [autoplay.current],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (items.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="px-6">
          {action ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow={eyebrow} title={title} description={description} align="left" />
              <div className="shrink-0 md:pb-2">{action}</div>
            </div>
          ) : (
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          )}
        </div>

        {/* === Carousel viewport === */}
        <div className="relative mt-16">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 px-6 md:px-10">
              {items.map((m) => (
                <div key={m.id} className="min-w-0 flex-[0_0_70%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] xl:flex-[0_0_18%]">
                  <MediaCard item={m} />
                </div>
              ))}
            </div>
          </div>

          {/* === Nav button (좌·우) === */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="이전 영상"
            className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-elevated text-ink-strong shadow-supanova transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-30 md:left-6 md:h-14 md:w-14"
          >
            <iconify-icon icon="solar:alt-arrow-left-linear" width="24" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="다음 영상"
            className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-elevated text-ink-strong shadow-supanova transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-30 md:right-6 md:h-14 md:w-14"
          >
            <iconify-icon icon="solar:alt-arrow-right-linear" width="24" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MediaCard({ item }: { item: MediaShortsItem }) {
  const [hovered, setHovered] = useState(false);
  const videoId = item.channelType === "youtube" ? extractYouTubeVideoId(item.externalUrl) : null;
  const canPreview = videoId !== null;

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group/card flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-brand-primary-soft ring-1 ring-border/60 shadow-supanova">
        {/* === thumbnail === */}
        {item.thumbnail ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.thumbnail}
            alt={item.title}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-supanova ${
              hovered && canPreview ? "opacity-0" : "opacity-100 group-hover/card:scale-105"
            }`}
          />
        ) : (
          <div aria-hidden className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary-hover text-fg-inverse">
            <iconify-icon icon="solar:play-circle-bold-duotone" width="48" />
          </div>
        )}

        {/* === YouTube embed (hover · muted autoplay loop · 9:16 cover) === */}
        {/*
          YouTube embed iframe 안 16:9 default — 9:16 (Shorts) video 안 contain 시 좌우 black band 안.
          해결: iframe 안 height 100% + width 안 (height * 16/9) = container_w * (16/9)² ≈ 3.16배 안
          가운데 align + 가로 overflow hidden (container) — video 안 9:16 fit · 좌우 잘림.
        */}
        {hovered && canPreview ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="pointer-events-none absolute top-1/2 left-1/2 h-full -translate-x-1/2 -translate-y-1/2 border-0"
            style={{ width: "calc(100% * 16 / 9 * 16 / 9)" }}
          />
        ) : null}

        {/* === play overlay (default hover hint) === */}
        {!hovered && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-supanova group-hover/card:opacity-100">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-elevated/95 text-brand-primary shadow-supanova-lg backdrop-blur">
              <iconify-icon icon="solar:play-bold" width="22" />
            </span>
          </div>
        )}

        {/* === channel badge === */}
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-elevated/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary backdrop-blur">
          <iconify-icon icon={CHANNEL_ICON[item.channelType]} width="11" />
          {CHANNEL_LABEL[item.channelType]}
        </span>

        {/* === bottom overlay — preview 시 fade out === */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-3/5 transition-opacity duration-500 ease-supanova ${
            hovered && canPreview ? "opacity-30" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(to top, rgba(51, 0, 94, 0.95) 0%, rgba(51, 0, 94, 0.55) 50%, rgba(51, 0, 94, 0) 100%)",
          }}
        />
        <div
          className={`absolute inset-x-0 bottom-0 z-10 p-4 text-fg-inverse transition-opacity duration-500 ease-supanova ${
            hovered && canPreview ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-fg-inverse/75">
            {item.channelName}
          </div>
          {/* 2 line min-height reserve — 1줄/2줄 카드 안 동일 bottom 높이 유지 */}
          <h3 className="line-clamp-2 min-h-[2.625rem] text-sm font-bold leading-snug">{item.title}</h3>
        </div>
      </div>
    </Link>
  );
}
