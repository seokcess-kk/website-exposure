// @glitzy/web/(site)/[instanceSlug]/conditions — P-007 Conditions List
// EXPOSURE_READINESS Phase B — 의료 검색 유입 페이지 list (전환 페이지 Treatment 와 분리).

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeCondition, type MedicalConditionPageRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { conditionsListGraph } from "@/lib/json-ld/builders";
import { siteBaseUrl } from "@/lib/site-url";
import { SectionHeading } from "@/components/site/ui";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "증상 안내",
    description: `${initial.clinic.name} 의 증상별 한방 진료 안내. 산후·갱년기·복부비만 등 상황별 한방 접근.`,
    canonicalPath: "/conditions",
  });
}

export default async function ConditionsListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<MedicalConditionPageRow[]>`
      SELECT slug, title, summary, body_markdown, hero_image_url, primary_treatment_id, metadata, published_at, updated_at
        FROM medical_condition_page
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND status = 'published'
       ORDER BY published_at DESC NULLS LAST
    `;
    return rows.map(normalizeCondition);
  });
  if (!data) notFound();
  const base = `/${params.instanceSlug}`;
  const graph = conditionsListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/conditions" },
    initial.clinic,
    data,
    `${initial.clinic.name} 의 증상별 한방 진료 안내`,
  );

  return (
    <>
      <JsonLdScript graph={graph} />
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "증상", href: null }]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="CONDITIONS"
            title="증상 안내"
            description={`${initial.clinic.name} 의 증상·상황별 한방 접근 — 산후·갱년기·복부·요요 등 자주 묻는 고민.`}
          />
          <div className="mt-16">
            {data.length === 0 ? (
              <p className="text-center text-sm text-fg-muted">등록된 증상 안내가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((c) => (
                  <Link
                    key={c.slug}
                    href={`${base}/conditions/${c.slug}`}
                    className="group relative block overflow-hidden rounded-[2rem] bg-elevated ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg"
                  >
                    {c.heroImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.heroImageUrl} alt={c.name} loading="lazy" decoding="async"
                           className="aspect-video w-full object-cover transition-transform duration-700 ease-supanova group-hover:scale-105" />
                    ) : (
                      <div aria-hidden className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated">
                        <iconify-icon icon="solar:medical-kit-bold-duotone" width="48" className="text-brand-primary/40" />
                      </div>
                    )}
                    <div className="flex flex-col gap-3 p-6 md:p-7">
                      <span className="text-xs font-medium uppercase tracking-wider text-brand-primary">증상</span>
                      <h3 className="text-xl font-bold tracking-tight text-ink-strong transition-colors duration-500 ease-supanova group-hover:text-brand-primary">
                        {c.name}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{c.summary}</p>
                      <span className="mt-1 inline-flex items-center text-xs font-medium text-brand-primary">자세히 보기</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
