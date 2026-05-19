// @glitzy/web/components/site/ArticleBody — Markdown body 렌더 (sanitize-html)
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09

import { renderMarkdownToHtml } from "@/lib/markdown";

export function ArticleBody({ markdown, hostOrigin }: { markdown: string; hostOrigin: string }) {
  const html = renderMarkdownToHtml(markdown, hostOrigin);
  return (
    <article className="prose-site max-w-3xl text-fg-default" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
