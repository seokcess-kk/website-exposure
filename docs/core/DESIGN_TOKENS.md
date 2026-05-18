# Core — 디자인 토큰

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: Core가 정의하는 디자인 토큰 표준 — 토큰 분류(primitive·semantic·component), 색상·타이포·간격·라운드·그림자·모션·컴포넌트 토큰 카탈로그, 출력 형식(CSS·JSON), Preset/Instance override 인터페이스, 접근성 기준, 빌드 검증을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 페이지 타입·헤딩 위계 → `core/PAGE_TYPES.md` § 2.1
> - 콘텐츠 블록 표준(콜아웃·인용·표) → `core/CONTENT_STANDARDS.md` § 3
> - 메타·sitemap → `core/SEARCH_STANDARDIZATION.md`
> - 어드민 화면 토큰 흐름 → `docs/admin/ARCHITECTURE.md` (후속)

---

## 0. 한 페이지 요약

- **3-tier 토큰 구조**: primitive(원시값) → semantic(의미) → component(컴포넌트 매핑). **색상·shadow component**는 semantic 참조 의무(primitive 직접 참조 fail). typography·spacing·radius·motion은 primitive 직접 참조 허용 (§ 2.4 참조 규칙 표)
- **3-레이어 override**: Core(기본 카탈로그) → Preset(업종 카테고리 — 한의·치과·종합병원 등) → Instance(개별 클라이언트)
- **출력 형식 2종**: (a) CSS Custom Properties (`:root`·`[data-theme="dark"]`), (b) `tokens.json` (Style Dictionary 호환 — 빌드 도구 변환 가능)
- **다크모드**: 기본 light + dark 2개 테마. semantic 단계에서 분기, primitive·component는 동일
- **접근성**: WCAG 2.1 AA 명도 대비(텍스트 4.5:1·UI 3:1) + 포커스 표시 의무
- **빌드 검증**: 토큰 미정의(체인 단절)·순환 참조·접근성 위반·**색상/shadow component에서 primitive 직접 참조** 시 fail (typography·spacing·radius·motion의 primitive 직접 참조는 § 2.4 허용)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| primitive 값 변경 (색상·크기) | **MAJOR** | semantic·component 전반 영향 — 마이그레이션 가이드 필수 |
| primitive 추가 | MINOR | |
| semantic 토큰 추가 | MINOR | |
| semantic 토큰 값 변경 (primitive 참조 교체) | **MAJOR** | UI 시각 변경 가능 |
| component 토큰 추가·변경 | MINOR | |
| 컴포넌트 → semantic 매핑 변경 | MINOR | |
| 출력 형식·파일 위치 변경 | **MAJOR** | 빌드 도구 정합성 |

### 1.2 SoT 원칙

- 본 문서 = **토큰 카탈로그·매핑 SoT** (사람 가독)
- **기계 처리 SoT — 4파일 구조** (`data/design-tokens/`):
  - `primitive.tokens.json` (테마 무관 원시값)
  - `semantic.light.tokens.json` (semantic — light 테마)
  - `semantic.dark.tokens.json` (semantic — dark 테마)
  - `component.tokens.json` (테마 무관, semantic 참조)
- Preset·Instance override 토큰 파일은 동일 4파일 구조를 따른다 (`presets/<presetSlug>/design-tokens/*.json`·`instances/<instanceId>/design-tokens/*.json`)
- 빌드 결과 — `dist/tokens/<theme>.css` + `dist/tokens/<theme>.json`

### 1.3 본 문서가 다루지 않는 영역

- 컴포넌트 시각 디자인 사양 (Figma 등 외부) — 본 문서는 토큰 인터페이스만
- 페이지별 레이아웃 — `core/PAGE_TYPES.md` § 2
- 의료광고법 표현 룰 — `core/CONTENT_STANDARDS.md` § 4

---

## 2. 토큰 분류 (3-tier)

### 2.1 primitive (원시값)

브랜드·시각 의미 없이 색상·크기·간격의 **원시값**만 보관. 다크모드·테마와 무관.

```
color.white·color.black                           (절대값)
color.gray.50    ~ color.gray.900                  (10단계)
color.blue.50    ~ color.blue.900                  (10단계)
color.green.50   ~ color.green.900                 (10단계)
color.amber.50   ~ color.amber.900                 (10단계)
color.red.50     ~ color.red.900                   (10단계)
font.size.12·14·16·18·20·24·30·36·48·60·72         (11단계 — § 4.2 표 SoT)
font.weight.regular·medium·semibold·bold
line.height.tight·normal·loose
letter.spacing.tight·normal·wide
spacing.0·1·2·3·4·6·8·12·16·24·32·48·64           (13단계 — § 5.1 표 SoT)
breakpoint.sm·md·lg·xl·2xl                         (§ 5.2)
radius.0·sm·md·lg·xl·full                          (§ 6.1)
border.width.thin·medium·thick                     (§ 6.3)
duration.fast·normal·slow                          (§ 7.1)
easing.linear·in·out·in-out                        (§ 7.2)
```

> `shadow.*`는 **semantic 단계**에서 정의 (§ 6.2 theme-aware). primitive에 두지 않음.
> `container.*`는 semantic 단계 (§ 5.3) — primitive `breakpoint.*` + `spacing.*` 참조.

### 2.2 semantic (의미)

primitive를 참조하여 **사용 맥락**을 의미화. 다크모드 분기 지점.

