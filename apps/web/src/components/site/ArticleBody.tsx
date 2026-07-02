// @glitzy/web/components/site/ArticleBody — Markdown body 렌더 (sanitize-html)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09

import { renderMarkdownToHtml } from "@/lib/markdown";

export function ArticleBody({
  markdown,
  hostOrigin,
  instanceSlug,
}: {
  markdown: string;
  hostOrigin: string;
  /** 본문 내 `/<slug>/...` 내부 링크를 sitePathPrefix 기준으로 재작성 (커스텀 도메인 301 회피). */
  instanceSlug?: string;
}) {
  // demoteH1 — ArticleBody 를 쓰는 모든 페이지(아티클·시술·약력·법적고지·about)는 자체 h1 을 가짐.
  // 본문 markdown 의 '# ' 는 h2 로 강등해 페이지당 h1 1개 원칙 유지.
  const html = renderMarkdownToHtml(markdown, hostOrigin, { instanceSlug, demoteH1: true });
  return (
    <article className="prose-site max-w-3xl text-fg-default" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
