You are reviewing the **plan** `docs/decisions/SLUG_AUTOGEN_PLAN.md` v0.2 (draft). This is the **first** Codex critique cycle.

This plan is **smaller in scope** than recent feature plans (LOCATION_LEGAL · EAT_CONTENT · COMPLIANCE_ASSISTANT) because it only adds client-side UX (auto-fill slug from source field) and a server retry loop. No DB/schema/migration changes. No SoT cascade. Still apply strict review — verify that "no cascade" is actually true, and that the proposed util/hook/retry semantics are correct.

## SoT to read first

1. `docs/decisions/SLUG_AUTOGEN_PLAN.md` v0.2 — plan under review (S-01~08, SLUG-DEFER-01~04, SLUG-CASCADE-01~06)
2. `docs/core/DATA_MODEL.md` — § 4 안 10 entity slug 컬럼 정의 (C-01·02·03·04·05·06·09·22·24·25·12)
3. `packages/core-content/src/schema.ts` — Drizzle schema · `*_slug_regex` CHECK · `*_instance_slug_unique` constraint 10종 (line 21·69·115·161·193·228·279·335·380·441·499)
4. `packages/core-content/migrations/` — C0001 ClinicProfile · C0003 DoctorProfile · C0004 TreatmentPage · C0005 Article · C0006 LegalDocument · C0008 LocationProfile · C0009 ArticleCategory · C0010 Publication · C0011 MediaAppearance · C0012 FAQ
5. `apps/web/src/lib/eat-content-schema.ts` — `SLUG_REGEX_LONG` `^[a-z0-9][a-z0-9-]{2,99}$` (line 115) · `SLUG_REGEX_SHORT` `^[a-z0-9][a-z0-9-]{2,63}$` (line 116) · 4 EAT zod refine
6. `apps/web/src/lib/errors.ts` `mapDbErrorToResult` — 10 entity `*_instance_slug_unique` constraint 매핑 (line 27·32·39·46·69·80·97·110·119)
7. `apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts` — savePublication 패턴 (withSkeletonTx · INSERT vs UPDATE · audit emit)
8. `apps/web/src/components/forms/PublicationForm.tsx` — 기존 slug 필드 onChange 패턴
9. `apps/web/src/components/forms/ClinicProfileForm.tsx` — LocationProfile/LegalDocument 5종 통합 폼 (slug auto-fill 미적용 근거 확인)
10. `docs/admin/ARCHITECTURE.md` § 3.8.1·3.8.2 — LocationProfile `main` 고정 · LegalDocument documentType 기반 default slug 자동 생성 규칙
11. `npmjs.com/package/hangul-romanization` — 실제 export shape · maintenance status · 최신 버전
12. `npmjs.com/package/nanoid` v5.x — `non-secure` export · ESM/CJS 정합

## What to check (cycle 1)

### Plan SoT 합치 / cascade 누락
- "SoT cascade 없음" 주장의 진위 — 10 entity migration / Drizzle schema / DATA_MODEL / eat-content-schema 안 slug 정의가 정말 무변경 가능한가?
- LegalDocument 5종 default slug 자동 생성 규칙 (LL-ACTION-12·LL-FORM-13)이 본 plan과 충돌 없는지 — admin/ARCHITECTURE § 3.8.2 인용 정합
- LocationProfile slug=`main` 고정 (LL-FORM-13) — ClinicProfileForm 안 자동 생성 위치 정확성
- LL-DEFER / EC-DEFER 안 본 plan으로 해소되는 항목 있는지 (예: ONBOARDING 이후 slug 자동화 marker)

### slugify util 정확성 (§ 3.1)
- `hangul-romanization` 실 export shape — `import { romanize }` named export 가 맞는가? Default export 가능성? 라이브러리 v1.0.6 의 실제 API 시그니처 확인
- `romanize(input.trim())` 결과 길이 — 200자 한글 title → 영문 800자까지 부풀 수 있다고 plan에 명시. 실제 음절당 평균 출력 자수 검증
- `replace(/[^a-z0-9]+/g, "-")` 가 `romanize` 결과 안 대문자 / 띄어쓰기 / 숫자 정합 — 라이브러리가 띄어쓰기 보존하는지?
- 길이 cap `opts.maxLength - 4` — retry suffix `-2`~`-5` (2자) + 안전 마진 2자가 정확한 산정인가? `-5`는 1자리지만 2자 ("-5") 정합
- fallback regex `^[a-z0-9]` 검증 시점 — `nanoid(8)` 결과가 항상 `^[a-z0-9]`로 시작하는지 (nanoid alphabet `0-9A-Za-z_-` → 첫 글자 대문자/언더스코어/하이픈일 수 있음 → SLUG_REGEX_SHORT/LONG 위반 가능)
- "slugify의 `-` collapse" — 음절 분리자 기본값(공백 없음) 결정과 정합 검증

### useAutoSlug hook (§ 3.2)
- `pristine` ref 시맨틱 — slug onChange 외 program-driven setSlug 호출도 `markSlugDirty()`를 거치지 않으면 pristine 유지. 의도된 동작인가?
- `lastSource` ref — `args.source === lastSource.current` 가드. 동일 source 재호출 시 작동 멈춤. 운영자가 source 지웠다가 동일 값 재입력하면 slug 안 채워질 가능성 → spec 의도와 정합?
- edit 모드 (`isNew=false`) 안 source 변경 시 slug 안 채움 결정 — 운영자가 title 수정해도 slug 그대로 유지. UX 문제 없는지?
- React 18 strict mode + ref mutation — `pristine.current = false` 가 double invocation에 안전한지

