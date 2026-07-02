// SUBDOMAIN_SCALE_PLAN SDS-01 — BASE_SITE_DOMAIN 라벨=slug 파생 규칙.
// custom-domains.ts 는 module-load 시 env 를 1회 파싱하므로 케이스별로 resetModules + dynamic import.

import { describe, it, expect, vi, afterEach } from "vitest";

const ENV_KEYS = [
  "CUSTOM_DOMAIN_MAP",
  "BASE_SITE_DOMAIN",
  "BASE_DOMAIN_EXCLUDE_SLUGS",
  "VERCEL_ENV",
  "NODE_ENV",
] as const;

type EnvOverrides = Partial<Record<(typeof ENV_KEYS)[number], string>>;

// NODE_ENV 는 Next 타입에서 read-only — 테스트 한정 mutable 캐스트로 케이스별 주입.
const mutableEnv = process.env as Record<string, string | undefined>;

const savedEnv: Record<string, string | undefined> = {};
for (const k of ENV_KEYS) savedEnv[k] = process.env[k];

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete mutableEnv[k];
    else mutableEnv[k] = savedEnv[k];
  }
  vi.resetModules();
});

async function importCustomDomains(env: EnvOverrides) {
  vi.resetModules();
  for (const k of ENV_KEYS) {
    const v = env[k];
    if (v === undefined) delete mutableEnv[k];
    else mutableEnv[k] = v;
  }
  return import("./custom-domains");
}

const MAP = JSON.stringify({ "bupyeong.key-mom.kr": "daeatdiet-incheon" });
// 파생 게이트 통과 조건: NODE_ENV !== development && VERCEL_ENV === production
const PROD: EnvOverrides = { NODE_ENV: "test", VERCEL_ENV: "production", BASE_SITE_DOMAIN: "key-mom.kr" };

describe("BASE_SITE_DOMAIN 파생 — slugForHost", () => {
  it("<label>.<BASE> 단일 라벨 → label 이 slug (zero-touch)", async () => {
    const { slugForHost } = await importCustomDomains(PROD);
    expect(slugForHost("site2.key-mom.kr")).toBe("site2");
  });

  it("명시 맵이 항상 우선 (라벨≠slug 매핑 유지)", async () => {
    const { slugForHost } = await importCustomDomains({ ...PROD, CUSTOM_DOMAIN_MAP: MAP });
    expect(slugForHost("bupyeong.key-mom.kr")).toBe("daeatdiet-incheon");
  });

  it("apex(BASE 자체)·다중 레벨은 파생하지 않음", async () => {
    const { slugForHost } = await importCustomDomains(PROD);
    expect(slugForHost("key-mom.kr")).toBeNull();
    expect(slugForHost("a.b.key-mom.kr")).toBeNull();
  });

  it("선행 www 는 normalizeHost 가 strip — www.<label>.<BASE> 는 label 로 파생 (문서화된 기대 동작)", async () => {
    // 실서비스에서는 *.<BASE> 와일드카드 인증서가 1-레벨만 커버해 TLS 단계에서 도달 불가.
    const { slugForHost } = await importCustomDomains(PROD);
    expect(slugForHost("www.site1.key-mom.kr")).toBe("site1");
  });

  it("포트는 정규화로 흡수", async () => {
    const { slugForHost } = await importCustomDomains(PROD);
    expect(slugForHost("site2.key-mom.kr:443")).toBe("site2");
  });

  it("RESERVED 라벨 (admin·api 등) 은 파생 금지", async () => {
    const { slugForHost } = await importCustomDomains(PROD);
    expect(slugForHost("admin.key-mom.kr")).toBeNull();
    expect(slugForHost("api.key-mom.kr")).toBeNull();
  });

  it("BASE_DOMAIN_EXCLUDE_SLUGS 기본값 demo — demo 서브도메인 파생 금지, 빈 문자열 명시 시 허용", async () => {
    const withDefault = await importCustomDomains(PROD);
    expect(withDefault.slugForHost("demo.key-mom.kr")).toBeNull();
    const noExclude = await importCustomDomains({ ...PROD, BASE_DOMAIN_EXCLUDE_SLUGS: "" });
    expect(noExclude.slugForHost("demo.key-mom.kr")).toBe("demo");
  });

  it("DNS 라벨 위반 (끝 하이픈 · 63자 초과) 은 파생 금지", async () => {
    const { slugForHost } = await importCustomDomains(PROD);
    expect(slugForHost("abc-.key-mom.kr")).toBeNull();
    const label64 = "a".repeat(64);
    expect(slugForHost(`${label64}.key-mom.kr`)).toBeNull();
    const label63 = "a".repeat(63);
    expect(slugForHost(`${label63}.key-mom.kr`)).toBe(label63);
  });
});

