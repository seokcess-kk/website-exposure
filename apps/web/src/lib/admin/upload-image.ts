// @glitzy/web/lib/admin/upload-image — 어드민 이미지 입력 resolver
// 사용자 결정 2026-05-20: Supabase Storage 전환 이후 file 분기 deprecate.
//
// 새 흐름 (Supabase Storage 클라이언트 직접 업로드):
//   1. ImageSourceField (client) 가 파일 선택 → requestImageUploadUrl() server action → signed URL
//   2. client 가 받은 signed URL 에 직접 PUT
//   3. 업로드 완료된 public URL 을 form 안 hidden input 에 저장 → submit
//   4. 본 resolver 는 mode 와 무관하게 form 안 URL 만 반환 (file 분기 사용 안 함)
//
// 기존 local fs 쓰기 (`public/uploads/...`) 분기는 Vercel ephemeral filesystem 에서 작동 안 함 → 제거.

export type UploadImageResult =
  | { ok: true; url: string | null }
  | { ok: false; field: string; message: string };

/**
 * 어드민 폼에서 이미지 URL 입력값을 resolve.
 *
 * @deprecated `modeField`·`fileField`·`uploadKind` 인자는 더 이상 사용되지 않음 (legacy 호환을 위해 시그니처만 유지).
 *   파일 업로드는 클라이언트가 Supabase Storage 에 직접 PUT 하므로, 서버는 form 안 URL 만 본다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resolveAdminImageInput({
  formData,
  instanceSlug: _instanceSlug,
  modeField: _modeField,
  urlField,
  fileField,
  uploadKind: _uploadKind,
}: {
  formData: FormData;
  instanceSlug: string;
  modeField: string;
  urlField: string;
  fileField: string;
  uploadKind: string;
}): Promise<UploadImageResult> {
  // file 분기 deprecate — 누군가 ImageSourceField 우회해서 file 직접 보내면 거부
  const file = formData.get(fileField);
  if (file instanceof File && file.size > 0) {
    return {
      ok: false,
      field: fileField,
      message: "파일은 클라이언트에서 Supabase Storage 로 직접 업로드해야 합니다. ImageSourceField 사용 권장.",
    };
  }

  const rawUrl = String(formData.get(urlField) ?? "").trim();
  return { ok: true, url: rawUrl === "" ? null : rawUrl };
}
