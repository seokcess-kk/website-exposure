// @glitzy/web/components/forms/ClinicMetadataEditor — Phase 4 C 하이브리드 정교화
// metadata JSON 5 섹션을 row 별 add/remove + field 편집 UI 로 관리.
// onChange 안 항상 JSON.stringify 결과 반환 → ClinicProfileForm 의 metadataJson string state 와 호환.

"use client";

import { useEffect, useMemo, useState } from "react";

type Pillar = { slug: string; icon: string; title: string; subtitle: string };
type Principle = { n: string; icon: string; title: string; desc: string };
type KeyStat = { value: string; suffix: string; label: string; source: string };
type SystemStrength = { icon: string; title: string; description: string };
type SectionCopy = {
  communityTitle: string;
  communityDescription: string;
  reservationHeadline: string;
  reservationDescription: string;
};
type ClinicMetadataState = {
  treatmentPillars: Pillar[];
  standardPrinciples: Principle[];
  keyStats: KeyStat[];
  systemStrengths: SystemStrength[];
  sectionCopy: SectionCopy;
};

const EMPTY_STATE: ClinicMetadataState = {
  treatmentPillars: [],
  standardPrinciples: [],
  keyStats: [],
  systemStrengths: [],
  sectionCopy: { communityTitle: "", communityDescription: "", reservationHeadline: "", reservationDescription: "" },
};

function s(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseInitial(raw: string): ClinicMetadataState {
  if (raw.trim() === "") return EMPTY_STATE;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_STATE;
    const o = parsed as Record<string, unknown>;
    const tp = Array.isArray(o.treatmentPillars) ? o.treatmentPillars : [];
    const sp = Array.isArray(o.standardPrinciples) ? o.standardPrinciples : [];
    const ks = Array.isArray(o.keyStats) ? o.keyStats : [];
    const ss = Array.isArray(o.systemStrengths) ? o.systemStrengths : [];
    const sc = (typeof o.sectionCopy === "object" && o.sectionCopy !== null ? o.sectionCopy : {}) as Record<string, unknown>;
    return {
      treatmentPillars: tp.map((x) => {
        const obj = (typeof x === "object" && x !== null ? x : {}) as Record<string, unknown>;
        return { slug: s(obj.slug), icon: s(obj.icon), title: s(obj.title), subtitle: s(obj.subtitle) };
      }),
      standardPrinciples: sp.map((x) => {
        const obj = (typeof x === "object" && x !== null ? x : {}) as Record<string, unknown>;
        return { n: s(obj.n), icon: s(obj.icon), title: s(obj.title), desc: s(obj.desc) };
      }),
      keyStats: ks.map((x) => {
        const obj = (typeof x === "object" && x !== null ? x : {}) as Record<string, unknown>;
        return { value: s(obj.value), suffix: s(obj.suffix), label: s(obj.label), source: s(obj.source) };
      }),
      systemStrengths: ss.map((x) => {
        const obj = (typeof x === "object" && x !== null ? x : {}) as Record<string, unknown>;
        return { icon: s(obj.icon), title: s(obj.title), description: s(obj.description) };
      }),
      sectionCopy: {
        communityTitle: s(sc.communityTitle),
        communityDescription: s(sc.communityDescription),
        reservationHeadline: s(sc.reservationHeadline),
        reservationDescription: s(sc.reservationDescription),
      },
    };
  } catch {
    return EMPTY_STATE;
  }
}

/** state → JSON. 빈 row/string 은 제거하여 깔끔한 출력 */
function serialize(state: ClinicMetadataState): string {
  const clean = {
    treatmentPillars: state.treatmentPillars.filter((p) => p.slug || p.icon || p.title || p.subtitle),
    standardPrinciples: state.standardPrinciples.filter((p) => p.n || p.icon || p.title || p.desc),
    keyStats: state.keyStats.filter((k) => k.value || k.label).map((k) => {
      const out: Record<string, string> = { value: k.value, label: k.label };
      if (k.suffix) out.suffix = k.suffix;
      if (k.source) out.source = k.source;
      return out;
    }),
    systemStrengths: state.systemStrengths.filter((s) => s.icon || s.title || s.description),
    sectionCopy: Object.fromEntries(
      Object.entries(state.sectionCopy).filter(([, v]) => v.trim().length > 0),
    ),
  };
  // 모든 섹션 비어 있으면 빈 string 반환 (server action 안 fallback 사용)
  const allEmpty =
    clean.treatmentPillars.length === 0 &&
    clean.standardPrinciples.length === 0 &&
    clean.keyStats.length === 0 &&
    clean.systemStrengths.length === 0 &&
    Object.keys(clean.sectionCopy).length === 0;
  if (allEmpty) return "";
  return JSON.stringify(clean, null, 2);
}

