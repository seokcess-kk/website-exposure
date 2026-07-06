// @glitzy/web/(admin)/[instanceSlug]/doctors/actions
// cycle1-3entity patch:
//   - WEB-01 isNextControlFlowError rethrow
//   - WEB-04 DELETE RETURNING id 확인
//   - WEB-05 Doctor 삭제 시 Article 참조 보호 (ON DELETE NO ACTION)
//   - WEB-06 delete result 통일 (SaveResult-like)
//   - WEB-08 errors.ts entity constraint mapping
//   - WEB-10 slug 변경 시 old path revalidate
//   - WEB-11 displayOrder Postgres integer 범위 사용
//   - WEB-15 content-deleted audit targetUserId 추가

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";

import { getSqlBase } from "@/lib/db";
import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { withSlugRetry } from "@/lib/slug-retry";
import { notifyIndexNow } from "@/lib/indexnow";
import type { SaveResult } from "@/lib/save-result";
import {
  readCredentialsFromFormData,
  parseSpecialtiesInput,
  serializeDoctorMetadata,
} from "@/lib/doctor-metadata";

const trimmedString = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });

const optionalStr = (max: number, label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });

const InputSchema = z.object({
  slug: z
    .string({ required_error: "slug 는 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => /^[a-z0-9][a-z0-9-]{2,63}$/.test(v), {
      message: "slug 는 3~64자 (소문자/숫자/하이픈) 이어야 합니다.",
    }),
  name: trimmedString(1, 100, "이름"),
  title: optionalStr(100, "직함"),
  jobTitle: optionalStr(100, "직책"),
  honorific: optionalStr(20, "호칭"),
  bio: optionalStr(2000, "약력"),
  photoUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "사진 URL 은 http/https · 2048자 이내",
    }),
  cvPhotoUrl: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "약력 사진 URL 은 http/https · 2048자 이내",
    }),
  displayOrder: z
    .string()
    .transform((v) => (v.trim() === "" ? "0" : v.trim()))
    .refine((v) => /^-?\d+$/.test(v), { message: "표시 순서는 정수" })
    .transform((v) => parseInt(v, 10))
    // cycle1-3entity WEB-11: Postgres integer 범위 사용
    .refine((n) => Number.isFinite(n) && n >= -2_147_483_648 && n <= 2_147_483_647, {
      message: "표시 순서는 -2147483648~2147483647",
    }),
  active: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "on"),
});

export type DeleteResult =
  | { ok: true }
  | { ok: false; formError: string };

