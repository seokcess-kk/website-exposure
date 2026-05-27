// @glitzy/web/playwright.config — E2E smoke test config
// dev server auto-spawn (Next.js 14 · port 3002) + chromium only (Phase 1 scope).

import { defineConfig, devices } from "@playwright/test";

// 사용자 환경 안 dev server 가 port 3000 안 default — 기존 server reuse 가 자연.
// port 3000 충돌 안 자동 fallback 3001 — Next.js 안 자동. 별 port 안 사용 시 E2E_PORT override.
const PORT = process.env.E2E_PORT ?? "3000";
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["**/global-setup.ts"],
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,        // dev server 안 shared state — serial 안전
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,                  // dev server 단일 — concurrency 1
  reporter: process.env.CI ? "github" : "list",
  timeout: 90_000,             // dev mode 컴파일 시간 확보 (Next.js dev 안 첫 진입 30~60s)
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    storageState: "e2e/.auth/storage.json",  // globalSetup 안 저장된 glitzy_session cookie reuse
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // dev server 가 이미 떠있을 때만 reuse — 없으면 별 spawn X (사용자가 직접 시작 가정).
  // E2E_NO_SERVER=1 안 webServer block 자체 skip.
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: "pnpm dev",
        cwd: ".",
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 180_000,
        stdout: "ignore",
        stderr: "pipe",
      },
});
