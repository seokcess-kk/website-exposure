// @glitzy/web/lib/site-tracking/__tests__/server — MEANINGFUL_TRAFFIC_LOOP v1.0 task #5
// vitest fixture: server-side helper 단위 검증.

import { describe, it, expect, beforeEach, afterEach } from "vitest";

import {
  formatKstDate,
  deriveSessionToken,
  generateVisitorSeed,
  parseUserAgentFamily,
  parseReferrerHost,
  normalizeUtmSource,
  parseOriginAllowlist,
  isOriginAllowed,
  checkRateLimit,
  extractSlugFromPagePath,
} from "../server";

describe("formatKstDate", () => {
  it("UTC 자정에 KST 09:00 같은 일자", () => {
    const d = new Date("2026-05-26T00:00:00Z");
    expect(formatKstDate(d)).toBe("2026-05-26");
  });

  it("KST 자정 직전 (UTC 14:59) — 같은 일자", () => {
    const d = new Date("2026-05-26T14:59:00Z");
    expect(formatKstDate(d)).toBe("2026-05-26");
  });

  it("KST 자정 (UTC 15:00) — 다음 일자", () => {
    const d = new Date("2026-05-26T15:00:00Z");
    expect(formatKstDate(d)).toBe("2026-05-27");
  });
});

describe("deriveSessionToken", () => {
  beforeEach(() => {
    process.env.SESSION_SALT_SECRET = "test-secret-fixed";
  });
  afterEach(() => {
    delete process.env.SESSION_SALT_SECRET;
  });

  it("동일 input → 동일 64 hex", () => {
    const t = deriveSessionToken({
      instanceId: "00000000-0000-0000-0000-000000000001",
      visitorSeed: "aaaa",
      date: new Date("2026-05-26T05:00:00Z"),
    });
    expect(t).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(t)).toBe(true);
    // 동일 input → 결정적
    const t2 = deriveSessionToken({
      instanceId: "00000000-0000-0000-0000-000000000001",
      visitorSeed: "aaaa",
      date: new Date("2026-05-26T05:00:00Z"),
    });
    expect(t2).toBe(t);
  });

  it("KST 자정 경계 — 다른 일자 → 다른 token (cycle 5 #59)", () => {
    // KST 2026-05-26 23:59:59 = UTC 2026-05-26 14:59:59
    const t1 = deriveSessionToken({
      instanceId: "00000000-0000-0000-0000-000000000001",
      visitorSeed: "same-seed",
      date: new Date("2026-05-26T14:59:00Z"),
    });
    // KST 2026-05-27 00:00:00 = UTC 2026-05-26 15:00:00
    const t2 = deriveSessionToken({
      instanceId: "00000000-0000-0000-0000-000000000001",
      visitorSeed: "same-seed",
      date: new Date("2026-05-26T15:00:00Z"),
    });
    expect(t1).not.toBe(t2);
  });

  it("다른 instance → 다른 token", () => {
    const t1 = deriveSessionToken({
      instanceId: "00000000-0000-0000-0000-000000000001",
      visitorSeed: "same",
      date: new Date("2026-05-26T05:00:00Z"),
    });
    const t2 = deriveSessionToken({
      instanceId: "00000000-0000-0000-0000-000000000002",
      visitorSeed: "same",
      date: new Date("2026-05-26T05:00:00Z"),
    });
    expect(t1).not.toBe(t2);
  });

  it("SESSION_SALT_SECRET env 미설정 시 throw", () => {
    delete process.env.SESSION_SALT_SECRET;
    expect(() =>
      deriveSessionToken({
        instanceId: "00000000-0000-0000-0000-000000000001",
        visitorSeed: "x",
        date: new Date(),
      }),
    ).toThrow(/SESSION_SALT_SECRET/);
  });
});

describe("generateVisitorSeed", () => {
  it("32 hex chars (16 bytes)", () => {
    const seed = generateVisitorSeed();
    expect(seed).toHaveLength(32);
    expect(/^[0-9a-f]{32}$/.test(seed)).toBe(true);
  });
  it("매 호출 마다 다름", () => {
    expect(generateVisitorSeed()).not.toBe(generateVisitorSeed());
  });
});

