// @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
// SoT: SEARCH_STANDARDIZATION § 3.3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09
//      EXPOSURE_READINESS Phase A — AI 학습 bot 정책 결정 (2026-05-26 사용자 결정)
//
// 사용자 운영 결정 2026-05-26 (EXPOSURE_READINESS Phase A):
//   - AI 검색·답변·user fetch bot 허용 유지 (검색 결과 노출 기본)
//   - AI 학습 bot (GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai)
//     도 허용으로 전환 — GEO 우선 정책. 장기적 LLM 모델 안 브랜드 기억 형성 목적.
//   - 의료광고법: 웹 공개 자체가 광고이므로 학습 bot 노출이 추가 리스크 만들지 않음 (의료기관 콘텐츠 기준).
//   - 클라이언트별 권리 우선 (재사용·학습 차단 필요) 합류 시 ClinicProfile.metadata.aiCrawlerPolicy 로 row-driven (PSR-DEFER-10).

import { NextResponse } from "next/server";
import { siteBaseUrl } from "@/lib/site-url";

// 페이지 ISR(revalidate=300)과 대칭.
export const revalidate = 300;

export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  // PSRC-09 + PSR-DEFER-02: host-aware base (커스텀 도메인이면 루트, 아니면 origin/<slug>) → sitemap 과 일치.
  const sitemapUrl = `${siteBaseUrl(params.instanceSlug)}/sitemap.xml`;

  const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
# 정책: GEO 우선 — AI 학습 bot 포함 모든 검색·답변·학습 크롤러 허용 (admin/auth/api 제외)

# 일반 룰
User-agent: *
Disallow: /admin/
Disallow: /sign-in
Disallow: /sign-out
Disallow: /api/
Allow: /

# A. 일반 검색 색인 — Allow
User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

User-agent: Bingbot
Allow: /

# B. AI 검색 인덱싱·답변용 — Allow
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# C. User-triggered fetch — Allow
User-agent: ChatGPT-User
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-User
Allow: /

# D. AI 학습·모델 개선용 — Allow (GEO 정책 · 2026-05-26 사용자 결정)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new NextResponse(body, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
