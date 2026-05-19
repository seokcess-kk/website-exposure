// PUBLIC_SITE_RENDER_PLAN v1.0 § 7 시나리오 LOCAL_PASS — Markdown sanitize
// 시나리오 #13 XSS payload escape · #20 외부 링크 rel

import { describe, it, expect } from "vitest";
import { renderMarkdownToHtml, renderMarkdownToPlainText } from "./markdown";

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
