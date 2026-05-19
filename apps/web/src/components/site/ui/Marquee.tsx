// @glitzy/web/components/site/ui/Marquee — 자체 horizontal infinite scroll
// CSS keyframes 안 GPU-safe (transform translateX) + hover pause + duplicate children 안 seamless loop.

"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export type MarqueeProps = {
  children: ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  /** scroll 속도 (s · 한 cycle 시간). 기본 40s */
  durationS?: number;
  /** gap between items (rem). 기본 1.5 */
  gapRem?: number;
  className?: string;
};

export function Marquee({
  children,
  pauseOnHover = true,
  reverse = false,
  durationS = 40,
  gapRem = 1.5,
  className = "",
}: MarqueeProps) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`group/marquee relative flex w-full overflow-hidden ${className}`}
      style={{ ["--marquee-gap" as string]: `${gapRem}rem` }}
    >
      <style jsx>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - ${gapRem / 2}rem)); }
        }
        @keyframes marquee-scroll-reverse {
          from { transform: translateX(calc(-50% - ${gapRem / 2}rem)); }
          to { transform: translateX(0); }
        }
        .marquee-track {
          display: flex;
          gap: ${gapRem}rem;
          animation: ${reverse ? "marquee-scroll-reverse" : "marquee-scroll"} ${durationS}s linear infinite;
          will-change: transform;
        }
        .group\\/marquee:hover .marquee-track.pause-on-hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
      <div
        ref={ref}
        className={`marquee-track ${pauseOnHover ? "pause-on-hover" : ""}`}
        suppressHydrationWarning={!mounted}
      >
        {children}
        {/* duplicate set for seamless loop (aria-hidden — screen reader 안 중복 회피) */}
        <div className="flex shrink-0" style={{ gap: `${gapRem}rem` }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
