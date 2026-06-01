// @glitzy/web/(admin)/[instanceSlug]/calendar/actions — CONTENT_CALENDAR_PLAN v1.1 § 12 (CCAL-DEFER-02)
// content_calendar_event CRUD — create · update · delete · toggleDone.
// 권한 operator-edit-content (다른 콘텐츠 편집과 동일) · withSkeletonTx + RLS tenant_isolation.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import type { SaveResult } from "@/lib/save-result";
import type { FieldErrors } from "@/lib/errors";

const ENTITY_TYPES = [
  "Article", "TreatmentPage", "MedicalConditionPage", "FAQ",
  "Publication", "MediaAppearance", "LegalDocument",
] as const;

const EventInputSchema = z.object({
  title: z.string().trim().min(1, "제목은 필수입니다.").max(200, "제목은 200자 이하여야 합니다."),
  plannedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD 여야 합니다.")
    .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()), "유효한 날짜가 아닙니다."),
  entityType: z
    .union([z.enum(ENTITY_TYPES), z.literal(""), z.null(), z.undefined()])
    .transform((v) => (v === "" || v === undefined ? null : v)),
  note: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => {
      const t = (v ?? "").trim();
      return t.length === 0 ? null : t;
    })
    .refine((v) => v === null || v.length <= 500, "메모는 500자 이하여야 합니다."),
});

export type PlannedEventInput = {
  title: string;
  plannedDate: string;
  entityType?: string | null;
  note?: string | null;
};

function zodToFieldErrors(error: z.ZodError): FieldErrors {
  return error.flatten().fieldErrors as FieldErrors;
}

function mapTenantError(err: unknown): SaveResult | null {
  if (isNextControlFlowError(err)) throw err;
  if (err instanceof TenantResolveError) {
    const action = mapAuthDenyReasonToUi(err.reason);
    if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
    if (action.kind === "not-found") notFound();
    return { ok: false, fieldErrors: {}, formError: action.kind === "forbidden" || action.kind === "info" ? action.message : "권한 확인 실패" };
  }
  return null;
}

export async function createPlannedEventAction(
  instanceSlug: string,
  input: PlannedEventInput,
): Promise<SaveResult> {
  const parsed = EventInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodToFieldErrors(parsed.error) };

  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, fieldErrors: {}, formError: "권한 확인 실패 — 다시 로그인 후 시도하세요." };
  }

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx): Promise<SaveResult> => {
        assertActionEligibility(ctx, "operator-edit-content");
        await tx`
          INSERT INTO content_calendar_event (instance_id, title, planned_date, entity_type, note, done, created_by)
          VALUES (
            ${ctx.instanceId}::uuid, ${parsed.data.title}, ${parsed.data.plannedDate}::date,
            ${parsed.data.entityType}, ${parsed.data.note}, false, ${ctx.userId}::uuid
          )
        `;
        return { ok: true };
      },
    );
    if (result.ok) revalidatePath(`/admin/${instanceSlug}/calendar`);
    return result;
  } catch (err) {
    const mapped = mapTenantError(err);
    if (mapped) return mapped;
    console.error("[createPlannedEventAction]", err);
    return { ok: false, fieldErrors: {}, formError: "계획 일정 저장 중 오류가 발생했습니다." };
  }
}

export async function updatePlannedEventAction(
  instanceSlug: string,
  eventId: string,
  input: PlannedEventInput,
): Promise<SaveResult> {
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { ok: false, fieldErrors: {}, formError: "잘못된 일정 id" };
  const parsed = EventInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodToFieldErrors(parsed.error) };

  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, fieldErrors: {}, formError: "권한 확인 실패 — 다시 로그인 후 시도하세요." };
  }

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx): Promise<SaveResult> => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{ id: string }[]>`
          UPDATE content_calendar_event
             SET title = ${parsed.data.title},
                 planned_date = ${parsed.data.plannedDate}::date,
                 entity_type = ${parsed.data.entityType},
                 note = ${parsed.data.note},
                 updated_at = NOW()
           WHERE id = ${eventId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           RETURNING id
        `;
        if (rows.length === 0) return { ok: false, fieldErrors: {}, formError: "일정을 찾을 수 없습니다." };
        return { ok: true };
      },
    );
    if (result.ok) revalidatePath(`/admin/${instanceSlug}/calendar`);
    return result;
  } catch (err) {
    const mapped = mapTenantError(err);
    if (mapped) return mapped;
    console.error("[updatePlannedEventAction]", err);
    return { ok: false, fieldErrors: {}, formError: "계획 일정 수정 중 오류가 발생했습니다." };
  }
}

export async function togglePlannedEventDoneAction(
  instanceSlug: string,
  eventId: string,
  done: boolean,
): Promise<SaveResult> {
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { ok: false, fieldErrors: {}, formError: "잘못된 일정 id" };

  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, fieldErrors: {}, formError: "권한 확인 실패" };
  }

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx): Promise<SaveResult> => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{ id: string }[]>`
          UPDATE content_calendar_event
             SET done = ${done}, updated_at = NOW()
           WHERE id = ${eventId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           RETURNING id
        `;
        if (rows.length === 0) return { ok: false, fieldErrors: {}, formError: "일정을 찾을 수 없습니다." };
        return { ok: true };
      },
    );
    if (result.ok) revalidatePath(`/admin/${instanceSlug}/calendar`);
    return result;
  } catch (err) {
    const mapped = mapTenantError(err);
    if (mapped) return mapped;
    console.error("[togglePlannedEventDoneAction]", err);
    return { ok: false, fieldErrors: {}, formError: "상태 변경 중 오류가 발생했습니다." };
  }
}

export async function deletePlannedEventAction(
  instanceSlug: string,
  eventId: string,
): Promise<SaveResult> {
  if (!/^[0-9a-f-]{36}$/i.test(eventId)) return { ok: false, fieldErrors: {}, formError: "잘못된 일정 id" };

  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, fieldErrors: {}, formError: "권한 확인 실패" };
  }

  try {
    const result = await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx): Promise<SaveResult> => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{ id: string }[]>`
          DELETE FROM content_calendar_event
           WHERE id = ${eventId}::uuid AND instance_id = ${ctx.instanceId}::uuid
           RETURNING id
        `;
        if (rows.length === 0) return { ok: false, fieldErrors: {}, formError: "일정을 찾을 수 없습니다." };
        return { ok: true };
      },
    );
    if (result.ok) revalidatePath(`/admin/${instanceSlug}/calendar`);
    return result;
  } catch (err) {
    const mapped = mapTenantError(err);
    if (mapped) return mapped;
    console.error("[deletePlannedEventAction]", err);
    return { ok: false, fieldErrors: {}, formError: "삭제 중 오류가 발생했습니다." };
  }
}
