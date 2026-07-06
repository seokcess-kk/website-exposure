// @glitzy/web/(site)/[instanceSlug]/sitemap.xml — per-instance sitemap
// SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
//      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)

import { NextResponse } from "next/server";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { siteBaseUrl } from "@/lib/site-url";

// 페이지 ISR(revalidate=300)과 대칭 — 요청당 DB 6-쿼리 dynamic 렌더 대신 5분 캐시.
export const revalidate = 300;

type SitemapEntry = {
  loc: string;
  lastmod: string; // ISO 8601
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};

export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  // PSRC-09 + PSR-DEFER-02: siteBaseUrl 이 host-aware — 커스텀 도메인이면 루트(slug 제거), 아니면 origin/<slug>.
  // canonical/JSON-LD 와 동일 헬퍼를 써야 sitemap loc 가 canonical 과 일치 (중복 URL 방지).
  const base = siteBaseUrl(params.instanceSlug);

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const clinicRows = await tx<{ updated_at: Date }[]>`
      SELECT updated_at FROM clinic_profile
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic' LIMIT 1
    `;
    const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
      SELECT slug, updated_at FROM location_profile
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main' LIMIT 1
    `;
    // D0011 public_reader policy 의 predicate 를 SQL 에도 명시 (이중 방어) —
    // prod WEB_PUBLIC_DATABASE_URL 이 admin role(RLS bypass 가능)일 수 있어 RLS 단독 의존 금지.
    const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
      SELECT slug, updated_at FROM doctor_profile
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND active = true
       ORDER BY display_order ASC, id ASC
    `;
    // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
    const doctorAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM doctor_profile
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND active = true
    `;
    const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
      SELECT slug, published_at, updated_at FROM treatment_page
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
       ORDER BY published_at DESC NULLS LAST
    `;
    const treatmentAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM treatment_page
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
    `;
    // MVP 단순화 — conditions 공개 라우트 제거됨. sitemap 미포함.
    // v0.4 EC-RENDER-06 (cycle 1 ECP-17): article sitemap URL — 실 category slug 사용 (JOIN article_category).
    const articleRows = await tx<{ slug: string; category_slug: string; published_at: Date | null; updated_at: Date }[]>`
      SELECT a.slug, ac.slug AS category_slug, a.published_at, a.updated_at
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE a.instance_id = ${ctx.instanceId}::uuid
         AND a.status = 'published' AND a.published_at IS NOT NULL AND a.published_at <= now()
       ORDER BY a.published_at DESC NULLS LAST
    `;
    // EXPOSURE_READINESS Phase A — list/category landing 색인 합류 위해 aggregate lastmod 회수.
    const articleAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM article
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
    `;
    // EXPOSURE_READINESS Phase A — article_category 색인 합류 (category landing).
    //   active category 는 row 가 1개 이상인 카테고리로 한정 (빈 카테고리는 색인 가치 낮음).
    const categoryRows = await tx<{ slug: string; latest: Date | null }[]>`
      SELECT ac.slug, MAX(GREATEST(a.updated_at, ac.updated_at)) AS latest
        FROM article_category ac
        JOIN article a ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       WHERE ac.instance_id = ${ctx.instanceId}::uuid
         AND a.status = 'published' AND a.published_at IS NOT NULL AND a.published_at <= now()
       GROUP BY ac.slug
       ORDER BY ac.slug ASC
    `;
    // EXPOSURE_READINESS Phase A — E-A-T 확장 entity (publication · media_appearance) sitemap 합류.
    const publicationRows = await tx<{ slug: string; updated_at: Date; published_at: Date | null }[]>`
      SELECT slug, updated_at, published_at FROM publication
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
       ORDER BY published_date DESC
    `;
    const publicationAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM publication
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
    `;
    const mediaRows = await tx<{ slug: string; updated_at: Date; published_at: Date | null }[]>`
      SELECT slug, updated_at, published_at FROM media_appearance
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
       ORDER BY published_date DESC
    `;
    const mediaAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM media_appearance
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
    `;
    // MVP 단순화 — /faq 공개 목록 라우트 제거됨. sitemap 미포함(인라인 FAQ 만 유지).
    const clinicLastmod = clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString();
    return {
      clinicLastmod,
      locationMain: locationRows[0] ?? null,
      doctors: doctorRows,
      doctorListLastmod: doctorAggRows[0]?.latest?.toISOString() ?? clinicLastmod,
      treatments: treatmentRows,
      treatmentListLastmod: treatmentAggRows[0]?.latest?.toISOString() ?? clinicLastmod,
      articles: articleRows,
      articleListLastmod: articleAggRows[0]?.latest?.toISOString() ?? clinicLastmod,
      categories: categoryRows,
      publications: publicationRows,
      publicationListLastmod: publicationAggRows[0]?.latest?.toISOString() ?? clinicLastmod,
      media: mediaRows,
      mediaListLastmod: mediaAggRows[0]?.latest?.toISOString() ?? clinicLastmod,
    };
  });
  if (!data) return new NextResponse("instance not found", { status: 404 });

  const entries: SitemapEntry[] = [];
  // P-001 Home
  entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
  // P-002 About
  entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
  // P-003 Doctors List — PSRC-07: 빈 상태도 항상 포함 (minimal 페이지)
  entries.push({ loc: `${base}/doctors`, lastmod: data.doctorListLastmod, changefreq: "monthly", priority: "0.7" });
  // P-004 Doctor Profile (each)
  for (const d of data.doctors) {
    entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
  }
  // P-005 Treatments List — PSRC-07: 빈 상태도 항상 포함
  entries.push({ loc: `${base}/treatments`, lastmod: data.treatmentListLastmod, changefreq: "monthly", priority: "0.8" });
  // P-006 Treatment Detail (each)
  for (const t of data.treatments) {
    entries.push({
      loc: `${base}/treatments/${t.slug}`,
      // lastmod = updated_at: 발행 후 본문 수정이 재크롤·최신성 신호로 반영되도록.
      // (published_at 고정은 편집을 절대 반영 못 해 재크롤 신호를 잃는다 — 2026-07-06 fix. 상세 4종 동일.)
      lastmod: t.updated_at.toISOString(),
      changefreq: "monthly",
      priority: "0.8",
    });
  }
  // EXPOSURE_READINESS Phase A — P-009 Articles List (전체 글 list landing) 색인.
  entries.push({ loc: `${base}/insights`, lastmod: data.articleListLastmod, changefreq: "weekly", priority: "0.7" });
  // EXPOSURE_READINESS Phase A — category landing 각 row (published article 1개 이상 보유 카테고리만).
  for (const c of data.categories) {
    entries.push({
      loc: `${base}/insights/${c.slug}`,
      lastmod: (c.latest ?? new Date()).toISOString(),
      changefreq: "monthly",
      priority: "0.6",
    });
  }
  // P-010 Article Detail (각 article — v0.4 실 category slug)
  for (const a of data.articles) {
    entries.push({
      loc: `${base}/insights/${a.category_slug}/${a.slug}`,
      lastmod: a.updated_at.toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    });
  }
  // P-012 Contact
  entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
  // P-014 Location Detail
  if (data.locationMain) {
    entries.push({
      loc: `${base}/locations/${data.locationMain.slug}`,
      lastmod: data.locationMain.updated_at.toISOString(),
      changefreq: "monthly",
      priority: "0.7",
    });
  }
  // EXPOSURE_READINESS Phase A — E-A-T 확장 (publications · media · community) sitemap 합류.
  entries.push({ loc: `${base}/publications`, lastmod: data.publicationListLastmod, changefreq: "monthly", priority: "0.6" });
  for (const p of data.publications) {
    entries.push({
      loc: `${base}/publications/${p.slug}`,
      lastmod: p.updated_at.toISOString(),
      changefreq: "yearly",
      priority: "0.5",
    });
  }
  entries.push({ loc: `${base}/media-appearances`, lastmod: data.mediaListLastmod, changefreq: "monthly", priority: "0.5" });
  for (const m of data.media) {
    entries.push({
      loc: `${base}/media-appearances/${m.slug}`,
      lastmod: m.updated_at.toISOString(),
      changefreq: "yearly",
      priority: "0.4",
    });
  }
  entries.push({ loc: `${base}/community`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "0.5" });
  // P-013 Legal — sitemap 제외 유지 (noindex · PSR-SEO-07 · 의료광고법 법정 페이지 색인 가치 낮음)

  const xml = renderSitemap(entries);
  return new NextResponse(xml, {
    status: 200,
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

// 네이버 서치어드바이저 파서는 lastmod 의 밀리초(.sssZ)를 거부하고 generic 500(errorCode=500
// "시스템 오류입니다")을 반환한다. W3C datetime 스펙상 밀리초는 유효하고 Google/Bing 은 무관하나,
// 네이버 호환을 위해 초 단위(YYYY-MM-DDThh:mm:ssZ)로 절삭한다. 모든 lastmod 는 toISOString() 산출물.
function formatLastmod(iso: string): string {
  return iso.replace(/\.\d+Z$/, "Z");
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${formatLastmod(e.lastmod)}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