```
color.surface.background  → light: color.gray.50,  dark: color.gray.900
color.text.primary        → light: color.gray.900, dark: color.gray.50
color.text.secondary      → light: color.gray.600, dark: color.gray.300
color.brand.primary       → color.blue.600 (Preset/Instance override)
color.status.success      → color.green.600
color.status.warning      → color.amber.500
color.status.error        → color.red.600
color.status.info         → color.blue.500
...
```

### 2.3 component (컴포넌트 매핑)

semantic을 참조하여 **컴포넌트 단위 토큰** 정의. 컴포넌트 구현은 본 토큰만 참조.

```
button.primary.background       → color.brand.primary
button.primary.text             → color.text.inverse
button.primary.hover.background → color.brand.primary.hover
...
card.background                  → color.surface.elevated
card.border                      → color.border.subtle
...
callout.info.background          → color.status.info.subtle
callout.warning.background       → color.status.warning.subtle
callout.disclaimer.background    → color.surface.subtle
```

### 2.4 참조 규칙

토큰 영역별로 의무 강도가 다르다:

| 영역 | component 층 참조 규칙 |
|---|---|
| **색상** (`color.*`) | semantic 의무. primitive 직접 참조 시 빌드 fail (다크모드·테마 분기 보장) |
| **타이포** (`font.*`, `line.height.*`, `letter.spacing.*`) | semantic(예: `typography.body.default`) 또는 primitive 모두 허용 |
| **간격** (`spacing.*`) | primitive 직접 참조 허용 (semantic 간격 토큰 없음) |
| **라운드·테두리** (`radius.*`, `border.width.*`) | primitive 직접 참조 허용 |
| **그림자** (`shadow.*`) | semantic 의무. 다크모드 분기 보장 (§ 6.2 정합) |
| **모션** (`duration.*`, `easing.*`) | primitive 직접 참조 허용 |

- semantic → primitive 또는 다른 semantic 참조
- 순환 참조 fail (DAG 강제)
- component → component 참조 금지 (수평 참조 불가)

---

## 3. 색상 토큰

### 3.1 primitive 색상 팔레트

각 hue는 50·100·200·300·400·500·600·700·800·900 (10단계) + 절대값 2종(`color.white`, `color.black`).

| 토큰 | 용도 |
|---|---|
| `color.white` | 절대값 `#ffffff` — surface.elevated(light) 등에서 사용 |
| `color.black` | 절대값 `#000000` — opacity 베이스 |
| `color.gray.*` (50~900) | neutral 배경·텍스트·경계 |
| `color.blue.*` | 기본 brand 후보 + info |
| `color.green.*` | success |
| `color.amber.*` | warning |
| `color.red.*` | error |
| `color.teal·indigo·pink·*` (확장) | preset/instance 확장 시 |

primitive 색상의 정확한 hex 값은 § 3.4 표 (본 문서가 SoT).

### 3.4 primitive hex 카탈로그 (DT-02 해소)

Tailwind v3 슬레이트·블루·그린·앰버·레드 톤을 base로 채택. 동일 hue 10단계 — 50(가장 밝음) ~ 900(가장 어두움).

| hue / step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| `gray` | `#f9fafb` | `#f3f4f6` | `#e5e7eb` | `#d1d5db` | `#9ca3af` | `#6b7280` | `#4b5563` | `#374151` | `#1f2937` | `#111827` |
| `blue` | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` |
| `green` | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` |
| `amber` | `#fffbeb` | `#fef3c7` | `#fde68a` | `#fcd34d` | `#fbbf24` | `#f59e0b` | `#d97706` | `#b45309` | `#92400e` | `#78350f` |
| `red` | `#fef2f2` | `#fee2e2` | `#fecaca` | `#fca5a5` | `#f87171` | `#ef4444` | `#dc2626` | `#b91c1c` | `#991b1b` | `#7f1d1d` |

확장 hue(`teal`·`indigo`·`pink` 등)는 preset/instance 시점 도입. 본 v1.0은 위 5개 hue + white·black 카탈로그를 안정 표준으로 둔다.

### 3.2 semantic 색상 (light/dark 분기)

| 토큰 | light | dark |
|---|---|---|
| `color.surface.background` | gray.50 | gray.900 |
| `color.surface.elevated` | color.white | gray.800 |
| `color.surface.subtle` | gray.100 | gray.800 |
| `color.text.primary` | gray.900 | gray.50 |
| `color.text.secondary` | gray.600 | gray.300 |
| `color.text.disabled` | gray.400 | gray.500 |
| `color.text.inverse` | color.white | gray.900 |
| `color.border.default` | gray.200 | gray.700 |
| `color.border.subtle` | gray.100 | gray.800 |
| `color.brand.primary` | blue.600 | blue.400 |
| `color.brand.primary.hover` | blue.700 | blue.300 |
| `color.brand.secondary` | gray.700 | gray.300 |
| `color.status.success` | green.600 | green.400 |
| `color.status.success.subtle` | green.50 | green.900 |
| `color.status.warning` | amber.500 | amber.400 |
| `color.status.warning.subtle` | amber.50 | amber.900 |
| `color.status.error` | red.600 | red.400 |
| `color.status.error.subtle` | red.50 | red.900 |
| `color.status.info` | blue.500 | blue.300 |
| `color.status.info.subtle` | blue.50 | blue.900 |
| `color.focus.ring` | blue.500 | blue.300 |
| `color.overlay.modal` | rgba(0,0,0,0.5) | rgba(0,0,0,0.7) |
| `color.overlay.scrim` | rgba(0,0,0,0.3) | rgba(0,0,0,0.5) |

