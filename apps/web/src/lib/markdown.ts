// @glitzy/web/lib/markdown — SSR-safe Markdown 렌더
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
//
// 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
// 외부 링크: rel="nofollow noopener noreferrer" 자동.
// LegalDocument body 도 동일 컴포넌트 사용 (CONTENT_STANDARDS § 7.1.1.1 면제는 어드민 저장 단계 결정).

import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4",
  "p",
  "ul", "ol", "li",
  "a",
  "strong", "em", "code", "pre",
  "blockquote",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "br",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  "*": ["class", "id", "lang"],
  a: ["href", "rel", "target"],
  code: ["class"],
  pre: ["class"],
};

const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];

/**
 * Markdown 또는 raw HTML → sanitized HTML.
 * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
 * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
 * 본 함수는 raw HTML / 단순 Markdown 양쪽 모두 동작.
 *
 * @param input — raw markdown 또는 raw HTML
 * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
 */
export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
  // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
  const html = minimalMarkdownToHtml(input);

  // 2) sanitize
  const sanitized = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    allowedSchemesAppliedToAttributes: ["href"],
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => {
        const href = attribs.href ?? "";
        const isExternal = isExternalLink(href, hostOrigin);
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
          },
        };
      },
    },
  });
  return sanitized;
}

/**
 * minimal Markdown → HTML (v0.1).
 * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
 * PSR-DEFER-17 합류 시 remark/marked 로 전환.
 */
function minimalMarkdownToHtml(md: string): string {
  // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let inPara: string[] = [];
  const flushPara = () => {
    if (inPara.length === 0) return;
    out.push(`<p>${formatInline(inPara.join(" "))}</p>`);
    inPara = [];
  };
  const flushList = () => {
    if (!inList) return;
    out.push("</ul>");
    inList = false;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") {
      flushPara();
      flushList();
      continue;
    }
    const h = /^(#{1,4})\s+(.+)$/.exec(line);
    if (h) {
      flushPara();
      flushList();
      const level = h[1]!.length;
      out.push(`<h${level}>${formatInline(h[2]!)}</h${level}>`);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushPara();
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${formatInline(line.slice(2))}</li>`);
      continue;
    }
    flushList();
    inPara.push(line);
  }
  flushPara();
  flushList();
  return out.join("\n");
}

function formatInline(text: string): string {
  let out = escapeHtml(text);
  // [link](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // *italic*
  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  // `code`
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * EAT_CONTENT_PLAN v1.0 EC-RENDER-05 (cycle 1 ECP-19):
 *   Markdown → plain text strip — JSON-LD `Answer.text` 용.
 *   heading `#` 제거 · `*bold*` `_italic_` 제거 · link `[text](url)` → `text` · code/blockquote/list literal.
 */
export function renderMarkdownToPlainText(input: string): string {
  let out = input;
  // 코드 블록 (```...```) — 내용 유지, 펜스만 제거
  out = out.replace(/```[a-zA-Z0-9-]*\n([\s\S]*?)```/g, (_, body) => String(body));
  // inline code (`code`)
  out = out.replace(/`([^`]+)`/g, "$1");
  // bold / italic — Markdown 마커 strip (** or __ for bold, * or _ for italic)
  out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  out = out.replace(/__([^_]+)__/g, "$1");
  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
  out = out.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");
  // cycle 1 ECC-05 patch: image 치환을 link 치환보다 먼저.
  //   link regex `\[...\]\(...\)` 가 image `![alt](url)` 의 `[alt](url)` 을 소비하면 `!alt` 잔존 → 품질 이슈.
  // image ![alt](url) → alt
  out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  // link [text](url) → text
  out = out.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  // heading (#, ##, ###, ####) — 마커 strip
  out = out.replace(/^\s*#{1,6}\s+/gm, "");
  // blockquote (>)
  out = out.replace(/^\s*>\s?/gm, "");
  // list bullets — '- ' / '* ' / '+ ' / 'n. ' → 평문
  out = out.replace(/^\s*[-*+]\s+/gm, "");
  out = out.replace(/^\s*\d+\.\s+/gm, "");
  // hr (--- / *** / ___)
  out = out.replace(/^\s*[-_*]{3,}\s*$/gm, "");
  // HTML tags — strip (sanitize-html 사용 안 함 — 평문이므로 simple strip)
  out = out.replace(/<[^>]+>/g, "");
  // multi blank line collapse + trim
  out = out.replace(/[ \t]+/g, " ");
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}

function isExternalLink(href: string, hostOrigin: string): boolean {
  // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
  if (href.startsWith("//")) return true;
  if (href.startsWith("/") || href.startsWith("#")) return false;
  try {
    const u = new URL(href, hostOrigin);
    const host = new URL(hostOrigin).host;
    return u.host !== host;
  } catch {
    return false;
  }
}