export function ClinicMetadataEditor({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: (json: string) => void;
  errors?: string[];
}) {
  // initialize state from incoming JSON string (only on mount — controlled by external value re-parse)
  const initialState = useMemo(() => parseInitial(value), [value]);
  const [state, setState] = useState<ClinicMetadataState>(initialState);

  // serialize on every state change → parent state
  useEffect(() => {
    onChange(serialize(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const updatePillar = (i: number, key: keyof Pillar, v: string) =>
    setState((s) => ({ ...s, treatmentPillars: s.treatmentPillars.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)) }));
  const addPillar = () =>
    setState((s) => ({ ...s, treatmentPillars: [...s.treatmentPillars, { slug: "", icon: "", title: "", subtitle: "" }] }));
  const removePillar = (i: number) =>
    setState((s) => ({ ...s, treatmentPillars: s.treatmentPillars.filter((_, idx) => idx !== i) }));

  const updatePrinciple = (i: number, key: keyof Principle, v: string) =>
    setState((s) => ({ ...s, standardPrinciples: s.standardPrinciples.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)) }));
  const addPrinciple = () =>
    setState((s) => ({ ...s, standardPrinciples: [...s.standardPrinciples, { n: "", icon: "", title: "", desc: "" }] }));
  const removePrinciple = (i: number) =>
    setState((s) => ({ ...s, standardPrinciples: s.standardPrinciples.filter((_, idx) => idx !== i) }));

  const updateStat = (i: number, key: keyof KeyStat, v: string) =>
    setState((s) => ({ ...s, keyStats: s.keyStats.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)) }));
  const addStat = () =>
    setState((s) => ({ ...s, keyStats: [...s.keyStats, { value: "", suffix: "", label: "", source: "" }] }));
  const removeStat = (i: number) =>
    setState((s) => ({ ...s, keyStats: s.keyStats.filter((_, idx) => idx !== i) }));

  const updateStrength = (i: number, key: keyof SystemStrength, v: string) =>
    setState((s) => ({ ...s, systemStrengths: s.systemStrengths.map((p, idx) => (idx === i ? { ...p, [key]: v } : p)) }));
  const addStrength = () =>
    setState((s) => ({ ...s, systemStrengths: [...s.systemStrengths, { icon: "", title: "", description: "" }] }));
  const removeStrength = (i: number) =>
    setState((s) => ({ ...s, systemStrengths: s.systemStrengths.filter((_, idx) => idx !== i) }));

  const updateCopy = (key: keyof SectionCopy, v: string) =>
    setState((s) => ({ ...s, sectionCopy: { ...s.sectionCopy, [key]: v } }));

  return (
    <div className="flex flex-col gap-6">
      {errors && errors.length > 0 ? (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          {errors.join(" · ")}
        </div>
      ) : null}

      {/* 1. treatmentPillars */}
      <Section
        title="진료 영역 (treatmentPillars)"
        hint="홈 § 5 + about 페이지의 4 카드. 빈 경우 page.tsx 의 fallback 사용."
        onAdd={addPillar}
        empty={state.treatmentPillars.length === 0}
      >
        {state.treatmentPillars.map((p, i) => (
          <Row key={`pillar-${i}`} onRemove={() => removePillar(i)}>
            <Mini label="slug" value={p.slug} onChange={(v) => updatePillar(i, "slug", v)} placeholder="diet-treatment" />
            <Mini label="icon" value={p.icon} onChange={(v) => updatePillar(i, "icon", v)} placeholder="mdi:scale-bathroom" />
            <Mini label="title" value={p.title} onChange={(v) => updatePillar(i, "title", v)} placeholder="다이어트 치료" />
            <Mini label="subtitle" value={p.subtitle} onChange={(v) => updatePillar(i, "subtitle", v)} placeholder="굿바이 다이어트 · 당질조절" wide />
          </Row>
        ))}
      </Section>

      {/* 2. standardPrinciples */}
      <Section
        title="3원칙 (standardPrinciples)"
        hint="홈 § 3 굿바이 다이어트 카드 + treatments detail key effects. 시술별 override 는 TreatmentPage 폼에서 가능."
        onAdd={addPrinciple}
        empty={state.standardPrinciples.length === 0}
      >
        {state.standardPrinciples.map((p, i) => (
          <Row key={`principle-${i}`} onRemove={() => removePrinciple(i)}>
            <Mini label="n" value={p.n} onChange={(v) => updatePrinciple(i, "n", v)} placeholder="01" />
            <Mini label="icon" value={p.icon} onChange={(v) => updatePrinciple(i, "icon", v)} placeholder="mdi:account-search" />
            <Mini label="title" value={p.title} onChange={(v) => updatePrinciple(i, "title", v)} placeholder="체질 진단" />
            <Mini label="desc" value={p.desc} onChange={(v) => updatePrinciple(i, "desc", v)} placeholder="사상체질 진단·신진대사 평가" wide />
          </Row>
        ))}
      </Section>

      {/* 3. keyStats */}
      <Section
        title="검증된 통계 (keyStats)"
        hint="about § BY THE NUMBERS. value 안 __publications_count__ sentinel → publications 자동 카운트로 치환."
        onAdd={addStat}
        empty={state.keyStats.length === 0}
      >
        {state.keyStats.map((k, i) => (
          <Row key={`stat-${i}`} onRemove={() => removeStat(i)}>
            <Mini label="value" value={k.value} onChange={(v) => updateStat(i, "value", v)} placeholder="9 또는 __publications_count__" />
            <Mini label="suffix" value={k.suffix} onChange={(v) => updateStat(i, "suffix", v)} placeholder="개" />
            <Mini label="label" value={k.label} onChange={(v) => updateStat(i, "label", v)} placeholder="전국 직영 지점" />
            <Mini label="source (선택)" value={k.source} onChange={(v) => updateStat(i, "source", v)} placeholder="검증 출처 명시" wide />
          </Row>
        ))}
      </Section>

      {/* 4. systemStrengths */}
      <Section
        title="시스템 강점 (systemStrengths)"
        hint="about § WHAT MAKES US DIFFERENT 4 카드."
        onAdd={addStrength}
        empty={state.systemStrengths.length === 0}
      >
        {state.systemStrengths.map((p, i) => (
          <Row key={`strength-${i}`} onRemove={() => removeStrength(i)}>
            <Mini label="icon" value={p.icon} onChange={(v) => updateStrength(i, "icon", v)} placeholder="mdi:test-tube" />
            <Mini label="title" value={p.title} onChange={(v) => updateStrength(i, "title", v)} placeholder="의학적 다이어트 시스템" />
            <Mini label="description" value={p.description} onChange={(v) => updateStrength(i, "description", v)} placeholder="학술 근거 기반 진료 프로토콜로..." wide />
          </Row>
        ))}
      </Section>

      {/* 5. sectionCopy */}
      <fieldset className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-xs font-medium text-slate-700">섹션 카피 (sectionCopy)</legend>
        <p className="text-[11px] text-slate-500">홈 § 8 1:1 비밀 상담소 + § 9 예약 CTA copy. 빈 경우 page.tsx fallback 사용.</p>
        <Mini label="communityTitle" value={state.sectionCopy.communityTitle} onChange={(v) => updateCopy("communityTitle", v)} placeholder="1:1 비밀 상담소" wide />
        <Mini label="communityDescription" value={state.sectionCopy.communityDescription} onChange={(v) => updateCopy("communityDescription", v)} placeholder="민감한 증상이나 진료 가능 여부..." wide multiline />
        <Mini label="reservationHeadline" value={state.sectionCopy.reservationHeadline} onChange={(v) => updateCopy("reservationHeadline", v)} placeholder="진료 상담 예약" wide />
        <Mini label="reservationDescription" value={state.sectionCopy.reservationDescription} onChange={(v) => updateCopy("reservationDescription", v)} placeholder="본인의 체질·목표에 맞춘 맞춤 상담..." wide multiline />
      </fieldset>
    </div>
  );
}

