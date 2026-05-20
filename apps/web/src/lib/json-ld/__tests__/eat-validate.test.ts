// EAT_CONTENT_PLAN v1.0 § 8.1 시나리오 24~36 (자동 검증 가능 부분)

import { describe, it, expect } from "vitest";
import { aboutGraph, doctorProfileGraph, faqPageGraph } from "../builders";
import {
  scholarlyArticleEntity,
  videoObjectEntity,
  faqPageEntity,
} from "../entities";
import { validateJsonLdGraph, validateExpectedEntities } from "./validate";
import type { GraphBuilderContext } from "../types";
import type {
  ClinicProjection,
  LocationProjection,
  DoctorProjection,
  PublicationProjection,
  MediaAppearanceProjection,
  FaqProjection,
} from "@/lib/db-projection";

const SITE_BASE_URL = "https://example.com/glitzy-clinic";

const CLINIC: ClinicProjection = {
  name: "Glitzy Clinic",
  description: "샘플 클리닉 설명. 검색·AEO 노출 목적의 자체 미디어 사이트.",
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
  metadata: { treatmentPillars: [], standardPrinciples: [], keyStats: [], systemStrengths: [], sectionCopy: {} },
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
  latitude: null,
  longitude: null,
  telephone: null,
  email: null,
  businessHours: { openingHours: [], receptionHours: [], lunchBreaks: [], specialClosures: [] },
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

const DOCTOR: DoctorProjection = {
  slug: "hong",
  name: "홍길동",
  title: "대표원장",
  jobTitle: null,
  honorific: null,
  bio: null,
  photoUrl: null,
  cvPhotoUrl: null,
  displayOrder: 0,
  active: true,
  updatedAt: new Date("2026-05-18T00:00:00Z"),
};

const PUB: PublicationProjection = {
  slug: "kim-2024-acupuncture",
  title: "한방 침구 치료의 임상 효과 분석",
  authors: ["김의원", "이연구"],
  journal: "대한한방학회지",
  publishedDate: "2024-06-15",
  doi: "10.1234/journal.2024.06.015",
  pubmedId: "12345678",
  url: "https://example.com/pub/kim2024",
  thumbnailUrl: null,
  summary: "본 연구는 한방 침구 치료의 임상 효과를 분석한 결과를 정리합니다. 본 50자 이상 요약 정합 충족.",
  authorDoctorId: null,
  publishedAt: new Date("2024-06-15T00:00:00Z"),
  updatedAt: new Date("2024-06-15T00:00:00Z"),
};

const MEDIA: MediaAppearanceProjection = {
  slug: "kbs-2024-health",
  title: "KBS 생로병사 — 한방 다이어트",
  channelName: "KBS",
  channelType: "broadcast",
  publishedDate: "2024-03-10",
  durationSeconds: 3720,
  url: "https://example.com/media/kbs2024",
  thumbnailUrl: "https://example.com/media/thumb.jpg",
  summary: "KBS 생로병사 의문 프로그램 출연 영상. 본 한방 다이어트 임상 사례 소개. 50자 이상.",
  authorDoctorId: null,
  publishedAt: new Date("2024-03-10T00:00:00Z"),
  updatedAt: new Date("2024-03-10T00:00:00Z"),
};

const FAQ_ITEMS: FaqProjection[] = [
  {
    slug: "faq-1",
    question: "한방 다이어트 효과는 얼마나 걸리나요?",
    answer: "**개인차가 있으나** 일반적으로 4~12주 정도의 프로그램을 권장합니다. 자세한 상담은 내원 후 결정합니다.",
    displayOrder: 0,
    categoryId: null,
    relatedTreatmentId: null,
    authorDoctorId: null,
    publishedAt: null,
    updatedAt: new Date("2026-05-18T00:00:00Z"),
  },
];

describe("EAT_CONTENT v1.0 scenario 24~36", () => {
  // # 24
  it("Doctor Profile 안 publication inline + author 매칭", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/doctors/hong" };
    const graph = doctorProfileGraph(ctx, CLINIC, DOCTOR, "원장 소개", [PUB], []);
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    expect(validateExpectedEntities(graph, ["Organization", "Physician", "WebPage", "BreadcrumbList", "ScholarlyArticle"])).toEqual({ ok: true });
  });

  // # 25 — VideoObject duration ISO 8601
  it("MediaAppearance VideoObject duration PT{seconds}S", () => {
    const entity = videoObjectEntity(MEDIA, `${SITE_BASE_URL}/doctors/hong`);
    expect(entity["duration"]).toBe("PT3720S");
    expect(entity["@type"]).toBe("VideoObject");
    expect(entity["@id"]).toBe(`${SITE_BASE_URL}/doctors/hong#video-${MEDIA.slug}`);
  });

  // # 26 — FAQ DB CHECK 검증은 마이그레이션 e2e (vitest 범위 외) — schema 자체 CHECK constraint 확인 deferred.
  //   여기서는 zod schema EatStatusSchema 가 draft 만 허용함을 검증.
  it("FAQ status zod = 'draft' only", async () => {
    const mod = await import("@/lib/eat-content-schema");
    const r1 = mod.EatStatusSchema.safeParse("draft");
    const r2 = mod.EatStatusSchema.safeParse("published");
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(false);
  });

  // # 27 — FAQPage graph 안 mainEntity 0건 (v0.1 published 차단 → 0 row)
  it("FAQPage empty mainEntity OK", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/faq" };
    const graph = faqPageGraph(ctx, CLINIC, [], "FAQ");
    expect(validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL })).toEqual({ ok: true });
    const faqEntity = graph["@graph"].find((e) => e["@type"] === "FAQPage");
    expect(faqEntity).toBeDefined();
    expect((faqEntity!["mainEntity"] as unknown[]).length).toBe(0);
  });

  // # 31 — ScholarlyArticle identifier array (DOI + PubMedID)
  it("ScholarlyArticle identifier — 2 PropertyValue", () => {
    const entity = scholarlyArticleEntity(
      { siteBaseUrl: SITE_BASE_URL, pagePath: "/doctors/hong" },
      PUB,
      `${SITE_BASE_URL}/doctors/hong`,
    );
    const ids = entity["identifier"] as Array<{ propertyID: string; value: string }>;
    expect(ids).toBeDefined();
    expect(ids.length).toBe(2);
    expect(ids[0]!.propertyID).toBe("DOI");
    expect(ids[1]!.propertyID).toBe("PubMedID");
  });

  // # 32 — 모든 4 channel_type → VideoObject (단일화 v0.1)
  it("VideoObject — 모든 channel_type 동일 @type 단일화", () => {
    for (const channelType of ["broadcast", "youtube", "podcast", "press"] as const) {
      const entity = videoObjectEntity(
        { ...MEDIA, slug: `t-${channelType}`, channelType },
        `${SITE_BASE_URL}/about`,
      );
      expect(entity["@type"]).toBe("VideoObject");
      expect(entity["@id"]).toBe(`${SITE_BASE_URL}/about#video-t-${channelType}`);
    }
  });

  // # 33 — Article.category JOIN 미존재 (이건 SQL 레벨 — vitest scope 외, e2e 검증 deferred).
  //   대신 articleDetailGraph 의 @id 가 categorySlug 사용함을 검증 (이미 validate.test.ts 에서 통과).

  // # 34 — FAQ markdown answer 안 <script> payload → JSON-LD Answer.text 평문 strip
  it("FAQ Markdown <script> payload — JSON-LD Answer.text strip", async () => {
    const mod = await import("@/lib/markdown");
    const dangerous = "정상 답변 텍스트 50자 이상으로 작성. <script>alert(1)</script> 본 보안 검증 입니다.";
    const plain = mod.renderMarkdownToPlainText(dangerous);
    expect(plain).not.toContain("<script>");
    expect(plain).not.toContain("</script>");
  });

  // # 35 — Doctor Profile graph self-contained — 풀 entity 모두 fragment-scoped @id
  it("Doctor Profile graph self-contained — fragment-scoped @id", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/doctors/hong" };
    const graph = doctorProfileGraph(ctx, CLINIC, DOCTOR, "원장 소개", [PUB], [MEDIA]);
    const result = validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL });
    expect(result).toEqual({ ok: true });
    const pubEntity = graph["@graph"].find((e) => e["@type"] === "ScholarlyArticle");
    const mediaEntity = graph["@graph"].find((e) => e["@type"] === "VideoObject");
    expect(pubEntity!["@id"]).toBe(`${SITE_BASE_URL}/doctors/hong#publication-${PUB.slug}`);
    expect(mediaEntity!["@id"]).toBe(`${SITE_BASE_URL}/doctors/hong#video-${MEDIA.slug}`);
  });

  // # 36 — ArticleCategory taxonomy public (이건 DB GRANT/policy — vitest scope 외, e2e 검증 deferred).
  //   대신 정책 결정 정합성 검증 — D0014 SQL 안 article_category policy 가 instance_id only 인 것을 file content 로 확인.
  it("D0014 article_category public_reader policy — instance_id only (no status)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const file = path.resolve(__dirname, "../../../../../../packages/db/migrations/D0014_public_reader_eat.sql");
    const content = fs.readFileSync(file, "utf-8");
    expect(content).toContain("public_reader_article_category_select");
    // article_category policy 안 status 게이트 없음 확인
    const acBlock = content.split("public_reader_article_category_select")[1] ?? "";
    const acFirstPolicy = acBlock.split("CREATE POLICY")[0] ?? "";
    expect(acFirstPolicy).not.toContain("status =");
  });

  // About — graph self-contained · MedicalClinic.subjectOf array (cycle 1 ECP-15 정정 — Organization 미사용)
  it("About graph — MedicalClinic.subjectOf array (Organization 미사용)", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/about" };
    const graph = aboutGraph(ctx, CLINIC, LOCATION, "소개", "샘플 설명", [PUB], [MEDIA]);
    const result = validateJsonLdGraph(graph, { siteBaseUrl: SITE_BASE_URL });
    expect(result).toEqual({ ok: true });
    const orgEntity = graph["@graph"].find((e) => e["@type"] === "Organization");
    const clinicEntity = graph["@graph"].find((e) => e["@type"] === "MedicalClinic");
    expect(orgEntity!["subjectOf"]).toBeUndefined();
    expect(clinicEntity!["subjectOf"]).toBeDefined();
    expect((clinicEntity!["subjectOf"] as Array<{ "@id": string }>).length).toBe(2);
  });

  // FAQPage helper — Markdown → plain text
  it("faqPageEntity — Answer.text plain text (sanitize)", () => {
    const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/faq" };
    const entity = faqPageEntity(ctx, FAQ_ITEMS);
    const mainEntity = entity["mainEntity"] as Array<{ acceptedAnswer: { text: string } }>;
    expect(mainEntity.length).toBe(1);
    expect(mainEntity[0]!.acceptedAnswer.text).not.toContain("**");
    expect(mainEntity[0]!.acceptedAnswer.text).toContain("개인차가 있으나");
  });
});
