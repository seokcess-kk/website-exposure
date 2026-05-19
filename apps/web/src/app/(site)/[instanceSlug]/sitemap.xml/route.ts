// @glitzy/web/(site)/[instanceSlug]/sitemap.xml — per-instance sitemap
// SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
//      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)

import { NextResponse } from "next/server";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { siteOrigin } from "@/lib/site-url";

type SitemapEntry = {
  loc: string;
  lastmod: string; // ISO 8601
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
};

export async function GET(_req: Request, { params }: { params: { instanceSlug: string } }) {
  // PSRC-09 patch: siteOrigin() 가 PUBLIC_SITE_ORIGIN env 우선 → Host spoof 회피
  const origin = siteOrigin();
  const base = `${origin}/${params.instanceSlug}`;

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const clinicRows = await tx<{ updated_at: Date }[]>`
      SELECT updated_at FROM clinic_profile WHERE slug = 'clinic' LIMIT 1
    `;
    const locationRows = await tx<{ slug: string; updated_at: Date }[]>`
      SELECT slug, updated_at FROM location_profile WHERE slug = 'main' LIMIT 1
    `;
    const doctorRows = await tx<{ slug: string; updated_at: Date }[]>`
      SELECT slug, updated_at FROM doctor_profile ORDER BY display_order ASC, id ASC
    `;
    // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
    const doctorAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM doctor_profile
    `;
    const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
      SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
    `;
    const treatmentAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM treatment_page
    `;
    // v0.4 EC-RENDER-06 (cycle 1 ECP-17): article sitemap URL — 실 category slug 사용 (JOIN article_category).
    const articleRows = await tx<{ slug: string; category_slug: string; published_at: Date | null; updated_at: Date }[]>`
      SELECT a.slug, ac.slug AS category_slug, a.published_at, a.updated_at
        FROM article a
        JOIN article_category ac
          ON a.category_id = ac.id AND a.instance_id = ac.instance_id
       ORDER BY a.published_at DESC NULLS LAST
    `;
    // v0.4 EC-RENDER-06 (cycle 1 ECP-21): faq sitemap entry — published row 0건이어도 페이지 포함.
    //   lastmod fallback: clinic.updated_at.
    const faqAggRows = await tx<{ latest: Date | null }[]>`
      SELECT MAX(updated_at) AS latest FROM faq
    `;
    return {
      clinicLastmod: clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
      locationMain: locationRows[0] ?? null,
      doctors: doctorRows,
      doctorListLastmod: doctorAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
      treatments: treatmentRows,
      treatmentListLastmod: treatmentAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
      articles: articleRows,
      faqLastmod: faqAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
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
      lastmod: (t.published_at ?? t.updated_at).toISOString(),
      changefreq: "monthly",
      priority: "0.8",
    });
  }
  // P-010 Article Detail (각 article — v0.4 실 category slug)
  for (const a of data.articles) {
    entries.push({
      loc: `${base}/insights/${a.category_slug}/${a.slug}`,
      lastmod: (a.published_at ?? a.updated_at).toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    });
  }
  // P-011 FAQ — v0.4 EC-RENDER-06 (cycle 1 ECP-21): published row 0건이어도 페이지 포함.
  entries.push({ loc: `${base}/faq`, lastmod: data.faqLastmod, changefreq: "monthly", priority: "0.5" });
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
  // P-013 Legal — v0.1 단계 sitemap 제외 (noindex · PSR-SEO-07)

  const xml = renderSitemap(entries);
  return new NextResponse(xml, {
    status: 200,
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
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
