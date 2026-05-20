import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadImageResult =
  | { ok: true; url: string | null }
  | { ok: false; field: string; message: string };

export async function resolveAdminImageInput({
  formData,
  instanceSlug,
  modeField,
  urlField,
  fileField,
  uploadKind,
}: {
  formData: FormData;
  instanceSlug: string;
  modeField: string;
  urlField: string;
  fileField: string;
  uploadKind: string;
}): Promise<UploadImageResult> {
  const mode = String(formData.get(modeField) ?? "url");
  const rawUrl = String(formData.get(urlField) ?? "").trim();
  if (mode !== "file") return { ok: true, url: rawUrl === "" ? null : rawUrl };

  const file = formData.get(fileField);
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, field: fileField, message: "첨부할 이미지 파일을 선택해주세요." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, field: fileField, message: "이미지는 5MB 이하만 첨부할 수 있습니다." };
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return { ok: false, field: fileField, message: "jpg, png, webp, gif 이미지만 첨부할 수 있습니다." };
  }

  const safeInstanceSlug = instanceSlug.replace(/[^a-zA-Z0-9-]/g, "-");
  const safeKind = uploadKind.replace(/[^a-zA-Z0-9-]/g, "-");
  const dir = path.join(process.cwd(), "public", "uploads", "admin", safeInstanceSlug, safeKind);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);
  return { ok: true, url: `/uploads/admin/${safeInstanceSlug}/${safeKind}/${filename}` };
}
