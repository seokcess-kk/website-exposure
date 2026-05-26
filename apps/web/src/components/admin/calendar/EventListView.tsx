// @glitzy/web/components/admin/calendar/EventListView — CONTENT_CALENDAR_PLAN v1.0 § 5.3
// 날짜 오름차순 그룹화 · entity icon + eventType dot + title + link · 7 entity filter chip (local state).

"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalendarEvent, CalendarEntityType } from "@/lib/admin/calendar-events";
import {
  entityIcon,
  entityLabel,
  entityEditLink,
  legalDocumentTypeLabel,
  EVENT_TYPE_EMOJI,
  EVENT_TYPE_LABEL,
} from "./EntityIcon";

const FILTER_CHIPS: CalendarEntityType[] = [
  "Article",
  "TreatmentPage",
  "MedicalConditionPage",
  "FAQ",
  "Publication",
  "MediaAppearance",
  "LegalDocument",
];

export function EventListView({
  events,
  instanceSlug,
}: {
  events: CalendarEvent[];
  instanceSlug: string;
}) {
  const [excluded, setExcluded] = useState<Set<CalendarEntityType>>(new Set());

  function toggle(type: CalendarEntityType) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  const filtered = events.filter((ev) => !excluded.has(ev.entityType));
  const groupedByDate = new Map<string, CalendarEvent[]>();
  for (const ev of filtered) {
    const arr = groupedByDate.get(ev.date) ?? [];
    arr.push(ev);
    groupedByDate.set(ev.date, arr);
  }
  const sortedDates = [...groupedByDate.keys()].sort();

  const allDeselected = excluded.size === FILTER_CHIPS.length;

  return (
    <div className="flex flex-col gap-3">
      <header>
        <h3 className="mb-2 text-sm font-semibold text-fg-default">이번 달 일정</h3>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_CHIPS.map((type) => {
            const selected = !excluded.has(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggle(type)}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
                  selected
                    ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                    : "border-border bg-bg-default/30 text-fg-muted opacity-50"
                }`}
              >
                <span>{entityIcon(type)}</span>
                <span>{entityLabel(type)}</span>
              </button>
            );
          })}
        </div>
      </header>

      {allDeselected ? (
        <p className="text-sm text-fg-muted">필터로 모든 entity 제외 — 표시 결과 없음</p>
      ) : sortedDates.length === 0 ? (
        <p className="text-sm text-fg-muted">이번 달 일정 없음 · 콘텐츠 발행 시 자동 표시됩니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sortedDates.map((date) => (
            <li key={date} id={`date-${date}`} className="flex flex-col gap-1">
              <div className="text-xs font-medium text-fg-muted">{formatDateLabel(date)}</div>
              <ul className="flex flex-col gap-1 pl-3">
                {groupedByDate.get(date)!.map((ev) => (
                  <li key={ev.id} className="flex items-center gap-2 text-sm">
                    <span>{entityIcon(ev.entityType)}</span>
                    <span title={EVENT_TYPE_LABEL[ev.eventType]}>
                      {EVENT_TYPE_EMOJI[ev.eventType]}
                    </span>
                    <Link
                      href={entityEditLink(instanceSlug, ev.entityType, ev.slug)}
                      className="truncate text-fg-default hover:text-brand-primary hover:underline"
                    >
                      {ev.entityType === "LegalDocument" ? legalDocumentTypeLabel(ev.slug) : ev.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDateLabel(date: string): string {
  // "2026-05-26" → "5/26 (화)"
  const [, m, d] = date.split("-");
  // UTC 자정 안 weekday 추출 — KST date 와 동일 일자
  const dateObj = new Date(`${date}T00:00:00Z`);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][dateObj.getUTCDay()];
  return `${Number(m)}/${Number(d)} (${weekday})`;
}
