// @glitzy/web/lib/slug-retry — SLUG_AUTOGEN_PLAN v0.3 § 3.3
// 신규 INSERT 시 unique slug 충돌 자동 suffix 재시도 (최대 5회).
// transaction 단위 retry: 호출자는 각 attempt 마다 새 tx 진입 (rollback → 재진입).
// edit 모드 UPDATE 는 wrap 하지 말 것 — 운영자 명시적 slug 변경의 충돌은 의도된 입력 실수.

const RETRY_LIMIT = 5;

export async function withSlugRetry<T>(
  baseSlug: string,
  fn: (slugAttempt: string) => Promise<T>,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
    try {
      return await fn(slug);
    } catch (err) {
      if (!isUniqueSlugViolation(err)) throw err;
      lastErr = err;
    }
  }
  // 5회 모두 23505 → 마지막 에러 그대로 throw (mapDbErrorToResult 가 흡수)
  throw lastErr;
}

export function isUniqueSlugViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; constraint_name?: string; constraint?: string };
  if (e.code !== "23505") return false;
  const constraint = e.constraint_name ?? e.constraint;
  return Boolean(constraint?.endsWith("_instance_slug_unique"));
}
