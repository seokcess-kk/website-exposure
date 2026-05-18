# 레퍼런스 심층 분석 — 의료기관 웹사이트 설계 반영

> **상태**: Draft v0.1
> **작성일**: 2026-05-13
> **소유자**: Glitzy
> **목적**: 실제 한의원·한방병원 웹사이트의 IA, 전환 흐름, 신뢰도 신호, 의료광고 리스크, 데이터 구조를 분석하여 `PAGE_TYPES.md`와 `DATA_MODEL.md` 개정 방향을 도출한다.
> **관계 문서**: `docs/research/REFERENCE_ANALYSIS_2026-05.md`의 1차 경쟁 분석을 보강하는 심층 설계 분석.

---

## 1. 분석 대상

| ID | 사이트 | URL | 역할 |
|---|---|---|---|
| R-01 | 다이트한의원 | https://daeatdiet.com/ | 다이어트 한의원 직접 경쟁군. 후기·이벤트·유명인·다지점·CTA 강함 |
| R-02 | 누베베한의원 | https://nubebe.com/ | 임상 데이터·논문·특허·숫자 신뢰도 포지셔닝 |
| R-03 | 규림한의원 | https://www.kyurim.com/ | 다지점 네트워크·비용문의·카카오 상담 중심 |
| R-04 | 자생한방병원 | https://www.jaseng.co.kr/ | 대형 한방병원. 진료시간·접수시간·자가테스트·다국어·공식성 기준점 |
| R-05 | 365매일한방병원 | https://gj.365maeil.com/ | 지점형 한방병원. 실적 수치·한양방 협진·네이버예약/톡톡 |
| R-06 | 허브한의원 | https://ahclinic.co.kr/ | 소규모 전문 한의원. 의료진 권위·치료후기·공지·외부 상담 CTA |
| R-07 | 허브한의원 다이어트 | https://ahclinic.co.kr/orientdiet | Treatment Detail 단순형. 한약·지방분해침·고주파 구성 |
| R-08 | 자생 자가테스트 | https://www.jaseng.co.kr/selfTest/waistList.asp?p=m | Self-test/Quiz 타입 근거 |

---

## 2. 관찰 요약

### 2.1 실제 병원 사이트는 `Contact`가 아니라 `Conversion Hub`를 운영한다

대부분의 사이트에서 방문 안내는 단순 주소 페이지가 아니다. 전화, 네이버예약, 네이버톡톡, 카카오톡, 온라인상담, 빠른상담, 오시는 길, 진료시간이 반복 노출된다.

| 관찰 | 사례 | 설계 반영 |
|---|---|---|
| 하단 고정 CTA | 허브한의원: 전화·카카오톡·네이버예약·네이버톡톡·비대면진료 | `CTAConfig`를 공통 타입으로 승격 |
| 예약 전용 페이지 | 365매일한방병원: 네이버예약 페이지 | `ReservationPage`는 선택 타입 유지, 단 `Contact`의 기본 슬롯으로 예약 채널 포함 |
| 빠른 예약/상담 | 다이트한의원: 전화문의·카톡문의·온라인상담·바로예약 | `reservationChannels[]`, `consultationChannels[]` 필요 |
| 지점별 예약 | 365매일한방병원: 지점별 홈페이지·예약하기·전화연결 | `LocationProfile`과 채널 연결 필요 |

**결론**: `P-012 Contact / Visit`는 위치 페이지가 아니라 **전환 허브**다. M0에 포함한 결정은 맞고, 데이터 모델을 강화해야 한다.

---

### 2.2 진료시간은 `openingHours`만으로 부족하다

자생한방병원은 진료시간과 접수시간을 분리한다. 강남 기준 월~목은 09:00~20:00, 금~일/공휴일은 09:00~18:00이며, 초진/재진의 오전·오후 접수 마감이 다르다. 설·추석 휴진, 점심시간, 일요일 진료 지점도 따로 안내한다.

| 필요한 데이터 | 이유 |
|---|---|
| `openingHours[]` | 실제 진료 가능 시간 |
| `receptionHours[]` | 초진/재진 접수 마감 차이 |
| `lunchBreaks[]` | 점심시간 |
| `holidayPolicy` | 설·추석·공휴일 운영 |
| `specialClosures[]` | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | 야간·응급·콜센터 안내 |

