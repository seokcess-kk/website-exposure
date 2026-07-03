// @glitzy/auth/identifier — 이메일 정규화 (trim·NFC·lowercase·EMAIL_REGEX)
// 구 magic-link.ts 에서 이전 — 로그인/계정 생성 전반에서 재사용.

import { AuthDeniedError } from "./errors.js";

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export function normalizeIdentifier(input: string): string {
  if (typeof input !== "string") throw new AuthDeniedError("invalid-credentials", `identifier must be string`);
  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > 254) {
    throw new AuthDeniedError("invalid-credentials", `identifier length invalid`);
  }
  const normalized = trimmed.normalize("NFC").toLowerCase();
  if (!EMAIL_REGEX.test(normalized)) {
    throw new AuthDeniedError("invalid-credentials", `invalid email format`);
  }
  return normalized;
}
