# slug 자동 생성 plan (v0.4·draft·2026-05-19)

> **상태**: **v0.4 draft** — 실코드 진행 중 ClinicProfileForm 점검 결과 slug 필드 부재 확인 → 7 Form 으로 축소 (SLG-FORM-01).

본 문서는 어드민 폼 안 slug 입력을 source 필드(name/title/question)로부터 자동 채우는 UX 개선 plan이다. 운영자가 slug를 직접 입력하는 번거로움을 제거하면서, slug 길이/regex/unique 같은 DB SoT는 그대로 유지한다.

## SoT (변경 없음)

본 plan은 client-side UX + server retry loop만 추가한다. 아래 SoT는 모두 **무변경 (read-only reference)**:

- `docs/core/DATA_MODEL.md` (C-01·02·03·04·05·06·09·22·24·25·12 안 slug 컬럼 정의)
- `packages/core-content/src/schema.ts` (10 entity Drizzle schema · slug regex CHECK · `*_instance_slug_unique` constraint)
- `packages/core-content/migrations/` (C0001·C0003·C0004·C0005·C0006·C0008·C0009·C0010·C0011·C0012 — slug regex / unique constraint)
- `apps/web/src/lib/eat-content-schema.ts` `SLUG_REGEX_LONG` `^[a-z0-9][a-z0-9-]{2,99}$` · `SLUG_REGEX_SHORT` `^[a-z0-9][a-z0-9-]{2,63}$` (Article·TreatmentPage·EAT 4종 schema 안 slug refine)
- `apps/web/src/lib/errors.ts` `mapDbErrorToResult` — 23505 unique violation → `*_instance_slug_unique` constraint → `slug` 필드 에러 매핑 (10 entity 모두 매핑됨)

## 1. 목적과 범위

### 1.1 목적

운영자가 학술 인용·기사·진료 페이지 등 컨텐츠를 추가할 때 slug 필드를 매번 직접 입력해야 하는 번거로움 제거. **한국어 source 필드에서 의미 있는 영문 slug를 자동 생성**하되, 운영자가 원하면 언제든 수동 편집 가능하도록 한다.

### 1.2 범위 (포함)

| ID | 항목 | 결정 |
|---|---|---|
| **S-01** | 한글 → 영문 변환 알고리즘 | `hangul-romanization` 패키지 (revised 국어의 로마자 표기법 근사) |
| **S-02** | source 필드 watch 동작 | pristine flag — 운영자가 slug 직접 편집 시 watcher 중단 |
| **S-03** | unique 충돌 처리 | 자동 suffix 재시도 (`-2`, `-3`, … 최대 10회) |
| **S-04** | 신규/편집 모드 차별 | 신규 폼만 자동 채움 활성. 편집 모드는 처음부터 not-pristine (기존 slug 보존) |
| **S-05** | Publication 특수 소스 | DOI → PubMed → title 우선순위 |
| **S-06** | 음절 분리자 | `hangul-romanization` 라이브러리 기본값 — 음절 사이 공백 없음. slugify의 `-` collapse가 처리. |
| **S-07** | nanoid suffix 길이 | 8자 (4×10¹² 공간) |
| **S-08** | retry limit | 5회 — 충돌 확률 낮으므로 5회면 충분, 응답 지연 최소화 |

### 1.3 범위 (비범위 / SLUG-DEFER)

| ID | 항목 | Defer 사유 |
|---|---|---|
| **SLUG-DEFER-01** | DB 안 slug regex / 길이 / unique 변경 | SoT 변경 cascade 발생. 본 plan은 UX layer 변경만. |
| **SLUG-DEFER-02** | 기존 row 의 slug bulk 재생성 (마이그레이션) | 기존 slug 운영자 의도 반영. 변경 시 SEO/admin URL/JSON-LD `@id` 모두 cascade. |
| **SLUG-DEFER-03** | 다국어(영어 외 일본어·중국어) source 처리 | 본 프로젝트 v1.0 한국어 한정. M1+ 다국어 합류 시 transliteration 추가. |
| **SLUG-DEFER-04** | URL 동의어 redirect (구 slug → 신 slug) | edit 모드 slug 변경 시 admin route는 이미 redirect 처리 중. 공개 사이트의 history redirect는 별도 cycle (Article/TreatmentPage 공개 URL 안정성과 묶어서). |

## 2. 적용 대상 (7 Form · 7 entity slug)

