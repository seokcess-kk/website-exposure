# M0 vertical slice schema v0.3 — codex 자동 비평 cycle 3 (acceptance scope)

동일 reviewer. cycle 2 (closed: 9·deferred: 11·신규 minor: 2) 에 대한 v0.3 micro patch.

## cycle 2 결과

closed (9): M0-01·02·03·05·06 partial·15·16·17·18.
remaining (11·모두 deferred·v0.3+ Phase 0 Week 4 진입 시점): M0-04 clinic-location FK·M0-07 manifest·M0-08~14 typed field detail·M0-19 trigger·M0-20 empirical apply.
new minor (2): M0-21·M0-22.

## v0.3 patch (micro)

### M0-21: Article summary 80~200 (DATA_MODEL C-04 정합)
SQL + Drizzle 양쪽: `BETWEEN 50 AND 200` → `BETWEEN 80 AND 200`

### M0-22: INFRA stale prose 정정
`docs/decisions/INFRA_DECISIONS_DRAFT.md` L333:
- before: `NotificationEvent·NotificationLog`
- after: `NotificationEventReceipt·NotificationLog 등 — NotificationEvent는 notify() 입력 envelope·DB table 아님·§ 4.4 참조`

## M0 v0.x acceptance scope (narrow·SoT cascade)

본 M0 schema v0.3은 6 tables minimum + content_publication_status·risk_level enum + Spike A 패턴 RLS·composite FK·CHECK constraints까지 acceptance.

**deferred 11항 (cycle 2 remaining)**:
- M0-04 clinic-location FK·m:n: **architecture decision required** (m:n vs location.clinic_id) — Phase 0 Week 4 본 구현 시점 결정
- M0-07 migrations-runner manifest·depends_on: **packages/migrations-runner v0.3 separate scope** — 본 M0와 독립
- M0-08·09·10·11·12 typed field detail: **M0 v1.0 Phase 0 Week 4 schema migration green** — 각 entity의 typed sub-table (DoctorEducation·DoctorExperience·Awards·businessHours 등) 별도 cycle
- M0-13 instance vs InstanceManifest 경계: **C-08 InstanceManifest 별도 entity·M0 v0.x+ deferred** — instance 본 table은 minimal projection 명시
- M0-14 audit_log M0 extension: **packages/db v0.2 separate scope** — REVIEW_WORKFLOW transition 시점 audit content_ref·action cascade 시점
- M0-19 updated_at trigger: **post-hardening** — DEFAULT now() + application layer touch·또는 trigger 별도
- M0-20 SQL apply·RLS·drizzle-kit diff empirical gate: **Phase 0 Week 4 LOCAL_PASS 실측 시점** — 본 v0.x는 static typecheck PASS만

이 11항은 v0.3 acceptance scope **외**·`docs/decisions/M0_SCHEMA_PLAN.md`에 명시 마커.

## cycle 3 검토

cycle 1·2 누적 22개 결함 중:
- close (11): M0-01·02·03·05·06·15·16·17·18·21·22
- deferred (11): M0-04·07·08·09·10·11·12·13·14·19·20

deferred 11항을 SoT cascade·scope narrow로 acceptable인가? 신규 결함 0이면 closeable.

acceptance_after_patch = true, ready_for_acceptance = true·deferred 명시 SoT cascade OK 시 진행.

## 평가 형식

```json
{
  "cycle": 3,
  "closeable_after_patch": true | false,
  "scope_narrow_acceptable": true | false,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [...],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "ready_for_acceptance": true | false
}
```