**결론**: `ClinicProfile.openingHours`를 단순 배열로 두면 대형병원·다지점·일요일 진료 케이스를 감당하기 어렵다. `BusinessHours` 계열 하위 타입을 분리해야 한다.

---

### 2.3 다이어트 한의원 Treatment는 정보형보다 패키지·구성형이다

실제 다이어트 페이지는 “정의·원리”보다 “무엇을 받는가”와 “누구에게 맞는가”가 강하다.

| 사이트 | 구성 |
|---|---|
| 다이트한의원 | 다이어트 치료, 다이어트 한약, 개인맞춤 다이어트, 체형관리, 약침, 앱/코칭 |
| 허브한의원 | 다이어트한약, 지방분해침, 고주파 |
| 365매일한방병원 | 다이어트 클리닉, 매일유지캡, 추천 대상 |
| 누베베한의원 | 1개월·3개월 프로그램, 처방·논문·통계 중심 |

**DATA_MODEL 반영**:

```txt
TreatmentPage
- treatmentComponents[]      # 한약, 약침, 고주파, 체성분검사, 식단관리 등
- programVariants[]          # 1개월, 3개월, 유지관리 등
- recommendedFor[]           # 추천 대상
- visitFlow[]                # 검사 → 상담 → 처방 → 관리
- remoteCareAvailable        # 비대면/배송 가능 여부
- maintenancePlan            # 요요방지/유지관리
- evidenceNotes[]            # 논문·통계·근거 링크
```

**결론**: 현재 `overview/mechanism/process/precautions`는 올바른 뼈대지만, 다이어트 한의원에는 `components`와 `programVariants`가 필수에 가깝다.

---

### 2.4 신뢰도 신호는 `TrustMetric`으로 구조화해야 한다

경쟁 사이트들은 수치와 권위를 강하게 노출한다.

| 신뢰도 신호 | 사례 | 리스크 |
|---|---|---|
| 누적 처방/환자 수 | 다이트: 처방자 수, 누베베: 처방 수 | 출처·기준일 없으면 신뢰도 하락 |
| 논문·특허 | 누베베: SCI·국내 논문·특허 | 사실 기반이면 유효, 과장 표현 주의 |
| 진료·입원·추나 건수 | 365매일한방병원 | 산정 기간·지점 범위 필요 |
| 공식 협력/학회 | 자생 | 검증 URL 필요 |
| 대표 스토리 | 다이트: 원장 개인 감량 스토리 | 의료광고상 결과 암시 위험 |
| 후기·전후사진 | 다수 사이트 | High 위험도 |

**DATA_MODEL 반영**:

```txt
TrustMetric
- label
- value
- unit?
- measuredFrom?
- measuredTo?
- scope: clinic | branch | network | doctor
- evidenceUrl?
- evidenceNote?
- displayRiskLevel
```

**결론**: `ClinicProfile`에 `trustMetrics[]`를 추가하되, `value`만 두면 안 된다. 기준 기간·범위·증빙 필드가 필수다.

---

### 2.5 다지점 구조는 예외가 아니라 흔한 패턴이다

분석 대상 중 상당수가 다지점이다. 다이트는 지점별 서브도메인, 규림은 지점 안내 URL, 자생과 365매일은 지점별 진료시간·주소·전화·예약 구조를 가진다.

**PAGE_TYPES 반영**:

```txt
P-014 Location / Branch Detail
URL: /locations/{slug}
Risk: Low, 단 지점별 이벤트·후기 노출 시 High 격상
```

**DATA_MODEL 반영**:

```txt
LocationProfile
- name
- branchCode?
- address
- geo
- telephone
- openingHours
- receptionHours
- reservationChannels[]
- representativeDoctors[]
- availableTreatments[]
- parkingInfo
- transitInfo
- images[]
```

**결론**: 1호가 단일 지점이어도 `LocationProfile`은 지금 넣는 것이 낫다. 단일 병원은 `locations: [main]`으로 처리하면 된다.

---

### 2.6 Self-test는 단순 콘텐츠가 아니라 리드 생성 도구다

자생의 허리디스크 자가테스트는 문항 선택, 성별/연령대 입력, 결과 안내, 상담 전환으로 구성된다. “전문의가 설계”했다는 권위 문구와 “결과가 진단을 대신하지 않는다”는 고지도 함께 둔다.

