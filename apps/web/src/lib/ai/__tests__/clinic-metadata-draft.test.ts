// @glitzy/web/lib/ai/__tests__/clinic-metadata-draft — 의원정보 고급 문안 AI 자동 채움
// pure helper (sanitize · merge) + prompt template + zod schema.

import { describe, expect, it } from "vitest";

import {
  mergeClinicMetadataPreservingFacts,
  pillarSubtitleFromDb,
  sanitizeClinicMetadataDraft,
  sanitizeIcon,
  type DbPillarRow,
} from "../clinic-metadata-draft-helpers";
import {
  buildClinicMetadataDraftSystemPrompt,
  buildClinicMetadataDraftUserPrompt,
  clinicMetadataDraftOutputSchema,
  CLINIC_METADATA_ICON_WHITELIST,
  type ClinicMetadataDraftOutput,
} from "../prompt-templates";

const DB_PILLARS: DbPillarRow[] = [
  { slug: "diet-treatment", title: "다이어트 치료", summary: "체질 기반 감량 진료 안내입니다.", spokeTitles: ["굿바이 다이어트", "당질조절"] },
  { slug: "herbal-medicine", title: "다이트 한약", summary: "원외탕전 한약 처방 안내입니다.", spokeTitles: [] },
];

function validOutput(overrides?: Partial<ClinicMetadataDraftOutput>): ClinicMetadataDraftOutput {
  return {
    treatmentPillars: [
      { slug: "diet-treatment", icon: "mdi:scale-bathroom", title: "다이어트 치료", subtitle: "굿바이 다이어트 · 당질조절" },
      { slug: "herbal-medicine", icon: "mdi:leaf", title: "다이트 한약", subtitle: "원외탕전 · 엄선된 재료" },
    ],
    standardPrinciples: [
      { n: "01", icon: "solar:user-id-bold-duotone", title: "체질 진단", desc: "사상체질 진단으로 환자 개개인의 체질을 파악합니다." },
      { n: "02", icon: "solar:leaf-bold-duotone", title: "맞춤 처방", desc: "체질에 맞춘 한약 처방으로 무리 없는 감량을 진행합니다." },
      { n: "03", icon: "solar:medal-star-bold-duotone", title: "사후 관리", desc: "감량 이후 체중 유지를 위한 관리 절차를 안내합니다." },
    ],
    systemStrengths: [
      { icon: "mdi:account-search", title: "초진 상담", description: "초진 시 상담과 진단 절차를 거쳐 진료 방향을 정합니다." },
      { icon: "mdi:calendar-check", title: "일정 관리", description: "내원 주기와 복약 일정을 함께 관리합니다." },
      { icon: "mdi:shield-check", title: "안전 관리", description: "복약 중 반응을 확인하며 처방을 조정합니다." },
    ],
    sectionCopy: {
      communityTitle: "다이어트 인사이트",
      communityDescription: "감량과 건강 관리에 필요한 정보를 칼럼으로 정리해 제공합니다. 궁금한 주제를 찾아보세요.",
      reservationHeadline: "상담 예약 안내",
      reservationDescription: "전화 또는 네이버 예약으로 상담 일정을 잡으실 수 있습니다. 진료 시간을 확인해 주세요.",
    },
    localKeywords: ["부평 다이어트 한약", "부평 한의원", "인천 다이어트", "부평 체형관리", "인천 한방 다이어트"],
    ...overrides,
  };
}

describe("sanitizeIcon", () => {
  it("whitelist 안 아이콘은 통과", () => {
    expect(sanitizeIcon("mdi:leaf", "mdi:medical-bag")).toBe("mdi:leaf");
  });
  it("whitelist 밖 (환각) 아이콘은 fallback 대체", () => {
    expect(sanitizeIcon("mdi:this-does-not-exist", "mdi:medical-bag")).toBe("mdi:medical-bag");
  });
});

describe("pillarSubtitleFromDb", () => {
  it("spoke 있으면 · 나열", () => {
    expect(pillarSubtitleFromDb(DB_PILLARS[0]!)).toBe("굿바이 다이어트 · 당질조절");
  });
  it("spoke 없으면 summary 축약", () => {
    expect(pillarSubtitleFromDb(DB_PILLARS[1]!)).toBe("원외탕전 한약 처방 안내입니다.");
  });
});