> **overlay 예외 규칙**: overlay 그룹의 semantic 토큰은 raw `rgba()` 값을 직접 가질 수 있다 — alpha 채널 표현을 위한 명시 예외. primitive `color.black` + opacity 별도 토큰으로 분리하면 alpha 변형마다 토큰이 늘어 운영 부담 큼. raw rgba는 overlay 그룹(`color.overlay.*`)에서만 허용 (다른 semantic 색상은 primitive alias 의무).

### 3.3 다크모드 활성화

- HTML 속성 `data-theme="light" | "dark"`로 분기
- `prefers-color-scheme` 자동 감지 + 사용자 명시 override (localStorage)
- 기본값 — `light`

---

## 4. 타이포그래피

### 4.1 폰트 패밀리 (primitive)

한국어 본문 가독성 우선 — Pretendard를 fallback 체인 앞에 배치.

| 토큰 | 값 |
|---|---|
| `font.family.sans` | "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Noto Sans KR", sans-serif |
| `font.family.serif` | "Noto Serif KR", Georgia, serif |
| `font.family.mono` | "JetBrains Mono", "D2Coding", Menlo, Consolas, monospace |

### 4.1.1 웹폰트 로딩 정책

- `Pretendard Variable` — `@font-face` 정의 시 `font-display: swap` 의무 (FOIT 회피)
- 한국어 글리프 subset 사용 권장 (전체 가중치 단일 파일 vs 가중치별 분할 — 빌드 도구가 결정. DT-06)
- preload 권장 — `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- 라이선스: Pretendard OFL — 검토 완료. 상용 사용 가능. Noto Sans KR SIL OFL — 검토 완료. 클라이언트 별도 폰트(상용 폰트) 사용 시 Instance override 시점 라이선스 확인 의무

### 4.1.2 letter-spacing 적용 범위

- `letter.spacing.tight` (-0.02em) — **영문 헤딩에만 권장** (한국어 본문 적용 시 가독성 저하)
- 한국어 본문은 기본 `letter.spacing.normal` (0) 사용
- 헤딩에 tight 적용 시 사용자 환경에서 한글 자음 충돌 가능 — Preset/Instance 검토

### 4.2 크기 스케일 (primitive)

`font.size.12` ~ `font.size.72` (11단계, rem 단위, 1rem = 16px):

| 토큰 | rem | px |
|---|---|---|
| `font.size.12` | 0.75 | 12 |
| `font.size.14` | 0.875 | 14 |
| `font.size.16` (base) | 1.0 | 16 |
| `font.size.18` | 1.125 | 18 |
| `font.size.20` | 1.25 | 20 |
| `font.size.24` | 1.5 | 24 |
| `font.size.30` | 1.875 | 30 |
| `font.size.36` | 2.25 | 36 |
| `font.size.48` | 3.0 | 48 |
| `font.size.60` | 3.75 | 60 |
| `font.size.72` | 4.5 | 72 |

### 4.3 가중치·줄간격·자간

| 토큰 | 값 |
|---|---|
| `font.weight.regular` | 400 |
| `font.weight.medium` | 500 |
| `font.weight.semibold` | 600 |
| `font.weight.bold` | 700 |
| `line.height.tight` | 1.25 |
| `line.height.normal` | 1.5 |
| `line.height.loose` | 1.75 |
| `letter.spacing.tight` | -0.02em |
| `letter.spacing.normal` | 0 |
| `letter.spacing.wide` | 0.02em |

### 4.4 semantic 타이포 (heading scale)

| 토큰 | 용도 | 크기 | 가중치 | 줄간격 |
|---|---|---|---|---|
| `typography.heading.h1` | 페이지 제목 | font.size.36 | semibold | tight |
| `typography.heading.h2` | 섹션 | font.size.30 | semibold | tight |
| `typography.heading.h3` | 서브섹션 | font.size.24 | semibold | normal |
| `typography.heading.h4` | 항목 | font.size.20 | semibold | normal |
| `typography.body.large` | 강조 본문 | font.size.18 | regular | normal |
| `typography.body.default` | 일반 본문 | font.size.16 | regular | normal |
| `typography.body.small` | 보조 텍스트 | font.size.14 | regular | normal |
| `typography.caption` | 캡션·메타 | font.size.12 | regular | normal |
| `typography.code` | 코드 | font.size.14 | regular | normal + font.family.mono |

---

## 5. 간격·레이아웃

### 5.1 spacing scale (primitive)

4px 기반 — `spacing.0` ~ `spacing.64` (13단계):

| 토큰 | rem | px |
|---|---|---|
| `spacing.0` | 0 | 0 |
| `spacing.1` | 0.25 | 4 |
| `spacing.2` | 0.5 | 8 |
| `spacing.3` | 0.75 | 12 |
| `spacing.4` | 1.0 | 16 |
| `spacing.6` | 1.5 | 24 |
| `spacing.8` | 2.0 | 32 |
| `spacing.12` | 3.0 | 48 |
| `spacing.16` | 4.0 | 64 |
| `spacing.24` | 6.0 | 96 |
| `spacing.32` | 8.0 | 128 |
| `spacing.48` | 12.0 | 192 |
| `spacing.64` | 16.0 | 256 |

### 5.2 breakpoints (primitive)

| 토큰 | 값 | 의미 |
|---|---|---|
| `breakpoint.sm` | 640px | 모바일 large |
| `breakpoint.md` | 768px | 태블릿 |
| `breakpoint.lg` | 1024px | 데스크탑 |
| `breakpoint.xl` | 1280px | 데스크탑 large |
| `breakpoint.2xl` | 1536px | 와이드 |

### 5.3 컨테이너·그리드 (semantic)

| 토큰 | 값 |
|---|---|
| `container.max-width` | breakpoint.xl (`1280px`) |
| `container.padding.mobile` | spacing.4 |
| `container.padding.desktop` | spacing.8 |
| `grid.columns` | 12 (raw integer — 비-색상 semantic) |
| `grid.gap.mobile` | spacing.4 |
| `grid.gap.desktop` | spacing.6 |

---

## 6. 라운드·그림자·테두리

### 6.1 radius (primitive)

| 토큰 | 값 |
|---|---|
| `radius.0` | 0 |
| `radius.sm` | 4px |
| `radius.md` | 8px |
| `radius.lg` | 12px |
| `radius.xl` | 16px |
| `radius.full` | 9999px |

### 6.2 shadow (semantic — theme-aware)

primitive가 아닌 **semantic 단계**에서 정의 (theme 분기) — primitive theme 무관 원칙 보호.

| 토큰 | light | dark (opacity 상향 — DT-04 해소) |
|---|---|---|
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.30)` |
| `shadow.md` | `0 4px 8px rgba(0,0,0,0.08)` | `0 4px 8px rgba(0,0,0,0.35)` |
| `shadow.lg` | `0 8px 16px rgba(0,0,0,0.12)` | `0 8px 16px rgba(0,0,0,0.40)` |
| `shadow.xl` | `0 16px 32px rgba(0,0,0,0.16)` | `0 16px 32px rgba(0,0,0,0.45)` |