| Form 파일 | source 필드 | maxLen | regex | 적용 |
|---|---|---|---|---|
| `DoctorProfileForm.tsx` | `name` | 64 | SHORT | DoctorProfile slug |
| `ArticleCategoryForm.tsx` | `name` | 64 | SHORT | ArticleCategory slug (`isDefault` 일 때 비활성 — general 카테고리 보호) |
| `TreatmentPageForm.tsx` | `title` | 99 | LONG | TreatmentPage slug |
| `ArticleForm.tsx` | `title` | 99 | LONG | Article slug |
| `PublicationForm.tsx` | DOI → PubMed → `title` | 99 | LONG | Publication slug (특수 우선순위 — § 4) |
| `MediaAppearanceForm.tsx` | `title` | 99 | LONG | MediaAppearance slug |
| `FaqForm.tsx` | `question` | 99 | LONG | FAQ slug |

**미적용 (v0.3 정정 SLG-FORM-01 — ClinicProfileForm 실 코드 점검 결과)**:
- **ClinicProfile**: `ClinicProfileForm` 에 slug 입력 필드 자체가 **없음**. `clinic_profile.slug` DEFAULT `'clinic'` 고정 (C0001 migration line 69 `text("slug").notNull().default("clinic")`). 운영자가 변경하지 않으므로 자동 생성 불필요.
- **LocationProfile**: `slug='main'` 고정 — admin/ARCH § 3.8.1 / LL-FORM-13
- **LegalDocument 5종**: documentType 기반 default slug — admin/ARCH § 3.8.2 / LL-ACTION-12
- **Instance**: 테넌트 setup 단계 — 본 plan 대상 외

## 3. 공통 인프라 (3 신규 파일)

### 3.1 `apps/web/src/lib/slugify.ts`

```typescript
import { convert } from "hangul-romanization";
import { customAlphabet } from "nanoid/non-secure"; // slug는 보안 식별자 아님

// 36자 영소문자/숫자 — slug regex `^[a-z0-9]` 항상 통과
const slugNanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export type SlugifyOptions = {
  maxLength: 64 | 99;
  fallbackPrefix: string; // 예: "article", "publication" — 빈 결과 시 fallback
};

export function slugify(input: string, opts: SlugifyOptions): string {
  const normalized = convert(input.trim())
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // 비ASCII 알파벳/숫자 외 모두 하이픈
    .replace(/-+/g, "-")          // 연속 하이픈 collapse
    .replace(/^-+|-+$/g, "");      // 양끝 하이픈 제거

  // 길이 cap (suffix 여유 4자 — retry "-5" 2자 + 안전 마진 2자)
  const capped = normalized.slice(0, opts.maxLength - 4);

  // 첫 글자가 하이픈/숫자만 등 invalid → fallback
  if (capped.length < 3 || !/^[a-z0-9]/.test(capped)) {
    return `${opts.fallbackPrefix}-${slugNanoid()}`;
  }
  return capped;
}
```

설계 결정:
- `hangul-romanization` v1.0.1 의 실 API는 named export `convert(text: string): string` (`dist/index.d.ts` 권위 확인). 한글이 아닌 문자는 그대로 통과 (`convertCharacter` 안 `isHangul` 체크). 결과는 한 음절당 영문 2~4자 (예: 강남 → gangnam). 200자 한글 title이 최악의 경우 800자까지 부풀어 길이 cap이 필요.
- 길이 cap을 `maxLength - 4`로 두어 collision retry `-2` ~ `-5` suffix를 위한 여유 확보.
- nanoid `non-secure` 사용 — slug는 보안 식별자가 아니며 V8 RNG는 충분.
- **`customAlphabet` 으로 36자 영소문자/숫자만 제한** (v0.3 cycle 정정 SLG-API-02 — v0.2 의 default `nanoid(8)` 은 alphabet `A-Za-z0-9_-` 라 첫 글자가 `_`·`-`·대문자일 수 있어 SLUG_REGEX `^[a-z0-9]` 위반 가능). `36^8` ≈ 2.8×10¹² 공간 — collision 가능성은 retry loop가 흡수.

### 3.2 `apps/web/src/hooks/useAutoSlug.ts`

```typescript
"use client";
import { useEffect, useRef } from "react";
import { slugify, type SlugifyOptions } from "@/lib/slugify";

export type UseAutoSlugArgs = {
  source: string;
  slug: string;
  setSlug: (v: string) => void;
  isNew: boolean;          // edit 모드면 false → 처음부터 not-pristine
  options: SlugifyOptions;
};

export function useAutoSlug(args: UseAutoSlugArgs) {
  const pristine = useRef(args.isNew); // edit 모드면 false 시작
  const lastSource = useRef(args.source);

  // slug onChange tracker — 외부에서 직접 호출
  const markSlugDirty = () => { pristine.current = false; };

  useEffect(() => {
    if (!pristine.current) return;
    if (args.source === lastSource.current) return;
    lastSource.current = args.source;
    if (args.source.trim().length === 0) {
      args.setSlug("");
      return;
    }
    const next = slugify(args.source, args.options);
    args.setSlug(next);
  }, [args.source]); // eslint-disable-line react-hooks/exhaustive-deps

  return { markSlugDirty };
}
```

