// @glitzy/web/lib/ai/suggestion-result — CONTENT_AI_ASSIST_PLAN v1.0 § 4·5
// 3 server-action wrapper 공통 결과 타입 + accept/reject 응답.

export type SuggestionSuccess<T> = {
  ok: true;
  logId: string;
  data: T;
};

export type SuggestionFailure = {
  ok: false;
  reason:
    | "cap-exceeded"
    | "rate-limited"
    | "api-error"
    | "parse-error"
    | "context-error"
    | "config-missing";
  message: string;
  logId?: string;
};

export type SuggestionResult<T> = SuggestionSuccess<T> | SuggestionFailure;