**PAGE_TYPES 반영**:

```txt
P-106 Self-test / Quiz
Risk: Medium 기본, 결과에서 진단·치료 단정 시 High
Schema: 일반 WebPage + FAQPage 일부. MedicalWebPage 검토 가능
```

**DATA_MODEL 후보**:

```txt
SelfTest
- title
- description
- designedByDoctor?
- disclaimer
- questions[]
- scoringRules
- resultBands[]
- cta
```

**결론**: M0에는 넣지 말고, 다이어트 한의원 Preset 또는 Feature Module 후보로 둔다. 다이어트용으로는 “다이어트 유형 체크”, “요요 위험도 체크”, “체질 기반 상담 전 사전문진”이 가능하다.

---

### 2.7 후기·가격·이벤트는 제품 차등과 컴플라이언스의 핵심

경쟁군은 후기, 전후사진, 감량 수치, 가격, 이벤트를 적극적으로 쓴다. 이 영역은 전환에는 강하지만 의료광고 리스크가 가장 크다.

**설계 원칙**:

| 영역 | 페이지 타입 | 기본 위험도 | 상품화 |
|---|---|---:|---|
| 후기 | P-101 Reviews | High | Add-on + 법무/심의 체크 |
| 가격 | P-102 Pricing | High | Add-on + 사전심의 판단 |
| 이벤트 | P-104 News/Event | High | Add-on + 기간/노출 자동 만료 |
| 전후사진 | Reviews 또는 Case | High | 별도 `BeforeAfterPolicy` 필요 |

**결론**: 이 영역은 Core에서 표준만 제공하고, 실제 활성화는 `FeatureModuleConfig` 또는 `ReviewPolicy`로 제어해야 한다.

---

## 3. 현재 문서별 변경 제안

### 3.1 `PAGE_TYPES.md`

| 변경 | 우선순위 | 이유 |
|---|---:|---|
| `P-014 Location / Branch Detail` 신설 | 높음 | 다지점이 보편적이고 단일 지점도 main location으로 모델링 가능 |
| `P-106 Self-test / Quiz` 선택 타입 신설 | 중간 | 자생 사례처럼 리드 생성과 콘텐츠 차별화에 강함 |
| `P-012 Contact / Visit`를 Conversion Hub로 명시 | 높음 | 예약·상담·지도·진료시간·주차·외부 채널의 중심 |
| `P-006 Treatment Detail`에 `Program/Package` 변형 추가 | 높음 | 다이어트 한의원은 1개월/3개월/유지관리 등 패키지 구조가 흔함 |
| `P-101 Reviews`, `P-102 Pricing`, `P-104 News/Event`를 High-risk commercial pages로 묶기 | 중간 | 영업·컴플라이언스·가격 차등 구조와 연결 |

### 3.2 `DATA_MODEL.md`

| 계약 | 변경 |
|---|---|
| `ClinicProfile` | `locations[]`, `trustMetrics[]`, `externalChannels[]`, `primaryCta[]` 추가 |
| `LocationProfile` | C-21 신설. 주소·전화·진료시간·접수시간·예약채널·주차·교통 |
| `TreatmentPage` | `treatmentComponents[]`, `programVariants[]`, `recommendedFor[]`, `visitFlow[]`, `remoteCareAvailable`, `maintenancePlan` 추가 |
| `Article` | `contentSource`, `externalUrl`, `embeddedMedia[]`, `reviewedBy`, `authorType` 추가 |
| `CTAConfig` | 전역 공통 타입으로 승격. `phone/naver-reservation/naver-talk/kakao/form/map/external` 지원 |
| `TrustMetric` | 기준 기간·범위·증빙 URL 포함한 공통 타입 신설 |
| `BusinessHours` | `openingHours`, `receptionHours`, `lunchBreaks`, `holidayPolicy`, `specialClosures`로 확장 |
| `ReviewPolicy` | `beforeAfterPhotoAllowed`만으로 부족. `BeforeAfterPolicy`, `testimonialPolicy`, `celebrityMentionPolicy` 분리 검토 |

### 3.3 `ARCHITECTURE.md`

