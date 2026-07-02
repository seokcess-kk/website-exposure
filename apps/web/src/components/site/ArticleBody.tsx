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
  const html = renderMarkdownToHtml(markdown, hostOrigin, { instanceSlug });
  return (
    <article className="prose-site max-w-3xl text-fg-default" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
