// @glitzy/web/components/site/SiteHeader — 다이트 브랜드 horizontal navigation
// SoT: 사용자 요청 (Visa Design System horizontal nav 패턴 정합 + 다이트 로고/메뉴)
// 패턴: standard sticky top · logo left · nav center · CTA + mobile hamburger right · L2 dropdown

"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteInitial } from "@/lib/site-initial";

// === 어드민 매핑 ===
//   로고: clinic.logoUrl (어드민 ClinicProfile.logo_url 입력 시 자동 swap)
//   메뉴: 사용자 확정 (진료 철학 · 의료진 · 진료 · 소통 공간 · 미디어 출연 · 굿바이 다이어트)
//   CTA: clinic.primaryCtas[0]

type MenuItem =
  | { kind: "link"; href: string; label: string }
  | { kind: "dropdown"; label: string; children: Array<{ href: string; label: string }> };

function buildMenu(base: string): MenuItem[] {
  return [
    { kind: "link", href: `${base}/about`, label: "진료 철학" },
    { kind: "link", href: `${base}/doctors`, label: "의료진" },
    { kind: "link", href: `${base}/treatments`, label: "진료" },
    {
      kind: "dropdown",
      label: "굿바이 다이어트",
      children: [
        { href: `${base}/treatments/goodbye-diet`, label: "프로그램 소개" },
        { href: `${base}#principles`, label: "프로그램 3원칙" },
        { href: `${base}/#program-reservation`, label: "예약 안내" },
      ],
    },
    {
      kind: "dropdown",
      label: "소통 공간",
      children: [
        { href: `${base}/faq`, label: "자주 묻는 질문" },
        { href: `${base}/community/consultation`, label: "1:1 비밀 상담소" },
      ],
    },
    // 신뢰 자료 묶음 — 메인페이지 § 7 신뢰 자료 섹션과 1:1 정합 (사용자 검수 2026-05-20)
    {
      kind: "dropdown",
      label: "콘텐츠",
      children: [
        { href: `${base}/insights`, label: "기사 및 칼럼" },
        { href: `${base}/media-appearances`, label: "미디어 출연" },
        { href: `${base}/publications`, label: "참여 논문" },
      ],
    },
  ];
}

export function SiteHeader({ initial }: { initial: SiteInitial }) {
  const base = `/${initial.instanceSlug}`;
  const cta = initial.clinic.primaryCtas[0];
  const [mobileOpen, setMobileOpen] = useState(false);
  const menu = buildMenu(base);

  // 다이트한의원 인천 부평점 로고 (사용자 지정 — 2026-05-20)
  const logoUrl = initial.clinic.logoUrl || "https://incheon.daeatdiet.com/theme/daeat/common/images/logo_new.png";

  return (
    <>
      <a
        href="#main"
        className="sr-only fixed left-2 top-2 z-[100] focus:not-sr-only focus:rounded-full focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg-inverse"
      >
        본문 바로가기
      </a>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
          {/* === Left: 모바일 hamburger + 로고 === */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-fg-default transition-all duration-500 ease-supanova hover:bg-brand-primary-soft lg:hidden"
            >
              <iconify-icon icon={mobileOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"} width="24" />
            </button>
            <Link
              href={base}
              aria-label={`${initial.clinic.name} 홈`}
              className="flex items-center transition-opacity duration-500 ease-supanova hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={`${initial.clinic.name} 로고`}
                className="h-10 w-auto md:h-11"
              />
            </Link>
          </div>

          {/* === Center/Right: desktop nav === */}
          <nav aria-label="주요 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menu.map((item) =>
                item.kind === "link" ? (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <NavDropdown key={item.label} label={item.label} children={item.children} />
                ),
              )}
            </ul>
          </nav>

          {/* === Right: CTA + 알림(검수 큐 placeholder · admin 전용 hide) === */}
          <div className="flex items-center gap-2">
            {cta ? (
              <a
                href={cta.targetUrl}
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-fg-inverse transition-all duration-500 ease-supanova hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="hidden sm:inline">{cta.label}</span>
                <span className="sm:hidden">예약</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* === 모바일 메뉴 (전체화면 stagger reveal) === */}
        {mobileOpen ? (
          <div className="border-t border-border bg-canvas/95 backdrop-blur-md lg:hidden">
            <nav aria-label="모바일 메뉴" className="mx-auto max-w-7xl px-4 py-4">
              <ul className="flex flex-col gap-1">
                {menu.map((item) =>
                  item.kind === "link" ? (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base font-medium text-fg-default transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label} className="rounded-xl bg-subtle/40 p-2">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                        {item.label}
                      </div>
                      <ul className="mt-1 flex flex-col gap-0.5">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-fg-default transition-all duration-500 ease-supanova hover:bg-elevated hover:text-brand-primary"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}

// === Desktop dropdown (hover + focus 둘 다 trigger) ===
function NavDropdown({
  label,
  children,
}: {
  label: string;
  children: Array<{ href: string; label: string }>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          // dropdown 안 child 안 focus 시 안 닫기
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) setOpen(false);
        }}
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary"
      >
        {label}
        <iconify-icon
          icon="solar:alt-arrow-down-linear"
          width="14"
          className={`transition-transform duration-500 ease-supanova ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
          <ul className="min-w-[14rem] rounded-2xl border border-border/60 bg-elevated p-1.5 shadow-supanova-lg ring-1 ring-border/40">
            {children.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-sm text-fg-default transition-all duration-500 ease-supanova hover:bg-brand-primary-soft hover:text-brand-primary"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}
