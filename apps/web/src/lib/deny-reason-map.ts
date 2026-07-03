// @glitzy/web/lib/deny-reason-map — AuthDenyReason 17종 + SignInReason exhaustive UI mapping
// Plan v1.0 § 5.4 (cycle3·5 정정 ADMIN-UI-34·55)
// build-time assertNever exhaustive enforce — union 확장 시 컴파일 fail

import type { AuthDenyReason } from "@glitzy/auth";

/** Plan § 5.4: sign-in page query reason union — AuthDenyReason 17 + 추가 reason */
// cycle4-code WEB-63: user-inactive 는 AuthDenyReason 에 이미 포함 — 중복 제거
export type SignInReason =
  | AuthDenyReason
  | "no-active-membership";

// cycle3-code WEB-38: 외부 query string narrow — assertNever 까지 임의 값 도달 차단
const SIGN_IN_REASON_VALUES: ReadonlySet<SignInReason> = new Set<SignInReason>([
  "session-not-found",
  "session-expired",
  "session-signature-invalid",
  "user-inactive",
  "membership-not-found",
  "membership-inactive",
  "instance-mismatch",
  "legal-reviewer-ineligible",
  "physician-reviewer-ineligible",
  "client-approver-ineligible",
  "operator-role-required",
  "super-admin-required",
  "invalid-instance-id",
  "invalid-credentials",
  "no-active-membership",
  // user-inactive 는 AuthDenyReason 에 이미 포함되어 위 enumeration 에서 처리됨
]);

export function isSignInReason(value: unknown): value is SignInReason {
  return typeof value === "string" && SIGN_IN_REASON_VALUES.has(value as SignInReason);
}

export type UiAction =
  | { kind: "redirect-sign-in"; reason: SignInReason }
  | { kind: "not-found" }
  | { kind: "forbidden"; message: string }
  | { kind: "info"; message: string };

function assertNever(x: never): never {
  throw new Error(`Unhandled AuthDenyReason: ${String(x)}`);
}

export function mapAuthDenyReasonToUi(reason: AuthDenyReason): UiAction {
  switch (reason) {
    case "session-not-found":
    case "session-expired":
    case "session-signature-invalid":
      return { kind: "redirect-sign-in", reason };
    case "user-inactive":
      return { kind: "redirect-sign-in", reason: "user-inactive" };
    case "invalid-instance-id":
      return { kind: "not-found" };
    case "membership-not-found":
      return { kind: "forbidden", message: "이 인스턴스에 접근 권한이 없습니다." };
    case "membership-inactive":
      // Plan § 5.4 ADMIN-UI-35: 현재 코드 경로에서 unreachable (resolveTenantContext 가 active=true 만 조회)
      // future-proof — packages/auth v0.3 cascade 시 분기 추가
      return { kind: "forbidden", message: "비활성 멤버십입니다." };
    case "instance-mismatch":
    case "super-admin-required":
      return { kind: "info", message: "super-admin 인스턴스 전환 필요 — 현재 skeleton 범위 외" };
    case "legal-reviewer-ineligible":
    case "physician-reviewer-ineligible":
    case "client-approver-ineligible":
      return { kind: "forbidden", message: "이 역할 자격이 없습니다." };
    case "operator-role-required":
      return { kind: "forbidden", message: "운영자 권한이 필요합니다." };
    case "invalid-credentials":
      return { kind: "redirect-sign-in", reason };
    default:
      return assertNever(reason);
  }
}

/** /sign-in 페이지에서 query `reason` 을 사용자 메시지로 변환 — cycle2-code WEB-31: assertNever exhaustive enforce */
export function signInReasonMessage(reason: SignInReason | null | undefined): string | null {
  if (!reason) return null;
  switch (reason) {
    case "session-not-found":
    case "session-expired":
    case "session-signature-invalid":
      return "세션이 만료되었습니다. 다시 로그인해주세요.";
    case "user-inactive":
      return "비활성 계정입니다. 관리자에게 문의해주세요.";
    case "no-active-membership":
      return "활성 운영자 멤버십이 없습니다. 관리자에게 문의해주세요.";
    case "invalid-credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "invalid-instance-id":
    case "membership-not-found":
    case "membership-inactive":
    case "instance-mismatch":
    case "super-admin-required":
    case "legal-reviewer-ineligible":
    case "physician-reviewer-ineligible":
    case "client-approver-ineligible":
    case "operator-role-required":
      return "접근 권한이 없습니다.";
    default:
      return assertNever(reason);
  }
}
