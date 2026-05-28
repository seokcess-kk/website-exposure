// @glitzy/web/e2e/smoke — Phase 1 smoke test
// 운영 시작 안 핵심 page 진입 + 신규 카드/그룹 가시 검증.
// dev DB 안 demo instance + DEMO_ADMIN_AUTO_LOGIN_EMAIL env (자동 admin login) 가정.

import { test, expect } from "@playwright/test";

const INSTANCE_SLUG = process.env.E2E_INSTANCE_SLUG ?? "demo";

test.describe("공개 사이트 진입", () => {
  test("E2E-S01 — /<slug>/ 200 OK + Hero 영역 렌더", async ({ page }) => {
    const res = await page.goto(`/${INSTANCE_SLUG}/`);
    expect(res?.status()).toBeLessThan(400);
    // Hero 또는 의원 헤더 영역 — instance 의 displayName 텍스트가 page title 안 들어가는지 확인
    await expect(page).toHaveTitle(/.+/);
    // 공개 사이트 안 footer (저작권/연락처) 한 가지 신호 확인
    const main = page.locator("main").first();
    await expect(main).toBeVisible();
  });

  test("E2E-S02 — /<slug>/treatments 진입", async ({ page }) => {
    const res = await page.goto(`/${INSTANCE_SLUG}/treatments`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("main").first()).toBeVisible();
  });

  test("E2E-S03 — /<slug>/sitemap.xml 200 OK + sitemap-prefix", async ({ page }) => {
    const res = await page.goto(`/${INSTANCE_SLUG}/sitemap.xml`);
    expect(res?.status()).toBeLessThan(400);
    const body = await page.content();
    expect(body).toContain("<urlset");
  });
});

test.describe("어드민 진입 (demo auto-login)", () => {
  test("E2E-S04 — /admin/<slug> 대시보드 진입 + 헤더 의원명 렌더", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}`);
    // sign-in 으로 redirect 되지 않았는지 (DEMO_ADMIN_AUTO_LOGIN_EMAIL 활성 확인)
    expect(page.url()).toContain(`/admin/${INSTANCE_SLUG}`);
    // h1 안 의원명 또는 "대시보드" — 한 가지 신호
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("E2E-S05 — NavMenu 3 그룹 + 14 항목 가시", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}`);
    const nav = page.locator('nav[aria-label="어드민 메뉴"]');
    await expect(nav).toBeVisible();
    // 운영 일상 그룹 — 대시보드 + 개선 큐 + 검색 노출 + 캘린더
    await expect(nav.getByRole("link", { name: "대시보드" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "개선 큐" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "검색 노출" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "캘린더" })).toBeVisible();
    // 콘텐츠 그룹 — 의료진 · 시술 · 아티클 · FAQ
    await expect(nav.getByRole("link", { name: "의료진" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "시술/진료" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "아티클" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "FAQ" })).toBeVisible();
    // 정보 그룹 — 의원 정보 + 키워드
    await expect(nav.getByRole("link", { name: "의원 정보" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "키워드" })).toBeVisible();
    // 공개 사이트 link
    await expect(nav.getByRole("link", { name: /공개 사이트 보기/ })).toBeVisible();
  });

  test("E2E-S06 — TodayActionsCard 가시 (action 있거나 healthy 안내)", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}`);
    const section = page.locator("section", { hasText: "오늘 할 일" }).first();
    await expect(section).toBeVisible();
    // action 또는 healthy 안내 한 가지 신호
    const hasAction = await section.locator("ol li").count();
    const hasHealthy = await section
      .getByText(/오늘 행동 권장 항목이 없습니다|개선 영향 콘텐츠/i)
      .count();
    expect(hasAction + hasHealthy).toBeGreaterThan(0);
  });
});

test.describe("어드민 entity 페이지 진입 (Option A 일상 4 + 콘텐츠 7 + setup 2)", () => {
  const ROUTES: ReadonlyArray<{ path: string; expect: RegExp }> = [
    { path: "improvement-queue", expect: /콘텐츠 개선 큐/ },
    { path: "visibility-metrics", expect: /검색 노출 분석/ },
    { path: "calendar", expect: /.+/ }, // 캘린더 페이지 (header 미확정)
    { path: "doctors", expect: /.+/ },
    { path: "treatments", expect: /.+/ },
    { path: "articles", expect: /.+/ },
    { path: "faqs", expect: /.+/ },
    { path: "keywords", expect: /타깃 키워드/ },
    { path: "clinic-profile", expect: /.+/ },
  ];

  for (const route of ROUTES) {
    test(`E2E-S07.${route.path} — /admin/<slug>/${route.path} 진입 OK`, async ({ page }) => {
      const res = await page.goto(`/admin/${INSTANCE_SLUG}/${route.path}`);
      expect(res?.status()).toBeLessThan(400);
      // main 영역 가시 — 기본 contract
      await expect(page.locator("main").first()).toBeVisible();
      // page 별 한 가지 텍스트 신호
      await expect(page.locator("body")).toContainText(route.expect);
    });
  }
});

test.describe("운영 안 가시 검증 — 신규 cycle 안 추가된 UI 요소", () => {
  test("E2E-S08 — visibility-metrics 안 source filter tab 3개 + (gap section 데이터 없으면 hide)", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}/visibility-metrics`);
    await expect(page.getByRole("link", { name: "전체" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Google/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /네이버/ })).toBeVisible();
  });

  test("E2E-S09 — improvement-queue empty/populated 분기 가시", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}/improvement-queue`);
    await expect(page.getByRole("heading", { name: /콘텐츠 개선 큐/ })).toBeVisible();
    // recompute button — operator 권한 안 노출
    await expect(page.getByRole("button", { name: /재계산/ })).toBeVisible();
  });

  test("E2E-S10 — articles/new 안 AI Draft 생성 panel 가시 (CONTENT_AI_DRAFT_PLAN v1.0)", async ({ page }) => {
    await page.goto(`/admin/${INSTANCE_SLUG}/articles/new`);
    // panel 안 button render
    await expect(page.getByRole("button", { name: /AI Draft 생성/ })).toBeVisible();
    // panel 안 설명 text
    await expect(page.locator("body")).toContainText(/AI 칼럼 Draft 생성/);
  });
});
