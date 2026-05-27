// @glitzy/web/e2e/global-setup — DEMO_ADMIN_AUTO_LOGIN_EMAIL 기반 storage state 사전 저장.
// /[instanceSlug]/demo-admin-enter route 안 진입 시 cookie set + admin/<slug> 안 redirect.
// 본 setup 안 한 번 진입 후 storage 안 cookie 저장 → tests 안 reuse.

import { request, type FullConfig } from "@playwright/test";

const INSTANCE_SLUG = process.env.E2E_INSTANCE_SLUG ?? "demo";

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) throw new Error("[e2e/global-setup] baseURL 미설정");

  const ctx = await request.newContext({ baseURL });
  const res = await ctx.get(`/${INSTANCE_SLUG}/demo-admin-enter`, {
    maxRedirects: 0,
    failOnStatusCode: false,
  });
  if (res.status() !== 307 && res.status() !== 302) {
    throw new Error(
      `[e2e/global-setup] demo-admin-enter 안 redirect 기대 — status ${res.status()}. ` +
        `DEMO_ADMIN_AUTO_LOGIN_EMAIL env 설정 확인 필요.`,
    );
  }
  // Set-Cookie 안 glitzy_session 가 포함됐는지 확인
  const setCookie = res.headers()["set-cookie"] ?? "";
  if (!setCookie.includes("glitzy_session=")) {
    throw new Error("[e2e/global-setup] glitzy_session cookie set 안 됨");
  }

  await ctx.storageState({ path: "e2e/.auth/storage.json" });
  await ctx.dispose();
}