#### 6.2.1 DTCG structured 형식 (Style Dictionary 입력)

tokens.json에서는 DTCG shadow 객체 모델로 저장 — 빌드 시 CSS box-shadow 문자열로 변환.

```json
{
  "shadow": {
    "sm": {
      "value": {
        "offsetX": "0",
        "offsetY": "1px",
        "blur": "2px",
        "spread": "0",
        "color": "rgba(0, 0, 0, 0.05)"
      },
      "type": "shadow"
    }
  }
}
```

- 복합 그림자(2개 이상 layer)는 `value`를 배열로 허용
- Style Dictionary transformer가 객체 → CSS 문자열로 변환 (`shadow/css` transform 사용)
- 본 문서의 § 6.2 표는 변환 후 CSS 문자열 형태로 표기 — tokens.json 원본은 객체

### 6.3 border-width (primitive)

| 토큰 | 값 |
|---|---|
| `border.width.thin` | 1px |
| `border.width.medium` | 2px |
| `border.width.thick` | 4px |

---

## 7. 모션

### 7.1 duration (primitive)

| 토큰 | 값 |
|---|---|
| `duration.fast` | 150ms |
| `duration.normal` | 250ms |
| `duration.slow` | 400ms |

### 7.2 easing (primitive)

| 토큰 | 값 |
|---|---|
| `easing.linear` | linear |
| `easing.in` | cubic-bezier(0.4, 0, 1, 1) |
| `easing.out` | cubic-bezier(0, 0, 0.2, 1) |
| `easing.in-out` | cubic-bezier(0.4, 0, 0.2, 1) |

### 7.3 reduced-motion

`@media (prefers-reduced-motion: reduce)` 적용 시:
- 모든 transition duration → 0ms
- animation 일괄 비활성화 (또는 fade-in만 유지)

---

## 8. 컴포넌트 토큰

### 8.1 button

| 토큰 | 값 (semantic) |
|---|---|
| `button.primary.background` | color.brand.primary |
| `button.primary.text` | color.text.inverse |
| `button.primary.hover.background` | color.brand.primary.hover |
| `button.secondary.background` | color.surface.subtle |
| `button.secondary.text` | color.text.primary |
| `button.padding.sm` | spacing.2 spacing.3 |
| `button.padding.md` | spacing.3 spacing.4 |
| `button.padding.lg` | spacing.4 spacing.6 |
| `button.radius` | radius.md |
| `button.font.size` | font.size.14 |
| `button.font.weight` | font.weight.medium |

### 8.2 card

| 토큰 | 값 |
|---|---|
| `card.background` | color.surface.elevated |
| `card.border` | color.border.subtle |
| `card.radius` | radius.lg |
| `card.padding` | spacing.6 |
| `card.shadow` | shadow.md |

### 8.3 input

| 토큰 | 값 |
|---|---|
| `input.background` | color.surface.elevated |
| `input.border` | color.border.default |
| `input.border.focus` | color.focus.ring |
| `input.text` | color.text.primary |
| `input.placeholder` | color.text.secondary |
| `input.radius` | radius.md |
| `input.padding` | spacing.3 spacing.4 |
| `input.font.size` | font.size.16 |

### 8.4 callout (CONTENT_STANDARDS § 3.4 정합)

