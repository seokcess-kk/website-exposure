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
import { sitePathPrefix } from "./custom-domains";
import {
  normalizeClinic,
  normalizeLocation,
  normalizeDoctor,
  type ClinicProjection,
  type ClinicProfileRow,
  type LocationProjection,
  type LocationProfileRow,
  type DoctorProfileRow,
  type DoctorProjection,
} from "./db-projection";

export type SiteInitial = {
  readonly instanceSlug: string;
  readonly instanceId: string;
  /**
   * 내부 링크 prefix — 서버에서 sitePathPrefix() 로 계산해 client component (Header/Footer)
   * 까지 전달. client 에서 env(CUSTOM_DOMAIN_MAP) 를 직접 읽으면 hydration mismatch.
   * 커스텀 도메인 slug 는 "" (루트 기준), 아니면 "/<slug>". 홈 href 는 `basePath || "/"`.
   */
  readonly basePath: string;
  readonly clinic: ClinicProjection;
  readonly locationMain: LocationProjection | null; // location main 미생성 시 null
  // 사용자 결정 2026-05-20 — 개인 페이지 컨셉상 SiteHeader/SiteFooter 등이 대표 의료진 사진 사용 가능.
  // slug='shin-soo-yong' 우선, fallback active doctor by display_order. 없으면 null.
  readonly leadDoctor: DoctorProjection | null;
};

export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
    const clinicRows = await tx<ClinicProfileRow[]>`
      SELECT name, description, long_description, slogan, logo_url, og_image_url,
             legal_entity_name, founder,
             to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
             business_registration_number, naver_site_verification,
             primary_ctas, brand_tokens, metadata, updated_at
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

    // 대표 의료진 (SiteHeader 로고용) — slug='shin-soo-yong' 우선
    const doctorRows = await tx<DoctorProfileRow[]>`
      SELECT slug, name, title, job_title, honorific, bio, photo_url, cv_photo_url, display_order, active, updated_at
        FROM doctor_profile
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND active = true
       ORDER BY CASE WHEN slug = 'shin-soo-yong' THEN 0 ELSE 1 END, display_order ASC, id ASC
       LIMIT 1
    `;
    const leadDoctor = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;

    return {
      instanceSlug: ctx.instanceSlug,
      instanceId: ctx.instanceId,
      basePath: sitePathPrefix(ctx.instanceSlug),
      clinic,
      locationMain,
      leadDoctor,
    };
  });
});
