// SUBDOMAIN_SCALE_PLAN SDS-02 — middleware 호스트 전이표 고정.
// {명시맵 canonical/alias · 파생 host · vercel.app · apex} × {규칙 1 rewrite · 2 slug-strip 301 ·
//  3 cross-host 301 · 4 host-canonical dedupe} 매트릭스를 decideSiteRoute 순수 함수로 검증.

import { describe, it, expect, vi, afterEach } from "vitest";
import type { decideSiteRoute as DecideSiteRoute } from "./site-routing";

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

async function importDecide(env: EnvOverrides): Promise<typeof DecideSiteRoute> {
  vi.resetModules();
  for (const k of ENV_KEYS) {
    const v = env[k];
    if (v === undefined) delete mutableEnv[k];
    else mutableEnv[k] = v;
  }
  const mod = await import("./site-routing");
  return mod.decideSiteRoute;
}

// 실제 프로덕션 구성과 동일: 명시맵 (라벨≠slug) + BASE 파생 + apex alias (G0-1)
const MAP = JSON.stringify({
  "bupyeong.onwell.site": "daeatdiet-incheon",
  "onwell.site": "daeatdiet-incheon", // apex alias — 규칙 (4) 로 canonical 301
});
const PROD: EnvOverrides = {
  NODE_ENV: "test",
  VERCEL_ENV: "production",
  BASE_SITE_DOMAIN: "onwell.site",
  CUSTOM_DOMAIN_MAP: MAP,
};

const GET = (host: string, pathname: string, search = "", crossHostEnabled = true) => ({
  rawHost: host,
  pathname,
  search,
  method: "GET",
  crossHostEnabled,
});

describe("규칙 (1)(2) — 매핑/파생 host 의 서빙", () => {
  it("명시맵 canonical host: 루트 '/' → /<slug> rewrite · '/x' → /<slug>/x rewrite", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("bupyeong.onwell.site", "/"))).toEqual({
      kind: "rewrite",
      pathname: "/daeatdiet-incheon",
    });
    expect(decide(GET("bupyeong.onwell.site", "/treatments/goodbye-diet"))).toEqual({
      kind: "rewrite",
      pathname: "/daeatdiet-incheon/treatments/goodbye-diet",
    });
  });

  it("명시맵 host 의 /<slug>/* 직접 접근 → slug 제거 같은-host 301", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("bupyeong.onwell.site", "/daeatdiet-incheon/insights"))).toEqual({
      kind: "redirect-path",
      pathname: "/insights",
    });
  });

  it("파생 host (자기 자신이 canonical): env 추가 없이 rewrite 동작 (zero-touch)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("site2.onwell.site", "/"))).toEqual({ kind: "rewrite", pathname: "/site2" });
    expect(decide(GET("site2.onwell.site", "/site2/insights"))).toEqual({
      kind: "redirect-path",
      pathname: "/insights",
    });
  });

  it("파생 host 의 /favicon.ico → /<slug>/favicon.ico rewrite (네이버 수집기 host-루트 폴백 — matcher 에서 .ico 제외 해제 전제)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("site2.onwell.site", "/favicon.ico"))).toEqual({
      kind: "rewrite",
      pathname: "/site2/favicon.ico",
    });
  });

  it("api·IndexNow 키 파일은 커스텀 host 에서도 passthrough (admin 표면은 규칙 6 으로 이동)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("site2.onwell.site", "/api/track"))).toEqual({ kind: "next" });
    expect(decide(GET("bupyeong.onwell.site", `/${"a1b2c3d4".repeat(8)}.txt`))).toEqual({ kind: "next" });
  });
});

describe("규칙 (4) — host-canonical dedupe (SDS-02 신규)", () => {
  it("파생 host 인데 slug 가 명시맵 canonical 보유 → canonical host 301", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("daeatdiet-incheon.onwell.site", "/insights", "?a=1"))).toEqual({
      kind: "redirect-host",
      url: "https://bupyeong.onwell.site/insights?a=1",
    });
  });

  it("명시맵 alias host (apex — G0-1) → canonical host 301 (기존 중복 서빙 → SEO 개선)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("onwell.site", "/"))).toEqual({
      kind: "redirect-host",
      url: "https://bupyeong.onwell.site/",
    });
    // www 는 normalizeHost 가 apex 로 정규화 — 동일 처리
    expect(decide(GET("www.onwell.site", "/treatments"))).toEqual({
      kind: "redirect-host",
      url: "https://bupyeong.onwell.site/treatments",
    });
  });

  it("비-production(crossHostEnabled=false)·POST 는 (4) 미발동 — 기존처럼 그 host 에서 서빙", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("onwell.site", "/", "", false))).toEqual({
      kind: "rewrite",
      pathname: "/daeatdiet-incheon",
    });
    expect(
      decide({ rawHost: "onwell.site", pathname: "/", search: "", method: "POST", crossHostEnabled: true }),
    ).toEqual({ kind: "rewrite", pathname: "/daeatdiet-incheon" });
  });
});

