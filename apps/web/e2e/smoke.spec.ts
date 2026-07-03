// @glitzy/web/e2e/smoke — MVP 단순화 v2.0 smoke test (재설계 2026-06-30)
// 운영 시작 안 핵심 page 진입 + 새 7항목 nav 가시 검증.
// dev DB 안 demo instance + 비밀번호 로그인 세션(global-setup storage state) 가정.

import { test, expect } from "@playwright/test";

const INSTANCE_SLUG = process.env.E2E_INSTANCE_SLUG ?? "demo";

test.describe("공개 사이트 진입", () => {
  test("E2E-S01 — /<slug>/ 200 OK + Hero 영역 렌더", async ({ page }) => {
    const res = await page.goto(`/${INSTANCE_SLUG}/`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/);
    const main = page.locator("main").first();
    await expect(main).toBeVisible();
  });

  test("E2E-S02 — /<slug>/treatments 진입", async ({ page }) => {
    const res = await page.goto(`/${INSTANCE_SLUG}/treatments`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("E2E-S03 — /<slug>/sitemap.xml 200 OK + urlset", async ({ page }) => {
    const res = await page.goto(`/${INSTANCE_SLUG}/sitemap.xml`);
    expect(res?.status()).toBeLessThan(400);
    const body = await page.content();
    expect(body).toContain("<urlset");
  });
});

test.describe("어드민 진입 (저장된 세션)", () => {
  test("E2E-S04 — /admin/<slug> 대시보드 진입 + 헤더 의원명 렌더", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}`);
    // sign-in 으로 redirect 되지 않았는지 (global-setup storage state 세션 유효 확인)
    expect(page.url()).toContain(`/admin/${INSTANCE_SLUG}`);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("E2E-S05 — NavMenu 7 항목 가시 (MVP 단순화)", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}`);
    const nav = page.locator('nav[aria-label="어드민 메뉴"]');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "대시보드" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "의료진" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "시술/진료" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "아티클" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "키워드" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "검색 노출" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "의원 정보" })).toBeVisible();
    await expect(nav.getByRole("link", { name: /공개 사이트 보기/ })).toBeVisible();
    // 제거된 메뉴 — 비노출 확인
    await expect(nav.getByRole("link", { name: "개선 큐" })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "캘린더" })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "FAQ" })).toHaveCount(0);
  });
});

test.describe("어드민 entity 페이지 진입 (MVP 핵심 라우트)", () => {
  const ROUTES: ReadonlyArray<{ path: string; expect: RegExp }> = [
    { path: "visibility-metrics", expect: /검색 노출 분석/ },
    { path: "doctors", expect: /.+/ },
    { path: "treatments", expect: /.+/ },
    { path: "articles", expect: /.+/ },
    { path: "keywords", expect: /타깃 키워드/ },
    { path: "clinic-profile", expect: /.+/ },
  ];

  for (const route of ROUTES) {
    test(`E2E-S06.${route.path} — /admin/<slug>/${route.path} 진입 OK`, async ({ page }) => {
      const res = await page.goto(`/admin/${INSTANCE_SLUG}/${route.path}`);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(page.locator("body")).toContainText(route.expect);
    });
  }
});

test.describe("운영 안 가시 검증 — 잔존 UI 요소", () => {
  test("E2E-S07 — visibility-metrics 안 source filter tab 3개", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}/visibility-metrics`);
    await expect(page.getByRole("link", { name: "전체" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Google/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /네이버/ })).toBeVisible();
  });

  test("E2E-S08 — articles/new 안 AI Draft 생성 panel 가시", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}/articles/new`);
    await expect(page.getByRole("button", { name: /AI Draft 생성/ })).toBeVisible();
    await expect(page.locator("body")).toContainText(/AI 칼럼 Draft 생성/);
  });
});