| 토큰 | 용도 |
|---|---|
| `callout.info.background` | color.status.info.subtle |
| `callout.info.border` | color.status.info |
| `callout.info.icon.color` | color.status.info |
| `callout.warning.background` | color.status.warning.subtle |
| `callout.warning.border` | color.status.warning |
| `callout.warning.icon.color` | color.status.warning |
| `callout.disclaimer.background` | color.surface.subtle |
| `callout.disclaimer.border` | color.border.default |
| `callout.disclaimer.text` | color.text.secondary |
| `callout.radius` | radius.md |
| `callout.padding` | spacing.4 |

### 8.5 badge·tag

| 토큰 | 값 |
|---|---|
| `badge.background` | color.surface.subtle |
| `badge.text` | color.text.primary |
| `badge.font.size` | font.size.12 |
| `badge.padding` | spacing.1 spacing.2 |
| `badge.radius` | radius.sm |

### 8.6 link

| 토큰 | 값 |
|---|---|
| `link.text` | color.brand.primary |
| `link.text.hover` | color.brand.primary.hover |
| `link.underline.offset` | 0.2em |

### 8.7 table (P-102 가격표·진료시간 표 등)

| 토큰 | 값 |
|---|---|
| `table.background` | color.surface.elevated |
| `table.header.background` | color.surface.subtle |
| `table.header.text` | color.text.primary |
| `table.row.background.alt` | color.surface.subtle |
| `table.border` | color.border.default |
| `table.cell.padding` | spacing.3 spacing.4 |
| `table.font.size` | font.size.14 |

### 8.8 accordion·FAQ (P-011·Q&A 블록)

| 토큰 | 값 |
|---|---|
| `accordion.item.background` | color.surface.elevated |
| `accordion.item.border` | color.border.default |
| `accordion.trigger.padding` | spacing.4 |
| `accordion.trigger.font.weight` | font.weight.semibold |
| `accordion.content.padding` | spacing.4 |
| `accordion.icon.color` | color.text.secondary |

### 8.9 tabs·filter

| 토큰 | 값 |
|---|---|
| `tabs.background` | color.surface.background |
| `tabs.trigger.text` | color.text.secondary |
| `tabs.trigger.text.active` | color.text.primary |
| `tabs.trigger.border.active` | color.brand.primary |
| `tabs.trigger.padding` | spacing.2 spacing.4 |

### 8.10 nav·header·footer

| 토큰 | 값 |
|---|---|
| `nav.background` | color.surface.background |
| `nav.border.bottom` | color.border.subtle |
| `nav.link.text` | color.text.primary |
| `nav.link.text.hover` | color.brand.primary |
| `nav.height` | spacing.16 (64px) |
| `footer.background` | color.surface.subtle |
| `footer.text` | color.text.secondary |
| `footer.padding` | spacing.12 spacing.6 |

### 8.11 modal·toast

| 토큰 | 값 |
|---|---|
| `modal.background` | color.surface.elevated |
| `modal.overlay` | color.overlay.modal |
| `modal.radius` | radius.lg |
| `modal.padding` | spacing.6 |
| `modal.shadow` | shadow.xl |
| `toast.background.info` | color.status.info.subtle |
| `toast.background.success` | color.status.success.subtle |
| `toast.background.warning` | color.status.warning.subtle |
| `toast.background.error` | color.status.error.subtle |
| `toast.radius` | radius.md |
| `toast.padding` | spacing.3 spacing.4 |
| `toast.shadow` | shadow.lg |

### 8.12 avatar·breadcrumb

| 토큰 | 값 |
|---|---|
| `avatar.background` | color.surface.subtle |
| `avatar.text` | color.text.secondary |
| `avatar.size.sm` | spacing.8 (32px) |
| `avatar.size.md` | spacing.12 (48px) |
| `avatar.size.lg` | spacing.16 (64px) |
| `avatar.radius` | radius.full |
| `breadcrumb.text` | color.text.secondary |
| `breadcrumb.text.current` | color.text.primary |
| `breadcrumb.separator.color` | color.text.disabled |
| `breadcrumb.font.size` | font.size.14 |

### 8.13 CTA cluster (P-001 Home·P-006 Treatment Detail 등)

여러 CTA 채널(`CTAConfig`)을 묶어 노출하는 영역.

| 토큰 | 값 |
|---|---|
| `cta-cluster.background` | color.brand.primary |
| `cta-cluster.text` | color.text.inverse |
| `cta-cluster.radius` | radius.lg |
| `cta-cluster.padding` | spacing.6 spacing.8 |
| `cta-cluster.gap` | spacing.4 |

### 8.14 timeline·map·embed

| 토큰 | 값 |
|---|---|
| `timeline.line.color` | color.border.default |
| `timeline.node.color` | color.brand.primary |
| `timeline.node.size` | spacing.3 (12px) |
| `timeline.item.padding` | spacing.4 0 |
| `map.background` | color.surface.subtle |
| `map.border` | color.border.default |
| `map.radius` | radius.md |
| `embed.background` | color.surface.subtle |
| `embed.aspect.video` | 16/9 |
| `embed.aspect.square` | 1/1 |

---

## 9. 출력 형식

### 9.1 CSS Custom Properties

```css
:root {
  /* primitive */
  --color-gray-50: #f9fafb;
  --color-blue-600: #2563eb;
  --spacing-4: 1rem;
  /* semantic */
  --color-surface-background: var(--color-gray-50);
  --color-text-primary: var(--color-gray-900);
  --color-brand-primary: var(--color-blue-600);
  /* component */
  --button-primary-background: var(--color-brand-primary);
}

[data-theme="dark"] {
  --color-surface-background: var(--color-gray-900);
  --color-text-primary: var(--color-gray-50);
}
```

