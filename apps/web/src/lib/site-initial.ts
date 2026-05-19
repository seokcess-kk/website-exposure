// @glitzy/web/lib/site-initial — layout-level data loader for public site
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-04 + § 6 작업 #6
//
// (site) layout 안 한 번 SELECT — Header/Footer + 모든 페이지가 공유.
// instance 미존재 / inactive → null (page 가 notFound() 처리).
//
// PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
// layout / page / generateMetadata 가 모두 같은 transaction 결과 공유.

import { cache } from "react";
import { withPublicTenantTransaction } from "./public-tenant";
import {
  normalizeClinic,
  normalizeLocation,
  type ClinicProjection,
  type ClinicProfileRow,
  type LocationProjection,
  type LocationProfileRow,
} from "./db-projection";

export type SiteInitial = {
  readonly instanceSlug: string;
  readonly instanceId: string;
  readonly clinic: ClinicProjection;
  readonly locationMain: LocationProjection | null; // location main 미생성 시 null
};

export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
    const clinicRows = await tx<ClinicProfileRow[]>`
      SELECT name, description, long_description, slogan, logo_url, og_image_url,
             legal_entity_name, founder,
             to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
             business_registration_number, primary_ctas, brand_tokens, updated_at
        FROM clinic_profile
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
       LIMIT 1
    `;
    if (clinicRows.length === 0) return null;
    const clinic = normalizeClinic(clinicRows[0]!);

    const locationRows = await tx<LocationProfileRow[]>`
      SELECT slug, name, street_address, address_locality, address_region, postal_code, address_country,
             latitude::text AS latitude, longitude::text AS longitude,
             phone, email, metadata, updated_at
        FROM location_profile
       WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
       LIMIT 1
    `;
    const locationMain = locationRows.length > 0 ? normalizeLocation(locationRows[0]!) : null;

    return {
      instanceSlug: ctx.instanceSlug,
      instanceId: ctx.instanceId,
      clinic,
      locationMain,
    };
  });
});