describe("규칙 (3) — 비-커스텀 host 의 cross-host 301", () => {
  it("vercel.app /<명시맵 slug>/* → canonical host 301 (현행 유지)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("glitzy.vercel.app", "/daeatdiet-incheon/insights", "?q=1"))).toEqual({
      kind: "redirect-host",
      url: "https://bupyeong.onwell.site/insights?q=1",
    });
  });

  it("vercel.app /<파생 가능 segment>/* → <segment>.<BASE> 301 (SDS-02 확장 — 수용 trade-off 포함)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("glitzy.vercel.app", "/site2/insights"))).toEqual({
      kind: "redirect-host",
      url: "https://site2.onwell.site/insights",
    });
    // DB-blind: 비존재 slug 도 라벨 규칙 통과 시 301→404 체인 (문서화된 수용 사항)
    expect(decide(GET("glitzy.vercel.app", "/community/consultation/thank-you"))).toEqual({
      kind: "redirect-host",
      url: "https://community.onwell.site/consultation/thank-you",
    });
  });

  it("crossHostEnabled=false · POST · passthrough · 제외 slug 는 (3) 미발동", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("glitzy.vercel.app", "/site2/insights", "", false))).toEqual({ kind: "next" });
    expect(
      decide({
        rawHost: "glitzy.vercel.app",
        pathname: "/site2/insights",
        search: "",
        method: "POST",
        crossHostEnabled: true,
      }),
    ).toEqual({ kind: "next" });
    // demo 는 기본 제외 → 파생 canonical 없음 → path-based 유지
    expect(decide(GET("glitzy.vercel.app", "/demo/insights"))).toEqual({ kind: "next" });
  });
});

describe("규칙 (5) — BASE 하위 비파생 host 404 (리뷰 3-lens 공통 지적 반영)", () => {
  it("제외 slug(demo)·예약어(mail)·다중 레벨은 404 — RootLanding/path-based fall-through 차단", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("demo.onwell.site", "/"))).toEqual({ kind: "not-found" });
    expect(decide(GET("demo.onwell.site", "/demo/insights"))).toEqual({ kind: "not-found" });
    expect(decide(GET("mail.onwell.site", "/"))).toEqual({ kind: "not-found" });
    expect(decide(GET("a.b.onwell.site", "/"))).toEqual({ kind: "not-found" });
  });

  it("어드민 전용 host(admin.onwell.site)는 passthrough — 404 아님 (SDS-DEFER-03)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("admin.onwell.site", "/"))).toEqual({ kind: "next" });
    expect(decide(GET("admin.onwell.site", "/admin/daeatdiet-incheon"))).toEqual({ kind: "next" });
    expect(decide(GET("admin.onwell.site", "/sign-in"))).toEqual({ kind: "next" });
  });

  it("BASE 게이트 비활성(preview)·비-BASE host 에는 미발동", async () => {
    const preview = await importDecide({ ...PROD, VERCEL_ENV: "preview" });
    expect(preview(GET("demo.onwell.site", "/"))).toEqual({ kind: "next" });
    const decide = await importDecide(PROD);
    expect(decide(GET("demo.other-domain.kr", "/"))).toEqual({ kind: "next" });
  });
});

describe("규칙 (6) — 어드민 진입점 단일화 (admin.<BASE> 로 301)", () => {
  it("인스턴스 host(파생·명시맵)의 /admin·/sign-in → admin host 301 (path·search 보존)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("daeatdiet-incheon.onwell.site", "/admin"))).toEqual({
      kind: "redirect-host",
      url: "https://admin.onwell.site/admin",
    });
    expect(decide(GET("bupyeong.onwell.site", "/admin/daeatdiet-incheon/articles", "?page=2"))).toEqual({
      kind: "redirect-host",
      url: "https://admin.onwell.site/admin/daeatdiet-incheon/articles?page=2",
    });
    expect(decide(GET("site2.onwell.site", "/sign-in"))).toEqual({
      kind: "redirect-host",
      url: "https://admin.onwell.site/sign-in",
    });
  });

  it("apex(명시맵 alias)·vercel.app 의 어드민 표면도 admin host 301 — 규칙 3·4 보다 우선", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("onwell.site", "/admin"))).toEqual({
      kind: "redirect-host",
      url: "https://admin.onwell.site/admin",
    });
    expect(decide(GET("glitzy.vercel.app", "/admin/site2"))).toEqual({
      kind: "redirect-host",
      url: "https://admin.onwell.site/admin/site2",
    });
  });

  it("admin host 자신·POST·비-production·/api 는 미발동", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("admin.onwell.site", "/admin"))).toEqual({ kind: "next" });
    expect(
      decide({ rawHost: "site2.onwell.site", pathname: "/sign-in", search: "", method: "POST", crossHostEnabled: true }),
    ).toEqual({ kind: "next" });
    expect(decide(GET("site2.onwell.site", "/admin", "", false))).toEqual({ kind: "next" });
    expect(decide(GET("site2.onwell.site", "/api/track"))).toEqual({ kind: "next" });
  });

  it("BASE 미설정 환경에선 admin host 개념 없음 → 기존 passthrough 유지", async () => {
    const decide = await importDecide({ NODE_ENV: "test", VERCEL_ENV: "production", CUSTOM_DOMAIN_MAP: MAP });
    expect(decide(GET("bupyeong.onwell.site", "/admin"))).toEqual({ kind: "next" });
  });
});

describe("파생 게이트 없는 환경 (dev/preview) — 기존 path-based 동작 보존", () => {
  it("BASE 가 있어도 게이트 미통과면 파생 host 는 매핑 없음 → next", async () => {
    const decide = await importDecide({ ...PROD, VERCEL_ENV: "preview" });
    expect(decide(GET("site2.onwell.site", "/"))).toEqual({ kind: "next" });
  });

  it("localhost 는 항상 next (매핑 없음)", async () => {
    const decide = await importDecide(PROD);
    expect(decide(GET("localhost:3000", "/demo/insights", "", false))).toEqual({ kind: "next" });
  });
});
