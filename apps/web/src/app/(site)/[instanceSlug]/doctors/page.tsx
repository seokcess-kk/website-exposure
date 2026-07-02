// @glitzy/web/(site)/[instanceSlug]/doctors — P-003 Doctors List (단아 v1.0)

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
import { SectionHeading } from "@/components/site/ui";
import { sitePathPrefix } from "@/lib/custom-domains";

export const revalidate = 300;

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
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, cv_photo_url, display_order, active, updated_at
        FROM doctor_profile
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND active = true
       ORDER BY display_order ASC, id ASC`;
    return rows.map(normalizeDoctor);
  });
  if (!data) notFound();
  const base = sitePathPrefix(params.instanceSlug);
  const graph = doctorsListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/doctors" },
    initial.clinic, data,
    `${initial.clinic.name}의 의료진 소개 페이지입니다.`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base || "/" }, { label: "의료진", href: null }]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            level={1}
            eyebrow="OUR DOCTORS"
            title="의료진"
            description={`${initial.clinic.name}의 의료진 — 환자 한 분 한 분의 체질을 진단하고 맞춤 처방을 제공합니다.`}
          />
          <div className="mt-16">
            {data.length === 0 ? (
              <p className="text-center text-sm text-fg-muted">의료진 정보가 아직 등록되지 않았습니다.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {data.map((d) => <DoctorCard key={d.slug} doctor={d} baseHref={base} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
