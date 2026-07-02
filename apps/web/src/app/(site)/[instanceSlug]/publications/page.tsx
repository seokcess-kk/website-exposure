// @glitzy/web/(site)/[instanceSlug]/publications — 논문 list (단아 v1.0)

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizePublication, type PublicationRow, type PublicationProjection } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { SectionHeading, Card } from "@/components/site/ui";
import { sitePathPrefix } from "@/lib/custom-domains";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "논문",
    description: `${initial.clinic.name} 의료진의 학술 활동 및 논문`,
    canonicalPath: "/publications",
  });
}

export default async function PublicationsListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<PublicationRow[]>`
      SELECT slug, title, authors, journal,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id, published_at, updated_at
        FROM publication
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
       ORDER BY published_date DESC NULLS LAST`;
    return rows.map(normalizePublication);
  });
  if (!data) notFound();
  const base = sitePathPrefix(params.instanceSlug);

  return (
    <>
      <Breadcrumb items={[{ label: "홈", href: base || "/" }, { label: "논문", href: null }]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            level={1}
            eyebrow="PUBLICATIONS"
            title="논문"
            description={`${initial.clinic.name} 의료진의 학술 활동 및 발표 논문입니다.`}
          />
          <div className="mt-16">
            {data.length === 0 ? (
              <p className="text-center text-sm text-fg-muted">아직 등록된 논문이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-6">
                {data.map((p) => <PublicationCard key={p.slug} pub={p} base={base} />)}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function PublicationCard({ pub, base }: { pub: PublicationProjection; base: string }) {
  return (
    <li>
      <Card padding="lg">
        <Link href={`${base}/publications/${pub.slug}`} className="group block">
          <h2 className="font-serif-heading text-xl text-ink-strong group-hover:text-brand-primary">{pub.title}</h2>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
          <span>{pub.authors.join(", ")}</span>
          {pub.journal && (<><span aria-hidden className="text-brand-accent">·</span><span className="italic">{pub.journal}</span></>)}
          <span aria-hidden className="text-brand-accent">·</span>
          <span>{pub.publishedDate}</span>
          {pub.doi && (
            <>
              <span aria-hidden className="text-brand-accent">·</span>
              <code className="rounded-full bg-brand-accent-soft/60 px-2 py-0.5 font-mono text-[10px] text-ink-strong">DOI {pub.doi}</code>
            </>
          )}
        </div>
        <p className="mt-4 leading-relaxed text-fg-default">{pub.summary}</p>
        <div className="mt-5 flex gap-4 text-xs">
          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
            원문 ↗
          </a>
          {pub.pubmedId && (
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pubmedId}/`} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">
              PubMed ↗
            </a>
          )}
        </div>
      </Card>
    </li>
  );
}
