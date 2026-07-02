// SUBDOMAIN_SCALE_PLAN SDS-00 — /api/track instance slug 해석 (커스텀/파생 host 우선).
// 배경: 커스텀 도메인 루트 서빙은 page_path 에 slug prefix 가 없어, 첫 segment 파싱만으로는
// "treatments" 등을 slug 로 오인 → instance 미존재 → 204 silent drop (bupyeong 라이브 유실 실사고).

import { describe, it, expect, vi, afterEach } from "vitest";

const ENV_KEYS = ["CUSTOM_DOMAIN_MAP", "BASE_SITE_DOMAIN", "BASE_DOMAIN_EXCLUDE_SLUGS", "VERCEL_ENV", "NODE_ENV"] as const;

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

async function importResolver(env: Partial<Record<(typeof ENV_KEYS)[number], string>>) {
  vi.resetModules();
  for (const k of ENV_KEYS) {
    const v = env[k];
    if (v === undefined) delete mutableEnv[k];
    else mutableEnv[k] = v;
  }
  const mod = await import("./server");
  return mod.resolveTrackInstanceSlug;
}

const MAP = JSON.stringify({ "bupyeong.key-mom.kr": "daeatdiet-incheon" });

describe("resolveTrackInstanceSlug", () => {
  it("커스텀 도메인 host: 루트 기준 page_path 여도 host 매핑으로 slug 해석 (라이브 유실 fix)", async () => {
    const resolve = await importResolver({ NODE_ENV: "test", CUSTOM_DOMAIN_MAP: MAP });
    expect(resolve("bupyeong.key-mom.kr", "/treatments/goodbye-diet")).toBe("daeatdiet-incheon");
    expect(resolve("bupyeong.key-mom.kr", "/")).toBe("daeatdiet-incheon"); // 홈 "/" 도 유효
  });

  it("파생 서브도메인 host (production 게이트 통과 시)", async () => {
    const resolve = await importResolver({
      NODE_ENV: "test",
      VERCEL_ENV: "production",
      BASE_SITE_DOMAIN: "key-mom.kr",
    });
    expect(resolve("site2.key-mom.kr", "/insights/diet/abc")).toBe("site2");
  });

  it("비매핑 host (vercel.app·localhost): 기존 page_path 첫 segment fallback 유지", async () => {
    const resolve = await importResolver({ NODE_ENV: "test", CUSTOM_DOMAIN_MAP: MAP });
    expect(resolve("glitzy.vercel.app", "/demo/treatments")).toBe("demo");
    expect(resolve("localhost:3000", "/demo")).toBe("demo");
  });

  it("host 매핑도 path slug 도 없으면 null (silent drop 유지)", async () => {
    const resolve = await importResolver({ NODE_ENV: "test" });
    expect(resolve("glitzy.vercel.app", "/")).toBeNull();
    expect(resolve(null, "/x")).toBeNull(); // 첫 segment "x" 는 slug regex(3자+) 미달
  });
});
