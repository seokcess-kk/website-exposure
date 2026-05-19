// @glitzy/web/(site)/[instanceSlug]/page — P-001 Home
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08 (Home row)
//   Hero · DoctorsTeaser (3명) · TreatmentsTeaser (3건) · ContactCard

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import {
  normalizeDoctor,
  normalizeTreatment,
  normalizeArticle,
  formatAddress,
  type DoctorProfileRow,
  type TreatmentPageRow,
  type ArticleRow,
} from "@/lib/db-projection";
import { Hero } from "@/components/site/Hero";
import { DoctorCard } from "@/components/site/DoctorCard";
import { TreatmentCard } from "@/components/site/TreatmentCard";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { homeGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: initial.clinic.slogan ?? initial.clinic.name,
    description: initial.clinic.description,
    canonicalPath: "/",
    ogType: "website",
  });
}

export default async function HomePage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const doctorRows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile
       ORDER BY display_order ASC, id ASC
       LIMIT 3
    `;
    const treatmentRows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
        FROM treatment_page
       ORDER BY published_at DESC NULLS LAST
       LIMIT 3
    `;
    // PSRC-13 patch: Home P-001 article teaser (PAGE_TYPES P-001 §1.4)
    const articleRows = await tx<ArticleRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
        FROM article
       ORDER BY published_at DESC NULLS LAST
       LIMIT 3
    `;
    return {
      doctors: doctorRows.map(normalizeDoctor),
      treatments: treatmentRows.map(normalizeTreatment),
      articles: articleRows.map(normalizeArticle),
    };
  });

  const baseHref = `/${params.instanceSlug}`;
  const cta = initial.clinic.primaryCtas[0] ?? null;
  const graph = homeGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/" },
    initial.clinic,
    initial.locationMain,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Hero clinic={initial.clinic} cta={cta} />

      {data && data.doctors.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-fg-default">의료진</h2>
            <Link href={`${baseHref}/doctors`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.doctors.map((d) => <DoctorCard key={d.slug} doctor={d} baseHref={baseHref} />)}
          </div>
        </section>
      ) : null}

      {data && data.treatments.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-fg-default">진료</h2>
            <Link href={`${baseHref}/treatments`} className="text-sm text-brand-primary hover:text-brand-primary-hover">전체 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.treatments.map((t) => <TreatmentCard key={t.slug} treatment={t} baseHref={baseHref} />)}
          </div>
        </section>
      ) : null}

      {data && data.articles.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-fg-default">최신 인사이트</h2>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.articles.map((a) => (
              <li key={a.slug} className="rounded-md border border-border bg-elevated p-4">
                <Link href={`${baseHref}/insights/general/${a.slug}`} className="font-medium text-fg-default hover:text-brand-primary">{a.headline}</Link>
                <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{a.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {initial.locationMain ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-fg-default">연락처 · 위치</h2>
            <Link href={`${baseHref}/contact`} className="text-sm text-brand-primary hover:text-brand-primary-hover">상세 보기 →</Link>
          </div>
          <div className="rounded-md border border-border bg-elevated p-6">
            <p className="text-base text-fg-default">{formatAddress(initial.locationMain)}</p>
            {initial.locationMain.telephone ? (
              <p className="mt-2 text-sm text-fg-muted">대표 전화: <a href={`tel:${initial.locationMain.telephone}`} className="text-brand-primary hover:text-brand-primary-hover">{initial.locationMain.telephone}</a></p>
            ) : null}
            {initial.clinic.primaryCtas.length > 0 ? (
              <div className="mt-4">
                <ReservationChannels ctas={initial.clinic.primaryCtas} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
