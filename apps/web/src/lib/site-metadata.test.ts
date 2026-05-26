// PUBLIC_SITE_RENDER_PLAN v1.0 § 7 시나리오 LOCAL_PASS — Next metadata
// 시나리오 #21 themeColor 2값 · #22 og:type P-004 profile · P-006/P-010 article · #23 P-013 noindex

import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ClinicProjection } from "./db-projection";

// site-url.ts 의 headers() (Next request scope) 를 mock — vitest node env
vi.mock("next/headers", () => ({
  headers: () => ({
    get: (k: string) => {
      if (k === "host") return "example.com";
      if (k === "x-forwarded-proto") return "https";
      return null;
    },
  }),
}));

import { buildPageMetadata } from "./site-metadata";

const CLINIC: ClinicProjection = {
  name: "Glitzy",
  description: "샘플 클리닉 설명 문장.",
  longDescription: null,
  slogan: null,
  logoUrl: "https://example.com/logo.png",
  ogImageUrl: "https://example.com/og.png",
  legalEntityName: null,
  founder: null,
  foundingDate: null,
  businessRegistrationNumber: null,
  primaryCtas: [],
  brandTokens: null,
  metadata: { treatmentPillars: [], standardPrinciples: [], keyStats: [], systemStrengths: [], sectionCopy: {}, localKeywords: [] },
  updatedAt: new Date(),
};

describe("buildPageMetadata (시나리오 #21 themeColor + #22 og:type + #23 noindex)", () => {
  beforeEach(() => {
    delete process.env.PUBLIC_SITE_ORIGIN;
  });

  it("themeColor 2값 (light + dark) 출력 (#21)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", { pageTitle: "테스트" });
    expect(meta.themeColor).toEqual([
      { media: "(prefers-color-scheme: light)", color: "#2563eb" },
      { media: "(prefers-color-scheme: dark)", color: "#60a5fa" },
    ]);
  });

  it("og:type P-004 profile 매핑 (#22)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", {
      pageTitle: "홍길동", ogType: "profile", canonicalPath: "/doctors/hong",
    });
    expect((meta.openGraph as { type?: string }).type).toBe("profile");
  });

  it("og:type P-006 article 매핑 (#22)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", {
      pageTitle: "굿바이 다이어트", ogType: "article", canonicalPath: "/treatments/diet",
    });
    expect((meta.openGraph as { type?: string }).type).toBe("article");
  });

  it("og:type P-010 article 매핑 (#22)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", {
      pageTitle: "요요 방지", ogType: "article", canonicalPath: "/insights/general/yoyo",
    });
    expect((meta.openGraph as { type?: string }).type).toBe("article");
  });

  it("P-013 Legal noindex (#23)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", {
      pageTitle: "개인정보처리방침", canonicalPath: "/legal/privacy", noindex: true,
    });
    expect((meta.robots as { index?: boolean }).index).toBe(false);
    expect((meta.robots as { follow?: boolean }).follow).toBe(true);
  });

  it("canonical 은 request-aware absolute URL (PSRC-08)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", {
      pageTitle: "About", canonicalPath: "/about",
    });
    expect((meta.alternates as { canonical?: string }).canonical).toBe("https://example.com/glitzy-clinic/about");
  });

  it("PUBLIC_SITE_ORIGIN env 우선 (PSRC-09)", () => {
    process.env.PUBLIC_SITE_ORIGIN = "https://prod.glitzy.kr";
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", {
      pageTitle: "About", canonicalPath: "/about",
    });
    expect((meta.alternates as { canonical?: string }).canonical).toBe("https://prod.glitzy.kr/glitzy-clinic/about");
  });

  it("title 패턴 `${pageTitle} | ${clinic.name}` (P-001 외)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", { pageTitle: "소개" });
    expect(meta.title).toBe("소개 | Glitzy");
  });
});
