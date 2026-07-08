// @glitzy/web/components/site/SiteHeader — 신수용 대표원장 개인 페이지 navigation
// SoT: 사용자 요청 (2026-05-20) — 다이트 로고 제거, 텍스트 기반 개인 브랜딩.
// 패턴: standard sticky top · logo left · nav center · CTA + mobile hamburger right · L2 dropdown

"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteInitial } from "@/lib/site-initial";

// === 어드민 매핑 ===
//   좌측 브랜드: leadDoctor.name fallback "신수용"
//   메뉴: Home section anchors 중심 (대표원장 이야기 · 칼럼 · FAQ · 상담 · 프로그램)
//   CTA: clinic.primaryCtas[0]

type MenuItem =
  | { kind: "link"; href: string; label: string }
  | { kind: "dropdown"; label: string; children: Array<{ href: string; label: string }> };

function buildMenu(home: string): MenuItem[] {
  return [
    { kind: "link", href: `${home}#doctor-intro`, label: "소개" },
    { kind: "link", href: `${home}#doctor-cv`, label: "약력" },
    { kind: "link", href: `${home}#trust-articles`, label: "칼럼" },
    {
      kind: "dropdown",
      label: "소통 공간",
      children: [
        { href: `${home}#community-faq`, label: "자주 묻는 질문" },
        { href: `${home}#community-1on1`, label: "1:1 비밀 상담소" },
      ],
    },
    {
      kind: "dropdown",
      label: "콘텐츠",
      children: [
        { href: `${home}#trust-articles`, label: "기사 및 칼럼" },
        { href: `${home}#trust-media`, label: "미디어" },
        { href: `${home}#trust-papers`, label: "논문" },
      ],
    },
    { kind: "link", href: `${home}#goodbye-diet`, label: "굿바이 다이어트" },
    // "예약" link 제거 — 사용자 결정 2026-05-20 (헤더 안 예약 기능 불필요)
  ];
}

export function SiteHeader({ initial }: { initial: SiteInitial }) {
  // basePath 는 서버 계산값 (커스텀 도메인이면 "" — /<slug> 링크는 middleware 301 유발 금지)
  const home = initial.basePath || "/";
  const cta = initial.clinic.primaryCtas[0] ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const menu = buildMenu(home);

  // tenant-bleed fix (2026-07-08): 지점명·의료진 이름 하드코드/고정 폴백 제거 — 전부 인스턴스 데이터.
  // leadDoctor 있으면 개인 브랜드(한의사 {이름} + {기관명} {직함}), 없으면 기관 브랜드({기관명}).
  const lead = initial.leadDoctor;
  const clinicName = initial.clinic.name;
  const leadTitle = lead?.title || "대표원장";
  const ctaLabel = cta?.type === "phone" ? "예약하기" : cta?.label;

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
              href={home}
              aria-label={lead ? `${lead.name} ${leadTitle} 홈` : `${clinicName} 홈`}
              className="flex items-center transition-opacity duration-500 ease-supanova hover:opacity-80"
            >
              {lead ? (
                <span className="flex flex-col leading-tight">
                  <span className="font-serif-display text-base font-bold tracking-tight text-ink-strong md:text-lg">
                    한의사 {lead.name}
                  </span>
                  <span className="text-[10px] tracking-[0.08em] text-fg-muted md:text-[11px]">
                    {clinicName} {leadTitle}
                  </span>
                </span>
              ) : (
                <span className="font-serif-display text-base font-bold tracking-tight text-ink-strong md:text-lg">
                  {clinicName}
                </span>
              )}
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

          {/* === Right: 예약 CTA === */}
          <div className="flex items-center gap-2">
            {cta ? (
              <a
                href={cta.targetUrl}
                className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-fg-inverse transition-all duration-500 ease-supanova hover:scale-[1.02] active:scale-[0.98]"
              >
                {ctaLabel}
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
