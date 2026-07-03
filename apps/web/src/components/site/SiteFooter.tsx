// @glitzy/web/components/site/SiteFooter — Visa Design System footer pattern 정합 (사용자 요청 2026-05-20)
// 좌측 main column (로고 + 기관 정보 + copyright) + 우측 N link columns (h2 + ul) · gap-32

import Link from "next/link";
import type { SiteInitial } from "@/lib/site-initial";
import { formatAddress } from "@/lib/db-projection";
import { TrackedPhoneLink } from "@/components/site/TrackedPhoneLink";

type FooterColumn = {
  title: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
};

export function SiteFooter({ initial }: { initial: SiteInitial }) {
  const loc = initial.locationMain;
  // basePath 는 서버 계산값 (커스텀 도메인이면 "" — /<slug> 링크는 middleware 301 유발 금지)
  const base = initial.basePath;
  const cta = initial.clinic.primaryCtas[0] ?? null;
  const ctaLabel = cta?.type === "phone" ? "예약하기" : cta?.label;

  // === 어드민 매핑 ===
  //   col 1 (main)  ← clinic.logo · clinic.legalEntityName · clinic.businessRegistrationNumber · clinic.description
  //   col 2 (사이트) ← hardcoded (메뉴 패턴 정합)
  //   col 3 (정책)   ← LegalDocument 5종 (hardcoded slug)
  //   col 4 (연락처) ← LocationProfile(main) · telephone · email · address
  const columns: FooterColumn[] = [
    {
      title: "사이트",
      links: [
        { href: `${base}/about`, label: "진료 철학" },
        { href: `${base}/doctors`, label: "의료진" },
        { href: `${base}/treatments`, label: "진료" },
        { href: `${base}/community`, label: "소통 공간" },
        { href: `${base}/media-appearances`, label: "미디어" },
        { href: `${base}/publications`, label: "논문" },
      ],
    },
    {
      title: "정책",
      links: [
        { href: `${base}/legal/privacy`, label: "개인정보처리방침" },
        { href: `${base}/legal/terms`, label: "이용약관" },
        { href: `${base}/legal/non-covered`, label: "비급여 진료비 안내" },
        { href: `${base}/legal/refund`, label: "환불 규정" },
        { href: `${base}/legal/complaint`, label: "민원 처리" },
      ],
    },
  ];

  // 연락처 column 안 분리 (CTA 안 그 안 아래 안 함께 안 inline render 위해)
  const contactLinks: Array<{ href: string; label: string; external?: boolean }> = [];
  if (loc?.telephone) contactLinks.push({ href: `tel:${loc.telephone}`, label: `대표 전화 ${loc.telephone}` });
  if (loc?.email) contactLinks.push({ href: `mailto:${loc.email}`, label: loc.email });
  // NAVER_PLACE_PLAN v1.0 § 6.1 — 네이버 플레이스 link (외부 도메인 · 새 탭)
  if (initial.clinic.metadata.naverPlace?.placeUrl) {
    contactLinks.push({
      href: initial.clinic.metadata.naverPlace.placeUrl,
      label: "네이버 플레이스",
      external: true,
    });
  }

  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-t border-border bg-subtle/40">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* === Main column (좌측 · grow) === */}
          <div className="flex shrink-0 flex-col gap-6 lg:max-w-md lg:flex-1">
            <Link href={base || "/"} aria-label={`${initial.clinic.name} 홈`} className="inline-flex items-center transition-opacity duration-500 ease-supanova hover:opacity-80">
              {initial.clinic.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={initial.clinic.logoUrl} alt={`${initial.clinic.name} 로고`} loading="lazy" decoding="async" className="h-9 w-auto md:h-10" />
              ) : (
                <span className="font-serif-heading text-lg text-ink-strong">{initial.clinic.name}</span>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-fg-muted">
              본 사이트의 정보는 다이트한의원 인천 부평점의 진료 안내 목적으로 제공되며, 의료 행위 자체를 대체하지 않습니다.
              모든 진료는 의료진의 진찰 후 처방됩니다.
            </p>
            {(initial.clinic.legalEntityName || initial.clinic.businessRegistrationNumber || initial.clinic.founder) ? (
              <dl className="grid grid-cols-1 gap-1 text-xs text-fg-muted">
                {initial.clinic.legalEntityName ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0">법인명</dt>
                    <dd className="text-ink-strong">{initial.clinic.legalEntityName}</dd>
                  </div>
                ) : null}
                {initial.clinic.founder ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0">대표원장</dt>
                    <dd className="text-ink-strong">{initial.clinic.founder}</dd>
                  </div>
                ) : null}
                {initial.clinic.businessRegistrationNumber ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0">사업자등록번호</dt>
                    <dd className="text-ink-strong">{initial.clinic.businessRegistrationNumber}</dd>
                  </div>
                ) : null}
                {loc ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0">주소</dt>
                    <dd>
                      <Link
                        href={`${base}/contact`}
                        className="text-ink-strong transition-colors duration-500 ease-supanova hover:text-brand-primary hover:underline"
                      >
                        {formatAddress(loc)}
                      </Link>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
            <p className="text-xs text-fg-muted">
              © {year} {initial.clinic.name}. All rights reserved.
            </p>
          </div>

          {/* === Link columns (우측) === */}
          <div className="grid flex-1 grid-cols-2 gap-12 md:grid-cols-3 lg:gap-16">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-strong">{col.title}</h2>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.href}-${link.label}`}>
                      {link.external || link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? (
                        <a href={link.href} className="text-sm text-fg-muted transition-colors duration-500 ease-supanova hover:text-brand-primary">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-sm text-fg-muted transition-colors duration-500 ease-supanova hover:text-brand-primary">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* === 연락처 column (분리 · 안 ul 다음 안 CTA pill 안 inline) === */}
            {contactLinks.length > 0 ? (
              <div className="flex flex-col gap-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-strong">연락처</h2>
                <ul className="flex flex-col gap-4">
                  {contactLinks.map((link) => (
                    <li key={link.href}>
                      {link.href.startsWith("tel:") ? (
                        <TrackedPhoneLink
                          href={link.href}
                          ctaId="footer-call"
                          className="text-sm text-fg-muted transition-colors duration-500 ease-supanova hover:text-brand-primary"
                        >
                          {link.label}
                        </TrackedPhoneLink>
                      ) : link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-fg-muted transition-colors duration-500 ease-supanova hover:text-brand-primary"
                        >
                          {link.label} ↗
                        </a>
                      ) : (
                        <a href={link.href} className="text-sm text-fg-muted transition-colors duration-500 ease-supanova hover:text-brand-primary">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                {cta ? (
                  <a
                    href={cta.targetUrl}
                    className="mt-2 inline-flex w-fit items-center justify-center rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold text-fg-inverse transition-all duration-500 ease-supanova hover:scale-[1.02] hover:bg-brand-primary-hover active:scale-[0.98]"
                  >
                    {ctaLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
