# 자동 비평 의뢰 — `docs/features/notifications.md` v0.1

## 컨텍스트

본 프로젝트는 의료기관 웹사이트 솔루션이며, `docs/features/compliance-assistant.md`가 첫 Feature Module 명세로 v1.0 안정판을 달성했다. 이제 두 번째 Feature Module인 `notifications`의 v0.1 초안을 작성했다.

본 명세는 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module이다.

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\notifications.md`를 다음 관점에서 엄정하게 비평해라:

1. **SoT 정합** — 다음 상위 문서와의 일관성:
   - `docs/admin/REVIEW_WORKFLOW.md` § 9 (NotificationPayload 인터페이스 SoT)
   - `docs/admin/REVIEW_WORKFLOW.md` § 10 (audit log)
   - `docs/core/DATA_MODEL.md` C-08 (`notificationChannels` 필드, `features[]` 등록)
   - `docs/ARCHITECTURE.md` § 11 (Feature Modules 책임 정의)
   - 같은 패턴의 SoT·cascade 처리 모범 사례: `docs/features/compliance-assistant.md` v1.0

2. **구현 안정성·운영 빈틈** — 단독 구현이 가능한지:
   - 단일 엔트리포인트 `notify()`의 입력 보강·실패 처리·idempotency
   - dedupe·재시도·DLQ 알고리즘의 정확성
   - digest 모드(일일·주간 요약) 구체성
   - circular dependency 회피 (알림 실패의 self-notification 차단)
   - quiet hours·critical 이벤트 분기
   - 인스턴스별 timezone·발송 시각 보장

3. **cascade 영향** — 본 명세가 요구하는 상위 문서 변경:
   - DATA_MODEL에 AdminUser·notificationPreferences·NotificationInbox·NotificationLog 등 신설 필요 여부
   - REVIEW_WORKFLOW § 9의 NotificationPayload와 본 문서 NotificationEvent의 관계 (필드 매핑·정합)
   - 인스턴스 어드민 base URL을 어디서 가져오는지 (DATA_MODEL C-08 cascade?)

4. **의료 도메인 적합성**:
   - 의료광고법 관련 critical 이벤트(예: 사전심의 결과)의 옵트아웃 정책
   - 의료기관 운영시간 외 알림 정책
   - 검수자 권한 5종(super-admin·operator·physician-reviewer·legal-reviewer·client-approver)별 알림 필요성

5. **명세 자체의 정합성** — 문서 내 모순·표현 불일치:
   - § 0 한 페이지 요약 ↔ § 3 입력·출력 ↔ § 4 실행 순서 일관성
   - § 1 변경 정책 ↔ 다른 절의 실제 변경 영향 정합성
   - eventType enum이 REVIEW_WORKFLOW § 9.1 표와 일대일 매핑되는지

## 출력 형식

다음 JSON 스키마를 따른다:

```json
{
  "summary": "전체 평가 한 문단",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail | major | minor",
      "section": "§ 번호 또는 절 제목",
      "location_quote": "지적 대상 원문 1~2줄 인용",
      "issue": "무엇이 문제인가",
      "rationale": "왜 문제인가 (SoT 정합·운영 빈틈 등)",
      "suggested_fix": "구체적 정정 방향 (필요 시 cascade 동반 변경 명시)"
    }
  ]
}
```

`severity`:
- **fail** — 구현 불가·논리 모순·SoT 직접 충돌
- **major** — 운영 시 실제 문제 발생 가능·cascade 누락
- **minor** — 명세 표현 정밀화·일관성 개선

지적 항목 수에 제한 없음. 타당한 지적은 모두 제기하라.

## 참고할 SoT 문서 경로 (절대 경로)

- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md` (모범 사례)
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\RISK_LEVELS.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
- `C:\Users\assag\solution\website-exposure\docs\core\CONTENT_STANDARDS.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DESIGN_TOKENS.md`
