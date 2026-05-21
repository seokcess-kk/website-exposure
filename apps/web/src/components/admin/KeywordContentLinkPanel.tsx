// @glitzy/web/components/admin/KeywordContentLinkPanel — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 4
//
// keyword ↔ 콘텐츠 다대다 매핑 + primary marker. 5 entity_type group.
// FormData 직렬화 (cycle 1 #7):
//   - keywordLinks_<EntityType>: 선택된 모든 link 토큰 (다중 hidden input)
//   - primaryKeywordLinks: primary marker 가 켜진 link 토큰 (다중 hidden input)
//
// EvidenceLinkPanel 와 다르게 primary toggle 이 필요해 별도 client component.

"use client";

import { useState } from "react";

import type { EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import type { SeoKeywordEntityType } from "@glitzy/core-content";

type LinkToken = { entityType: SeoKeywordEntityType; entityId: string };

export type KeywordContentLinkPanelProps = {
  options: EvidenceLinkOptions;
  initialLinks?: ReadonlyArray<{ entityType: SeoKeywordEntityType; entityId: string; isPrimary: boolean }>;
};

const ENTITY_GROUPS: ReadonlyArray<{
  entityType: SeoKeywordEntityType;
  title: string;
  description: string;
  optionsKey: keyof EvidenceLinkOptions;
}> = [
  { entityType: "Article", title: "아티클", description: "이 키워드를 노리는 글", optionsKey: "articles" },
  { entityType: "TreatmentPage", title: "시술·진료", description: "이 키워드와 연관된 시술 페이지", optionsKey: "treatmentPages" },
  { entityType: "FAQ", title: "FAQ", description: "이 키워드 의도와 매칭되는 FAQ", optionsKey: "faqs" },
  { entityType: "Publication", title: "논문", description: "이 키워드 영역의 학술 근거", optionsKey: "publications" },
  { entityType: "MediaAppearance", title: "미디어 출연", description: "이 키워드 관련 방송/유튜브", optionsKey: "mediaAppearances" },
];

function tokenOf(t: LinkToken): string {
  return `${t.entityType}:${t.entityId}`;
}

export function KeywordContentLinkPanel({ options, initialLinks = [] }: KeywordContentLinkPanelProps) {
  // 초기 state — entityType 별 Set + primary Set
  const [selected, setSelected] = useState<Map<SeoKeywordEntityType, Set<string>>>(() => {
    const m = new Map<SeoKeywordEntityType, Set<string>>();
    for (const g of ENTITY_GROUPS) m.set(g.entityType, new Set());
    for (const l of initialLinks) m.get(l.entityType)?.add(l.entityId);
    return m;
  });
  const [primary, setPrimary] = useState<Set<string>>(() => {
    const s = new Set<string>();
    for (const l of initialLinks) if (l.isPrimary) s.add(tokenOf(l));
    return s;
  });

  const toggleSelected = (entityType: SeoKeywordEntityType, entityId: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const setForType = new Set(next.get(entityType) ?? []);
      if (checked) setForType.add(entityId);
      else setForType.delete(entityId);
      next.set(entityType, setForType);
      return next;
    });
    if (!checked) {
      // 해제 시 primary 도 자동 해제
      const tok = tokenOf({ entityType, entityId });
      setPrimary((prev) => {
        if (!prev.has(tok)) return prev;
        const next = new Set(prev);
        next.delete(tok);
        return next;
      });
    }
  };

  const togglePrimary = (entityType: SeoKeywordEntityType, entityId: string) => {
    const tok = tokenOf({ entityType, entityId });
    // 선택되지 않은 항목은 primary 마커 불가 — 자동 선택
    const setForType = selected.get(entityType) ?? new Set();
    if (!setForType.has(entityId)) {
      toggleSelected(entityType, entityId, true);
    }
    setPrimary((prev) => {
      const next = new Set(prev);
      if (next.has(tok)) next.delete(tok);
      else next.add(tok);
      return next;
    });
  };

  // FormData hidden input 직렬화 — keywordLinks_<type> + primaryKeywordLinks
  const allSelectedTokens: LinkToken[] = [];
  for (const g of ENTITY_GROUPS) {
    const setForType = selected.get(g.entityType) ?? new Set();
    for (const id of setForType) allSelectedTokens.push({ entityType: g.entityType, entityId: id });
  }
  const primaryTokens = allSelectedTokens.filter((t) => primary.has(tokenOf(t)));

  return (
    <section className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50/30 p-4">
      <header>
        <h3 className="text-sm font-semibold text-slate-800">이 키워드와 연결된 콘텐츠</h3>
        <p className="text-xs text-slate-500">
          ★ primary 토글 = 이 콘텐츠가 이 키워드의 1차 타깃 (readiness 의 title-has-target-keyword check 평가 대상).
        </p>
      </header>

      {/* hidden inputs — formData.getAll() 패턴 */}
      {ENTITY_GROUPS.map((g) =>
        Array.from(selected.get(g.entityType) ?? []).map((id) => (
          <input
            key={`hidden-${g.entityType}-${id}`}
            type="hidden"
            name={`keywordLinks_${g.entityType}`}
            value={`${g.entityType}:${id}`}
          />
        )),
      )}
      {primaryTokens.map((t) => (
        <input
          key={`primary-${tokenOf(t)}`}
          type="hidden"
          name="primaryKeywordLinks"
          value={tokenOf(t)}
        />
      ))}

      <div className="flex flex-col gap-3">
        {ENTITY_GROUPS.map((g) => {
          const opts = options[g.optionsKey];
          const setForType = selected.get(g.entityType) ?? new Set();
          const selectedCount = setForType.size;
          const primaryCount = primaryTokens.filter((t) => t.entityType === g.entityType).length;
          return (
            <fieldset key={g.entityType} className="rounded-md border border-slate-200 bg-white px-3 py-3">
              <legend className="px-1 text-sm font-semibold text-slate-800">
                {g.title}
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {selectedCount} 연결 · {primaryCount} primary
                </span>
              </legend>
              <p className="mb-2 text-xs text-slate-500">{g.description}</p>

              {opts.length === 0 ? (
                <p className="rounded bg-slate-50 px-3 py-3 text-center text-xs text-slate-400">
                  등록된 {g.title} 가 없습니다.
                </p>
              ) : (
                <ul className="flex max-h-48 flex-col gap-0.5 overflow-y-auto rounded border border-slate-100 bg-slate-50/40 px-2 py-1.5">
                  {opts.map((o) => {
                    const id = o.value.split(":", 2)[1] ?? "";
                    const isChecked = setForType.has(id);
                    const isPrimary = primary.has(`${g.entityType}:${id}`);
                    return (
                      <li key={o.value} className="flex items-center gap-2 px-1.5 py-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleSelected(g.entityType, id, e.target.checked)}
                          className="h-3.5 w-3.5"
                        />
                        <span className="min-w-0 flex-1 truncate text-xs text-slate-800" title={o.label}>
                          {o.label}
                          {o.sublabel && <span className="ml-1 text-[10px] text-slate-500">· {o.sublabel}</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePrimary(g.entityType, id)}
                          aria-pressed={isPrimary}
                          title={isPrimary ? "primary 해제" : "primary 로 지정"}
                          className={`shrink-0 rounded px-1.5 py-0.5 text-xs ${
                            isPrimary
                              ? "bg-amber-100 text-amber-700"
                              : "text-slate-400 hover:bg-slate-100 hover:text-amber-700"
                          }`}
                        >
                          ★
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </fieldset>
          );
        })}
      </div>
    </section>
  );
}