export async function saveDoctorProfile(
  instanceSlug: string,
  originalSlug: string | null,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  // credentials / medicalSpecialties — FormData 안 prefixed key + free-text comma 입력.
  //   InputSchema 는 Object.fromEntries 라 array entries 누락 → 별도 reader.
  const credentialFormEntries = readCredentialsFromFormData(formData);
  const specialtiesRaw = (formData.get("medicalSpecialties") ?? "") as string;
  const credentialFieldErrors: Record<string, string[]> = {};
  credentialFormEntries.forEach((c, i) => {
    if (!c.name.trim()) {
      credentialFieldErrors[`credentials.${i}.name`] = ["인증·자격명은 필수입니다."];
    }
    if (c.name.length > 200) {
      credentialFieldErrors[`credentials.${i}.name`] = ["인증·자격명은 200자를 넘을 수 없습니다."];
    }
    if (c.url && !/^https?:\/\//.test(c.url)) {
      credentialFieldErrors[`credentials.${i}.url`] = ["검증 URL 은 http/https 만 허용됩니다."];
    }
  });
  if (Object.keys(credentialFieldErrors).length > 0) {
    return { ok: false, fieldErrors: credentialFieldErrors };
  }
  const doctorMetadata = serializeDoctorMetadata({
    credentials: credentialFormEntries,
    medicalSpecialties: parseSpecialtiesInput(specialtiesRaw),
  });
  const metadataJson = JSON.stringify(doctorMetadata);

  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    // SLUG_AUTOGEN_PLAN v0.4 § 3.3·§ 6 — 신규 INSERT 만 withSlugRetry. UPDATE 안 충돌은 운영자 명시 변경이므로 retry 안 함.
    const txResult = originalSlug === null
      ? await withSlugRetry(parsed.data.slug, (slugAttempt) =>
          withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
            assertActionEligibility(ctx, "operator-edit-content");
            await tx`
              INSERT INTO doctor_profile (
                instance_id, slug, name, title, job_title, honorific, bio, photo_url, cv_photo_url, display_order, active, metadata
              ) VALUES (
                ${ctx.instanceId}::uuid, ${slugAttempt}, ${parsed.data.name},
                ${parsed.data.title ?? null}, ${parsed.data.jobTitle ?? null}, ${parsed.data.honorific ?? null},
                ${parsed.data.bio ?? null}, ${parsed.data.photoUrl ?? null}, ${parsed.data.cvPhotoUrl ?? null},
                ${parsed.data.displayOrder}, ${parsed.data.active}, ${metadataJson}::jsonb
              )
            `;
            return { ok: true as const, ctx, slug: slugAttempt, mode: "insert" as const };
          }),
        )
      : await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
          assertActionEligibility(ctx, "operator-edit-content");
          const beforeRows = await tx<{ id: string }[]>`
            SELECT id FROM doctor_profile
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
             FOR UPDATE
          `;
          if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
          await tx`
            UPDATE doctor_profile
               SET slug = ${parsed.data.slug},
                   name = ${parsed.data.name},
                   title = ${parsed.data.title ?? null},
                   job_title = ${parsed.data.jobTitle ?? null},
                   honorific = ${parsed.data.honorific ?? null},
                   bio = ${parsed.data.bio ?? null},
                   photo_url = ${parsed.data.photoUrl ?? null},
                   cv_photo_url = ${parsed.data.cvPhotoUrl ?? null},
                   display_order = ${parsed.data.displayOrder},
                   active = ${parsed.data.active},
                   metadata = ${metadataJson}::jsonb,
                   updated_at = now()
             WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
          `;
          return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
        });

    if (txResult.ok === false) {
      if (txResult.action === "notfound") notFound();
    }
    if (txResult.ok === true) {
      try {
        await emitAuditEvent(sqlBase, {
          eventType: "content-saved",
          actorUserId: txResult.ctx.userId,
          targetUserId: txResult.ctx.userId,
          toInstanceId: txResult.ctx.instanceId,
          // cycle2-3entity WEB-28: content-saved payload shape 통일 (status 는 Doctor 에 없으므로 null)
          payload: { contentType: "DoctorProfile", slug: txResult.slug, mode: txResult.mode, status: null, originalSlug },
        });
      } catch (auditErr) {
        console.error("[saveDoctorProfile] audit emit failed", auditErr);
      }
      revalidatePath(`/admin/${instanceSlug}/doctors`);
      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
      // cycle1-3entity WEB-10: slug 변경 시 old path 도 revalidate
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
      }
      revalidatePath(`/admin/${instanceSlug}`);
      // 사용자 검수 2026-05-20 — 공개 사이트 ISR cache 갱신 (약력 섹션 · 의료진 목록·상세)
      revalidatePath(`/${instanceSlug}`);
      revalidatePath(`/${instanceSlug}/doctors`);
      revalidatePath(`/${instanceSlug}/doctors/${txResult.slug}`);
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        revalidatePath(`/${instanceSlug}/doctors/${originalSlug}`);
      }
      // IndexNow — active 의료진 상세만 sitemap 포함 → 발행/갱신 통지. slug 변경 시 구 URL 은 removal 통지 (redirect 전).
      if (parsed.data.active) {
        await notifyIndexNow(instanceSlug, `/doctors/${txResult.slug}`);
      }
      if (originalSlug !== null && originalSlug !== txResult.slug) {
        await notifyIndexNow(instanceSlug, `/doctors/${originalSlug}`);
      }
      if (originalSlug === null || originalSlug !== txResult.slug) {
        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
      }
      return { ok: true, slug: txResult.slug };
    }
    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
  } catch (err) {
    // cycle1-3entity WEB-01: redirect/notFound rethrow
    if (isNextControlFlowError(err)) throw err;

    // cycle1-3entity WEB-08: 통합 mapping
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
    console.error("[saveDoctorProfile] unexpected", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  }
}

