// @glitzy/web/(site)/[instanceSlug]/locations/[slug] — P-014 Location Detail (v0.1 main 1건)

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { formatAddress } from "@/lib/db-projection";
import { BusinessHoursTable } from "@/components/site/BusinessHoursTable";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { locationDetailGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { sitePathPrefix } from "@/lib/custom-domains";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  // soft-404 방지 — 스트리밍 셸(200) 전 metadata 단계에서 404 확정
  if (params.slug !== "main") notFound();
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial || !initial.locationMain) notFound();
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: initial.locationMain.name,
    description: `${initial.locationMain.name} · ${formatAddress(initial.locationMain)}`,
    canonicalPath: `/locations/${params.slug}`,
  });
}

export default async function LocationDetailPage({
  params,
}: {
  params: { instanceSlug: string; slug: string };
}) {
  // v0.1 단계 main 만 지원 (PSR-DEFER-11 부분)
  if (params.slug !== "main") notFound();
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial || !initial.locationMain) notFound();
  const loc = initial.locationMain;
  const base = sitePathPrefix(params.instanceSlug);
  const graph = locationDetailGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: `/locations/${loc.slug}` },
    initial.clinic,
    loc,
    `${loc.name} · ${formatAddress(loc)}`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[
        { label: "홈", href: base || "/" },
        { label: "위치", href: null },
        { label: loc.name, href: null },
      ]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-fg-default">{loc.name}</h1>
        <p className="mb-8 text-base text-fg-muted">{formatAddress(loc)}</p>

        <dl className="mb-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-fg-muted">주소</dt><dd className="font-medium text-fg-default">{formatAddress(loc)}</dd></div>
          {loc.telephone ? <div><dt className="text-fg-muted">전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
          {loc.email ? <div><dt className="text-fg-muted">이메일</dt><dd className="font-medium text-fg-default"><a href={`mailto:${loc.email}`}>{loc.email}</a></dd></div> : null}
        </dl>

        <h2 className="mb-3 text-xl font-semibold text-fg-default">진료 시간</h2>
        <BusinessHoursTable hours={loc.businessHours} />

        {initial.clinic.primaryCtas.length > 0 ? (
          <>
            <h2 className="mb-3 mt-10 text-xl font-semibold text-fg-default">예약 채널</h2>
            <ReservationChannels ctas={initial.clinic.primaryCtas} />
          </>
        ) : null}
      </section>
    </>
  );
}
