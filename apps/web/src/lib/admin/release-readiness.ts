// @glitzy/web/lib/admin/release-readiness — ADMIN_UX_REDESIGN v1.0 § 3.1
// 출시 준비도 조회 + 다음 작업 산정. release-evaluator wrapper.

import type postgres from "postgres";
import { evaluateInstanceRelease, type InstanceEvalInput, type InstanceReleaseStateRow } from "./release-evaluator";
import type { InstanceReleaseResult } from "./release-evaluator-types";

export type ReleaseReadiness = InstanceReleaseResult & {
  /** 가장 영향 큰 다음 작업 1건 (blockers[0] 또는 recommendedItems[0]) */
  nextAction: { label: string; href: string; kind: "blocking" | "recommended" } | null;
  /** quality-score 산정 안 evalInput 재사용 위한 echo (별 SQL 회피) */
  evalInput: InstanceEvalInput;
};

/**
 * loadReleaseReadiness — instance 단위 출시 준비도 조회.
 *   tx 안 모든 entity SELECT (collection 단위) → evaluateInstanceRelease → ReleaseReadiness.
 *   본 helper 는 server component 안 호출 (withSkeletonTx 안 tx 사용).
 */
export async function loadReleaseReadiness(
  tx: postgres.TransactionSql,
  instanceId: string,
  instanceSlug: string,
): Promise<ReleaseReadiness> {
  // (1) instance.release_state
  const instRows = await tx<{ release_state: InstanceReleaseStateRow }[]>`
    SELECT release_state FROM instance WHERE id = ${instanceId}::uuid LIMIT 1
  `;
  const releaseState = instRows[0]?.release_state ?? { state: "draft", lastTransitionAt: null, transitionBy: null, releasedAt: null };

  // (2) ClinicProfile
  const clinicRows = await tx<{
    name: string | null;
    description: string | null;
    logo_url: string | null;
    og_image_url: string | null;
    policy_contact_person: string | null;
    policy_contact_email: string | null;
    policy_contact_phone: string | null;
    primary_ctas: unknown;
  }[]>`
    SELECT name, description, logo_url, og_image_url, policy_contact_person, policy_contact_email, policy_contact_phone, primary_ctas
      FROM clinic_profile WHERE instance_id = ${instanceId}::uuid AND slug='clinic' LIMIT 1
  `;
  const clinicRow = clinicRows[0];
  const clinic = clinicRow ? {
    name: clinicRow.name,
    description: clinicRow.description,
    logoUrl: clinicRow.logo_url,
    ogImageUrl: clinicRow.og_image_url,
    policyContactPerson: clinicRow.policy_contact_person,
    policyContactEmail: clinicRow.policy_contact_email,
    policyContactPhone: clinicRow.policy_contact_phone,
    primaryCtasCount: Array.isArray(clinicRow.primary_ctas) ? clinicRow.primary_ctas.length : 0,
  } : null;

  // (3) LocationProfile(main)
  const locRows = await tx<{
    street_address: string | null;
    address_locality: string | null;
    address_region: string | null;
    metadata: unknown;
  }[]>`
    SELECT street_address, address_locality, address_region, metadata
      FROM location_profile WHERE instance_id = ${instanceId}::uuid AND slug='main' LIMIT 1
  `;
  const locRow = locRows[0];
  const location = locRow ? {
    streetAddress: locRow.street_address,
    addressLocality: locRow.address_locality,
    addressRegion: locRow.address_region,
    hasBusinessHours: extractHasBusinessHours(locRow.metadata),
  } : null;

  // (4) doctors
  const docs = await tx<{ slug: string; active: boolean; photo_url: string | null; bio: string | null }[]>`
    SELECT slug, active, photo_url, bio FROM doctor_profile WHERE instance_id = ${instanceId}::uuid
  `;
  const doctors = docs.map((d) => ({
    slug: d.slug,
    active: d.active,
    photoUrl: d.photo_url,
    bioLength: d.bio?.length ?? 0,
  }));

  // (5) content entities
  const treatments = await tx<{ slug: string; status: string }[]>`
    SELECT slug, status::text AS status FROM treatment_page WHERE instance_id = ${instanceId}::uuid
  `;
  const articles = await tx<{ slug: string; status: string; category_id: string }[]>`
    SELECT slug, status::text AS status, category_id FROM article WHERE instance_id = ${instanceId}::uuid
  `;
  const faqs = await tx<{ slug: string; status: string }[]>`
    SELECT slug, status::text AS status FROM faq WHERE instance_id = ${instanceId}::uuid
  `;
  const publications = await tx<{ slug: string; status: string }[]>`
    SELECT slug, status::text AS status FROM publication WHERE instance_id = ${instanceId}::uuid
  `;
  const media = await tx<{ slug: string; status: string }[]>`
    SELECT slug, status::text AS status FROM media_appearance WHERE instance_id = ${instanceId}::uuid
  `;
  const legals = await tx<{ document_type: string; status: string }[]>`
    SELECT document_type::text AS document_type, status::text AS status FROM legal_document WHERE instance_id = ${instanceId}::uuid
  `;
  const categories = await tx<{ id: string; slug: string }[]>`
    SELECT id, slug FROM article_category WHERE instance_id = ${instanceId}::uuid
  `;

  const input: InstanceEvalInput = {
    instanceSlug,
    clinic,
    location,
    doctors,
    treatments,
    articles: articles.map((a) => ({ slug: a.slug, status: a.status, categoryId: a.category_id })),
    faqs,
    publications,
    media,
    legals: legals.map((l) => ({ documentType: l.document_type as never, status: l.status })),
    categories,
    releaseState,
  };

  const evalResult = evaluateInstanceRelease(input);
  const nextAction = computeNextAction(evalResult);

  return { ...evalResult, nextAction, evalInput: input };
}

function extractHasBusinessHours(metadata: unknown): boolean {
  if (typeof metadata !== "object" || metadata === null) return false;
  const m = metadata as { businessHours?: { openingHours?: Array<{ dayOfWeek?: string[] }> } };
  return (m.businessHours?.openingHours?.length ?? 0) > 0;
}

function computeNextAction(result: InstanceReleaseResult): ReleaseReadiness["nextAction"] {
  if (result.blockers.length > 0) {
    const first = result.blockers[0]!;
    // blockers 의 message → href 안 매핑 어려움 (entity-evaluator 안 source 만 식별)
    // 현재 단순화: clinic-* 차단 시 → /clinic-profile · doctor-* → /doctors · 나머지 → /clinic-profile
    const href = first.field.startsWith("doctor") ? "/admin/{slug}/doctors"
      : first.field === "content" ? "/admin/{slug}/treatments"
      : first.field === "legals" ? "/admin/{slug}/clinic-profile#legal"
      : "/admin/{slug}/clinic-profile";
    return { label: first.message, href, kind: "blocking" };
  }
  if (result.recommendedItems.length > 0) {
    const first = result.recommendedItems[0]!;
    return { label: first.label, href: first.href, kind: "recommended" };
  }
  return null;
}
