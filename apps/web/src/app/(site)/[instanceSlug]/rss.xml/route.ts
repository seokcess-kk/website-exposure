// @glitzy/web/(site)/[instanceSlug]/rss.xml — per-instance RSS 2.0 피드
// 네이버 서치어드바이저 '요청 > RSS 제출' 용 — sitemap 과 별도의 신규 콘텐츠 수집 트리거.
// 네이버 권장: 본문 전체 + 이미지 포함 (content:encoded).
//
// sitemap.xml/route.ts 와 동일 원칙:
//   - siteBaseUrl 로 canonical URL 생성 (커스텀 도메인이면 루트 기준 — 중복 URL 방지)
//   - status='published' AND published_at<=now() 를 SQL 에 명시 (RLS published-only 의 이중 방어
//     — prod WEB_PUBLIC_DATABASE_URL 이 admin role 일 가능성 대비)

import { NextResponse } from "next/server";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { siteBaseUrl, siteOrigin } from "@/lib/site-url";
import { canonicalHostForSlug } from "@/lib/custom-domains";
import { renderMarkdownToHtml } from "@/lib/markdown";

// 페이지 ISR(revalidate=300)과 대칭 — 신규 발행은 최대 5분 내 피드 반영.
export const revalidate = 300;

const FEED_ITEM_LIMIT = 50;

type FeedArticleRow = {
  slug: string;
  title: string;
  summary: string;
  body_markdown: string;
  hero_image_url: string | null;
  published_at: Date;
  category_slug: string;
  author_name: string | null;
};

export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  const base = siteBaseUrl(params.instanceSlug);
  // content:encoded 안 내부 링크 절대화용 origin —
  //   커스텀 도메인: https://<host> (본문 링크는 렌더 시 루트 기준으로 재작성됨)
  //   path-based: PUBLIC_SITE_ORIGIN (본문 링크는 /<slug>/... 그대로)
  const customHost = canonicalHostForSlug(params.instanceSlug);
  const origin = customHost ? `https://${customHost}` : siteOrigin();

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const clinicRows = await tx<{ name: string; description: string | null }[]>`
      SELECT name, description FROM clinic_profile
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic' LIMIT 1
    `;
    if (clinicRows.length === 0) return null;

    const articleRows = await tx<FeedArticleRow[]>`
      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url, a.published_at,
             ac.slug AS category_slug, dp.name AS author_name
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
        LEFT JOIN doctor_profile dp
          ON a.author_doctor_id = dp.id AND a.instance_id = dp.instance_id
       WHERE a.instance_id = ${ctx.instanceId}::uuid
         AND a.status = 'published'
         AND a.published_at <= now()
       ORDER BY a.published_at DESC
       LIMIT ${FEED_ITEM_LIMIT}
    `;
    return { clinic: clinicRows[0]!, articles: articleRows };
  });
  if (!data) return new NextResponse("instance not found", { status: 404 });

  const items = data.articles.map((a) => {
    const link = `${base}/insights/${a.category_slug}/${a.slug}`;
    // 본문 전체 HTML — 내부 링크는 sitePathPrefix 정책으로 재작성 후 절대 URL 화 (RSS 리더 호환).
    // (?!\/) — protocol-relative(//host/...) 외부 링크 오탐 방지. fragment-only 는 아티클 URL 기준 절대화.
    const bodyHtml = renderMarkdownToHtml(a.body_markdown, base, { instanceSlug: params.instanceSlug })
      .replace(/href="\/(?!\/)/g, `href="${origin}/`)
      .replace(/href="#/g, `href="${link}#`);
    const heroHtml = a.hero_image_url
      ? `<p><img src="${escapeXml(a.hero_image_url)}" alt="${escapeXml(a.title)}" /></p>`
      : "";
    return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${a.published_at.toUTCString()}</pubDate>
      ${a.author_name ? `<dc:creator>${escapeXml(a.author_name)}</dc:creator>` : ""}
      <description>${escapeXml(a.summary)}</description>
      <content:encoded><![CDATA[${escapeCdata(heroHtml + bodyHtml)}]]></content:encoded>
    </item>`;
  });

  const lastBuildDate = data.articles[0]?.published_at ?? new Date();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(data.clinic.name)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(data.clinic.description ?? `${data.clinic.name} 건강 정보`)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** CDATA 안 `]]>` 시퀀스 분할 escape. */
function escapeCdata(s: string): string {
  return s.replaceAll("]]>", "]]]]><![CDATA[>");
}
