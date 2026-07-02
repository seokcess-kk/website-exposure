// @glitzy/web/lib/markdown — SSR-safe Markdown 렌더
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.4 PSR-COMP-09 + § 6 작업 #9
//
// 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
// 외부 링크: rel="nofollow noopener noreferrer" 자동.
// LegalDocument body 도 동일 컴포넌트 사용 (CONTENT_STANDARDS § 7.1.1.1 면제는 어드민 저장 단계 결정).

import sanitizeHtml from "sanitize-html";
import { sitePathPrefix } from "./custom-domains";

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
  // h2/h3/h4 anchor link 안 aria-label
  "h1": ["aria-label"], "h2": ["aria-label"], "h3": ["aria-label"], "h4": ["aria-label"],
  code: ["class"],
  pre: ["class"],
};

const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];

export type MarkdownRenderOptions = {
  /**
   * 본문 안 `/<instanceSlug>/...` 내부 링크를 sitePathPrefix 기준으로 재작성.
   * 커스텀 도메인 매핑 slug 는 `/<slug>` prefix 링크가 매 클릭/크롤마다 middleware 301 을
   * 경유하므로 렌더 시점에 루트 기준 path 로 변환한다 (DB 본문은 slug-prefix 관례 유지).
   */
  instanceSlug?: string;
  /** 본문 '# ' 헤딩을 h2 로 강등 — 자체 h1 을 가진 페이지에서 h1 중복 방지 (ArticleBody 기본 사용). */
  demoteH1?: boolean;
};

/**
 * Markdown 또는 raw HTML → sanitized HTML.
 * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
 * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
 * 본 함수는 raw HTML / 단순 Markdown 양쪽 모두 동작.
 *
 * @param input — raw markdown 또는 raw HTML
 * @param hostOrigin — 사이트 도메인 (외부 링크 판별용 · v0.1 path-based 단계 `<host>/<instanceSlug>` 형태 prefix)
 */
export function renderMarkdownToHtml(input: string, hostOrigin: string, opts?: MarkdownRenderOptions): string {
  // 1) minimal Markdown → HTML (v0.1: 헤더 + 줄바꿈 + 링크 만)
  const html = minimalMarkdownToHtml(input, { demoteH1: opts?.demoteH1 ?? false });

  // 2) sanitize
  const sanitized = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    allowedSchemesAppliedToAttributes: ["href"],
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => {
        let href = attribs.href ?? "";
        if (opts?.instanceSlug && href.startsWith("/")) {
          href = rewriteInternalHref(href, opts.instanceSlug);
        }
        const isExternal = isExternalLink(href, hostOrigin);
        return {
          tagName,
          attribs: {
            ...attribs,
            ...(href ? { href } : {}),
            ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
          },
        };
      },
    },
  });
  return sanitized;
}

/**
 * 본문 내부 링크의 `/<instanceSlug>` prefix 를 sitePathPrefix 정책으로 재작성.
 * 커스텀 도메인 매핑이 없으면 (prefix == `/<slug>`) 원본 유지 — dev/path-based 무영향.
 */
function rewriteInternalHref(href: string, instanceSlug: string): string {
  const slugPrefix = `/${instanceSlug}`;
  const target = sitePathPrefix(instanceSlug);
  if (target === slugPrefix) return href;
  if (href === slugPrefix) return target || "/";
  if (href.startsWith(`${slugPrefix}/`)) {
    return target + href.slice(slugPrefix.length);
  }
  // /<slug>#x·/<slug>?q — target="" 이면 fragment/query-only 가 되어 현재 문서 기준으로 변질.
  // 홈 경로를 보존해 어느 페이지에서 렌더돼도 홈 anchor/query 를 가리키게 한다.
  if (href.startsWith(`${slugPrefix}#`) || href.startsWith(`${slugPrefix}?`)) {
    return (target || "/") + href.slice(slugPrefix.length);
  }
  return href;
}

/**
 * minimal Markdown → HTML (v0.1).
 * 지원: `# H1` · `## H2` · `### H3` · 빈 줄 단락 · `- ` 리스트 · `**bold**` · `*italic*` · `[link](url)` · `` `code` ``.
 * h2/h3/h4 에는 anchor id 자동 부착 (TOC navigation 정합).
 * PSR-DEFER-17 합류 시 remark/marked 로 전환.
 */
