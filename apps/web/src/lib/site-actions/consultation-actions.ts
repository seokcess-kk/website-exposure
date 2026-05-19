// @glitzy/web/lib/site-actions/consultation-actions — 1:1 비밀 상담 submit server action
//
// Turbopack (Next 15.5.x) 안 dynamic route segment ([instanceSlug]) 내부 안 server action import
// 안 unexpected error 발생 — dynamic path 밖 안 단일 위치 안 정의.
//
// 공개 사이트 안 form submit → app_public_reader role 안 INSERT (C0026 RLS policy 안 허용).
// stub 단계: 단순 INSERT + thank-you redirect.

"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { withPublicTenantTransaction } from "@/lib/public-tenant";

const InputSchema = z.object({
  title: z
    .string({ required_error: "제목은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 100, { message: "제목은 1~100자" }),
  displayName: z
    .string({ required_error: "이름은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 1 && v.length <= 50, { message: "이름은 1~50자" }),
  contactPhone: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^[0-9+\-\s]{8,30}$/.test(v), { message: "전화번호 형식 오류" }),
  contactEmail: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine(
      (v) => v === null || v === undefined || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      { message: "이메일 형식 오류" },
    ),
  message: z
    .string({ required_error: "상담 내용은 필수입니다." })
    .transform((v) => v.trim())
    .refine((v) => v.length >= 10 && v.length <= 5000, { message: "상담 내용은 10~5000자" }),
});

export type SubmitResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string[]>; formError?: string };

export async function submitConsultation(
  instanceSlug: string,
  _prev: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  const parsed = InputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }

  if (parsed.data.contactPhone === null && parsed.data.contactEmail === null) {
    return { ok: false, fieldErrors: { contactPhone: ["전화 또는 이메일 중 하나는 필수입니다."] } };
  }

  try {
    await withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
      await tx`
        INSERT INTO consultation_request (instance_id, title, display_name, contact_phone, contact_email, message)
        VALUES (
          ${ctx.instanceId}::uuid,
          ${parsed.data.title},
          ${parsed.data.displayName},
          ${parsed.data.contactPhone ?? null},
          ${parsed.data.contactEmail ?? null},
          ${parsed.data.message}
        )
      `;
    });
  } catch (err) {
    console.error("[consultation] insert error", err);
    return { ok: false, formError: "상담 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  redirect(`/${instanceSlug}/community/consultation/thank-you`);
}