### slug-retry (§ 3.3)
- transaction 경계 — `withSlugRetry` 호출 안 마다 `withSkeletonTx` 새로 진입. § 6 patternd이 정확한지 (retry loop가 outer)
- 신규 INSERT만 retry, 편집 UPDATE는 retry 안 함 결정 — § 6 "edit 모드는 retry 안 함" 결정의 spec 안 명시 위치
- constraint suffix `_instance_slug_unique` — 10 entity 모두 정합 (errors.ts CONSTRAINT_MAP 안 매핑됨) — 검증된 사실 인용
- 5회 한계 응답 지연 — 100ms × 5 = 0.5초 추가 latency 운영 영향
- `nanoid(8)` 충돌 시 retry 안 함 — fallback slug는 매번 다른 값으로 재생성? 아니면 retry 안 같은 fallback slug 재시도? § 3.1 fallback이 deterministic 한가 random 한가 명시

### Publication 특수 (§ 4)
- DOI sanitize 결과 — `10.1234/abc.123` → `doi-10-1234-abc-123` 변환의 길이/regex 정합 (특수문자 `-._;()/:` 모두 `[^a-z0-9]+` → `-` 로 변환)
- DOI 정규식 `/^10\.\d{4,9}\//` — eat-content-schema.ts:113 `DOI_REGEX` 와 정합?
- 우선순위 변경 시 (DOI 추가 입력 → slug 재생성) — useAutoSlug 의 source 변경 감지 단위가 string 인데 source 함수 결과를 useMemo로 감싸야 하지 않는가?

### 적용 대상 표 (§ 2)
- 8 Form 적용 / 2 entity 미적용 결정의 정확성
- LegalDocument 5종 default slug 규칙 (admin/ARCH § 3.8.2) — 현재 코드 실제 동작과 정합? (LL-ACTION 어디서 default slug 생성하는지 확인)
- Instance slug (테넌트 setup) — 미적용 결정의 cascade marker 누락?

### vitest 시나리오 (§ 8)
- SLG-01 `"강남미용외과"` → `"gangnammiyongoegwa"` (또는 라이브러리 정합) — 실제 hangul-romanization 출력 확인 필요. 음절 결합/분리 결과 검증
- SLG-09 `"123"` 입력 — fallback이 발동하는가? `capped.length < 3` 가드 통과 검증
- HK-03 edit 모드 source 변경 시 slug 안 채움 — testing-library 의존성 (이미 있는지 확인)
- coverage — slugify 결과가 항상 `SLUG_REGEX_LONG`/`SHORT` 통과 보장하는 property-based test SLG-10 의 시드 / sample size

### 의존성 (§ 7)
- `hangul-romanization` v1.0.6 — 라이브러리 최신 활동 (npm publish 시점) · open issues · license · 의존성
- `nanoid` v5.x ESM-only — Next 14 App Router 환경에서 `non-secure` export server/client 모두 정합?
- 대안 라이브러리 — `transliteration` (3.0.0, broader Unicode) · `@stdlib/nlp-trans-hangul` 등 비교
- size 영향 — apps/web 번들에 client 측 ~10KB 추가, ROI 비교

### 운영 / 회귀
- 기존 운영 안 slug 입력 패턴이 onChange 마다 markSlugDirty 호출 — 운영자가 잘못 입력해서 fix 하려고 slug 필드 클릭만 해도 dirty 되지 않는지? (focus만으로는 onChange 안 됨 — OK)
- M0_BUILD_EXPORT 안 publication/media slug → public URL 미반영 (FAQ만 P-011 공개) — admin URL 만 영향이므로 SEO 무영향 검증
- Article / TreatmentPage / Doctor / FAQ / ArticleCategory 는 공개 URL 노출 — auto-generated slug 가 한글→로마자 변환된 형태로 SEO 노출. 사용자(운영자) 가 검수/편집할 panel 제공? (Field hint로 충분?)

### Cascade markers (acceptance precondition)
- SLUG-CASCADE-01~06: 모두 "없음" 주장 검증 — DATA_MODEL · schema · migrations · eat-content-schema · errors.ts · admin/ARCHITECTURE 각각 본 plan 이 변경 요구하는 line 있는지

### SLUG-DEFER 점검
- SLUG-DEFER-01 ~ 04 — defer 사유 적정성 + 후속 cycle 위치 명시 정합

## Output format

```
# SLUG_AUTOGEN_PLAN v0.2 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N nit=N (총 N)
- closeableAfterPatch: <true|false>
- 추정 cycle 수렴 horizon: <2~3 cycle | 4~5 cycle>

## blocking
- **SLG-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <SLUG_AUTOGEN_PLAN § ...>
  - 근거(SoT): <인용>
  - 문제: ...
  - 권장 patch: ...

## major
## minor
## nit

## cascade marker / acceptance precondition 점검
- SLUG-CASCADE-01~06: <PASS|FAIL|TBD>

## SLUG-DEFER 점검
- SLUG-DEFER-01~04: <적정|이의>
```

가능한 한 광범위하게 보고, 추측이 아니라 SoT 파일을 직접 line 단위로 인용하라. 특히 외부 라이브러리(hangul-romanization · nanoid) API shape는 npm registry 실제 export 확인 후 인용. 한국어로 응답.
