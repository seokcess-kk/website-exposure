# NOTIFICATIONS_M0_PLAN v0.5 — cycle 5 review (self-critique)

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=5 (총 5)
- closeableAfterPatch: **true** (blocking 0 · major 0 · minor 5 — 표현/정합 marker 만 잔존 · 본 plan 의 실 결정 영향 없음)
- 수렴 추세: cycle 1 = 16 → cycle 2 = 12 → cycle 3 = 11 → cycle 4 = 6 → cycle 5 = **5** (안정 수렴)

## cycle 4 patch 검증

| finding | patched § | 검증 |
|---|---|---|
| NFM4-01 (blocking) | § 7 시나리오 15 정정 | **PASS** — sentinel 키워드 제거 + 일반 user deactivated case |
| NFM4-02 (minor) | NF-DEFER-23 신설 (§ 1.3 + § 9.1.1) | **PASS** |
| NFM4-03 (minor) | § 5.1 setTimeout AbortSignal marker | **PASS** |
| NFM4-04 (minor) | § 5.1 tx.json() as any marker | **PASS** |
| NFM4-05 (minor) | NF-CASCADE-04 강화 | **PASS** |
| NFM4-06 (minor) | § 7 시나리오 11 fixture 정정 | **PASS** |

## minor (모두 표현/정합 patch · 본 plan 실 결정 영향 없음)

- **NFM5-01**: § 1.2 범위 표 안 "vitest scenarios **14건**" 표현 — cycle 3 NFM3-09 안 시나리오 15 신설로 15건 됨
  - 위치: plan § 1.2 (vitest scenarios 14건 행)
  - 권장 patch: "vitest scenarios **15건** (NF-TEST-01) | envelope shape (3 case) · idempotent insert (2 case) · recipients 산정 (4 case · sentinel/deactivated 분리) · 4 eventType emit 시점 (4 case) · emit 실패 fallback (2 case)" 표현 정정.

- **NFM5-02**: § 1.2 범위 표 안 "docs cascade ... NF-CASCADE-**01~06**" 표현 — cycle 1 NFM-16 안 NF-CASCADE-07 신설 patch 후 § 8 작업 11 만 정정 · § 1.2 patch 누락
  - 위치: plan § 1.2 (docs cascade 행)
  - 권장 patch: "docs cascade ... NF-CASCADE-**01~07**" 표현 정정.

- **NFM5-03**: § 1.3 비범위 표 안 NF-DEFER-19 row 가 NF-DEFER-23 다음에 위치 — 순서 정합 (19→23 vs 19→20→21→22→23 정렬)
  - 위치: plan § 1.3 비범위 표 마지막 2 row
  - 권장 patch: NF-DEFER-19 row 를 NF-DEFER-15 와 NF-DEFER-16 사이 (defer-to "NF-DEFER-01 동반" 그룹 안) 으로 이동. NF-DEFER-20~23 은 marker ID 순.

- **NFM5-04**: § 7 시나리오 1~4·6·7·9·10·15 fixture marker 안 "admin_user.active=true" 명시 부재 — instance_membership.active=true 만 명시. resolveRoleRecipients 안 JOIN `admin_user.active=true` 필터 정합 검증
  - 위치: plan § 7 시나리오 (각 fixture marker)
  - 권장 patch: 시나리오 fixture marker 안 "admin_user.active=true · instance_membership.active=true" 양쪽 명시.

- **NFM5-05**: § 6.4 NF-INTEGRATION-04 안 audit_event payload `recipientsCount` — recipients[] 다중 role 보유 user 시 user 수 vs row 수 모호
  - 위치: plan § 6.4 (audit_event emit payload)
  - 권장 patch: payload `recipientsCount` 명시 — "`recipients.length` (row 수 · 동일 user 가 다중 role 시 다중 count)" 정합 marker.

## acceptance precondition 점검

- NF-DEFER 매핑 완비성 (23종 + 41 NotificationEventType cascade 매핑): **PASS**
- envelope shape REVIEW_WORKFLOW § 9.2 SoT 정합: **PASS**
- sourceEventId 결정 함수 idempotency 계약 정합: **PASS**
- recipients 산정 (finalRoles + author) DATA_MODEL C-23 정합: **PASS**
- 4 server action emit 시점 (tx commit 후 base role) compliance-assistant M0 § 6.2 정합: **PASS**
- LL-DEFER-01 완전 해소 marker 정합: **PASS**
- CA-DEFER-14 부분 해소 marker (11 tables · channel · digest · suppression · DLQ · broadcast NF-DEFER-01 cascade) 정합: **PASS**
- plan 문서 구조 정합 (§ 번호 순서): **PASS**
- 시나리오 15건 정합: **PASS** (NFM5-01 표현 정정 후)

## acceptance 권장

**closeableAfterPatch=true** — 본 cycle 5 finding 모두 minor (표현/정합 marker) · 본 plan 의 실 결정 (DB schema · helper signature · 시나리오 의도) 영향 없음. cycle 5 patch 직후 v1.0 acceptance 후보. cycle 6 자체 cycle 검토 시 신규 blocking·major 발견 가능성 낮음 (수렴 안정).

cycle 5 patch 후 NOTIFICATIONS_M0_PLAN v1.0 (acceptance) 직접 진입 권장. 누계 5 cycle = 40 findings 전건 수용. NF-DEFER 23종 · NF-CASCADE 7종 안정판.

cascade docs patch (다른 SoT 문서 cascade — NF-CASCADE-01~07 실 doc patch) 는 acceptance commit 동시 포함 marker.
