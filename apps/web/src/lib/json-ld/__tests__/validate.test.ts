// PUBLIC_SITE_RENDER_PLAN v1.0 § 7 시나리오 LOCAL_PASS 검증 — JSON-LD rule checker
// 시나리오 #10 페이지별 entity 풀/참조 + #18 자체 rule checker

import { describe, it, expect } from "vitest";
import {
  homeGraph,
  aboutGraph,
  doctorsListGraph,
  doctorProfileGraph,
  treatmentsListGraph,
  treatmentDetailGraph,
  articleDetailGraph,
  contactGraph,
  locationDetailGraph,
} from "../builders";
import { validateJsonLdGraph, validateExpectedEntities } from "./validate";
import type { GraphBuilderContext } from "../types";
import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  TreatmentProjection,
  ArticleProjection,
} from "@/lib/db-projection";

const SITE_BASE_URL = "https://example.com/glitzy-clinic";
const CTX: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/" };

const CLINIC: ClinicProjection = {
  name: "Glitzy Clinic",
  description: "샘플 클리닉 설명 문장. 검색·AEO 노출 목적의 자체 미디어 사이트.",
  longDescription: "긴 설명",
  slogan: "근본부터 바꾸는 한의학",
  logoUrl: "https://example.com/logo.png",
  ogImageUrl: "https://example.com/og.png",
  faviconUrl: null,
  legalEntityName: "주식회사 글리치",
  founder: "홍길동",
  foundingDate: "2024-01-01",
  businessRegistrationNumber: "123-45-67890",
  naverSiteVerification: null,
  primaryCtas: [
    { id: "phone-1", type: "phone", label: "전화 예약", targetUrl: "tel:+82-2-1234-5678" },
    { id: "kakao-talk-1", type: "kakao-talk", label: "카카오 상담", targetUrl: "https://pf.kakao.com/_demo" },
  ],
  brandTokens: null,
  metadata: { treatmentPillars: [], standardPrinciples: [], keyStats: [], systemStrengths: [], sectionCopy: {}, localKeywords: [], naverPlace: null },
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

const LOCATION: LocationProjection = {
  slug: "main",
  name: "본원",
  streetAddress: "테스트로 1",
  addressLocality: "강남구",
  addressRegion: "서울특별시",
  postalCode: "06000",
  addressCountry: "KR",
  latitude: 37.5,
  longitude: 127.0,
  telephone: "02-1234-5678",
  email: "info@example.com",
  businessHours: {
    openingHours: [{ dayOfWeek: ["Monday", "Tuesday"], opens: "09:30", closes: "18:30" }],
    receptionHours: [],
    lunchBreaks: [{ dayOfWeek: ["Monday", "Tuesday"], from: "13:00", to: "14:00" }],
    specialClosures: [],
  },
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

const DOCTOR: DoctorProjection = {
  slug: "hong",
  name: "홍길동",
  title: "대표원장",
  jobTitle: "한의학 박사",
  honorific: null,
  bio: "원장 소개",
  photoUrl: "https://example.com/hong.png",
  cvPhotoUrl: null,
  displayOrder: 0,
  active: true,
  metadata: { credentials: [], medicalSpecialties: [] },
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

const TREATMENT: TreatmentProjection = {
  slug: "diet",
  name: "굿바이 다이어트",
  summary: "체질 진단 기반 한방 다이어트 프로그램입니다. 본 페이지는 시술의 적응증·과정·예약 안내를 제공합니다.",
  body: "## 핵심\n\n3원칙 ...",
  heroImageUrl: "https://example.com/diet.png",
  pillarSlug: null,
  principles: [],
  publishedAt: new Date("2026-05-18T00:00:00Z"),
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

const ARTICLE: ArticleProjection = {
  slug: "yoyo",
  headline: "요요 방지 5가지",
  summary: "요요를 방지하는 5가지 핵심 원칙을 정리한 한방 인사이트 글입니다. 본 글은 임상 관찰과 학술 근거를 함께 다룹니다.",
  body: "본문 ...",
  heroImageUrl: "https://example.com/yoyo.png",
  externalUrl: null,
  publishedAt: new Date("2026-05-18T00:00:00Z"),
  authorDoctorId: "00000000-0000-0000-0000-000000000001",
  categoryId: "00000000-0000-0000-0000-0000000000c0",
  categorySlug: "general",
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

describe("JSON-LD rule checker (시나리오 #18 LOCAL_PASS)", () => {
  it("Home graph PASS — Organization · MedicalClinic · WebSite · WebPage 모두 풀 entity", () => {
    const graph = homeGraph(CTX, CLINIC, LOCATION);
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "MedicalClinic", "WebSite", "WebPage"])).toEqual({ ok: true });
  });

  it("About graph PASS — Organization · MedicalClinic · WebPage · BreadcrumbList", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/about" };
    const graph = aboutGraph(ctx, CLINIC, LOCATION, "소개 | Glitzy", CLINIC.description);
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "MedicalClinic", "WebPage", "BreadcrumbList"])).toEqual({ ok: true });
  });

  it("Doctors List graph PASS — Organization 풀 + MedicalClinic 참조 (graph 밖) + ItemList(Physician)", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/doctors" };
    const graph = doctorsListGraph(ctx, CLINIC, [DOCTOR], "의료진");
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "WebPage", "BreadcrumbList", "ItemList"])).toEqual({ ok: true });
  });

  it("Doctor Profile graph PASS — Physician 풀", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/doctors/hong" };
    const graph = doctorProfileGraph(ctx, CLINIC, DOCTOR, "홍길동 원장");
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "Physician", "WebPage", "BreadcrumbList"])).toEqual({ ok: true });
  });

  it("Treatments List graph PASS — Organization + ItemList(MedicalProcedure)", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/treatments" };
    const graph = treatmentsListGraph(ctx, CLINIC, [TREATMENT], "진료");
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "WebPage", "BreadcrumbList", "ItemList"])).toEqual({ ok: true });
  });

  it("Treatment Detail graph PASS — MedicalClinic 풀 + MedicalProcedure 풀", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/treatments/diet" };
    const graph = treatmentDetailGraph(ctx, CLINIC, LOCATION, TREATMENT, TREATMENT.summary);
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "MedicalClinic", "MedicalProcedure", "WebPage", "BreadcrumbList"])).toEqual({ ok: true });
  });

  it("Article Detail graph PASS — Article inline author Physician", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/insights/general/yoyo" };
    const graph = articleDetailGraph(ctx, CLINIC, ARTICLE, DOCTOR);
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "Article", "WebPage", "BreadcrumbList"])).toEqual({ ok: true });
  });

  it("Contact graph PASS — MedicalClinic 풀", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/contact" };
    const graph = contactGraph(ctx, CLINIC, LOCATION, "연락처");
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "MedicalClinic", "WebPage", "BreadcrumbList"])).toEqual({ ok: true });
  });

  it("Location Detail graph PASS — MedicalClinic 풀 (본원 #clinic identity)", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/locations/main" };
    const graph = locationDetailGraph(ctx, CLINIC, LOCATION, "본원 위치");
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    const clinic = graph["@graph"].find((e) => e["@type"] === "MedicalClinic");
    expect(clinic).toBeDefined();
    // SCHEMA_MAPPING § 1.4: 본원 main location 의 @id 는 `/#clinic` (URL `/locations/main` 과 다름)
    expect(clinic!["@id"]).toBe(`${SITE_BASE_URL}/#clinic`);
  });
});

