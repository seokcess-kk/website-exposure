// @glitzy/web/hooks/useFormSuccessToast — form action 결과를 toast 로 alert (UX-P0 fix)
// 사용자 결정 2026-05-20: form 안 inline success banner 가 긴 form 안 화면 밖에서 가려져
// 안 보이는 issue 해결. 6 entity form 모두 동일 hook 한 줄로 적용.

"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import type { SaveResult } from "@/lib/save-result";

/**
 * form action 결과(`SaveResult`)를 ToastProvider 우하단 toast 로 자동 알림.
 *
 * @param state — useFormState 의 state 첫 인자
 * @param successMessage — 성공 시 토스트 메시지 (default "저장되었습니다.")
 * @param errorMessage — 실패 시 fallback 메시지 (state.formError 가 없을 때만 사용)
 */
export function useFormSuccessToast(
  state: SaveResult | null,
  successMessage = "저장되었습니다.",
  errorMessage = "저장에 실패했습니다.",
): void {
  const { show } = useToast();
  // 같은 state 객체가 reactivity 안 중복 trigger 안 되도록 ref 비교
  const lastShownRef = useRef<SaveResult | null>(null);

  useEffect(() => {
    if (!state) return;
    if (lastShownRef.current === state) return;
    lastShownRef.current = state;

    if (state.ok === true) {
      show({ kind: "success", message: successMessage });
    } else {
      // ok === false. fieldErrors 만 있을 때는 form 상단 inline 안 자동 표시 → toast 생략 가능.
      // formError 가 있는 경우만 (서버 측 일반 오류) toast 발생.
      if (state.formError) {
        show({ kind: "error", message: state.formError });
      } else if (Object.keys(state.fieldErrors ?? {}).length > 0) {
        show({ kind: "warning", message: "입력값을 확인해주세요." });
      } else {
        show({ kind: "error", message: errorMessage });
      }
    }
  }, [state, show, successMessage, errorMessage]);
}
