// 내부 링크 slug-prefix 301 경유 해소 — sitePathPrefix + markdown 본문 내부 링크 재작성
// 배경: 커스텀 도메인(bupyeong.key-mom.kr)에서 /<slug>/... 내부 링크는 middleware 301 을
// 매 클릭/크롤마다 경유 → 크롤 예산 낭비 + 내부 링크 신호 희석. 렌더 시점에 루트 기준으로 변환.

import { describe, it, expect, vi } from "vitest";

// custom-domains.ts 는 module-load 시 CUSTOM_DOMAIN_MAP 을 1회 파싱하므로
// env 케이스별 검증은 resetModules + dynamic import 로 수행한다.
async function importWithDomainMap(map: string | undefined) {
  vi.resetModules();
  if (map === undefined) delete process.env.CUSTOM_DOMAIN_MAP;
  else process.env.CUSTOM_DOMAIN_MAP = map;
  const customDomains = await import("./custom-domains");
  const markdown = await import("./markdown");
  return { ...customDomains, ...markdown };
}

const MAP = JSON.stringify({ "bupyeong.key-mom.kr": "daeatdiet-incheon" });
const HOST = "https://bupyeong.key-mom.kr";

describe("sitePathPrefix", () => {
  it("커스텀 도메인 매핑 slug → 빈 prefix (루트 기준 링크)", async () => {
    const { sitePathPrefix } = await importWithDomainMap(MAP);
    expect(sitePathPrefix("daeatdiet-incheon")).toBe("");
  });

  it("매핑 없는 slug → 기존 path-based /<slug>", async () => {
    const { sitePathPrefix } = await importWithDomainMap(MAP);
    expect(sitePathPrefix("other-clinic")).toBe("/other-clinic");
  });

  it("env 미설정 (dev/staging) → 모든 slug path-based (무영향)", async () => {
    const { sitePathPrefix } = await importWithDomainMap(undefined);
    expect(sitePathPrefix("daeatdiet-incheon")).toBe("/daeatdiet-incheon");
  });
});

describe("renderMarkdownToHtml 본문 내부 링크 재작성 (opts.instanceSlug)", () => {
  it("커스텀 도메인 slug: /<slug>/... 링크 → 루트 기준으로 재작성", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(MAP);
    const html = renderMarkdownToHtml(
      "[굿바이 다이어트](/daeatdiet-incheon/treatments/goodbye-diet)",
      HOST,
      { instanceSlug: "daeatdiet-incheon" },
    );
    expect(html).toContain('href="/treatments/goodbye-diet"');
    expect(html).not.toContain("/daeatdiet-incheon/");
  });

  it("slug 홈 링크 (/<slug>) → /", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(MAP);
    const html = renderMarkdownToHtml("[홈](/daeatdiet-incheon)", HOST, {
      instanceSlug: "daeatdiet-incheon",
    });
    expect(html).toContain('href="/"');
  });

  it("anchor 붙은 slug 링크 (/<slug>#x) 는 홈 경로 보존 (/#x) — fragment-only 변질 금지", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(MAP);
    const html = renderMarkdownToHtml("[FAQ](/daeatdiet-incheon#community-faq)", HOST, {
      instanceSlug: "daeatdiet-incheon",
    });
    expect(html).toContain('href="/#community-faq"');
  });

  it("prefix 경계 안전 — /<slug>xxx/... 는 재작성하지 않음", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(MAP);
    const html = renderMarkdownToHtml("[x](/daeatdiet-incheonx/page)", HOST, {
      instanceSlug: "daeatdiet-incheon",
    });
    expect(html).toContain('href="/daeatdiet-incheonx/page"');
  });

  it("매핑 없는 slug (dev/path-based) 는 원본 유지", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(undefined);
    const html = renderMarkdownToHtml(
      "[진료](/daeatdiet-incheon/treatments/goodbye-diet)",
      "http://localhost:3000",
      { instanceSlug: "daeatdiet-incheon" },
    );
    expect(html).toContain('href="/daeatdiet-incheon/treatments/goodbye-diet"');
  });

  it("opts 미전달 시 기존 동작 그대로 (원본 유지)", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(MAP);
    const html = renderMarkdownToHtml(
      "[진료](/daeatdiet-incheon/treatments/goodbye-diet)",
      HOST,
    );
    expect(html).toContain('href="/daeatdiet-incheon/treatments/goodbye-diet"');
  });

  it("재작성된 내부 링크는 external 처리(nofollow/_blank) 되지 않음", async () => {
    const { renderMarkdownToHtml } = await importWithDomainMap(MAP);
    const html = renderMarkdownToHtml(
      "[진료](/daeatdiet-incheon/treatments/goodbye-diet)",
      HOST,
      { instanceSlug: "daeatdiet-incheon" },
    );
    expect(html).not.toContain("nofollow");
    expect(html).not.toContain("_blank");
  });
});
