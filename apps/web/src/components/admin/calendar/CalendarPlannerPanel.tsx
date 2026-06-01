// @glitzy/web/components/admin/calendar/CalendarPlannerPanel — CONTENT_CALENDAR_PLAN v1.1 § 12 (CCAL-DEFER-02)
// 운영자 추가 "계획 일정" 관리 panel — 추가 폼 + 목록 (done 토글 · 수정 · 삭제).
// published 파생 event 와 별 source — grid 에는 📌 dot, 관리는 본 panel.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PlannedCalendarEvent } from "@/lib/admin/calendar-planned-events";
import type { CalendarEntityType } from "@/lib/admin/calendar-events";
import { entityIcon, entityLabel } from "./EntityIcon";
import {
  createPlannedEventAction,
  updatePlannedEventAction,
  deletePlannedEventAction,
  togglePlannedEventDoneAction,
  type PlannedEventInput,
} from "@/app/(admin)/admin/[instanceSlug]/calendar/actions";

const ENTITY_OPTIONS: CalendarEntityType[] = [
  "Article", "TreatmentPage", "MedicalConditionPage", "FAQ",
  "Publication", "MediaAppearance", "LegalDocument",
];

type FormState = {
  title: string;
  plannedDate: string;
  entityType: string;
  note: string;
};

const EMPTY_FORM: FormState = { title: "", plannedDate: "", entityType: "", note: "" };

export function CalendarPlannerPanel({
  instanceSlug,
  plannedEvents,
}: {
  instanceSlug: string;
  plannedEvents: PlannedCalendarEvent[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const reset = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
  };

  const canSubmit = form.title.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(form.plannedDate);

  const submit = () => {
    if (!canSubmit) return;
    setError(null);
    const input: PlannedEventInput = {
      title: form.title.trim(),
      plannedDate: form.plannedDate,
      entityType: form.entityType || null,
      note: form.note.trim() || null,
    };
    startTransition(async () => {
      const result = editingId
        ? await updatePlannedEventAction(instanceSlug, editingId, input)
        : await createPlannedEventAction(instanceSlug, input);
      if (result.ok) {
        reset();
        router.refresh();
      } else {
        setError(result.formError ?? Object.values(result.fieldErrors).flat()[0] ?? "저장 실패");
      }
    });
  };

  const startEdit = (ev: PlannedCalendarEvent) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      plannedDate: ev.plannedDate,
      entityType: ev.entityType ?? "",
      note: ev.note ?? "",
    });
    setError(null);
  };

  const toggleDone = (ev: PlannedCalendarEvent) => {
    startTransition(async () => {
      const result = await togglePlannedEventDoneAction(instanceSlug, ev.id, !ev.done);
      if (result.ok) router.refresh();
      else setError(result.formError ?? "상태 변경 실패");
    });
  };

  const remove = (ev: PlannedCalendarEvent) => {
    if (!window.confirm(`"${ev.title}" 계획 일정을 삭제하시겠습니까?`)) return;
    startTransition(async () => {
      const result = await deletePlannedEventAction(instanceSlug, ev.id);
      if (result.ok) {
        if (editingId === ev.id) reset();
        router.refresh();
      } else {
        setError(result.formError ?? "삭제 실패");
      }
    });
  };

  const sorted = [...plannedEvents].sort((a, b) => a.plannedDate.localeCompare(b.plannedDate));

  return (
    <section className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
      <h3 className="text-sm font-semibold text-fg-default">📌 계획 일정</h3>

      <div className="flex flex-col gap-2 rounded-md border border-border/60 bg-bg-default/30 p-3">
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="계획 제목 (예: 다이어트 한약 칼럼 작성)"
          maxLength={200}
          disabled={pending}
          className="rounded border border-border bg-canvas px-2 py-1 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={form.plannedDate}
            onChange={(e) => set("plannedDate", e.target.value)}
            disabled={pending}
            className="flex-1 rounded border border-border bg-canvas px-2 py-1 text-sm"
          />
          <select
            value={form.entityType}
            onChange={(e) => set("entityType", e.target.value)}
            disabled={pending}
            className="flex-1 rounded border border-border bg-canvas px-2 py-1 text-sm"
          >
            <option value="">(콘텐츠 유형 선택 안 함)</option>
            {ENTITY_OPTIONS.map((et) => (
              <option key={et} value={et}>
                {entityIcon(et)} {entityLabel(et)}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="메모 (선택 · 최대 500자)"
          rows={2}
          maxLength={500}
          disabled={pending}
          className="rounded border border-border bg-canvas px-2 py-1 text-sm"
        />
        {error && <p className="text-xs text-rose-700">⚠ {error}</p>}
        <div className="flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="rounded border border-border px-3 py-1 text-xs text-fg-muted hover:bg-bg-hover disabled:opacity-50"
            >
              취소
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit || pending}
            className="rounded bg-brand-primary px-3 py-1 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {pending ? "처리 중…" : editingId ? "수정 저장" : "계획 추가"}
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-fg-muted">아직 계획 일정이 없습니다 · 위에서 추가하세요.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {sorted.map((ev) => (
            <li key={ev.id} className="flex items-start gap-2 rounded border border-border/50 bg-canvas px-2 py-1.5 text-sm">
              <input
                type="checkbox"
                checked={ev.done}
                onChange={() => toggleDone(ev)}
                disabled={pending}
                title={ev.done ? "완료 해제" : "완료로 표시"}
                className="mt-1"
              />
              <div className="flex-1">
                <div className={ev.done ? "text-fg-muted line-through" : "text-fg-default"}>
                  {ev.entityType ? `${entityIcon(ev.entityType)} ` : ""}{ev.title}
                </div>
                <div className="text-xs text-fg-muted">
                  {ev.plannedDate}
                  {ev.entityType ? ` · ${entityLabel(ev.entityType)}` : ""}
                </div>
                {ev.note && <div className="text-xs text-fg-muted">{ev.note}</div>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(ev)}
                  disabled={pending}
                  className="rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-muted hover:bg-bg-hover disabled:opacity-50"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => remove(ev)}
                  disabled={pending}
                  className="rounded border border-rose-300 px-1.5 py-0.5 text-[11px] text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