설계 결정:
- **pristine은 ref** (state 아님) — 렌더 트리거 안 함. 사용자가 slug를 한 번이라도 onChange하면 false로 굳고 끝.
- **edit 모드 (`isNew=false`)** 는 시작부터 not-pristine — 기존 slug 보존이 기본값. 운영자가 수동으로 재생성하려면 § 3.4 옵션 reset 버튼 (defer).
- source 비면 slug도 비움 — 운영자가 source를 다시 입력하면 채움.

### 3.3 `apps/web/src/lib/slug-retry.ts`

```typescript
import { Sql } from "postgres";

const RETRY_LIMIT = 5;

export async function withSlugRetry<T>(
  baseSlug: string,
  fn: (slugAttempt: string) => Promise<T>,
): Promise<T> {
  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
    const slug = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`;
    try {
      return await fn(slug);
    } catch (err) {
      if (!isUniqueSlugViolation(err)) throw err;
      if (attempt === RETRY_LIMIT) throw err;
      // continue with attempt+1
    }
  }
  throw new Error("unreachable");
}

function isUniqueSlugViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; constraint_name?: string };
  if (e.code !== "23505") return false;
  return Boolean(e.constraint_name?.endsWith("_instance_slug_unique"));
}
```

설계 결정:
- **transaction 단위 retry**: action 안 `withSkeletonTx`는 retry 1회당 새 트랜잭션 (rollback → 재진입). 동일 트랜잭션 안 재시도는 PostgreSQL이 거부 (aborted state).
- **5회 한계**: 응답 지연 최소화 + 충돌 확률 낮은 도메인 특성. 도달 시 마지막 23505 그대로 throw → `mapDbErrorToResult` 기존 매핑이 사용자에게 "이미 사용 중인 slug" 표시.
- **constraint 이름 suffix `_instance_slug_unique`** — 10 entity 모두 정합 (errors.ts CONSTRAINT_MAP에서 확인 완료).

## 4. Publication 특수 소스 우선순위

Publication은 source 우선순위가 3단계:

```typescript
function publicationSlugSource(form: {
  doi: string | null;
  pubmedId: string | null;
  title: string;
}): { source: string; fallbackPrefix: string } {
  if (form.doi && /^10\.\d{4,9}\//.test(form.doi)) {
    // 10.1234/abc.123 → doi-10-1234-abc-123
    return { source: `doi-${form.doi}`, fallbackPrefix: "publication" };
  }
  if (form.pubmedId && /^\d{1,9}$/.test(form.pubmedId)) {
    return { source: `pubmed-${form.pubmedId}`, fallbackPrefix: "publication" };
  }
  return { source: form.title, fallbackPrefix: "publication" };
}
```

`useAutoSlug` source는 `doi || pubmedId || title` 중 첫 비어있지 않은 값을 반응. 우선순위 변화 시(예: DOI 추가 입력) → slug 재생성. pristine=false면 무시.

## 5. Form 적용 패턴 (예: ArticleForm)

```tsx
const { markSlugDirty } = useAutoSlug({
  source: v.title,
  slug: v.slug,
  setSlug: (s) => set("slug", s),
  isNew,
  options: { maxLength: 99, fallbackPrefix: "article" },
});

<Field name="slug" label="slug" required
  value={v.slug}
  onChange={(x) => { markSlugDirty(); set("slug", x); }}
  ... />
