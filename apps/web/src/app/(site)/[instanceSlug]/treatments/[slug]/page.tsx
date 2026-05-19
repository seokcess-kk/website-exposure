// @glitzy/web/(site)/[instanceSlug]/treatments/[slug] — P-006 Treatment Detail

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { treatmentDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const t = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
        FROM treatment_page WHERE slug = ${params.slug} LIMIT 1
    `;
    return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  });
  if (!t) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: t.name,
    description: t.summary,
    canonicalPath: `/treatments/${t.slug}`,
    ogType: "article",
    imageUrl: t.heroImageUrl ?? undefined,
  });
}

export default async function TreatmentDetailPage({
  params,
}: {
  params: { instanceSlug: string; slug: string };
}) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();

  const treatment = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, updated_at
        FROM treatment_page
       WHERE slug = ${params.slug}
       LIMIT 1
    `;
    return rows.length > 0 ? normalizeTreatment(rows[0]!) : null;
  });
  if (!treatment) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug);
  const graph = treatmentDetailGraph(
    { siteBaseUrl: hostOrigin, pagePath: `/treatments/${treatment.slug}` },
    initial.clinic,
    initial.locationMain,
    treatment,
    treatment.summary,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "진료", href: `${base}/treatments` },
        { label: treatment.name, href: null },
      ]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        {treatment.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={treatment.heroImageUrl} alt="" className="mb-6 aspect-video w-full rounded-md object-cover" />
        ) : null}
        <h1 className="text-3xl font-bold text-fg-default">{treatment.name}</h1>
        <p className="mt-2 text-base text-fg-muted">{treatment.summary}</p>
        <div className="mt-8">
          <ArticleBody markdown={treatment.body} hostOrigin={hostOrigin} />
        </div>
        {initial.clinic.primaryCtas.length > 0 ? (
          <div className="mt-12 rounded-md border border-border bg-subtle p-6">
            <h2 className="mb-3 text-lg font-semibold text-fg-default">예약 / 상담</h2>
            <ReservationChannels ctas={initial.clinic.primaryCtas} />
          </div>
        ) : null}
      </section>
    </>
  );
}
