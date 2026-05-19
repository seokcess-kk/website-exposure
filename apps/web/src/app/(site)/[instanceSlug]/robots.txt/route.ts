// @glitzy/web/(site)/[instanceSlug]/robots.txt — per-instance robots
// SoT: SEARCH_STANDARDIZATION § 3.3 disallowTraining 출력 예시 (line-by-line 정합)
//      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.3 PSR-SEO-09 (cycle2 PSR-22 + cycle3 PSR-30 정합)

import { NextResponse } from "next/server";
import { siteOrigin } from "@/lib/site-url";

export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
  const origin = siteOrigin();
  const sitemapUrl = `${origin}/${params.instanceSlug}/sitemap.xml`;

  // SEARCH_STANDARDIZATION § 3.3 `disallowTraining` 출력 예시 그대로 (v0.1 starter)
  // 운영 단계 ClinicProfile.metadata.aiCrawlerPolicy row-driven 합류는 PSR-DEFER-10
  const body = `# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)

# 일반 룰
User-agent: *
Disallow: /admin/
Disallow: /auth/
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

# D. AI 학습·모델 개선용 — Disallow
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

# meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)

Sitemap: ${sitemapUrl}
`;

  return new NextResponse(body, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