export async function deleteDoctorProfile(
  instanceSlug: string,
  slug: string,
): Promise<DeleteResult> {
  const aCtx = await resolveActionContext(instanceSlug);
  const sqlBase = getSqlBase();

  try {
    const deletedRow = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");

      // 사용자 검수 2026-05-20 — article 외 publication·media·faq 도 자동 NULL 처리.
      // 기존 fk-blocked 차단 패턴 제거 — 운영자가 author 일일이 변경하지 않아도 됨.
      const targetRows = await tx<{ id: string }[]>`
        SELECT id FROM doctor_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         LIMIT 1
      `;
      if (targetRows.length === 0) return { kind: "notfound" as const };
      const doctorId = targetRows[0]!.id;

      // 4 entity 의 author_doctor_id NULL 처리 (FK NO ACTION 회피)
      const nullArticle = await tx`
        UPDATE article SET author_doctor_id = NULL
         WHERE instance_id = ${ctx.instanceId}::uuid AND author_doctor_id = ${doctorId}::uuid
      `;
      const nullPublication = await tx`
        UPDATE publication SET author_doctor_id = NULL
         WHERE instance_id = ${ctx.instanceId}::uuid AND author_doctor_id = ${doctorId}::uuid
      `;
      const nullMedia = await tx`
        UPDATE media_appearance SET author_doctor_id = NULL
         WHERE instance_id = ${ctx.instanceId}::uuid AND author_doctor_id = ${doctorId}::uuid
      `;
      const nullFaq = await tx`
        UPDATE faq SET author_doctor_id = NULL
         WHERE instance_id = ${ctx.instanceId}::uuid AND author_doctor_id = ${doctorId}::uuid
      `;

      // doctor_profile DELETE
      const deleted = await tx<{ id: string }[]>`
        DELETE FROM doctor_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
         RETURNING id
      `;
      return {
        kind: "deleted" as const,
        deleted: deleted.length,
        nulledRefs: {
          article: nullArticle.count ?? 0,
          publication: nullPublication.count ?? 0,
          media: nullMedia.count ?? 0,
          faq: nullFaq.count ?? 0,
        },
      };
    });

    if (deletedRow.kind === "notfound") {
      return { ok: false, formError: "해당 의료진이 이미 삭제되었습니다." };
    }
    if (deletedRow.deleted === 0) {
      return { ok: false, formError: "해당 의료진이 이미 삭제되었습니다." };
    }

    try {
      await emitAuditEvent(sqlBase, {
        eventType: "content-deleted",
        actorUserId: aCtx.userId,
        targetUserId: aCtx.userId,
        toInstanceId: aCtx.instanceId,
        payload: { contentType: "DoctorProfile", slug, nulledRefs: deletedRow.nulledRefs },
      });
    } catch (auditErr) {
      console.error("[deleteDoctorProfile] audit emit failed", auditErr);
    }

    revalidatePath(`/admin/${instanceSlug}/doctors`);
    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
    revalidatePath(`/admin/${instanceSlug}`);
    // 공개 사이트 ISR cache 갱신 (의료진 삭제 시)
    revalidatePath(`/${instanceSlug}`);
    revalidatePath(`/${instanceSlug}/doctors`);
    revalidatePath(`/${instanceSlug}/doctors/${slug}`);
    // 삭제된 공개 상세 — IndexNow 통지 (재크롤 → 404 → 색인 제거 · redirect 전).
    await notifyIndexNow(instanceSlug, `/doctors/${slug}`);
    redirect(`/admin/${instanceSlug}/doctors`);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    // cycle1-3entity WEB-06: delete error mapping
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, formError: action.message };
      if (action.kind === "info") return { ok: false, formError: action.message };
    }
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      // cycle2-3entity WEB-24: article_author_fk 같은 field-mapping 도 delete 에서는 formError 로 변환
      if (mapped.kind === "form") return { ok: false, formError: mapped.message };
      const firstField = Object.keys(mapped.errors)[0];
      const firstMsg = firstField ? mapped.errors[firstField]?.[0] : undefined;
      return { ok: false, formError: firstMsg ?? "참조 무결성 오류로 삭제할 수 없습니다." };
    }
    console.error("[deleteDoctorProfile] unexpected", err);
    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
  }
}