describe("JSON-LD rule checker — invariant 검증", () => {
  it("@id 중복은 fail", () => {
    const graph = {
      "@context": "https://schema.org" as const,
      "@graph": [
        { "@type": "Organization", "@id": "https://example.com/glitzy-clinic/#organization", name: "X" },
        { "@type": "Organization", "@id": "https://example.com/glitzy-clinic/#organization", name: "Y" },
      ],
    };
    const result = validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.includes("duplicate"))).toBe(true);
  });

  it("Cross-tenant same-origin ref 는 forbidden", () => {
    const graph = {
      "@context": "https://schema.org" as const,
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://example.com/glitzy-clinic/about#webpage",
          isPartOf: { "@id": "https://example.com/other-tenant/#website" }, // cross-tenant
        },
      ],
    };
    const result = validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.includes("cross-tenant") || e.includes("forbidden"))).toBe(true);
  });

  it("external origin URL 은 dereferenceable 예외 PASS", () => {
    const graph = {
      "@context": "https://schema.org" as const,
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://example.com/glitzy-clinic/#organization",
          sameAs: { "@id": "https://www.example.org/external" },
        },
      ],
    };
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
  });

  it("cross-page allowlist (#organization) — tenant base path 일치 시 PASS", () => {
    const graph = {
      "@context": "https://schema.org" as const,
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://example.com/glitzy-clinic/about#webpage",
          isPartOf: { "@id": "https://example.com/glitzy-clinic/#website" }, // same tenant, allowlist
        },
      ],
    };
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
  });
});
