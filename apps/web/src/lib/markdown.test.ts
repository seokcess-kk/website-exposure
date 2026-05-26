// PUBLIC_SITE_RENDER_PLAN v1.0 § 7 시나리오 LOCAL_PASS — Markdown sanitize
// 시나리오 #13 XSS payload escape · #20 외부 링크 rel

import { describe, it, expect } from "vitest";
import {
  renderMarkdownToHtml,
  renderMarkdownToPlainText,
  extractTocHeadings,
  slugifyHeading,
} from "./markdown";

const HOST = "https://example.com/glitzy-clinic";

describe("Markdown sanitize (시나리오 #13 XSS — execution 불가)", () => {
  it("<script> 태그는 escape — literal 텍스트로 출력 (execution X)", () => {
    const md = `# 제목\n\n<script>alert(1)</script>본문`;
    const html = renderMarkdownToHtml(md, HOST);
    // raw `<script>` open tag 가 그대로 있으면 XSS execution → 그건 없어야
    expect(html).not.toMatch(/<script[\s>]/);
    // escape 된 literal text (`&lt;script&gt;`) 는 안전 — browser 가 plain text 로 표시
    expect(html).toContain("&lt;script&gt;");
  });

  it("<img onerror=...> 같은 inline JS 도 escape — DOM img 미생성", () => {
    const md = `<img src=x onerror="alert(1)">`;
    const html = renderMarkdownToHtml(md, HOST);
    // 실 `<img>` DOM 으로 들어가면 안 됨
    expect(html).not.toMatch(/<img\s/);
    // escape 된 형태로 literal text (`&lt;img`) 출력
    expect(html).toContain("&lt;img");
  });

  it("일반 Markdown heading + paragraph 는 표준 출력", () => {
    const md = `# 큰 제목\n\n본문 단락.`;
    const html = renderMarkdownToHtml(md, HOST);
    expect(html).toContain("<h1>");
    expect(html).toContain("큰 제목");
    expect(html).toContain("<p>");
  });
});

describe("외부 링크 rel (시나리오 #20)", () => {
  it("외부 링크는 nofollow noopener noreferrer + target=_blank", () => {
    const md = `[외부](https://www.evil.example/path)`;
    const html = renderMarkdownToHtml(md, HOST);
    expect(html).toContain("nofollow");
    expect(html).toContain("noopener");
    expect(html).toContain("noreferrer");
    expect(html).toContain('target="_blank"');
  });

  it("내부 절대 path 링크 (`/...`) 는 rel 없음", () => {
    const md = `[내부](/glitzy-clinic/about)`;
    const html = renderMarkdownToHtml(md, HOST);
    expect(html).not.toContain("nofollow");
    expect(html).not.toContain("noopener");
  });

  it("protocol-relative (`//evil.example`) 는 외부 처리 (PSRC-12)", () => {
    const md = `[evil](//evil.example/foo)`;
    const html = renderMarkdownToHtml(md, HOST);
    expect(html).toContain("nofollow");
    expect(html).toContain("noopener");
  });

  it("같은 host 절대 URL 은 내부", () => {
    const md = `[same](${HOST}/contact)`;
    const html = renderMarkdownToHtml(md, HOST);
    expect(html).not.toContain("nofollow");
  });
});

// EAT_CONTENT_PLAN v1.0 EC-RENDER-05 — renderMarkdownToPlainText
describe("renderMarkdownToPlainText (JSON-LD Answer.text)", () => {
  it("heading/bold/italic/link/code 모두 평문 strip", () => {
    const md = "# 제목\n\n**굵게** *기울임* `코드` [링크](https://x)";
    const out = renderMarkdownToPlainText(md);
    expect(out).not.toContain("#");
    expect(out).not.toContain("**");
    expect(out).not.toContain("`");
    expect(out).not.toContain("(https://x)");
    expect(out).toContain("제목");
    expect(out).toContain("굵게");
    expect(out).toContain("기울임");
    expect(out).toContain("링크");
  });

  it("<script> tag strip — XSS payload 평문", () => {
    const md = "정상 답변 <script>alert(1)</script> 본문";
    const out = renderMarkdownToPlainText(md);
    expect(out).not.toContain("<script");
    expect(out).toContain("정상 답변");
  });

  it("list / blockquote / hr — 마커 strip", () => {
    const md = "- 항목 1\n- 항목 2\n\n> 인용\n\n---";
    const out = renderMarkdownToPlainText(md);
    expect(out).toContain("항목 1");
    expect(out).toContain("인용");
    expect(out).not.toMatch(/^- /m);
    expect(out).not.toMatch(/^> /m);
    expect(out).not.toMatch(/^---$/m);
  });
});

// 위키형 정보계층 — heading id auto-gen + TOC 추출
describe("slugifyHeading + extractTocHeadings + heading id (TOC 정합)", () => {
  it("영문 heading 은 소문자 slug + 공백 hyphen", () => {
    expect(slugifyHeading("Hello World")).toBe("hello-world");
  });

  it("한국어 heading 은 유지 (URL encoding 은 브라우저)", () => {
    expect(slugifyHeading("자가진단 체크리스트")).toBe("자가진단-체크리스트");
  });

  it("markdown inline marker strip + hyphen 정규화", () => {
    expect(slugifyHeading("**중요** `코드` 섹션")).toBe("중요-코드-섹션");
  });

  it("h2/h3 id 가 HTML 안 부착 + extractTocHeadings 와 동일 slug", () => {
    const md = "## 첫 번째\n\n본문\n\n### 하위\n\n본문2";
    const html = renderMarkdownToHtml(md, HOST);
    const toc = extractTocHeadings(md);
    expect(html).toContain('<h2 id="첫-번째">');
    expect(html).toContain('<h3 id="하위">');
    expect(toc).toEqual([
      { id: "첫-번째", label: "첫 번째", level: 1 },
      { id: "하위", label: "하위", level: 2 },
    ]);
  });

  it("동일 heading 중복은 -2/-3 suffix — minimal renderer 와 TOC 동기", () => {
    const md = "## 같은\n\n본문A\n\n## 같은\n\n본문B";
    const html = renderMarkdownToHtml(md, HOST);
    const toc = extractTocHeadings(md);
    expect(html).toMatch(/<h2 id="같은">/);
    expect(html).toMatch(/<h2 id="같은-2">/);
    expect(toc.map((t) => t.id)).toEqual(["같은", "같은-2"]);
  });

  it("h4 는 TOC item 미포함, 단 slug counter 는 진행", () => {
    const md = "## A\n\n#### A\n\n## A";
    const toc = extractTocHeadings(md);
    // h2(a) · h4(a-2) · h2(a-3) — toc 안 h4 제외 → [a, a-3]
    expect(toc.map((t) => t.id)).toEqual(["a", "a-3"]);
    // html 안 h4 가 a-2 로 부착되는지 확인 (renderer 일관성)
    const html = renderMarkdownToHtml(md, HOST);
    expect(html).toMatch(/<h4 id="a-2">/);
    expect(html).toMatch(/<h2 id="a-3">/);
  });

  it("h1 은 TOC 미포함 (eyebrow 역할) + id 미부착", () => {
    const md = "# 페이지 제목\n\n## 섹션";
    const html = renderMarkdownToHtml(md, HOST);
    const toc = extractTocHeadings(md);
    expect(html).toContain("<h1>페이지 제목</h1>");
    expect(toc).toEqual([{ id: "섹션", label: "섹션", level: 1 }]);
  });
});
