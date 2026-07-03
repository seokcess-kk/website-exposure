// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
// 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
//
// 핵심 결정:
//   LL-ACTION-04 (cycle1 LL-07): 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha (complaint→non-covered→privacy→refund→terms)
//   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
//   LL-ACTION-07 (cycle1 LL-21): effective_date 는 Asia/Seoul 기준 — DB CURRENT_DATE AT TIME ZONE
//   LL-ACTION-08 (cycle1 LL-02 + cycle3 LL-45): LocationProfile = build-time reference. DB metadata 는 marker 만
//   LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30): businessHours CT-02 SoT 변환
//   LL-ACTION-18 (cycle2 LL-32 + cycle3 LL-43): 7 audit row sequential + per-row try/catch + partial/failed fallback + 3단계 안전망
//   LL-ACTION-21 (cycle3 LL-44): assertHasMainLocationAfterTx + MainLocationMissingError

"use server";

import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { notFound, redirect } from "next/navigation";
import {
  AuthDeniedError,
  assertActionEligibility,
  emitAuditEvent,
  getActiveSession,
  TenantResolveError,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
import {
  CLOSED_DOCUMENT_TYPES_ALPHA,
  TEMPLATES,
  renderTemplate,
  TemplateRenderError,
  type RenderContext,
} from "@glitzy/core-content";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { readSessionCookie } from "@/lib/session-cookie";
import { slugResolver } from "@/lib/slug-resolver";
import { withSkeletonTx } from "@/lib/tenant";
import {
  mapDbErrorToResult,
  MainLocationMissingError,
  type FieldErrors,
} from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { isNextControlFlowError } from "@/lib/action-context";
import {
  clinicProfileBundleInputSchema,
  convertToOpeningHoursSpec,
  extractBrandTokens,
  extractBusinessHours,
  extractLegalDocEffectiveOverrides,
  extractPrimaryCtas,
} from "@/lib/clinic-profile-schema";
import { ensureSentinelComplianceRecord } from "@/lib/sentinel-compliance";

export type SaveResult =
  | { ok: true }
  | { ok: false; fieldErrors: FieldErrors; formError?: string };

type ContractMode = "insert" | "update";

type AuditEntry = {
  contentType: "ClinicProfile" | "LocationProfile" | "LegalDocument";
  slug: string;
  mode: ContractMode;
  status: string | null;
  originalSlug: string;
  documentType?: string;
  templateVersion?: string;
  updatedAtBefore?: Date | null;
  updatedAtAfter?: Date | null;
};

export async function saveClinicProfile(
  instanceSlug: string,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  // 1. parse + zod 검증
  const rawSimple = Object.fromEntries(formData);
  const parsed = clinicProfileBundleInputSchema.safeParse({
    ...rawSimple,
    businessHours: extractBusinessHours(formData),
    primaryCtas: extractPrimaryCtas(formData),
    legalDocEffectiveOverrides: extractLegalDocEffectiveOverrides(formData),
    brandTokens: extractBrandTokens(formData),
  });
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }
  const data = parsed.data;

  // 2. session + tenant resolve
  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let session;
  try {
    session = await getActiveSession(sqlBase, cfg, signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  let userId: AdminUserId;
  try {
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }
  const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  if (instanceId === null) notFound();

  try {
    // 3. tx 안 3계약 + 5 LegalDocument upsert
    const txResult = await withSkeletonTx(
      { signedToken, instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        const auditEntries: AuditEntry[] = [];

        // === (a) ClinicProfile UPSERT ===
        const clinicBefore = await tx<{ updated_at: Date }[]>`
          SELECT updated_at FROM clinic_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
           FOR UPDATE
        `;
        const beforeClinic = clinicBefore[0] ?? null;

        // Phase 3 C 하이브리드: metadataJson 파싱. 빈 문자열이면 '{}'::jsonb (page hardcode fallback 사용)
        let metadataValue: unknown = {};
        const metaRaw = (data.metadataJson ?? "").trim();
        if (metaRaw.length > 0) {
          try {
            const parsedMeta = JSON.parse(metaRaw);
            if (typeof parsedMeta === "object" && parsedMeta !== null && !Array.isArray(parsedMeta)) {
              metadataValue = parsedMeta;
            } else {
              return { ok: false as const, formError: "metadata JSON 은 객체여야 합니다 ({}). 배열·원시값 불가." };
            }
          } catch (e) {
            return { ok: false as const, formError: "metadata JSON 형식 오류 — 유효한 JSON 객체를 입력하세요." };
          }
        }

        const clinicAfter = await tx<{ id: string; updated_at: Date; inserted: boolean }[]>`
          INSERT INTO clinic_profile (
            instance_id, slug, name, description, logo_url, og_image_url, favicon_url,
            business_registration_number, alternate_name, legal_entity_name,
            slogan, long_description, founding_date, founder,
            policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
            primary_contact_name, primary_contact_phone, primary_contact_email, primary_contact_role,
            primary_ctas, brand_tokens, metadata
          ) VALUES (
            ${ctx.instanceId}::uuid, 'clinic',
            ${data.name},
            ${data.description},
            ${data.logoUrl},
            ${data.ogImageUrl},
            ${data.faviconUrl ?? null},
            ${data.businessRegistrationNumber ?? null},
            ${data.alternateName ?? null},
            ${data.legalEntityName ?? null},
            ${data.slogan ?? null},
            ${data.longDescription ?? null},
            ${data.foundingDate ?? null},
            ${data.founder ?? null},
            ${data.policyContactPerson},
            ${data.policyContactEmail},
            ${data.policyContactPhone},
            ${data.policyEffectiveDate},
            ${data.primaryContactName},
            ${data.primaryContactPhone},
            ${data.primaryContactEmail},
            ${data.primaryContactRole},
            ${tx.json(data.primaryCtas as unknown as never)},
            ${tx.json((data.brandTokens ?? {}) as unknown as never)},
            ${tx.json(metadataValue as never)}
          )
          ON CONFLICT (instance_id, slug) DO UPDATE
             SET name = EXCLUDED.name,
                 description = EXCLUDED.description,
                 logo_url = EXCLUDED.logo_url,
                 og_image_url = EXCLUDED.og_image_url,
                 favicon_url = EXCLUDED.favicon_url,
                 business_registration_number = EXCLUDED.business_registration_number,
                 alternate_name = EXCLUDED.alternate_name,
                 legal_entity_name = EXCLUDED.legal_entity_name,
                 slogan = EXCLUDED.slogan,
                 long_description = EXCLUDED.long_description,
                 founding_date = EXCLUDED.founding_date,
                 founder = EXCLUDED.founder,
                 policy_contact_person = EXCLUDED.policy_contact_person,
                 policy_contact_email = EXCLUDED.policy_contact_email,
                 policy_contact_phone = EXCLUDED.policy_contact_phone,
                 policy_effective_date = EXCLUDED.policy_effective_date,
                 primary_contact_name = EXCLUDED.primary_contact_name,
                 primary_contact_phone = EXCLUDED.primary_contact_phone,
                 primary_contact_email = EXCLUDED.primary_contact_email,
                 primary_contact_role = EXCLUDED.primary_contact_role,
                 primary_ctas = EXCLUDED.primary_ctas,
                 brand_tokens = CASE WHEN EXCLUDED.brand_tokens <> '{}'::jsonb THEN EXCLUDED.brand_tokens ELSE clinic_profile.brand_tokens END,
                 metadata = CASE WHEN EXCLUDED.metadata <> '{}'::jsonb THEN EXCLUDED.metadata ELSE clinic_profile.metadata END,
                 updated_at = now()
          RETURNING id, updated_at, (xmax = 0) AS inserted
        `;
        const clinic = clinicAfter[0]!;

        auditEntries.push({
          contentType: "ClinicProfile",
          slug: "clinic",
          mode: clinic.inserted ? "insert" : "update",
          status: null,
          originalSlug: "clinic",
          updatedAtBefore: beforeClinic?.updated_at ?? null,
          updatedAtAfter: clinic.updated_at,
        });

        // === (b) LocationProfile(main) UPSERT ===
        const businessHoursSpec = convertToOpeningHoursSpec(data.businessHours);
        const locationMetadata = {
          businessHours: businessHoursSpec,
          reservationChannelsInheritedFrom: "clinic_profile.primary_ctas",
          representativeDoctors: [],
          featuredChannelId: data.featuredChannelId,
        };

        const locationBefore = await tx<{ updated_at: Date }[]>`
          SELECT updated_at FROM location_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
           FOR UPDATE
        `;
        const beforeLocation = locationBefore[0] ?? null;

        const locationAfter = await tx<{ id: string; updated_at: Date; inserted: boolean }[]>`
          INSERT INTO location_profile (
            instance_id, slug, name, clinic_profile_id,
            street_address, address_locality, address_region, postal_code, address_country,
            phone, email, metadata
          ) VALUES (
            ${ctx.instanceId}::uuid, 'main',
            ${data.name},
            ${clinic.id}::uuid,
            ${data.streetAddress},
            ${data.addressLocality},
            ${data.addressRegion},
            ${data.postalCode},
            ${data.addressCountry},
            ${data.locationTelephone},
            ${data.locationEmail ?? null},
            ${tx.json(locationMetadata as unknown as never)}
          )
          ON CONFLICT (instance_id, slug) DO UPDATE
             SET name = EXCLUDED.name,
                 clinic_profile_id = EXCLUDED.clinic_profile_id,
                 street_address = EXCLUDED.street_address,
                 address_locality = EXCLUDED.address_locality,
                 address_region = EXCLUDED.address_region,
                 postal_code = EXCLUDED.postal_code,
                 address_country = EXCLUDED.address_country,
                 phone = EXCLUDED.phone,
                 email = EXCLUDED.email,
                 metadata = EXCLUDED.metadata,
                 updated_at = now()
          RETURNING id, updated_at, (xmax = 0) AS inserted
        `;
        const location = locationAfter[0]!;

        auditEntries.push({
          contentType: "LocationProfile",
          slug: "main",
          mode: location.inserted ? "insert" : "update",
          status: null,
          originalSlug: "main",
          updatedAtBefore: beforeLocation?.updated_at ?? null,
          updatedAtAfter: location.updated_at,
        });

        // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
        // LLC-05 patch: doc 별 effectiveDate override 를 renderCtx 안 policy.effectiveDate 에도 반영
        // → DB effective_date 와 body 안 `{{policy.effectiveDate}}` 가 일치
        const baseRenderCtx = {
          clinic: {
            name: data.name,
            legalEntityName: data.legalEntityName ?? null,
            businessRegistrationNumber: data.businessRegistrationNumber ?? null,
            founder: data.founder ?? null,
          },
          location: {
            main: {
              address: `${data.addressRegion} ${data.addressLocality} ${data.streetAddress} (${data.postalCode})`,
              telephone: data.locationTelephone,
              email: data.locationEmail ?? null,
            },
          },
          policy: {
            contactPerson: data.policyContactPerson,
            contactEmail: data.policyContactEmail,
            contactPhone: data.policyContactPhone,
          },
        } as const;

        for (const docType of CLOSED_DOCUMENT_TYPES_ALPHA) {
          const template = TEMPLATES[docType];
          const overrideValue = data.legalDocEffectiveOverrides[docType];
          const effectiveDate = overrideValue && overrideValue !== ""
            ? overrideValue
            : data.policyEffectiveDate;
          const docRenderCtx: RenderContext = {
            ...baseRenderCtx,
            policy: { ...baseRenderCtx.policy, effectiveDate },
          };
          const renderedBody = renderTemplate(template.body, docRenderCtx);

          // 즉시 발행 모드 (사용자 검수 2026-05-20) — sentinel + published + 본문 항상 갱신.
          // 기존 status drift 보호 (CASE WHEN draft/rejected) 제거 — 검수 큐 비활성화로 무의미.
          const sentinelId = await ensureSentinelComplianceRecord(tx, {
            instanceId: ctx.instanceId,
            contentType: "LegalDocument",
            contentRef: template.slug,
            userId: ctx.userId,
          });
          const legalAfter = await tx<{ id: string; inserted: boolean; current_status: string }[]>`
            INSERT INTO legal_document (
              instance_id, slug, document_type, title, body,
              auto_generated, template_version, effective_date,
              contact_person, contact_email, status, risk_level,
              compliance_record_id, published_at
            ) VALUES (
              ${ctx.instanceId}::uuid,
              ${template.slug},
              ${docType}::legal_document_type,
              ${template.title},
              ${renderedBody},
              true,
              ${template.version},
              ${effectiveDate},
              ${data.policyContactPerson},
              ${data.policyContactEmail},
              'published'::content_publication_status,
              'Low'::risk_level,
              ${sentinelId}::uuid,
              NOW()
            )
            ON CONFLICT (instance_id, document_type)
              WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
              DO UPDATE
               SET slug = EXCLUDED.slug,
                   title = EXCLUDED.title,
                   body = EXCLUDED.body,
                   auto_generated = EXCLUDED.auto_generated,
                   template_version = EXCLUDED.template_version,
                   effective_date = EXCLUDED.effective_date,
                   contact_person = EXCLUDED.contact_person,
                   contact_email = EXCLUDED.contact_email,
                   status = 'published'::content_publication_status,
                   published_at = COALESCE(legal_document.published_at, NOW()),
                   risk_level = 'Low'::risk_level,
                   compliance_record_id = EXCLUDED.compliance_record_id,
                   updated_at = now()
            RETURNING id, (xmax = 0) AS inserted, status::text AS current_status
          `;
          const legal = legalAfter[0]!;

          auditEntries.push({
            contentType: "LegalDocument",
            slug: template.slug,
            mode: legal.inserted ? "insert" : "update",
            // LL-WORKFLOW-INTEGRATION (CAMC-12 정합): form/UPSERT 안 status 는 'draft' hard-coded (insert) · 미수정 (update).
            //   audit 에는 DB current status 사용 — workflow action 으로 전이된 status (review-queued 등) 정확 기록.
            status: legal.current_status,
            originalSlug: template.slug,
            documentType: docType,
            templateVersion: template.version,
          });
        }

        // === (d) assertHasMainLocationAfterTx 안전망 (cycle3 LL-44) ===
        const mainCheck = await tx<{ exists: boolean }[]>`
          SELECT EXISTS (
            SELECT 1 FROM location_profile
             WHERE instance_id = ${ctx.instanceId}::uuid
               AND clinic_profile_id = ${clinic.id}::uuid
               AND slug = 'main'
          ) AS exists
        `;
        if (!mainCheck[0]?.exists) {
          throw new MainLocationMissingError();
        }

        return { ctx, auditEntries };
      },
    );

    // 4. audit 7 row sequential emit + 3단계 안전망 (LL-ACTION-18 + cycle3 LL-43)
    // type narrow — withSkeletonTx return type 안 ctx/auditEntries possibly undefined 추론. const + guard.
    const ctx = txResult.ctx;
    const auditEntries = txResult.auditEntries ?? [];
    if (!ctx) {
      throw new Error("[saveClinicProfile] withSkeletonTx 안 ctx 미반환 — internal error");
    }
    const emitted: string[] = [];
    const failed: string[] = [];
    // LLC-09 patch: per-row 실패 원인 보존 — fallback payload 에 reason/code/name 정규화 포함
    const failedDetails: Array<{ target: string; code: string | null; name: string | null; message: string }> = [];
    for (const entry of auditEntries) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: ctx.userId,
          targetUserId: ctx.userId,
          toInstanceId: ctx.instanceId,
          payload: {
            contentType: entry.contentType,
            slug: entry.slug,
            mode: entry.mode,
            status: entry.status,
            originalSlug: entry.originalSlug,
            ...(entry.documentType !== undefined ? { documentType: entry.documentType } : {}),
            ...(entry.templateVersion !== undefined ? { templateVersion: entry.templateVersion } : {}),
            ...(entry.updatedAtBefore !== undefined ? { updatedAtBefore: entry.updatedAtBefore } : {}),
            ...(entry.updatedAtAfter !== undefined ? { updatedAtAfter: entry.updatedAtAfter } : {}),
          },
        });
        emitted.push(`${entry.contentType}:${entry.slug}`);
      } catch (auditErr) {
        const target = `${entry.contentType}:${entry.slug}`;
        failed.push(target);
        const eObj = typeof auditErr === "object" && auditErr !== null ? (auditErr as { code?: unknown; name?: unknown; message?: unknown }) : null;
        failedDetails.push({
          target,
          code: typeof eObj?.code === "string" ? eObj.code : null,
          name: typeof eObj?.name === "string" ? eObj.name : (auditErr instanceof Error ? auditErr.name : null),
          message: auditErr instanceof Error ? auditErr.message : String(auditErr),
        });
        console.error("[saveClinicProfile] audit row emit failed", {
          contentType: entry.contentType,
          slug: entry.slug,
          error: auditErr,
        });
      }
    }

    if (failed.length > 0) {
      const eventType = emitted.length > 0 ? "content-saved-partial" : "content-saved-failed";
      // LL-ACTION-18 reason payload: 첫 실패의 code 를 reason 으로 그대로 노출 (운영 포렌식)
      const primaryReason = failedDetails[0]?.code ?? failedDetails[0]?.name ?? "unknown";
      try {
        await emitAuditEvent(sqlBase, {
          eventType,
          actorUserId: ctx.userId,
          targetUserId: ctx.userId,
          toInstanceId: ctx.instanceId,
          payload: {
            outcome: emitted.length > 0 ? "partial" : "failed",
            emitted,
            failed,
            reason: primaryReason,
            failedDetails,
          },
        });
      } catch (fallbackErr) {
        // 3단계 안전망 의 최종: server stdout (v0.5 — Sentry SDK 미통합 · LL-DEFER-18 까지)
        console.error("[saveClinicProfile] fallback audit emit failed", {
          eventType,
          emitted,
          failed,
          error: fallbackErr,
        });
      }
    }

    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
    revalidatePath(`/admin/${instanceSlug}`);
    // 의원 정보(이름·설명·localKeywords·CTA·영업시간)는 공개 사이트 전 페이지에 영향 → 즉시 반영.
    revalidatePublicSite();
    return { ok: true };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;

    // MainLocationMissingError (LL-ACTION-21)
    if (err instanceof MainLocationMissingError) {
      return { ok: false, fieldErrors: {}, formError: err.message };
    }

    // TemplateRenderError (LL-ACTION-12 — 변수 화이트리스트 외 키)
    if (err instanceof TemplateRenderError) {
      return {
        ok: false,
        fieldErrors: {},
        formError: `정책 문서 본문 생성 중 오류가 발생했습니다 (${err.reason}: ${err.variableKey}).`,
      };
    }

    // DB constraint violation
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }

    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }

    console.error("[saveClinicProfile] unexpected error", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

// === C0051 — 네이버 서치어드바이저 소유확인 토큰 저장 (격리 액션) ===
// 콘텐츠 metadata 와 분리된 전용 컬럼 UPDATE — 의원정보 번들 저장과 독립(wipe 위험 없음).
const NAVER_VERIFICATION_REGEX = /^[A-Za-z0-9]{8,200}$/;

export async function saveNaverVerification(
  instanceSlug: string,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const raw = formData.get("naverSiteVerification");
  const token = typeof raw === "string" ? raw.trim() : "";
  // 빈 값 = 해제(null). 값이 있으면 형식 검증.
  if (token !== "" && !NAVER_VERIFICATION_REGEX.test(token)) {
    return {
      ok: false,
      fieldErrors: { naverSiteVerification: ["네이버 소유확인 토큰은 영문·숫자 8~200자입니다 (meta content 값만)."] },
    };
  }

  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let session;
  try {
    session = await getActiveSession(sqlBase, cfg, signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  let userId: AdminUserId;
  try {
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }
  const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  if (instanceId === null) notFound();

  try {
    await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      await tx`
        UPDATE clinic_profile
           SET naver_site_verification = ${token === "" ? null : token}, updated_at = now()
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
      `;
    });
    revalidatePath(`/admin/${instanceSlug}/clinic-profile`);
    // 네이버 소유확인 토큰은 공개 사이트 <head> 에 반영 → 즉시 무효화.
    revalidatePublicSite();
    return { ok: true };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveNaverVerification] unexpected error", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 오류가 발생했습니다." };
  }
}
