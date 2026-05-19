// @glitzy/web/components/site/SiteHeader — 공개 사이트 헤더
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03

import Link from "next/link";
import type { SiteInitial } from "@/lib/site-initial";

export function SiteHeader({ initial }: { initial: SiteInitial }) {
  const base = `/${initial.instanceSlug}`;
  const cta = initial.clinic.primaryCtas[0];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-elevated/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href={base} className="flex items-center gap-3 hover:opacity-80" aria-label={`${initial.clinic.name} 홈`}>
          {initial.clinic.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={initial.clinic.logoUrl} alt="" className="h-9 w-auto" />
          ) : null}
          <span className="text-base font-semibold tracking-tight text-fg-default">{initial.clinic.name}</span>
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="hidden items-center gap-7 text-sm font-medium text-fg-muted md:flex">
            <li><Link href={`${base}/about`} className="hover:text-brand-primary">소개</Link></li>
            <li><Link href={`${base}/doctors`} className="hover:text-brand-primary">의료진</Link></li>
            <li><Link href={`${base}/treatments`} className="hover:text-brand-primary">진료</Link></li>
            <li><Link href={`${base}/contact`} className="hover:text-brand-primary">연락처</Link></li>
            <li><Link href={`${base}/locations/main`} className="hover:text-brand-primary">위치</Link></li>
          </ul>
        </nav>
        {cta ? (
          <a
            href={cta.targetUrl}
            className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-fg-inverse shadow-sm hover:bg-brand-primary-hover hover:shadow-md"
          >
            {cta.label}
          </a>
        ) : null}
      </div>
    </header>
  );
}
