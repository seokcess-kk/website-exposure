// @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
// SoT: SEARCH_STANDARDIZATION § 3.3 + PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09
//      EXPOSURE_READINESS Phase A — AI 학습 bot 정책 결정 (2026-05-26 사용자 결정)
//
// 사용자 운영 결정 2026-05-26 (EXPOSURE_READINESS Phase A):
//   - AI 검색·답변·user fetch bot 허용 유지 (검색 결과 노출 기본)
//   - AI 학습 bot (GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai)
//     도 허용으로 전환 — GEO 우선 정책. 장기적 LLM 모델 안 브랜드 기억 형성 목적.
//   - 의료광고법: 웹 공개 자체가 광고이므로 학습 bot 노출이 추가 리스크 만들지 않음 (의료기관 콘텐츠 기준).

import { NextResponse } from "next/server";
import { siteBaseUrl } from "@/lib/site-url";

// 페이지 ISR(revalidate=300)과 대칭.
export const revalidate = 300;

// admin/auth/api 는 모든 크롤러에서 제외.
// robots 표준(RFC 9309 § 2.2.1): 크롤러는 자신과 매칭되는 그룹 '하나'만 따르고
//   User-agent:* 그룹은 무시한다. 따라서 named 봇 그룹마다 Disallow 를 반복해야 실제로 제외된다.
//   (2026-07-06 fix: 이전엔 named 그룹이 `Allow: /` 만 가져 Googlebot·Yeti·Bingbot 등 명시 봇이
//    * 그룹의 Disallow 를 적용받지 못해 /admin//api//sign-in 을 크롤 가능했다.)
const DISALLOW_PATHS = ["/admin/", "/sign-in", "/sign-out", "/api/"] as const;

// 명시 허용 봇 (GEO 정책 · 2026-05-26 사용자 결정). 각 그룹은 Disallow(공통) + Allow:/ 로 렌더된다.
const BOT_GROUPS: ReadonlyArray<{ comment: string; agents: readonly string[] }> = [
  { comment: "# A. 일반 검색 색인", agents: ["Googlebot", "Yeti", "Bingbot"] },
  { comment: "# B. AI 검색 인덱싱·답변용", agents: ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"] },
  { comment: "# C. User-triggered fetch", agents: ["ChatGPT-User", "Perplexity-User", "Claude-User"] },
  { comment: "# D. AI 학습·모델 개선용 (2026-05-26 사용자 결정)", agents: ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot", "anthropic-ai"] },
];

// 한 User-agent 그룹 = 공통 Disallow + Allow:/ (admin/auth/api 만 막고 나머지는 전부 허용).
function renderGroup(userAgent: string): string {
  return [
    `User-agent: ${userAgent}`,
    ...DISALLOW_PATHS.map((p) => `Disallow: ${p}`),
    "Allow: /",
  ].join("\n");
}

export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  // PSRC-09 + PSR-DEFER-02: host-aware base (커스텀 도메인이면 루트, 아니면 origin/<slug>) → sitemap 과 일치.
  const sitemapUrl = `${siteBaseUrl(params.instanceSlug)}/sitemap.xml`;

  const namedSections = BOT_GROUPS
    .map((g) => `${g.comment}\n${g.agents.map(renderGroup).join("\n\n")}`)
    .join("\n\n");

  const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
# 정책: GEO 우선 — AI 학습 bot 포함 모든 검색·답변·학습 크롤러 허용 (admin/auth/api 제외)

# 일반 룰
${renderGroup("*")}

${namedSections}

Sitemap: ${sitemapUrl}
`;

  return new NextResponse(body, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
