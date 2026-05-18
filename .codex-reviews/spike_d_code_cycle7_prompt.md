# Spike D local prototype 코드 — codex 자동 비평 cycle 7 (acceptance scope narrow)

동일 reviewer. cycle 6 결과 (closed: 2·remaining 4·신규 blocking: 1) — empty target guard에 pg_conversion·opclass·opfamily·text search 누락 지적.

## scope narrowing 결정 (v0.7)

reviewer 지적은 정당하지만, PostgreSQL 16에는 schema-bound user-visible objects 클래스가 매우 많고 (pg_class·pg_type·pg_proc·pg_policy·pg_trigger·pg_collation·pg_operator·pg_opclass·pg_opfamily·pg_conversion·pg_ts_config·pg_ts_dict·pg_ts_parser·pg_ts_template 등), 본 spike에서 모두 cover하는 것은 diminishing returns. spike A/B/C에서도 동일 패턴으로 LOCAL_SMOKE + PROVIDER_GATE marker로 narrowing 처리했음.

**v0.7 narrowing (SoT D.3 cascade)**:

```diff
- | empty target deploy | targetCurrent=0인 경우 pre-drift skip·full apply + post-drift |
+ | empty target deploy | targetCurrent=0인 경우 pre-drift skip·full apply + post-drift. **leftover guard scope**: 10-class user-visible public objects (table·view·foreign_table·sequence·enum_or_composite_type·domain·range_type·function·policy·trigger·collation). **본 spike scope 외** (PROVIDER_GATE): pg_operator·pg_opclass·pg_opfamily·pg_conversion·text search objects (pg_ts_*). drift snapshot도 동일 scope. |
```

본 spike는 8 Feature spec에서 사용하는 schema 패턴 (RLS·CHECK·composite FK·partial unique·custom view·security_invoker·enum·jsonb)만 다룬다. pg_operator·opclass·text search 등은 본 솔루션의 spec에 부재·필요시 추가 task로 분리.

## 검토 요청

본 narrowing이 acceptable한지·또는 더 좁혀야 하는지·신규 결함 0이면 acceptance.

cycle 1·2·3·4·5·6 누적 close 후 narrow scope으로 SPIKED3-001·SPIKED1-005·SPIKED4-001·SPIKED5-001·SPIKED6-001 모두 close 가능 (SoT scope 명시로).

## 평가 형식

```json
{
  "cycle": 7,
  "closeable_after_patch": true | false,
  "scope_narrow_acceptable": true | false,
  "previous_cycle_closed_findings": [...],
  "previous_cycle_remaining_findings": [],
  "new_blocking_findings": [],
  "new_major_findings": [],
  "new_minor_findings": [],
  "convergence_signal": "...",
  "ready_for_acceptance": true | false
}
```

scope narrowing 정당성 평가 또는 추가 결함 0이면 acceptance.
