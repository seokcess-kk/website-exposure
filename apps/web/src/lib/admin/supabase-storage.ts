// @glitzy/web/lib/admin/supabase-storage — Supabase Storage 어드민 업로드 helper
// 사용자 결정 2026-05-20: Cloudflare R2 대신 Supabase Storage (이미 Postgres 사용 중 → vendor 단일화).
//
// 흐름:
//   1. server action `signImageUploadUrl()` 호출 → Supabase service-role 로 signed upload URL 발급
//   2. client (ImageSourceField) 가 받은 URL 에 직접 PUT 으로 파일 업로드
//   3. 업로드 완료 후 public URL 을 form hidden input 에 저장 → submit
//
// 보안:
//   - SUPABASE_SERVICE_ROLE_KEY 는 서버 전용 (process.env access, client 노출 금지)
//   - bucket 은 public read · service-role 만 write
//   - object key path 안 instanceSlug 포함 → 운영자 cross-instance write 시 audit 가능

import { createClient } from "@supabase/supabase-js";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_IMAGE_BYTES = 30 * 1024 * 1024; // Supabase bucket 안 동일 30MB 정책 정합
const SIGNED_UPLOAD_TTL_SECONDS = 600; // 10분

export type SignUploadResult =
  | { ok: true; signedUrl: string; token: string; publicUrl: string; path: string }
  | { ok: false; message: string };

function getSupabaseEnv(): { url: string; serviceKey: string; bucket: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!url || !serviceKey || !bucket) return null;
  return { url, serviceKey, bucket };
}

function sanitizeSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, "-");
}

export async function signImageUploadUrl(input: {
  instanceSlug: string;
  kind: string;
  contentType: string;
  size: number;
}): Promise<SignUploadResult> {
  const env = getSupabaseEnv();
  if (!env) {
    return { ok: false, message: "Supabase Storage 환경 변수가 설정되지 않았습니다 (NEXT_PUBLIC_SUPABASE_URL · SUPABASE_SERVICE_ROLE_KEY · SUPABASE_STORAGE_BUCKET)." };
  }

  // 입력 검증
  if (input.size <= 0) return { ok: false, message: "파일 크기가 0 입니다." };
  if (input.size > MAX_IMAGE_BYTES) return { ok: false, message: "이미지는 30MB 이하만 업로드할 수 있습니다." };
  const ext = ALLOWED_TYPES[input.contentType];
  if (!ext) return { ok: false, message: "jpg, png, webp, gif 이미지만 업로드할 수 있습니다." };

  const safeInstance = sanitizeSegment(input.instanceSlug);
  const safeKind = sanitizeSegment(input.kind);
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const path = `admin/${safeInstance}/${safeKind}/${filename}`;

  const supabase = createClient(env.url, env.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.storage.from(env.bucket).createSignedUploadUrl(path);
  if (error || !data) {
    return { ok: false, message: `Supabase Storage signed URL 발급 실패: ${error?.message ?? "unknown"}` };
  }

  const publicUrl = supabase.storage.from(env.bucket).getPublicUrl(path).data.publicUrl;

  return {
    ok: true,
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl,
    path,
  };
}
