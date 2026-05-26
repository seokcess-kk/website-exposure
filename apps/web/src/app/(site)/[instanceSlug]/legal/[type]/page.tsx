// @glitzy/web/(site)/[instanceSlug]/legal/[type] — P-013 Legal/Policy
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.2 PSR-DATA-07 + § 4.3 + PSR-DEFER-13 (= LL-DEFER-01 alias)
//
// v0.1 단계: DB CHECK 가 status='draft' 만 허용하고 RLS 는 status='published' 만 SELECT.
// → 항상 0 row → notFound().
// 합류 시점 (compliance-assistant + ComplianceRecord legalCounsel) 이후에 정상 노출.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeLegal, type LegalDocumentRow } from "@/lib/db-projection";
import { ArticleBody } from "@/components/site/ArticleBody";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { siteBaseUrl } from "@/lib/site-url";

export const revalidate = 60;

const CLOSED_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default async function LegalPage({
  params,
}: {
  params: { instanceSlug: string; type: string };
}) {
  if (!CLOSED_TYPES.includes(params.type as (typeof CLOSED_TYPES)[number])) notFound();

  const legal = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<LegalDocumentRow[]>`
      SELECT slug, document_type::text AS document_type, title, body,
             to_char(effective_date, 'YYYY-MM-DD') AS effective_date,
             updated_at
        FROM legal_document
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND document_type = ${params.type}::legal_document_type
       LIMIT 1
    `;
    return rows.length > 0 ? normalizeLegal(rows[0]!) : null;
  });
  if (!legal) notFound();

  const base = `/${params.instanceSlug}`;
  const hostOrigin = siteBaseUrl(params.instanceSlug); // PSRC-15 patch

  return (
    <>
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "정책", href: null },
        { label: legal.title, href: null },
      ]} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-fg-default">{legal.title}</h1>
        <p className="mb-8 text-sm text-fg-muted">시행일: {legal.effectiveDate}</p>
        <ArticleBody markdown={legal.body} hostOrigin={hostOrigin} />
      </section>
    </>
  );
}
