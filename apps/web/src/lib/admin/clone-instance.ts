// @glitzy/web/lib/admin/clone-instance — 한 instance 의 노출 골격 + 디자인을 신규 instance 로 복제
//
// 복제 정책 (사용자 요청 2026-05-21 · 패치 2026-05-21-2):
//   - 디자인 자산 (clinic_profile.brand_tokens · primary_ctas · metadata) → 그대로 복사.
//   - 골격 entity (article_category · treatment_page · legal_document) → 슬러그·구조·body 까지 그대로 복사.
//   - 운영 콘텐츠 entity (doctor_profile · article · publication · media_appearance · faq · consultation_request)
//     → 복제 안 함 (새 클라이언트가 직접 입력).
//   - clinic_profile 의 "병원 식별 정보":
//       * name        → 새 instance display_name (사용자 입력) 으로 초기화
//       * description → placeholder (80~300자 CHECK 통과 안내 문구)
//       * slogan, long_description → NULL
//       * legal_entity_name · founder · founding_date · brn · alternate_name · policy_* → NULL
//       * logo_url · og_image_url → NOT NULL 이라 source 유지 (admin 에서 교체 필요)
//   - location_profile 의 주소·연락처 → placeholder ("(입력 필요)") 로 비움.
//   - treatment_page · legal_document 의 status → 'published' 만 유지, 그 외는 모두 'draft' reset
//     (published_at NULL · compliance_record_id NULL). published row 만 sentinel ComplianceRecord 신규 발급.
//
// 보안: 단일 transaction 안 getSqlBase().begin(...) — WEB_DATABASE_URL role 이 admin URL super-user
//   (CLAUDE.md "WEB_DATABASE_URL 도 admin URL 사용 · demo 한정") 라 RLS policy(FOR ALL TO app_tenant_user)
//   가 적용 안 됨 → 자연 우회. 단일 트랜잭션이라 partial state 회피. audit_event 안 'instance.cloned' 1건.
//   ※ packages/db.withServiceRole 는 spike 단계의 audit_log 테이블 가정이라 prod (audit_event 만 존재) 와
//     불일치 → 사용 안 함. seed.ts · release-actions.ts 와 동일한 raw-tx 패턴.

/**
 * 신규 instance 의 clinic_profile.description placeholder.
 * 길이 80~300자 CHECK 통과 + 어드민에게 다음 작업 안내. JS .length 는 UTF-16 code unit (한글 1자 = 1).
 */
const CLINIC_DESCRIPTION_PLACEHOLDER =
  "이 사이트는 템플릿에서 복제된 신규 인스턴스입니다. " +
  "어드민의 '병원 정보' 메뉴에서 의료기관명·소개·연락처·사업자번호 등 식별 정보를 " +
  "직접 입력해 주세요. 본 안내 문구는 description CHECK (80~300자) 통과용 placeholder 입니다.";

import type { AdminUserId, InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "../db";

const INSTANCE_SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,63}$/;

export type CloneInstanceArgs = {
  sourceInstanceId: InstanceId;
  targetSlug: string;
  targetDisplayName: string;
  actorUserId: AdminUserId;
};

export type CloneInstanceResult = {
  newInstanceId: string;
  newInstanceSlug: string;
  counts: {
    clinicProfile: number;
    locationProfile: number;
    articleCategory: number;
    treatmentPage: number;
    legalDocument: number;
    sentinelComplianceRecords: number;
  };
};

export class CloneInstanceValidationError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "CloneInstanceValidationError";
  }
}

const SENTINEL_AUTO_CHECK = JSON.stringify({
  automatedDecision: "pass",
  buildBlocked: false,
  gateRequired: false,
  hasWarnings: false,
  findingsBySeverity: { fail: 0, "content-gate": 0, warning: 0, info: 0 },
  findings: [],
});

const SENTINEL_METADATA = JSON.stringify({
  sentinel: true,
  manualReview: true,
  catalogVersion: "m0-stub-v0.1",
  exemptReason: "instance-clone (clone-instance lib · 2026-05-21)",
});