describe("BASE_SITE_DOMAIN 파생 — canonicalHostForSlug (대칭 불변식)", () => {
  it("파생 slug 의 canonical 은 <slug>.<BASE>", async () => {
    const { canonicalHostForSlug, sitePathPrefix } = await importCustomDomains(PROD);
    expect(canonicalHostForSlug("site2")).toBe("site2.key-mom.kr");
    expect(sitePathPrefix("site2")).toBe(""); // 내부링크 루트 기준 flip
  });

  it("명시 맵 canonical 우선 — 파생으로 덮지 않음", async () => {
    const { canonicalHostForSlug } = await importCustomDomains({ ...PROD, CUSTOM_DOMAIN_MAP: MAP });
    expect(canonicalHostForSlug("daeatdiet-incheon")).toBe("bupyeong.key-mom.kr");
  });

  it("명시 맵 선점 검사 — 파생 host 가 다른 slug 로 점유돼 있으면 파생 거부 (hijack 방지)", async () => {
    const { canonicalHostForSlug, slugForHost } = await importCustomDomains({
      ...PROD,
      CUSTOM_DOMAIN_MAP: MAP,
    });
    // slug 'bupyeong' 의 파생 후보 bupyeong.key-mom.kr 은 daeatdiet-incheon 이 선점
    expect(canonicalHostForSlug("bupyeong")).toBeNull();
    expect(slugForHost("bupyeong.key-mom.kr")).toBe("daeatdiet-incheon");
  });

  it("RESERVED · 제외 slug 는 canonical 도 파생하지 않음 (slugForHost 와 대칭)", async () => {
    const { canonicalHostForSlug } = await importCustomDomains(PROD);
    expect(canonicalHostForSlug("admin")).toBeNull();
    expect(canonicalHostForSlug("demo")).toBeNull();
  });

  it("DNS 라벨 위반 slug 는 path-based 로 남음", async () => {
    const { canonicalHostForSlug, sitePathPrefix } = await importCustomDomains(PROD);
    expect(canonicalHostForSlug("abc-")).toBeNull();
    expect(sitePathPrefix("abc-")).toBe("/abc-");
  });
});

describe("파생 환경 가드 (fail-closed — 22002ec 패턴)", () => {
  it("NODE_ENV=development 이면 VERCEL_ENV=production 이어도 파생 비활성 (vercel env pull 오염 방어)", async () => {
    const { slugForHost, canonicalHostForSlug } = await importCustomDomains({
      ...PROD,
      NODE_ENV: "development",
    });
    expect(slugForHost("site2.key-mom.kr")).toBeNull();
    expect(canonicalHostForSlug("site2")).toBeNull();
  });

  it("VERCEL_ENV 미설정/preview 이면 파생 비활성", async () => {
    const noVercel = await importCustomDomains({ NODE_ENV: "test", BASE_SITE_DOMAIN: "key-mom.kr" });
    expect(noVercel.slugForHost("site2.key-mom.kr")).toBeNull();
    const preview = await importCustomDomains({
      NODE_ENV: "test",
      VERCEL_ENV: "preview",
      BASE_SITE_DOMAIN: "key-mom.kr",
    });
    expect(preview.slugForHost("site2.key-mom.kr")).toBeNull();
  });

  it("명시 맵은 게이트와 무관하게 동작 (기존 동작 보존)", async () => {
    const { slugForHost, canonicalHostForSlug } = await importCustomDomains({
      NODE_ENV: "development",
      CUSTOM_DOMAIN_MAP: MAP,
    });
    expect(slugForHost("bupyeong.key-mom.kr")).toBe("daeatdiet-incheon");
    expect(canonicalHostForSlug("daeatdiet-incheon")).toBe("bupyeong.key-mom.kr");
  });

  it("BASE 미설정이면 파생 없음 (fail-safe 무영향)", async () => {
    const { slugForHost } = await importCustomDomains({ NODE_ENV: "test", VERCEL_ENV: "production" });
    expect(slugForHost("site2.key-mom.kr")).toBeNull();
  });
});

describe("slugSubdomainIssue (SDS-04 — 생성 검증 · 게이트 무관)", () => {
  it("끝 하이픈/63자 초과 → dns-label", async () => {
    const { slugSubdomainIssue } = await importCustomDomains({ NODE_ENV: "test" });
    expect(slugSubdomainIssue("abc-")).toBe("dns-label");
    expect(slugSubdomainIssue("a".repeat(64))).toBe("dns-label");
  });

  it("예약어 → reserved", async () => {
    const { slugSubdomainIssue } = await importCustomDomains({ NODE_ENV: "test" });
    expect(slugSubdomainIssue("admin")).toBe("reserved");
  });

  it("명시 맵 선점 라벨 → claimed — BASE env 없이도 판정 (Phase 2 이전 시간창 공백 방지)", async () => {
    const { slugSubdomainIssue } = await importCustomDomains({
      NODE_ENV: "test",
      CUSTOM_DOMAIN_MAP: MAP,
    });
    expect(slugSubdomainIssue("bupyeong")).toBe("claimed");
  });

  it("정상 slug → null (demo 는 의도된 제외 정책이라 issue 아님)", async () => {
    const { slugSubdomainIssue } = await importCustomDomains({
      NODE_ENV: "test",
      BASE_SITE_DOMAIN: "key-mom.kr",
    });
    expect(slugSubdomainIssue("songdo")).toBeNull();
    expect(slugSubdomainIssue("demo")).toBeNull();
  });
});