function minimalMarkdownToHtml(md: string, mdOpts?: { demoteH1?: boolean }): string {
  // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let inPara: string[] = [];
  const usedIds = new Set<string>();
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
      // demoteH1 — 자체 h1 을 가진 페이지의 본문에서 h1 중복 방지
      const level = h[1]!.length === 1 && mdOpts?.demoteH1 ? 2 : h[1]!.length;
      const text = h[2]!;
      if (level >= 2 && level <= 4) {
        const id = uniqueSlug(text, usedIds);
        out.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      } else {
        out.push(`<h${level}>${formatInline(text)}</h${level}>`);
      }
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

/**
 * heading text → URL-safe slug.
 *   - 한국어 그대로 유지 (URL encoding 은 browser 가 처리)
 *   - 공백·연속 hyphen → 단일 hyphen
 *   - markdown inline marker (`**`, `*`, `` ` ``) 제거
 *   - 영문은 소문자화
 */
export function slugifyHeading(text: string): string {
  let s = text.replace(/[*_`]/g, "").trim();
  s = s.toLowerCase();
  // 영문 알파벳·숫자·한글·일부 허용 외 모두 hyphen.
  s = s.replace(/[\s!"#$%&'()*+,./:;<=>?@[\\\]^{|}~·]+/g, "-");
  s = s.replace(/^-+|-+$/g, "");
  s = s.replace(/-{2,}/g, "-");
  if (s.length === 0) return "section";
  if (s.length > 80) s = s.slice(0, 80).replace(/-+$/g, "");
  return s;
}

function uniqueSlug(text: string, used: Set<string>): string {
  const base = slugifyHeading(text);
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  for (let i = 2; i < 1000; i += 1) {
    const candidate = `${base}-${i}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
  used.add(base);
  return base;
}

/**
 * Markdown body 에서 h2/h3 만 추출 → TOC items.
 *   h2 = level 1, h3 = level 2 (FloatingTOC.TocItem 정합).
 *   h4 는 제외 (depth 가 깊어지면 가독성 저하).
 */
export type HeadingItem = { id: string; label: string; level: 1 | 2 };

export function extractTocHeadings(md: string): HeadingItem[] {
  const items: HeadingItem[] = [];
  // minimalMarkdownToHtml 안 id 생성 알고리즘 (h2~h4 모두 카운터 소비) 과 동일하게 walk.
  // h4 는 TOC item 에는 미포함이나 id counter 는 진행시켜야 동일 slug 보장.
  const used = new Set<string>();
  const lines = md.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    const h = /^(#{2,4})\s+(.+)$/.exec(line);
    if (!h) continue;
    const depth = h[1]!.length; // 2, 3, 4
    const text = h[2]!.replace(/[*_`]/g, "").trim();
    if (!text) continue;
    const id = uniqueSlug(text, used);
    if (depth === 2 || depth === 3) {
      items.push({ id, label: text, level: (depth === 2 ? 1 : 2) as 1 | 2 });
    }
  }
  return items;
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

/**
 * 본문 markdown 의 "## 자주 묻는 질문" 섹션에서 Q&A 쌍 추출 — FAQPage JSON-LD 용.
 * CONTENT_AI_DRAFT 프롬프트가 강제하는 구조(`## 자주 묻는 질문` + `### Q. <질문>` + 답변 문단)와 정합.
 * 답변은 질문 다음 첫 문단만 — FAQ 가 마지막 H2 라서 뒤따르는 conclusion 문단이 흡수되지 않게 한다.
 * 섹션이 없거나 형식이 다르면 [] (graceful).
 */
export function extractFaqPairsFromMarkdown(md: string): Array<{ question: string; answer: string }> {
  const lines = md.split(/\r?\n/);
  const pairs: Array<{ question: string; answer: string }> = [];
  let inFaqSection = false;
  let currentQuestion: string | null = null;
  let answerLines: string[] = [];
  const flush = () => {
    if (currentQuestion) {
      const answer = renderMarkdownToPlainText(answerLines.join("\n")).trim();
      if (answer.length > 0) pairs.push({ question: currentQuestion, answer });
    }
    currentQuestion = null;
    answerLines = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      flush();
      inFaqSection = h2[1]!.includes("자주 묻는 질문");
      continue;
    }
    if (!inFaqSection) continue;
    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      flush();
      // 질문도 답변과 동일하게 평문화 (link/HTML/marker strip) 후 Q prefix 제거 (Q. / Q) / Q: / Q1. 등)
      currentQuestion =
        renderMarkdownToPlainText(h3[1]!).replace(/^Q[0-9]*[.):]?\s*/i, "").trim() || null;
      continue;
    }
    if (!currentQuestion) continue;
    if (line === "") {
      // 첫 문단 종료 — 답변 확정 (이후 문단은 conclusion 등으로 간주)
      if (answerLines.some((l) => l.trim() !== "")) flush();
      continue;
    }
    answerLines.push(raw);
  }
  flush();
  return pairs.slice(0, 10);
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
