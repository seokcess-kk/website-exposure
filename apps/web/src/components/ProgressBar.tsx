// @glitzy/web/components/ProgressBar — 모든 페이지 이동 시 상단 progress bar
// SoT: 사용자 검수 2026-05-20 — 메인/admin 공통 navigation feedback

"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function ProgressBar() {
  return (
    <AppProgressBar
      height="3px"
      color="#1a4d3a"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