// === sub-components ===

function Section({
  title, hint, onAdd, empty, children,
}: {
  title: string; hint: string; onAdd: () => void; empty: boolean; children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
      <div className="flex items-baseline justify-between gap-3">
        <legend className="px-1 text-xs font-medium text-slate-700">{title}</legend>
        <button type="button" onClick={onAdd} className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">
          + 추가
        </button>
      </div>
      <p className="text-[11px] text-slate-500">{hint}</p>
      {empty ? <p className="text-[11px] italic text-slate-400">(비어 있음 — fallback hardcode 사용)</p> : children}
    </fieldset>
  );
}

function Row({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded border border-slate-100 bg-slate-50/40 p-2 md:flex-row md:flex-wrap md:items-start">
      <div className="flex flex-1 flex-wrap gap-2">{children}</div>
      <button type="button" onClick={onRemove} className="self-end rounded border border-rose-200 bg-white px-2 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50">
        삭제
      </button>
    </div>
  );
}

function Mini({
  label, value, onChange, placeholder, wide, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; wide?: boolean; multiline?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-0.5 text-[11px] text-slate-600 ${wide ? "w-full" : "w-44"}`}>
      <span className="font-mono">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="rounded border border-slate-300 px-2 py-1 text-xs"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="rounded border border-slate-300 px-2 py-1 text-xs"
        />
      )}
    </label>
  );
}
