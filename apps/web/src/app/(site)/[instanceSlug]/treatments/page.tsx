// @glitzy/web/(site)/[instanceSlug]/treatments — P-005 Treatments List

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeTreatment, type TreatmentPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { TreatmentCard } from "@/components/site/TreatmentCard";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { treatmentsListGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { SectionHeading } from "@/components/site/ui";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "진료",
    description: `${initial.clinic.name}의 진료 안내`,
    canonicalPath: "/treatments",
  });
}

export default async function TreatmentsListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<TreatmentPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, pillar_slug, metadata, published_at, updated_at
        FROM treatment_page
       WHERE instance_id = ${ctx.instanceId}::uuid
       ORDER BY published_at DESC NULLS LAST
    `;
    return rows.map(normalizeTreatment);
  });
  if (!data) notFound();
  const base = `/${params.instanceSlug}`;
  const graph = treatmentsListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/treatments" },
    initial.clinic,
    data,
    `${initial.clinic.name}의 진료 안내`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "진료", href: null }]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="TREATMENTS"
            title="진료"
            description={`${initial.clinic.name} 의 진료 안내 — 체질 진단 기반 한방 맞춤 처방.`}
          />
          <div className="mt-16">
            {data.length === 0 ? (
              <p className="text-center text-sm text-fg-muted">등록된 진료 페이지가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {data.map((t) => <TreatmentCard key={t.slug} treatment={t} baseHref={base} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