명명 규칙: 토큰 ID의 `.`을 `-`로 치환, kebab-case + `--` prefix.

### 9.2 tokens.json (Style Dictionary 표준 포맷)

**파일 구조** — Style Dictionary v3+ token set 방식:

```
data/design-tokens/
├── primitive.tokens.json       # primitive (테마 무관)
├── semantic.light.tokens.json  # semantic — light 테마
├── semantic.dark.tokens.json   # semantic — dark 테마
└── component.tokens.json       # component (테마 무관, semantic 참조)
```

**primitive.tokens.json 예시**:

```json
{
  "color": {
    "white": { "value": "#ffffff", "type": "color" },
    "gray": {
      "50": { "value": "#f9fafb", "type": "color" },
      "900": { "value": "#111827", "type": "color" }
    },
    "blue": {
      "600": { "value": "#2563eb", "type": "color" }
    }
  },
  "spacing": {
    "4": { "value": "1rem", "type": "dimension" }
  }
}
```

**semantic.light.tokens.json 예시**:

```json
{
  "color": {
    "surface": {
      "background": { "value": "{color.gray.50}", "type": "color" },
      "elevated":   { "value": "{color.white}", "type": "color" }
    },
    "brand": {
      "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
    }
  }
}
```

**component.tokens.json 예시**:

```json
{
  "button": {
    "primary": {
      "background": { "value": "{color.brand.primary}", "type": "color" },
      "text":       { "value": "{color.text.inverse}", "type": "color" },
      "radius":     { "value": "{radius.md}", "type": "dimension" },
      "padding":    { "value": "{spacing.3} {spacing.4}", "type": "dimension" }
    }
  }
}
```

**Style Dictionary 변환 규칙**:
- 토큰 ID — JSON path를 `.`로 join (예: `color.surface.background`)
- alias — `{ ... }` 구문, 빌드 시 resolve
- `type` 필드 — Style Dictionary v3+ 표준 (`value`·`type` 표기, **DTCG draft의 `$value`·`$type`는 미채택**). 타입 값은 DTCG 카테고리 호환 (color·dimension·fontFamily·fontWeight·duration·cubicBezier·shadow 등)
- theme 분기 — light/dark용 semantic 파일 별도. 빌드 시 token set으로 결합 (`StyleDictionary.config({ source: [primitive, semantic.light, component] })`)

### 9.3 빌드 결과

| 파일 | 내용 |
|---|---|
| `dist/tokens/light.css` | light 테마 CSS Custom Properties (:root) |
| `dist/tokens/dark.css` | dark 테마 ([data-theme="dark"]) |
| `dist/tokens/all.css` | 두 테마 통합 |
| `dist/tokens/light.json` | light 테마 평면화 JSON |
| `dist/tokens/dark.json` | dark 테마 평면화 JSON |

---

## 9.4 DATA_MODEL C-07 BrandTokens 매핑

DATA_MODEL의 C-07 `BrandTokens`는 어드민·인스턴스 단위 브랜드 최종값. 본 문서의 토큰 카탈로그와 다음과 같이 매핑:

| `BrandTokens` 필드 | 본 문서 토큰 매핑 |
|---|---|
| `personaMode` | preset selector — DATA_MODEL C-07 enum (`Premium`·`Wellness`·`Professional`·`Friendly`)을 kebab-case로 변환한 디렉터리 명. `Premium` → `presets/premium/`, `Wellness` → `presets/wellness/` 등. 정규화 규칙: PascalCase → 첫 글자만 소문자(현 enum 값은 1단어이므로 단순 lowercase로 충분) |
| `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
| `typography` | § 4.4 semantic 타이포 (typography.heading.h1 등) |
| `spacing` (`tight \| standard \| spacious`) | preset 단위 **primitive `spacing.*` scale 배수 override** — `tight` 0.85·`standard` 1.0(기본)·`spacious` 1.25. 모든 primitive spacing 값에 일괄 적용되므로 **MAJOR 변경**(§ 1.1·§ 10.2 정합)으로 취급. 개별 컴포넌트 padding만 바꾸는 것이 아니라 spacing scale 전체 |
| `radius` | § 6.1 primitive radius scale |
| `shadow` | § 6.2 shadow semantic (theme별 분기) |
| `layoutVariants` | preset/instance가 페이지 타입별 layout 변형 선택 (별도 문서) |
| `componentVariants` | preset/instance가 § 8 컴포넌트 토큰 set 선택 |

### 9.4.0 BrandTokens 세부 타입 정의

DATA_MODEL C-07이 위임한 세부 타입은 본 문서가 SoT — 평면화 키 집합 + 필수/선택:

```ts
// 단일 테마 색상 평면화 — § 3.2 semantic 색상 전체 round-trip
type ColorTokens = {
  // brand
  primary: string;
  primary_hover: string;
  secondary: string;
  // surface
  surface_background: string;
  surface_elevated: string;
  surface_subtle: string;
  // text
  text_primary: string;
  text_secondary: string;
  text_disabled: string;
  text_inverse: string;
  // border
  border_default: string;
  border_subtle: string;
  // focus
  focus_ring: string;
  // status
  status_success: string;
  status_success_subtle: string;
  status_warning: string;
  status_warning_subtle: string;
  status_error: string;
  status_error_subtle: string;
  status_info: string;
  status_info_subtle: string;
  // overlay (raw rgba — § 3.2 overlay 예외)
  overlay_modal: string;
  overlay_scrim: string;
};