describe("sanitizeClinicMetadataDraft", () => {
  it("pillar slug/title 은 DB 값 강제 — LLM 변조 무시", () => {
    const out = validOutput();
    out.treatmentPillars[0]! = { ...out.treatmentPillars[0]!, title: "LLM 이 바꾼 제목" };
    const clean = sanitizeClinicMetadataDraft(out, DB_PILLARS) as { treatmentPillars: Array<{ title: string; slug: string }> };
    expect(clean.treatmentPillars[0]!.title).toBe("다이어트 치료");
    expect(clean.treatmentPillars.map((p) => p.slug)).toEqual(["diet-treatment", "herbal-medicine"]);
  });

  it("LLM 이 pillar 를 누락해도 DB pillar 전부 출력 (subtitle fallback)", () => {
    const out = validOutput({ treatmentPillars: [] });
    const clean = sanitizeClinicMetadataDraft(out, DB_PILLARS) as { treatmentPillars: Array<{ subtitle: string }> };
    expect(clean.treatmentPillars).toHaveLength(2);
    expect(clean.treatmentPillars[0]!.subtitle).toBe("굿바이 다이어트 · 당질조절");
  });

  it("환각 아이콘은 기본 아이콘으로 대체", () => {
    const out = validOutput();
    out.standardPrinciples[0]! = { ...out.standardPrinciples[0]!, icon: "fake:icon-name" };
    const clean = sanitizeClinicMetadataDraft(out, DB_PILLARS) as { standardPrinciples: Array<{ icon: string }> };
    expect(CLINIC_METADATA_ICON_WHITELIST).toContain(clean.standardPrinciples[0]!.icon);
  });

  it("keyStats 는 항상 빈 배열 (자동 생성 금지) · localKeywords 중복 제거", () => {
    const out = validOutput({ localKeywords: ["부평 한의원", "부평 한의원", "인천 다이어트", " ", "부평 다이어트", "인천 한약"] });
    const clean = sanitizeClinicMetadataDraft(out, DB_PILLARS) as { keyStats: unknown[]; localKeywords: string[] };
    expect(clean.keyStats).toEqual([]);
    expect(clean.localKeywords).toEqual(["부평 한의원", "인천 다이어트", "부평 다이어트", "인천 한약"]);
  });
});

describe("mergeClinicMetadataPreservingFacts", () => {
  const draft = JSON.stringify(sanitizeClinicMetadataDraft(validOutput(), DB_PILLARS));

  it("기존 keyStats · naverPlace 보존 + 문안은 초안으로 교체", () => {
    const current = JSON.stringify({
      treatmentPillars: [{ slug: "old", icon: "mdi:leaf", title: "옛 문안", subtitle: "..." }],
      keyStats: [{ value: "12", suffix: "년", label: "진료 경력", source: "개원일 기준" }],
      naverPlace: { placeId: "123456789", placeUrl: "https://map.naver.com/p/entry/place/123456789" },
    });
    const merged = JSON.parse(mergeClinicMetadataPreservingFacts(current, draft)) as Record<string, unknown>;
    expect((merged.keyStats as unknown[]).length).toBe(1);
    expect((merged.naverPlace as { placeId: string }).placeId).toBe("123456789");
    expect((merged.treatmentPillars as Array<{ slug: string }>)[0]!.slug).toBe("diet-treatment");
  });

  it("기존 metadata 가 비어 있으면 초안 그대로", () => {
    const merged = JSON.parse(mergeClinicMetadataPreservingFacts("", draft)) as Record<string, unknown>;
    expect(merged.naverPlace).toBeUndefined();
    expect((merged.keyStats as unknown[]).length).toBe(0);
  });
});

describe("clinic-metadata-draft prompt + schema", () => {
  it("system prompt — 의료광고법 + 수치 생성 금지 + JSON only + icon whitelist", () => {
    const sys = buildClinicMetadataDraftSystemPrompt();
    expect(sys).toMatch(/의료광고법/);
    expect(sys).toMatch(/제56조/);
    expect(sys).toMatch(/JSON only/);
    expect(sys).toMatch(/수치·통계.*생성 금지|수치·통계·연차·건수 절대 생성 금지/);
    expect(sys).toMatch(/keyStats/);
    expect(sys).toMatch(/mdi:scale-bathroom/);
    expect(sys).toMatch(/변경 절대 금지|변경 금지/);
  });

  it("user prompt — 기관/지역/pillar/키워드 interpolation + 사실 창작 금지", () => {
    const user = buildClinicMetadataDraftUserPrompt({
      clinicName: "다이트한의원 부평점",
      clinicDescription: "체질 기반 다이어트 진료를 제공합니다.",
      addressRegion: "인천광역시",
      addressLocality: "부평구",
      pillars: DB_PILLARS,
      keywordLabels: ["부평 다이어트 한약", "인천 한의원"],
    });
    expect(user).toContain("다이트한의원 부평점");
    expect(user).toContain("인천광역시 부평구");
    expect(user).toContain("slug=diet-treatment");
    expect(user).toContain("굿바이 다이어트");
    expect(user).toContain("부평 다이어트 한약");
    expect(user).toMatch(/창작 금지/);
  });

  it("user prompt — pillar 없으면 빈 배열 지시", () => {
    const user = buildClinicMetadataDraftUserPrompt({
      clinicName: "대전 한의원",
      clinicDescription: "소개",
      addressRegion: null,
      addressLocality: null,
      pillars: [],
      keywordLabels: [],
    });
    expect(user).toContain("빈 배열");
  });

  it("output schema — principle 2개는 reject (정확히 3)", () => {
    const bad = validOutput();
    const r = clinicMetadataDraftOutputSchema.safeParse({ ...bad, standardPrinciples: bad.standardPrinciples.slice(0, 2) });
    expect(r.success).toBe(false);
  });

  it("output schema — localKeywords 4개는 reject (min 5)", () => {
    const bad = validOutput();
    const r = clinicMetadataDraftOutputSchema.safeParse({ ...bad, localKeywords: bad.localKeywords.slice(0, 4) });
    expect(r.success).toBe(false);
  });

  it("output schema — 정상 출력 pass", () => {
    expect(clinicMetadataDraftOutputSchema.safeParse(validOutput()).success).toBe(true);
  });
});
