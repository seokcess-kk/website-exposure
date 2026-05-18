// @glitzy/web/components/dev/MockMailbox — server-side 3중 가드 (Plan § 7 ADMIN-UI-19)
// cycle1-code WEB-16: sign-in/page.tsx 의 inline 블록을 별도 dev component 로 분리 (Plan tree 정합)
// NODE_ENV !== 'production' && RESEND_MODE === 'mock' && DEV_MOCK_MAILBOX_VIEW === 'true' 모두 통과 시에만 렌더

import { getMockMailbox } from "@glitzy/auth";
import { isMockMailboxVisible } from "@/lib/env";

export function MockMailbox() {
  if (!isMockMailboxVisible()) return null;
  const mailbox = getMockMailbox();
  if (mailbox.length === 0) {
    return (
      <details className="rounded-md border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500">
        <summary>dev mock mailbox (비어있음)</summary>
      </details>
    );
  }
  // 최신 항목 먼저 (max 20)
  const recent = [...mailbox].reverse().slice(0, 20);
  return (
    <details className="rounded-md border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-700">
      <summary>dev mock mailbox (최신 {recent.length}건)</summary>
      <ul className="mt-2 flex flex-col gap-2">
        {recent.map((entry, i) => (
          <li key={`${entry.to}-${entry.at}-${i}`}>
            <div className="font-medium">{entry.to}</div>
            <a
              className="break-all text-blue-700 underline"
              href={`/sign-in/consume?identifier=${encodeURIComponent(entry.to)}&token=${encodeURIComponent(entry.tokenPlain)}`}
            >
              /sign-in/consume?identifier=…&token={entry.tokenPlain.slice(0, 12)}…
            </a>
            <div className="text-slate-500">@ {new Date(entry.at).toISOString()}</div>
          </li>
        ))}
      </ul>
    </details>
  );
}