| 변경 | 이유 |
|---|---|
| Feature Module에 `competitive-audit` 검토 | 경쟁 사이트 분석 자체가 영업/운영 상품이 될 수 있음 |
| `search-visibility`와 `competitive-audit` 경계 명시 | 전자는 자사 사이트 가시성, 후자는 경쟁사/시장 관찰 |
| `asset-ingestion` guardrail 강화 | 기존 사이트·SNS·후기·이미지 수집 시 저작권/초상권/동의 필요 |

---

## 4. 1호 다이어트 한의원 기준 권장 IA

### M0 유지

M0는 현재처럼 7종 + Article 1샘플을 유지한다.

1. Home
2. About
3. Doctors List
4. Doctor Profile
5. Treatments List
6. Treatment Detail
7. Contact / Visit
8. Article Detail 1개 샘플

### M1 빠른 합류 권장

1. Articles List
2. FAQ
3. Location / Branch Detail
4. Legal / Policy

### M2 이후 선택

1. Reviews
2. Pricing
3. News/Event
4. Self-test / Quiz
5. Facilities / Equipment

---

## 5. 1호 클라이언트 인터뷰 체크리스트

실제 설계 확정을 위해 다음 질문을 클라이언트에게 받아야 한다.

| 영역 | 질문 |
|---|---|
| 예약/상담 | 전화, 네이버예약, 네이버톡톡, 카카오, 폼 중 어떤 채널을 운영하는가 |
| 진료시간 | 진료시간과 접수 마감이 다른가. 점심시간·공휴일·야간진료가 있는가 |
| 다이어트 구성 | 한약, 환, 약침, 고주파, 체성분검사, 식단관리, 비대면 배송 중 무엇을 제공하는가 |
| 프로그램 | 1개월/3개월/유지관리/요요방지 같은 패키지가 있는가 |
| 증빙 | 논문, 수상, 인증, 누적 처방, 환자 수 등 공개 가능한 신뢰 지표가 있는가 |
| 후기 | 후기·전후사진·감량 수치 노출을 원하는가. 어느 수준까지 감수할 것인가 |
| 가격/이벤트 | 가격 또는 이벤트를 사이트에 공개할 것인가 |
| 외부 채널 | 네이버 플레이스, 블로그, 인스타그램, 유튜브, 카카오채널 URL은 무엇인가 |
| 지점 | 현재 단일 지점인지, 향후 지점 확장 가능성이 있는가 |

---

## 6. 설계 결론

현재 Core 설계는 방향이 맞다. 그러나 실제 병원 사이트 기준으로는 다음 5가지를 반영해야 구현 후 재작업을 줄일 수 있다.

1. `Contact / Visit`를 전환 허브로 격상한다.
2. `LocationProfile`을 지금 추가한다. 단일 지점도 location으로 모델링한다.
3. `TreatmentPage`는 정보형 구조에 `programVariants`와 `treatmentComponents`를 추가한다.
4. `TrustMetric`을 공통 타입으로 만들고, 모든 수치 주장에 기준 기간·범위·증빙을 요구한다.
5. 후기·가격·이벤트·전후사진은 High-risk commercial pages로 묶고 Add-on/정책 기반으로 활성화한다.

---

## 7. 출처 메모

- 다이트한의원: https://daeatdiet.com/
- 다이트한의원 소개 페이지 예시: https://incheon.daeatdiet.com/bbs/content.php?co_id=05_01&me_code=50
- 규림한의원: https://www.kyurim.com/
- 자생한방병원 진료시간: https://gangnam.jaseng.co.kr/reservation/treatmentInfo/info.asp
- 자생한방병원 자가테스트: https://www.jaseng.co.kr/selfTest/waistList.asp?p=m
- 365매일한방병원 경기광주점: https://gj.365maeil.com/
- 365매일한방병원 다이어트: https://gj.365maeil.com/clinicInfo365maeil/care/diet.php
- 365매일한방병원 네이버예약 예시: https://ddm.365maeil.com/clinicInfo365maeil/naverReserve.php
- 허브한의원: https://ahclinic.co.kr/
- 허브한의원 한방 다이어트: https://ahclinic.co.kr/orientdiet

---

## 8. 변경 이력

| 일자 | 버전 | 변경 | 작성자 |
|---|---|---|---|
| 2026-05-13 | v0.1 | 최초 작성 — 1차 레퍼런스 분석을 설계 반영 관점으로 심층 보강 | Glitzy (Codex) |
