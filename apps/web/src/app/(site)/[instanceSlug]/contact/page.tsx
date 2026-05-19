// @glitzy/web/(site)/[instanceSlug]/contact — P-012 Contact

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { formatAddress } from "@/lib/db-projection";
import { BusinessHoursTable } from "@/components/site/BusinessHoursTable";
import { ReservationChannels } from "@/components/site/ReservationChannels";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { contactGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "연락처",
    description: `${initial.clinic.name} 연락처 · 위치 · 진료 시간 · 예약 채널 안내`,
    canonicalPath: "/contact",
  });
}

export default async function ContactPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  if (!initial.locationMain) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 text-center text-sm text-fg-muted">
        본원 위치 정보가 등록되지 않았습니다.
      </section>
    );
  }
  const base = `/${params.instanceSlug}`;
  const loc = initial.locationMain;
  const graph = contactGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/contact" },
    initial.clinic,
    loc,
    `${initial.clinic.name} 연락처 · 위치 · 진료 시간 · 예약 채널 안내`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "연락처", href: null }]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-fg-default">연락처</h1>
        <p className="mb-8 text-base text-fg-muted">방문·전화·예약 정보 안내</p>

        <dl className="mb-10 grid grid-cols-1 gap-3 rounded-md border border-border bg-elevated p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-fg-muted">주소</dt><dd className="font-medium text-fg-default">{formatAddress(loc)}</dd></div>
          {loc.telephone ? <div><dt className="text-fg-muted">대표 전화</dt><dd className="font-medium text-fg-default"><a href={`tel:${loc.telephone}`}>{loc.telephone}</a></dd></div> : null}
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