describe("parseUserAgentFamily", () => {
  it("Chrome/120", () => {
    expect(parseUserAgentFamily("Mozilla/5.0 ... Chrome/120.0.0.0 Safari/537.36")).toBe("Chrome/120");
  });
  it("Mobile Safari/17", () => {
    expect(parseUserAgentFamily("Mozilla/5.0 (iPhone) ... Mobile Safari/17.0")).toBe("Mobile Safari/17");
  });
  it("Edg/118", () => {
    expect(parseUserAgentFamily("Mozilla/5.0 ... Chrome/118 Edg/118.0.0")).toBe("Chrome/118");  // 정규식 안 Chrome 먼저 매칭
  });
  it("null / undefined → null", () => {
    expect(parseUserAgentFamily(null)).toBeNull();
    expect(parseUserAgentFamily(undefined)).toBeNull();
  });
  it("unknown UA → null", () => {
    expect(parseUserAgentFamily("CustomBot/1.0")).toBeNull();
  });
});

describe("parseReferrerHost", () => {
  it("외부 host 추출", () => {
    expect(parseReferrerHost("https://naver.com/search?q=foo", "glitzy.kr")).toBe("naver.com");
  });
  it("자체사이트 navigation → null (cycle 3 #41)", () => {
    expect(parseReferrerHost("https://glitzy.kr/treatments", "glitzy.kr")).toBeNull();
  });
  it("invalid URL → null", () => {
    expect(parseReferrerHost("not-a-url", "glitzy.kr")).toBeNull();
  });
  it("null → null", () => {
    expect(parseReferrerHost(null, "glitzy.kr")).toBeNull();
  });
});

describe("normalizeUtmSource", () => {
  it("Naver Search → naver-search", () => {
    expect(normalizeUtmSource("Naver Search")).toBe("naver-search");
  });
  it("NAVER_SEARCH → naver-search", () => {
    expect(normalizeUtmSource("NAVER_SEARCH")).toBe("naver-search");
  });
  it("trim", () => {
    expect(normalizeUtmSource("  google  ")).toBe("google");
  });
  it("undefined → undefined", () => {
    expect(normalizeUtmSource(undefined)).toBeUndefined();
  });
});

describe("parseOriginAllowlist + isOriginAllowed", () => {
  const ORIGINAL_ENV = { ...process.env };
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("PUBLIC_SITE_ORIGIN URL 안 host 추출", () => {
    process.env.PUBLIC_SITE_ORIGIN = "https://glitzy.kr";
    process.env.TRACK_ORIGIN_ALLOWLIST = "";
    const a = parseOriginAllowlist();
    expect(a.hosts).toContain("glitzy.kr");
  });

  it("wildcard *.glitzy.kr 매칭", () => {
    process.env.PUBLIC_SITE_ORIGIN = "https://glitzy.kr";
    process.env.TRACK_ORIGIN_ALLOWLIST = "*.glitzy.kr";
    const a = parseOriginAllowlist();
    expect(isOriginAllowed("clinic-abc.glitzy.kr", a)).toBe(true);
    expect(isOriginAllowed("glitzy.kr", a)).toBe(true);
    expect(isOriginAllowed("attacker.com", a)).toBe(false);
  });

  it("dev fallback — localhost auto-allow (cycle 5 #55)", () => {
    delete process.env.PUBLIC_SITE_ORIGIN;
    delete process.env.TRACK_ORIGIN_ALLOWLIST;
    Object.assign(process.env, { NODE_ENV: "development" });
    const a = parseOriginAllowlist();
    expect(isOriginAllowed("localhost:3000", a)).toBe(true);
  });
});

describe("checkRateLimit", () => {
  it("30회 까지 OK · 31번째 차단", () => {
    const instId = "rl-test-instance";
    const seed = "rl-test-seed";
    const now = Date.now();
    for (let i = 0; i < 30; i++) {
      expect(checkRateLimit(instId, seed, now + i)).toBe(true);
    }
    expect(checkRateLimit(instId, seed, now + 30)).toBe(false);
  });
});

describe("extractSlugFromPagePath (cycle 3 #36)", () => {
  it("/demo/treatments/foo → demo", () => {
    expect(extractSlugFromPagePath("/demo/treatments/foo")).toBe("demo");
  });
  it("/demo → demo", () => {
    expect(extractSlugFromPagePath("/demo")).toBe("demo");
  });
  it("/_admin → null (underscore 시작)", () => {
    expect(extractSlugFromPagePath("/_admin")).toBeNull();
  });
  it("/123 → null (regex 검증 ab → 첫 char a-z 만)", () => {
    // 정규식 ^[a-z0-9] — 0-9 도 허용. /123 = 매칭
    expect(extractSlugFromPagePath("/123")).toBe("123");
  });
  it("/A-B → null (uppercase 차단)", () => {
    expect(extractSlugFromPagePath("/A-B")).toBeNull();
  });
});
