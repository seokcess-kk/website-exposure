// @glitzy/web/lib/save-result — Server Action 공통 결과 타입

import type { FieldErrors } from "./errors";

export type SaveResult =
  | { ok: true; slug?: string }
  | { ok: false; fieldErrors: FieldErrors; formError?: string };