// BrandTokens.colors는 light·dark 두 ColorTokens 분리 구조
type BrandTokensColors = {
  light: ColorTokens;
  dark: ColorTokens;
};

// 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)

type TypographyTokens = {
  font_family_sans: string;   // CSS font-family 문자열 전체 (required)
  font_family_serif?: string;
  font_family_mono?: string;
  // 각 heading·body 스타일은 평면화 키로 — 예: heading_h1_size·heading_h1_weight·heading_h1_line_height
  // 모든 § 4.4 semantic typography 토큰 평면화 (required)
};

type RadiusScale = {
  none: string;  // "0" 또는 "0px" — § 6.1 `radius.0` round-trip
  sm: string;    // § 6.1 primitive 값
  md: string;
  lg: string;
  xl: string;
  full: string;
};

// DTCG shadow 객체 — § 6.2.1 structured 모델
type ShadowValue = {
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  color: string;
};

type ShadowTokens = {
  sm: ShadowValue;
  md: ShadowValue;
  lg: ShadowValue;
  xl: ShadowValue;
};

// BrandTokens.shadow도 light·dark 양층 구조 (colors와 동일 패턴)
type ShadowScale = {
  light: ShadowTokens;
  dark: ShadowTokens;
};
```

- **평면화 규칙**: dot path를 underscore로 변환 (예: `color.surface.background` → `surface_background`). 어드민·빌드 도구가 본 규칙으로 평면화 결과 출력
- **required vs optional**: 위 표의 required는 모든 인스턴스가 제공해야 함. optional은 미제공 시 Core 기본값 사용

### 9.4.1 theme-color 메타 (SEARCH_STANDARDIZATION 정합)

빌드 시 light·dark 두 meta 모두 출력:

- **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
- **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex

미디어 쿼리 미지정 meta가 light 기본값을 의미. 양 theme 모두 출력 의무 — **한쪽만 출력 시 fail** (`SEARCH_STANDARDIZATION.md` § 2.1 Allowed 의무와 정합).

## 10. Preset·Instance Override

### 10.1 Override 흐름

```
Core (data/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
   ↓ merge (deep, 4-file 각각 별도)
Preset (presets/<presetSlug>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
   ↓ merge (deep)
Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
   ↓ build (Style Dictionary)
dist/tokens/<theme>.css·json
```

- Preset·Instance는 4파일 모두 제공할 필요 없음 — override할 파일만 작성 (없는 파일은 머지 단계에서 무시)
- 머지는 파일 단위가 아니라 토큰 ID 단위 (§ 10.3 알고리즘)

### 10.2 Override 규칙

- Preset·Instance는 **semantic 또는 component 토큰**만 override 권장
- primitive 직접 override는 가능하나 **MAJOR 변경**으로 취급
- **신규 토큰 추가 정책**:
  - Core에 없는 component 토큰을 Preset/Instance가 신설 → warning (Core 컴포넌트 계약 안정성 보호 — 일반 컴포넌트 토큰은 Core 신설 권장)
  - Core에 없는 semantic 토큰을 Preset/Instance가 신설 → warning
  - 단, **preset/instance 전용 토큰**은 합법 — **`private.*` 네임스페이스** 사용. semantic·component 양쪽 layer 모두 허용 (예: `private.hanui-card.background` 컴포넌트, `private.color.brand.tertiary` semantic). 표기 변환: tokens.json은 dot 객체 hierarchy, CSS 변수명은 dot을 `-`로 치환 + `--` prefix (예: `private.hanui-card.background` → `--private-hanui-card-background`). warning 면제
- 토큰 삭제 불가 (Core 토큰의 값만 override)

### 10.3 머지 알고리즘

1. **순서**: Core → Preset → Instance (3-step)
2. **타입별 머지**:
   - 스칼라 (color hex·spacing rem·radius px) — 후순위 값으로 교체
   - 객체 (`color.surface.*` 그룹) — deep merge (key 별 재귀)
   - 배열 (`font.family.sans` fallback 체인) — 전체 교체 (union 아님)
3. **theme별 머지**: light·dark token set은 각각 독립 머지. 한쪽만 override 시 다른 쪽 영향 없음
4. **alias 재해석 순서**: 머지 완료 후 alias resolve (한 번에). 중간 단계의 alias resolve 금지
5. **unknown key 처리**:
   - Core에 존재하지 않는 토큰 path 발견 시 — § 10.2 신규 추가 정책 적용
   - `private.*` 네임스페이스 외의 신규 component/semantic 토큰 → warning
   - `private.*` 네임스페이스 시 warning 면제
6. **접근성 재검증**: 머지·alias resolve 완료 후 § 11 접근성 검증 자동 재실행. Preset/Instance가 brand 색상 변경 후 본문 텍스트 대비가 WCAG AA 미충족 시 fail
7. **순환 참조 검출**: alias resolve 시 DAG 위반 발견 시 fail

---

## 11. 접근성 (WCAG 2.1 AA)

### 11.1 명도 대비 기준

| 항목 | 기준 |
|---|---|
| 본문 텍스트 | 4.5:1 |
| 대형 텍스트 (18px+ 또는 14px+ bold) | 3:1 |
| UI 구성 요소 (버튼·테두리·포커스 링) | 3:1 |
| 비활성 텍스트 | 권장 (기준 없음) |

### 11.2 자동 검증 색상 쌍 카탈로그

빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.

| 쌍 | 전경 / 배경 | 기준 |
|---|---|---|
| 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
| 본문 텍스트 — elevated | `color.text.primary` / `color.surface.elevated` | 4.5:1 |
| 본문 텍스트 — subtle | `color.text.primary` / `color.surface.subtle` | 4.5:1 |
| 보조 텍스트 | `color.text.secondary` / `color.surface.background` | 4.5:1 |
| 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
| 버튼 primary 텍스트 | `button.primary.text` / `button.primary.background` | 4.5:1 |
| 버튼 secondary 텍스트 | `button.secondary.text` / `button.secondary.background` | 4.5:1 |
| 링크 | `link.text` / `color.surface.background` | 4.5:1 |
| 링크 hover | `link.text.hover` / `color.surface.background` | 4.5:1 |
| 포커스 링 | `color.focus.ring` / `color.surface.background` | 3:1 |
| 콜아웃 info 텍스트 | `color.text.primary` / `callout.info.background` | 4.5:1 |
| 콜아웃 warning 텍스트 | `color.text.primary` / `callout.warning.background` | 4.5:1 |
| 콜아웃 disclaimer 텍스트 | `color.text.secondary` / `callout.disclaimer.background` | 4.5:1 |
| 입력 placeholder | `input.placeholder` / `input.background` | 3:1 (UI 구성 요소 기준) |
| 입력 focus 테두리 | `input.border.focus` / `color.surface.background` | 3:1 |

위 15개 쌍 × 2테마 = **30개 검증** 각 빌드 자동. 1개라도 미충족 시 fail.

> ⚠️ `color.border.default`처럼 시각 분리 목적의 일반 border는 WCAG 2.1 의 1.4.11(Non-text Contrast) 비대상 — 검증 카탈로그에서 제외. focus ring·input.border.focus 등 의미 boundary만 검증.

### 11.3 포커스 표시

- 모든 인터랙티브 요소는 `:focus-visible` 시 `color.focus.ring` 표시
- outline 또는 box-shadow 사용 (outline-offset 권장)
- 포커스 표시 제거 금지 (`outline: none` 단독 사용 금지)

### 11.4 reduced-motion

§ 7.3 적용 — 사용자 prefers-reduced-motion 존중

---

## 12. 빌드 검증 — 룰 레벨

| 레벨 | 본 문서 영역 |
|---|---|
| **fail** | 토큰 미정의(체인 단절), 순환 참조, **색상·shadow component에서 primitive 직접 참조** (§ 2.4 — typography·spacing·radius·motion은 허용), **`color.overlay.*` 외 semantic 색상이 raw hex·rgb·hsl 값을 보유** (semantic 색상은 primitive alias 의무, overlay 그룹만 예외 — § 3.2), 접근성 명도 대비 위반(본문 4.5:1·UI 3:1), 출력 파일 생성 실패 |
| **warning** | semantic 미사용(고아 토큰), Preset/Instance override가 Core에 없는 토큰 신설(MAJOR 의도일 수 있음 — 경고만), reduced-motion 미구현 |
| **content-gate** | (본 문서 영역 직접 적용 없음 — 시각 검수는 별도 디자인 리뷰) |

---

## 13. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| DT-01 | Style Dictionary vs 자체 빌드 도구 선택 | UI 구현 진입 시 — § 9.2 표준 포맷 Style Dictionary v3+ 채택 권장 |
| DT-03 | 컴포넌트별 size 변형(sm/md/lg) 토큰 — button 외 input·card 등에도 일관 적용 | input·card는 § 8에 단일 size만 정의. M2+ 다중 size 도입 시 |
| DT-05 | preset/instance tokens.json의 schema 검증 — JSON Schema 정의 | 자체 빌드 도구 구현 시 |
| DT-06 | Pretendard 한국어 글리프 subset 전략 — 전체 가중치 단일 파일 vs 분할 | 폰트 빌드 도구 결정 |

### 13.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~DT-02~~ | primitive 색상 hex 값 카탈로그 | v0.2 — § 3.4 표 (gray·blue·green·amber·red 5 hue × 10 단계 + white·black 절대값) |
| ~~DT-04~~ | 다크모드 그림자 opacity 값 | v0.2 — § 6.2 shadow를 semantic theme-aware로 이동, light·dark 두 값 명시 |
| ~~DT-07~~ | private 네임스페이스 컨벤션 | v0.3 — `private.*` dot 형식 확정. semantic·component 양쪽 layer 허용. CSS 변수명 `--private-*`, tokens.json 객체 키 `private` 하위. slug 형식은 kebab-case (정규식 `^[a-z][a-z0-9-]*[a-z0-9]$`, `CONTENT_STANDARDS.md § 7.1.1` 동일 규약 적용) |

---

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 3-tier 토큰 구조(primitive·semantic·component), 3-레이어 override(Core·Preset·Instance), 색상 팔레트 + 다크모드 분기, 타이포(Pretendard 기반)·간격·라운드·그림자·모션, 컴포넌트 토큰 6종(button·card·input·callout·badge·link), 출력 형식 2종(CSS·JSON), 접근성 WCAG AA, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |
