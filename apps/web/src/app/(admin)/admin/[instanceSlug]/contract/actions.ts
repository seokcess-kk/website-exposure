// @glitzy/web/(admin)/[instanceSlug]/contract/actions — ADMIN_BUSINESS_ENTITIES_PLAN v1.0 § 2
// instance_contract UPSERT server action. super-admin only (action level + lib level 가드).

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import { getSqlBase } from "@/lib/db";
import type { SaveResult } from "@/lib/save-result";

const STATUS_VALUES = ["trial", "active", "suspended", "terminated"] as const;
const PLAN_TIER_VALUES = ["starter", "standard", "pro", "custom"] as const;
const BILLING_CYCLE_VALUES = ["monthly", "yearly", "custom"] as const;

const InputSchema = z.object({
  status: z.enum(STATUS_VALUES),
  planTier: z.enum(PLAN_TIER_VALUES),
  billingCycle: z.enum(BILLING_CYCLE_VALUES),
  amountKrw: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => /^[0-9]+$/.test(v), { message: "금액은 정수만 가능합니다." })
    .transform((v) => parseInt(v, 10))
    .refine((v) => v >= 0 && v <= 1_000_000_000, { message: "금액 범위 초과." }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다."),
  endDate: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: "YYYY-MM-DD 또는 빈 값." }),
  contractHolderName: z.string().trim().max(100),
  contractHolderEmail: z.string().trim().max(200),
  notes: z.string().trim().max(2000),
});

export async function saveContractAction(
  instanceSlug: string,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      return { ok: false, fieldErrors: {}, formError: `auth: ${err.reason}` };
    }
    throw err;
  }
  if (!pageCtx.ctx.isSuperAdmin) {
    return { ok: false, fieldErrors: {}, formError: "계약 관리는 운영자(super-admin) 만 가능합니다." };
  }

  const raw = {
    status: formData.get("status"),
    planTier: formData.get("planTier"),
    billingCycle: formData.get("billingCycle"),
    amountKrw: formData.get("amountKrw"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") ?? "",
    contractHolderName: formData.get("contractHolderName") ?? "",
    contractHolderEmail: formData.get("contractHolderEmail") ?? "",
    notes: formData.get("notes") ?? "",
  };
  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[k]) fieldErrors[k] = [];
      fieldErrors[k].push(issue.message);
    }
    return { ok: false, fieldErrors };
  }
  const d = parsed.data;
  const endDateValue = d.endDate === "" ? null : d.endDate;

  // dates_order CHECK 와 정합 — application level 사전 검증
  if (endDateValue !== null && endDateValue < d.startDate) {
    return { ok: false, fieldErrors: { endDate: ["종료일은 시작일 이후여야 합니다."] } };
  }

  const sql = getSqlBase();
  try {
    await sql`
      INSERT INTO instance_contract (
        instance_id, status, plan_tier, billing_cycle, amount_krw,
        start_date, end_date, contract_holder_name, contract_holder_email, notes
      ) VALUES (
        ${pageCtx.instanceId}::uuid,
        ${d.status}, ${d.planTier}, ${d.billingCycle}, ${d.amountKrw},
        ${d.startDate}::date,
        ${endDateValue}::date,
        ${d.contractHolderName}, ${d.contractHolderEmail}, ${d.notes}
      )
      ON CONFLICT (instance_id) DO UPDATE SET
        status = EXCLUDED.status,
        plan_tier = EXCLUDED.plan_tier,
        billing_cycle = EXCLUDED.billing_cycle,
        amount_krw = EXCLUDED.amount_krw,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        contract_holder_name = EXCLUDED.contract_holder_name,
        contract_holder_email = EXCLUDED.contract_holder_email,
        notes = EXCLUDED.notes,
        updated_at = now()
    `;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, fieldErrors: {}, formError: `저장 실패: ${msg}` };
  }

  revalidatePath(`/admin/${instanceSlug}/contract`);
  revalidatePath(`/admin`);
  return { ok: true };
}

export async function deleteContractAction(
  instanceSlug: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }
  if (!pageCtx.ctx.isSuperAdmin) {
    return { ok: false, reason: "계약 관리는 운영자(super-admin) 만 가능합니다." };
  }
  try {
    await getSqlBase()`DELETE FROM instance_contract WHERE instance_id = ${pageCtx.instanceId}::uuid`;
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
  revalidatePath(`/admin/${instanceSlug}/contract`);
  revalidatePath(`/admin`);
  return { ok: true };
}