```

8 Form 모두 동일 패턴 — source 필드만 다름.

## 6. Server action 적용 패턴 (예: savePublication)

```typescript
const result = await withSlugRetry(parsed.data.slug, async (slug) => {
  return await withSkeletonTx({ ... }, async (tx, ctx) => {
    // ... INSERT/UPDATE with slug
    return { ok: true, slug, mode: "insert", ... };
  });
});
```

**중요**: edit 모드는 retry 안 함 — 운영자가 명시적으로 slug를 변경했다면 unique violation은 의도된 입력 실수다. 신규 INSERT 모드에서만 자동 retry.

10 action 모두 동일 패턴:
- `apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts` (LegalDocument override 제외)
- `.../doctors/actions.ts`
- `.../articles/actions.ts`
- `.../treatments/actions.ts`
- `.../article-categories/actions.ts`
- `.../publications/actions.ts`
- `.../media-appearances/actions.ts`
- `.../faqs/actions.ts`

## 7. 의존성 추가

```json
{
  "dependencies": {
    "hangul-romanization": "^1.0.6",
    "nanoid": "^5.0.0"
  }
}
```

- `hangul-romanization` (~10KB) — revised 국어의 로마자 표기법 근사
- `nanoid` 5.x — `non-secure` export 사용. server-only가 아닌 universal.

`apps/web/package.json`에만 추가. 다른 package는 미사용.

## 8. vitest 시나리오 (신규)

### 8.1 `apps/web/src/lib/__tests__/slugify.test.ts`

| ID | 입력 | options | 기대 출력 |
|---|---|---|---|
| SLG-01 | `"강남미용외과"` | `{maxLength: 64, fallbackPrefix: "doctor"}` | `"gangnammiyongoegwa"` (또는 라이브러리 정합 결과) |
| SLG-02 | `"2024년 보톡스 효과 연구"` | `{maxLength: 99, fallbackPrefix: "article"}` | 영문 + 숫자 + 하이픈 조합 (regex 통과) |
| SLG-03 | `"   "` (빈/공백) | `{maxLength: 99, fallbackPrefix: "article"}` | `"article-<8자>"` fallback |
| SLG-04 | `"!!!@@@"` (특수문자만) | `{maxLength: 99, fallbackPrefix: "faq"}` | `"faq-<8자>"` fallback |
| SLG-05 | 300자 한글 title | `{maxLength: 99, fallbackPrefix: "article"}` | length ≤ 95 (maxLength - 4) |
| SLG-06 | `"가나 다라"` (공백 포함) | `{maxLength: 64, fallbackPrefix: "doctor"}` | 하이픈 1개 (`gana-dara`) |
| SLG-07 | `"---abc---"` (양끝 하이픈) | `{maxLength: 64, fallbackPrefix: "doctor"}` | `"abc"` |
| SLG-08 | `"abc---def"` (연속 하이픈) | `{maxLength: 64, fallbackPrefix: "doctor"}` | `"abc-def"` |
| SLG-09 | `"123"` (숫자 첫글자 OK) | `{maxLength: 64, fallbackPrefix: "doctor"}` | `"123"` (regex `^[a-z0-9]` 통과) |
| SLG-10 | regex 정합 — 결과는 항상 `SLUG_REGEX_LONG`/`SHORT` 통과 | property-based | 100 random 입력 |

### 8.2 `apps/web/src/lib/__tests__/slug-retry.test.ts`

| ID | 시나리오 |
|---|---|
| RT-01 | 1회차 성공 — `fn` 1회 호출, base slug 반환 |
| RT-02 | 1회차 23505 → 2회차 성공 — `fn` 2회 호출, `${base}-2` 반환 |
| RT-03 | 1~4회차 모두 23505 → 5회차 성공 — `fn` 5회, `${base}-5` 반환 |
| RT-04 | 5회 모두 23505 → throw — 마지막 에러 propagate |
| RT-05 | 23505가 아닌 에러 (예: 23514) → 즉시 throw, retry 안 함 |
| RT-06 | 23505 + constraint suffix 다름 (`*_instance_id_unique` 같은) → throw |

### 8.3 `apps/web/src/hooks/__tests__/useAutoSlug.test.tsx`

`@testing-library/react` (이미 의존성 있는지 확인 필요 — 없으면 다른 패턴):

| ID | 시나리오 |
|---|---|
| HK-01 | `isNew=true`, source 입력 → slug 자동 채움 |
| HK-02 | `isNew=true`, slug 수동 onChange → 이후 source 변경 무시 |
| HK-03 | `isNew=false` (edit 모드), source 변경 → slug 안 채움 (pristine=false 시작) |
| HK-04 | source가 빈 문자열 → slug도 빈 문자열 |

## 9. 구현 manifest

| 단계 | 산출물 |
|---|---|
| 1 | `pnpm add hangul-romanization nanoid` (apps/web 안에서) |
| 2 | `apps/web/src/lib/slugify.ts` 생성 |
| 3 | `apps/web/src/hooks/useAutoSlug.ts` 생성 |
| 4 | `apps/web/src/lib/slug-retry.ts` 생성 |
| 5 | `apps/web/src/lib/__tests__/slugify.test.ts` (vitest · 10 시나리오) |
| 6 | `apps/web/src/lib/__tests__/slug-retry.test.ts` (vitest · 6 시나리오) |
| 7 | `apps/web/src/hooks/__tests__/useAutoSlug.test.tsx` (vitest + testing-library · 4 시나리오) |
| 8 | DoctorProfileForm: useAutoSlug 적용 (name → slug 64) |
| 9 | ArticleCategoryForm: useAutoSlug 적용 (name → slug 64) |
| 10 | TreatmentPageForm: useAutoSlug 적용 (title → slug 99) |
| 11 | ArticleForm: useAutoSlug 적용 (title → slug 99) |
| 12 | PublicationForm: useAutoSlug 적용 (DOI → PubMed → title) |
| 13 | MediaAppearanceForm: useAutoSlug 적용 (title → slug 99) |
| 14 | FaqForm: useAutoSlug 적용 (question → slug 99) |
| 15 | 7 actions.ts 안 `withSlugRetry` wrap — **신규 INSERT 모드만** |
| 17 | `pnpm --filter @glitzy/web test` PASS 확인 |
| 18 | `pnpm --filter @glitzy/web typecheck` PASS 확인 |

## 10. SoT cascade (영향 분석)

| ID | SoT 문서 | 영향 |
|---|---|---|
| SLUG-CASCADE-01 | `docs/core/DATA_MODEL.md` | **없음** — slug 컬럼 정의/regex/unique 무변경 |
| SLUG-CASCADE-02 | `packages/core-content/src/schema.ts` | **없음** — Drizzle schema 무변경 |
| SLUG-CASCADE-03 | `packages/core-content/migrations/` | **없음** — DB constraint 무변경 |
| SLUG-CASCADE-04 | `apps/web/src/lib/eat-content-schema.ts` | **없음** — zod refine 유지 (운영자 수동 편집도 통과해야 하므로 client-side 검증 동일) |
| SLUG-CASCADE-05 | `apps/web/src/lib/errors.ts` `mapDbErrorToResult` | **없음** — 23505 매핑 그대로. retry loop는 매핑 이전에서 흡수. |
| SLUG-CASCADE-06 | `docs/admin/ARCHITECTURE.md` § 3.8 자동 생성 규칙 | **약함** — LocationProfile(`main`) / LegalDocument 5종 default slug 규칙은 그대로. 본 plan은 운영자 직접 입력 entity만 대상. |

**결론**: SoT cascade 없음. plan acceptance는 단독으로 가능하며 follow-up cascade 패치 불필요.

## 11. 마이그레이션 / 롤백

- DB 변경 없음 → 마이그레이션 없음.
- 롤백: useAutoSlug 호출 제거 + slug-retry wrap 해제만으로 v0.0 상태 복귀. 의존성(hangul-romanization, nanoid)은 다른 의존이 없으면 제거.

## 12. cycle history

| date | version | 변경 |
|---|---|---|
| 2026-05-19 | v0.4 | 실코드 7 Form 적용 중 발견 — SLG-FORM-01: `ClinicProfileForm` 에 slug 입력 필드 없음 (실 코드 점검). `clinic_profile.slug` DEFAULT `'clinic'` 고정 (C0001 migration). 적용 대상 8 → 7 Form / manifest 단계 18 → 17 정정. |
| 2026-05-19 | v0.3 | 실코드 진입 직전 외부 라이브러리 API 검증 patch (Codex 비평 사이클 건너뜀 결정 후 직접 검증). SLG-API-01: `hangul-romanization` v1.0.1 의 실 export는 named function `convert(text: string): string` (`dist/index.d.ts` 권위). v0.2 의 `import { romanize }` 는 함수명 불일치 — `import { convert } from "hangul-romanization"` 로 정합. 비-한글 문자(영문·숫자·공백·특수문자) 는 그대로 통과 (`convertCharacter` 안 `isHangul` 체크). SLG-API-02: `nanoid` default alphabet `A-Za-z0-9_-` 가 SLUG_REGEX `^[a-z0-9]` 위반 가능 → `customAlphabet("0123456789a-z", 8)` 36자 제한. |
| 2026-05-19 | v0.2 | S-06·07·08 미정 해소 (모두 추천안 수용) — 음절 분리자 기본값 · nanoid 8자 · retry 5회. RETRY_LIMIT 코드/시나리오 5회로 정합. § 12 미정 표 제거. |
| 2026-05-19 | v0.1 | 최초 draft — 사용자 옵션 결정 3건 반영(로마자 변환·pristine flag·자동 suffix). Codex 자동 비평 미진입. |
