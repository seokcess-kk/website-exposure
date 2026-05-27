// @glitzy/web/components/admin/QuickAddDoctorRow — ADMIN_UX_REDESIGN v1.0 § 7
// 의료진 list 안 inline quick-add. ADMIN_SIMPLIFY (S2) 안 slug/displayOrder column hide 정합 —
// 직함 column 안 inline 으로 slug input 묶음 (자동 생성 미구현 → 필수 입력 유지).

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDoctorProfile } from "@/app/(admin)/admin/[instanceSlug]/doctors/actions";

export function QuickAddDoctorRow({ instanceSlug }: { instanceSlug: string }) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdd = () => {
    setError(null);
    if (slug.trim() === "" || name.trim() === "") {
      setError("slug 와 이름은 필수입니다.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("slug", slug.trim());
      fd.set("name", name.trim());
      fd.set("displayOrder", "0");
      if (active) fd.set("active", "on");
      const result = await saveDoctorProfile(instanceSlug, null, null, fd);
      if (result.ok) {
        setSlug("");
        setName("");
        setActive(true);
        router.refresh();
      } else {
        const fieldKeys = Object.keys(result.fieldErrors ?? {});
        setError(
          result.formError ??
            (fieldKeys.length > 0
              ? `${fieldKeys[0]}: ${(result.fieldErrors as Record<string, string[]>)[fieldKeys[0]!]?.[0] ?? "검증 실패"}`
              : "저장 실패"),
        );
      }
    });
  };

  return (
    <tr className="border-t border-slate-200 bg-amber-50">
      <td className="px-3 py-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
          placeholder="홍길동"
          required
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded border border-slate-300 px-2 py-1 font-mono text-xs"
          placeholder="식별자 (예: dr-hong)"
          required
          pattern="^[a-z0-9][a-z0-9-]{2,63}$"
          aria-label="URL 식별자"
        />
      </td>
      <td className="px-3 py-2">
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          활성
        </label>
      </td>
      <td className="px-3 py-2 text-xs text-slate-500">신규</td>
      <td className="px-3 py-2 text-right">
        <button
          type="button"
          onClick={handleAdd}
          disabled={pending}
          className="rounded-md bg-brand-primary px-3 py-1 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
        >
          {pending ? "추가 중…" : "+ 추가"}
        </button>
        {error && <div className="mt-1 text-xs text-error">{error}</div>}
      </td>
    </tr>
  );
}
