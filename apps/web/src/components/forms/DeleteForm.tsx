// @glitzy/web/components/forms/DeleteForm — form action 기반 delete (redirect/notFound throw 자연 전파)
// cycle4-3entity WEB-45: useTransition catch 가 NEXT_REDIRECT 를 일반 error 로 swallow → form action 사용
"use client";

import { useFormState, useFormStatus } from "react-dom";

type DeleteResult = { ok: true } | { ok: false; formError: string };

export function DeleteForm({
  action,
  confirmMessage,
  label,
}: {
  action: () => Promise<DeleteResult>;
  confirmMessage: string;
  label?: string;
}) {
  // FormData payload 무시 · 결과만 inline 에러 표시
  const wrapped = async (_prev: DeleteResult | null, _form: FormData): Promise<DeleteResult> => action();
  const [state, formAction] = useFormState<DeleteResult | null, FormData>(wrapped, null);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-2"
    >
      {state && state.ok === false && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          {state.formError}
        </div>
      )}
      <SubmitButton label={label ?? "삭제"} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md border border-rose-300 bg-rose-50 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100 disabled:opacity-60"
    >
      {pending ? "삭제 중…" : label}
    </button>
  );
}