type Row = Record<string, unknown>;

/**
 * postgres-js 가 jsonb 컬럼을 환경/설정 (특히 prepare:false) 에 따라 string · parsed object/array 양쪽으로
 * 반환할 수 있어, INSERT 측에서는 항상 JS object/array 값으로 정규화한 뒤 `tx.json(value)` 헬퍼로 전달한다.
 * trigger 의 `jsonb_typeof(NEW.col) = 'array'` 같은 제약이 동작하려면 cast 보다 헬퍼 경유가 robust.
 *   - 입력이 string 이면 JSON.parse 시도, 실패하거나 fallback 형 (array vs object) 과 어긋나면 fallback.
 *   - 입력이 null/undefined 면 fallback.
 *   - 입력이 object/array 면 그대로 (단 fallback 이 array 인데 값이 array 아니면 fallback).
 */
function toJsonbValue(value: unknown, fallback: object | unknown[]): object | unknown[] {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed === null || typeof parsed !== "object") return fallback;
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      return parsed as object | unknown[];
    } catch {
      return fallback;
    }
  }
  if (typeof value === "object") {
    if (Array.isArray(fallback) && !Array.isArray(value)) return fallback;
    return value as object | unknown[];
  }
  return fallback;
}

export async function cloneInstance(args: CloneInstanceArgs): Promise<CloneInstanceResult> {
  if (!INSTANCE_SLUG_REGEX.test(args.targetSlug)) {
    throw new CloneInstanceValidationError(
      "invalid-slug",
      "사이트 식별자(slug) 는 3~64자, 소문자/숫자/하이픈만 가능합니다 (^[a-z0-9][a-z0-9-]{2,63}$).",
    );
  }
  const displayName = args.targetDisplayName.trim();
  if (displayName.length < 1 || displayName.length > 200) {
    throw new CloneInstanceValidationError(
      "invalid-name",
      "사이트 표시 이름은 1~200자여야 합니다.",
    );
  }

  return getSqlBase().begin(async (tx) => {
      // (a) 결과 타입은 변수 annotation 으로, (b) jsonb 는 항상 JSON.stringify 후 ::jsonb 캐스트
      //     — sentinel-compliance.ts 와 동일 패턴. postgres-js Sql 의 generic 호출 안정성 + 가독성 절충.

      // === 1. source 존재 + target slug 충돌 확인 ===
      const sourceRows: Array<{ id: string; slug: string }> = await tx`
        SELECT id, slug FROM instance WHERE id = ${args.sourceInstanceId}::uuid LIMIT 1
      `;
      if (sourceRows.length === 0) {
        throw new CloneInstanceValidationError("source-not-found", "원본 사이트를 찾을 수 없습니다.");
      }
      const slugCollision: Array<{ id: string }> = await tx`
        SELECT id FROM instance WHERE slug = ${args.targetSlug} LIMIT 1
      `;
      if (slugCollision.length > 0) {
        throw new CloneInstanceValidationError(
          "slug-collision",
          `식별자 "${args.targetSlug}" 는 이미 사용 중입니다. 다른 식별자를 선택해주세요.`,
        );
      }

      // === 2. instance INSERT ===
      const newInstanceRows: Array<{ id: string }> = await tx`
        INSERT INTO instance (slug, display_name, active)
        VALUES (${args.targetSlug}, ${displayName}, true)
        RETURNING id
      `;
      const newInstanceId = newInstanceRows[0]!.id;

      // === 3. operator instance_membership 부여 ===
      await tx`
        INSERT INTO instance_membership (user_id, instance_id, role, active)
        VALUES (${args.actorUserId}::uuid, ${newInstanceId}::uuid, 'operator', true)
        ON CONFLICT DO NOTHING
      `;

      // === 4. clinic_profile 복사 (디자인 자산 + brand_tokens 유지 / 병원 식별 정보 placeholder·NULL) ===
      const srcClinic: Row[] = await tx`
        SELECT slug, logo_url, og_image_url, primary_ctas, brand_tokens, metadata
          FROM clinic_profile
         WHERE instance_id = ${args.sourceInstanceId}::uuid
         LIMIT 1
      `;
      let clinicProfileCount = 0;
      let newClinicId: string | null = null;
      if (srcClinic.length > 0) {
        const c = srcClinic[0]!;
        const primaryCtasVal = toJsonbValue(c.primary_ctas, []);
        const brandTokensVal = toJsonbValue(c.brand_tokens, {});
        const metadataVal = toJsonbValue(c.metadata, {});
        // name 은 새 instance 의 display_name (사용자 입력) — clinic_profile.name 의 1~100자 CHECK 통과
        const clinicName = displayName.slice(0, 100);
        const ins: Array<{ id: string }> = await tx`
          INSERT INTO clinic_profile (
            instance_id, slug, name, description, long_description, slogan,
            logo_url, og_image_url,
            legal_entity_name, founder, founding_date, business_registration_number, alternate_name,
            policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
            primary_ctas, brand_tokens, metadata
          ) VALUES (
            ${newInstanceId}::uuid,
            ${(c.slug as string) ?? "clinic"},
            ${clinicName},
            ${CLINIC_DESCRIPTION_PLACEHOLDER},
            NULL,
            NULL,
            ${c.logo_url as string},
            ${c.og_image_url as string},
            NULL, NULL, NULL, NULL, NULL,
            NULL, NULL, NULL, NULL,
            ${tx.json(primaryCtasVal as any)},
            ${tx.json(brandTokensVal as any)},
            ${tx.json(metadataVal as any)}
          )
          RETURNING id
        `;
        newClinicId = ins[0]!.id;
        clinicProfileCount = 1;
      }

      // === 5. location_profile 복사 (구조만 — 주소·연락처 placeholder) ===
      let locationProfileCount = 0;
      if (newClinicId !== null) {
        const srcLocs: Row[] = await tx`
          SELECT slug, address_country, metadata
            FROM location_profile
           WHERE instance_id = ${args.sourceInstanceId}::uuid
        `;
        for (const l of srcLocs) {
          const metaVal = toJsonbValue(l.metadata, {});
          await tx`
            INSERT INTO location_profile (
              instance_id, slug, name,
              street_address, address_locality, address_region, postal_code, address_country,
              latitude, longitude, phone, email,
              clinic_profile_id, metadata
            ) VALUES (
              ${newInstanceId}::uuid,
              ${l.slug as string},
              '본원',
              '(주소 입력 필요)',
              '(자치구 입력 필요)',
              '(시·도 입력 필요)',
              '00000',
              ${(l.address_country as string | null) ?? "KR"},
              NULL, NULL, NULL, NULL,
              ${newClinicId}::uuid,
              ${tx.json(metaVal as any)}
            )
          `;
          locationProfileCount += 1;
        }
      }

      // === 6. article_category 복사 (UI slug 'general' 은 instance 부트스트랩 시 자동 생성 — 충돌 회피) ===
      const srcCats: Row[] = await tx`
        SELECT slug, name, description, pillar, cover_image_url, seo_meta,
               display_order, article_type_default, metadata
          FROM article_category
         WHERE instance_id = ${args.sourceInstanceId}::uuid
      `;
      let articleCategoryCount = 0;
      for (const c of srcCats) {
        const seoMetaVal = c.seo_meta === null || c.seo_meta === undefined
          ? null
          : toJsonbValue(c.seo_meta, {});
        const metaVal = toJsonbValue(c.metadata, {});
        await tx`
          INSERT INTO article_category (
            instance_id, slug, name, description, pillar,
            cover_image_url, seo_meta, display_order, article_type_default, metadata
          ) VALUES (
            ${newInstanceId}::uuid,
            ${c.slug as string},
            ${c.name as string},
            ${(c.description as string | null) ?? null},
            ${(c.pillar as string | null) ?? null},
            ${(c.cover_image_url as string | null) ?? null},
            ${seoMetaVal === null ? null : tx.json(seoMetaVal as any)},
            ${(c.display_order as number) ?? 0},
            ${(c.article_type_default as string | null) ?? null},
            ${tx.json(metaVal as any)}
          )
          ON CONFLICT (instance_id, slug) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            pillar = EXCLUDED.pillar,
            cover_image_url = EXCLUDED.cover_image_url,
            seo_meta = EXCLUDED.seo_meta,
            display_order = EXCLUDED.display_order,
            article_type_default = EXCLUDED.article_type_default,
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
        `;
        articleCategoryCount += 1;
      }

      // === sentinel ComplianceRecord 헬퍼 (published row 용) ===
      let sentinelCount = 0;
      const SENTINEL_AUTO_CHECK_VAL = JSON.parse(SENTINEL_AUTO_CHECK) as object;
      const SENTINEL_METADATA_VAL = JSON.parse(SENTINEL_METADATA) as object;
      // sentinel ComplianceRecord — 다음 CHECK 모두 만족하도록 채움:
      //   - publishedRequiresPeer (peer_reviewer + peer_reviewed_at)
      //   - publishedRequiresAt (published_at + published_by)
      //   - legalDocRequiresLegal (LegalDocument + published → legal_counsel + legal_counsel_at)
      //   - medHighRequiresPhysician (page_risk_level='Low' 이라 미적용)
      // LegalDocument 외 content type 에도 legal_counsel 을 채워두는 게 단순·무해.
      const ensureSentinel = async (
        contentType: "TreatmentPage" | "LegalDocument",
        contentRef: string,
      ): Promise<string> => {
        const ins: Array<{ id: string }> = await tx`
          INSERT INTO compliance_record (
            instance_id, content_type, content_ref, page_risk_level,
            auto_check_result,
            peer_reviewer, peer_reviewed_at,
            legal_counsel, legal_counsel_at,
            published_at, published_by,
            record_phase, record_version, metadata
          ) VALUES (
            ${newInstanceId}::uuid,
            ${contentType}::compliance_content_type,
            ${contentRef},
            'Low'::risk_level,
            ${tx.json(SENTINEL_AUTO_CHECK_VAL as any)},
            ${args.actorUserId}::uuid, NOW(),
            ${args.actorUserId}::uuid, NOW(),
            NOW(), ${args.actorUserId}::uuid,
            'published'::compliance_record_phase, 1,
            ${tx.json(SENTINEL_METADATA_VAL as any)}
          )
          RETURNING id
        `;
        sentinelCount += 1;
        return ins[0]!.id;
      };

      // === 7. treatment_page 전체 복사 (slug · pillar · body · body_slots · metadata) ===
      //   status 는 'published' 만 유지, 그 외 (review-queued / in-review / approved / blocked 등) 는 'draft' reset.
      //   target instance 안 review_queue/compliance pipeline 이 비었기 때문에 mid-workflow 상태를 그대로
      //   가져가면 상태 머신이 깨짐. published 만 sentinel 발급해서 안전한 상태로 시작.
      const srcTreatments: Row[] = await tx`
        SELECT slug, title, summary, body_markdown, status::text AS status, risk_level::text AS risk_level,
               hero_image_url, metadata, body_slots, published_at, pillar_slug
          FROM treatment_page
         WHERE instance_id = ${args.sourceInstanceId}::uuid
      `;
      let treatmentPageCount = 0;
      for (const t of srcTreatments) {
        const sourceStatus = (t.status as string) ?? "draft";
        const isPublished = sourceStatus === "published";
        const status = isPublished ? "published" : "draft";
        const complianceId = isPublished
          ? await ensureSentinel("TreatmentPage", t.slug as string)
          : null;
        const metaVal = toJsonbValue(t.metadata, {});
        const bodySlotsVal = toJsonbValue(t.body_slots, {});
        const publishedAt = isPublished ? ((t.published_at as Date | null) ?? new Date()) : null;
        await tx`
          INSERT INTO treatment_page (
            instance_id, slug, title, summary, body_markdown, status, risk_level,
            compliance_record_id, hero_image_url, metadata, body_slots, published_at, pillar_slug
          ) VALUES (
            ${newInstanceId}::uuid,
            ${t.slug as string},
            ${t.title as string},
            ${(t.summary as string | null) ?? null},
            ${(t.body_markdown as string | null) ?? null},
            ${status}::content_publication_status,
            ${(t.risk_level as string | null) ?? null}::risk_level,
            ${complianceId},
            ${(t.hero_image_url as string | null) ?? null},
            ${tx.json(metaVal as any)},
            ${tx.json(bodySlotsVal as any)},
            ${publishedAt},
            ${(t.pillar_slug as string | null) ?? null}
          )
        `;
        treatmentPageCount += 1;
      }

      // === 8. legal_document 전체 복사 (body 포함 — 약관 템플릿) ===
      //   treatment_page 와 동일: 'published' 만 유지, 그 외는 'draft' reset.
      const srcLegals: Row[] = await tx`
        SELECT slug, document_type::text AS document_type, title, body, auto_generated, template_version,
               effective_date, last_revised_date, contact_person, contact_email,
               status::text AS status, risk_level::text AS risk_level, published_at, metadata
          FROM legal_document
         WHERE instance_id = ${args.sourceInstanceId}::uuid
      `;
      let legalDocumentCount = 0;
      for (const l of srcLegals) {
        const sourceStatus = (l.status as string) ?? "draft";
        const isPublished = sourceStatus === "published";
        const status = isPublished ? "published" : "draft";
        const complianceId = isPublished
          ? await ensureSentinel("LegalDocument", l.slug as string)
          : null;
        const metaVal = toJsonbValue(l.metadata, {});
        const publishedAt = isPublished ? ((l.published_at as Date | null) ?? new Date()) : null;
        await tx`
          INSERT INTO legal_document (
            instance_id, slug, document_type, title, body, auto_generated, template_version,
            effective_date, last_revised_date, contact_person, contact_email,
            status, risk_level, published_at, compliance_record_id, metadata
          ) VALUES (
            ${newInstanceId}::uuid,
            ${l.slug as string},
            ${l.document_type as string}::legal_document_type,
            ${l.title as string},
            ${l.body as string},
            ${l.auto_generated as boolean},
            ${(l.template_version as string | null) ?? null},
            ${l.effective_date as Date | string},
            ${(l.last_revised_date as Date | string | null) ?? null},
            NULL,
            NULL,
            ${status}::content_publication_status,
            ${(l.risk_level as string | null) ?? "Low"}::risk_level,
            ${publishedAt},
            ${complianceId},
            ${tx.json(metaVal as any)}
          )
        `;
        legalDocumentCount += 1;
      }

      // === 9. audit_event (clone 완료 기록) ===
      const auditPayload = {
        sourceSlug: sourceRows[0]!.slug,
        targetSlug: args.targetSlug,
        targetDisplayName: displayName,
        counts: {
          clinicProfile: clinicProfileCount,
          locationProfile: locationProfileCount,
          articleCategory: articleCategoryCount,
          treatmentPage: treatmentPageCount,
          legalDocument: legalDocumentCount,
          sentinelComplianceRecords: sentinelCount,
        },
      };
      await tx`
        INSERT INTO audit_event (event_type, actor_user_id, from_instance_id, to_instance_id, payload)
        VALUES (
          'instance.cloned',
          ${args.actorUserId}::uuid,
          ${args.sourceInstanceId}::uuid,
          ${newInstanceId}::uuid,
          ${tx.json(auditPayload as any)}
        )
      `;

      return {
        newInstanceId,
        newInstanceSlug: args.targetSlug,
        counts: {
          clinicProfile: clinicProfileCount,
          locationProfile: locationProfileCount,
          articleCategory: articleCategoryCount,
          treatmentPage: treatmentPageCount,
          legalDocument: legalDocumentCount,
          sentinelComplianceRecords: sentinelCount,
        },
      };
    }) as Promise<CloneInstanceResult>;
}
