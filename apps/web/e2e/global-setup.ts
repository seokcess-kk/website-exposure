// @glitzy/web/e2e/global-setup — 비밀번호 로그인으로 storage state 사전 저장.
// /sign-in 폼에 E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD 로 로그인 → glitzy_session 쿠키를 storage 에 저장 → tests reuse.
// 사전 준비: dev DB 에 해당 이메일의 operator 계정 생성(seed) + 비밀번호 설정(set-password).

import { chromium, type FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) throw new Error("[e2e/global-setup] baseURL 미설정");

  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "[e2e/global-setup] E2E_ADMIN_EMAIL·E2E_ADMIN_PASSWORD env 필요 " +
        "(seed 로 계정 생성 + set-password 로 비밀번호 설정 후 실행).",
    );
  }

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await Promise.all([
      page.waitForURL(/\/admin(\/|$)/, { timeout: 15000 }),
      page.click('button[type="submit"]'),
    ]);
    await context.storageState({ path: "e2e/.auth/storage.json" });
  } finally {
    await browser.close();
  }
}
