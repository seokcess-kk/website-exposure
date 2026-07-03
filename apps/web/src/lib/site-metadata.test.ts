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
  faviconUrl: null,
  legalEntityName: null,
  founder: null,
  foundingDate: null,
  businessRegistrationNumber: null,
  naverSiteVerification: null,
  primaryCtas: [],
  brandTokens: null,
  metadata: { treatmentPillars: [], standardPrinciples: [], keyStats: [], systemStrengths: [], sectionCopy: {}, localKeywords: [], naverPlace: null },
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

  it("긴 clinic.description 은 80자 이내 첫 완결 문장으로 clamp (네이버 설명 권장)", () => {
    const longClinic: ClinicProjection = {
      ...CLINIC,
      description:
        "다이트한의원은 단순한 체중 감량이 아닌 건강한 몸의 회복을 목표로 합니다. 환자 한 분 한 분의 체질을 진단하고, 그에 맞춘 한약 처방·약침·코칭을 통해 무리 없는 다이어트를 약속합니다.",
    };
    const meta = buildPageMetadata(longClinic, "glitzy-clinic", { pageTitle: "홈" });
    expect((meta.description as string).length).toBeLessThanOrEqual(80);
    expect(meta.description).toBe("다이트한의원은 단순한 체중 감량이 아닌 건강한 몸의 회복을 목표로 합니다.");
    // og:description 도 동일 clamp
    expect((meta.openGraph as { description?: string }).description).toBe(meta.description);
  });

  it("지역 키워드 pageTitle → `${키워드} | ${brand}` 조합 (홈 SEO title)", () => {
    const meta = buildPageMetadata(CLINIC, "glitzy-clinic", { pageTitle: "부평 다이어트 한의원" });
    expect(meta.title).toBe("부평 다이어트 한의원 | Glitzy");
  });
});
