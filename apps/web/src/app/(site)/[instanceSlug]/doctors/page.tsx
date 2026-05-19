// @glitzy/web/(site)/[instanceSlug]/doctors — P-003 Doctors List

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeDoctor, type DoctorProfileRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { DoctorCard } from "@/components/site/DoctorCard";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { doctorsListGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "의료진",
    description: `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
    canonicalPath: "/doctors",
  });
}

export default async function DoctorsListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
    const rows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
        FROM doctor_profile
       ORDER BY display_order ASC, id ASC
    `;
    return rows.map(normalizeDoctor);
  });
  if (!data) notFound();
  const base = `/${params.instanceSlug}`;
  const graph = doctorsListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
    initial.clinic,
    data,
    `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "의료진", href: null }]} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-fg-default">의료진</h1>
        {data.length === 0 ? (
          <p className="text-sm text-fg-muted">의료진 정보가 아직 등록되지 않았습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {data.map((d) => <DoctorCard key={d.slug} doctor={d} baseHref={base} />)}
          </div>
        )}
      </section>
    </>
  );
}
