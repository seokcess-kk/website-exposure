// @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
// 3 섹션 + 5 LegalDocument override 재구성.
//
// (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
// (b) 본원 위치·연락·시간 (신규 · LL-FORM-03·07·08·12)
// (c) 정책 변수 보조 (신규 · LL-FORM-04)
// (d) 5 LegalDocument override 보조 (신규 · LL-FORM-13)

"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useFormSuccessToast } from "@/hooks/useFormSuccessToast";
import { Field } from "@/components/forms/Field";
import { ClinicMetadataEditor } from "@/components/forms/ClinicMetadataEditor";
import { AddressSearchButton } from "@/components/admin/AddressSearchButton";
import { useFormDraft } from "@/components/admin/useFormDraft";
import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";
import type {
  BusinessHoursInput,
  PrimaryCtaInput,
} from "@/lib/clinic-profile-schema";

const CLOSED_DOC_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
type ClosedDocType = (typeof CLOSED_DOC_TYPES)[number];

const DOC_TYPE_LABEL: Record<ClosedDocType, string> = {
  privacy: "개인정보처리방침",
  terms: "이용약관",
  "non-covered": "비급여 진료비 안내",
  refund: "환불 규정",
  complaint: "민원 처리 안내",
};

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
type DayOfWeek = (typeof DAYS)[number];

const DAY_LABEL: Record<DayOfWeek, string> = {
  monday: "월요일",
  tuesday: "화요일",
  wednesday: "수요일",
  thursday: "목요일",
  friday: "금요일",
  saturday: "토요일",
  sunday: "일요일",
};

export type ClinicProfileInitial = {
  // (a) 기관 정체성
  name: string;
  description: string;
  logoUrl: string;
  ogImageUrl: string;
  businessRegistrationNumber: string;
  alternateName: string;
  legalEntityName: string;
  slogan: string;
  longDescription: string;
  foundingDate: string;
  founder: string;
  // (b) 본원 위치·연락·시간
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  locationTelephone: string;
  locationEmail: string;
  businessHours: BusinessHoursInput;
  primaryCtas: PrimaryCtaInput[];
  featuredChannelId: string;
  // (c) 정책 변수
  policyContactPerson: string;
  policyContactEmail: string;
  policyContactPhone: string;
  policyEffectiveDate: string;
  // (c-2) 운영 contact — ADMIN_BUSINESS_ENTITIES v1 § 3 (외부 비공개)
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  // (d) 5 LegalDocument effective date override
  legalDocEffectiveOverrides: Record<ClosedDocType, string>;
  // (e) Phase 3 C 하이브리드: page hardcode 이관용 metadata JSON
  // treatmentPillars · standardPrinciples · keyStats · systemStrengths · sectionCopy 5 키
  metadataJson: string;
};

const emptyDay = { closed: true as const, lunchEnabled: false as const };

const emptyBusinessHours: BusinessHoursInput = {
  monday: { ...emptyDay },
  tuesday: { ...emptyDay },
  wednesday: { ...emptyDay },
  thursday: { ...emptyDay },
  friday: { ...emptyDay },
  saturday: { ...emptyDay },
  sunday: { ...emptyDay },
};

export const emptyInitial: ClinicProfileInitial = {
  name: "",
  description: "",
  logoUrl: "",
  ogImageUrl: "",
  businessRegistrationNumber: "",
  alternateName: "",
  legalEntityName: "",
  slogan: "",
  longDescription: "",
  foundingDate: "",
  founder: "",
  streetAddress: "",
  addressLocality: "",
  addressRegion: "",
  postalCode: "",
  addressCountry: "KR",
  locationTelephone: "",
  locationEmail: "",
  businessHours: emptyBusinessHours,
  primaryCtas: [],
  featuredChannelId: "",
  policyContactPerson: "",
  policyContactEmail: "",
  policyContactPhone: "",
  policyEffectiveDate: "",
  primaryContactName: "",
  primaryContactPhone: "",
  primaryContactEmail: "",
  primaryContactRole: "",
  legalDocEffectiveOverrides: {
    privacy: "",
    terms: "",
    "non-covered": "",
    refund: "",
    complaint: "",
  },
  metadataJson: "",
};

type SiteMeta = {
  name: string | null;
  description: string | null;
  logoUrl: string | null;
  ogImageUrl: string | null;
  themeColor: string | null;
  resolvedUrl: string;
  // 확장 추출 (2026-05-19) — site-meta-fetch.ts SiteMeta 정합
  siteName: string | null;
  phone: string | null;
  email: string | null;
  addressLine: string | null;
  addressRegion: string | null;
  addressLocality: string | null;
  addressStreet: string | null;
  // L1 brand 자동 추출 (2026-05-19)
  brand: {
    primaryHex: string | null;
    accentHex: string | null;
    palette: string[];
    source: "logo" | "ogImage" | "themeColor" | "manual" | "none";
  };
};

type BrandTokensState = {
  primaryHex: string | null;
  accentHex: string | null;
  palette: string[];
  source: "logo" | "ogImage" | "themeColor" | "manual" | "none";
};

export function ClinicProfileForm({
  action,
  initial,
  instanceSlug,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: ClinicProfileInitial | null;
  instanceSlug: string;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  useFormSuccessToast(state);
  const [values, setValues] = useState<ClinicProfileInitial>(initial ?? emptyInitial);
  // ADMIN_UX_REDESIGN v1.0 § 6 — 5단계 wizard step (anchor scroll · fieldset 모두 visible · step click 안 자유 nav)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  useEffect(() => {
    const el = document.getElementById(`wizard-step-${wizardStep}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [wizardStep]);
  const [siteUrl, setSiteUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [appliedFields, setAppliedFields] = useState<string[]>([]);
  // UX 개선: 기존 값 덮어쓰기 옵션 (default: off — 빈 필드만 prefill 안전 패턴)
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  // 분석 완료 후 적용=0 인 경우 안내 (이미 모든 필드 채워짐) — undefined = 분석 전, "" = 적용=0 안내, "<msg>" = 일반
  const [analyzeInfo, setAnalyzeInfo] = useState<string | null>(null);
  // L1 brand 자동 추출 결과 — form 안 hidden input 안 JSON serialize 안 server action 전달
  const [brandTokens, setBrandTokens] = useState<BrandTokensState>({
    primaryHex: null, accentHex: null, palette: [], source: "none",
  });
  const [ctaPhoneEnabled, setCtaPhoneEnabled] = useState(values.primaryCtas.some((c) => c.type === "phone"));
  const [ctaKakaoEnabled, setCtaKakaoEnabled] = useState(values.primaryCtas.some((c) => c.type === "kakao-talk"));
  const [ctaNaverEnabled, setCtaNaverEnabled] = useState(values.primaryCtas.some((c) => c.type === "naver-reservation"));
  const [ctaPhoneLabel, setCtaPhoneLabel] = useState(values.primaryCtas.find((c) => c.type === "phone")?.label ?? "예약하기");
  const [ctaPhoneUrl, setCtaPhoneUrl] = useState(values.primaryCtas.find((c) => c.type === "phone")?.targetUrl ?? "");
  const [ctaKakaoLabel, setCtaKakaoLabel] = useState(values.primaryCtas.find((c) => c.type === "kakao-talk")?.label ?? "카카오톡 상담");
  const [ctaKakaoUrl, setCtaKakaoUrl] = useState(values.primaryCtas.find((c) => c.type === "kakao-talk")?.targetUrl ?? "");
  const [ctaNaverLabel, setCtaNaverLabel] = useState(values.primaryCtas.find((c) => c.type === "naver-reservation")?.label ?? "네이버 예약");
  const [ctaNaverUrl, setCtaNaverUrl] = useState(values.primaryCtas.find((c) => c.type === "naver-reservation")?.targetUrl ?? "");

  // 자동 저장 (localStorage debounce 1s) + 페이지 진입 시 복원 prompt + 저장 성공 시 clear
  const { lastSavedAt, draftAvailable, applyDraft, discardDraft, clearDraft } = useFormDraft({
    storageKey: `clinic-profile-${instanceSlug}`,
    values,
    initial: initial ?? emptyInitial,
  });
  // 저장 성공 시 draft clear
  useEffect(() => {
    if (state?.ok === true) clearDraft();
  }, [state, clearDraft]);

  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;

  // UX: 저장 시도 후 첫 에러 필드로 자동 scroll + focus (form 길이 큼 — 사용자 헷갈림 방지)
  useEffect(() => {
    if (!state || state.ok !== false) return;
    // 우선순위 — formError 표시 박스 (가장 위) · 또는 첫 fieldErrors 의 input
    const firstErrorField = Object.keys(fieldErrors)[0];
    if (firstErrorField) {
      const el = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // input/textarea 자동 focus
        if ("focus" in el && typeof (el as HTMLInputElement).focus === "function") {
          setTimeout(() => (el as HTMLInputElement).focus(), 300);
        }
        return;
      }
    }
    // fieldErrors 없으면 formError 표시 박스로 scroll
    const errBox = document.getElementById("clinic-form-status-banner");
    if (errBox) errBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state, fieldErrors]);

  // fieldErrors 개수 + 첫 필드 이름 summary
  const errorCount = Object.keys(fieldErrors).length;
  const firstErrorFieldName = Object.keys(fieldErrors)[0] ?? null;

  const setField = <K extends keyof ClinicProfileInitial>(key: K, v: ClinicProfileInitial[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const setDay = (day: DayOfWeek, patch: Partial<BusinessHoursInput[DayOfWeek]>) =>
    setValues((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [day]: { ...prev.businessHours[day], ...patch } },
    }));

  const setLegalDocOverride = (t: ClosedDocType, v: string) =>
    setValues((prev) => ({
      ...prev,
      legalDocEffectiveOverrides: { ...prev.legalDocEffectiveOverrides, [t]: v },
    }));

  async function handleAnalyze(): Promise<void> {
    setAnalyzeError(null);
    setAppliedFields([]);
    setAnalyzeInfo(null);
    if (siteUrl.trim() === "") {
      setAnalyzeError("URL 을 입력해주세요.");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await fetch("/api/site-meta-fetch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: siteUrl.trim(), instanceSlug }),
      });
      const body = (await res.json()) as { ok: boolean; meta?: SiteMeta; error?: string };
      if (!body.ok || !body.meta) {
        setAnalyzeError(body.error ?? "분석에 실패했습니다.");
        return;
      }
      const m = body.meta;
      const applied: string[] = [];
      // 분석으로 얻은 raw 값 (덮어쓰기 OFF + 기존 값 있어 skip 된 필드 카운트 — 안내용)
      const skippedExisting: string[] = [];
      const safeUrl = (v: string | null): string | null => {
        if (!v) return null;
        if (v.length > 2048) return null;
        try {
          const u = new URL(v);
          if (u.protocol !== "http:" && u.protocol !== "https:") return null;
        } catch {
          return null;
        }
        return v;
      };
      // UX: overwriteExisting=true 시 기존 값 무시 + 분석 결과로 덮어쓰기
      setValues((prev) => {
        const next = { ...prev };
        if (m.name) {
          if (next.name === "" || overwriteExisting) { next.name = m.name.slice(0, 100); applied.push("기관명"); }
          else { skippedExisting.push("기관명"); }
        }
        if (m.description) {
          if (next.description === "" || overwriteExisting) { next.description = m.description.slice(0, 300); applied.push("간략 소개"); }
          else { skippedExisting.push("간략 소개"); }
        }
        const safeLogo = safeUrl(m.logoUrl);
        if (safeLogo) {
          if (next.logoUrl === "" || overwriteExisting) { next.logoUrl = safeLogo; applied.push("로고 URL"); }
          else { skippedExisting.push("로고 URL"); }
        }
        const safeOg = safeUrl(m.ogImageUrl);
        if (safeOg) {
          if (next.ogImageUrl === "" || overwriteExisting) { next.ogImageUrl = safeOg; applied.push("OG 이미지 URL"); }
          else { skippedExisting.push("OG 이미지 URL"); }
        }
        // 확장 추출 (2026-05-19): 전화·이메일·주소 (한국어 regex)
        if (m.phone) {
          if (next.locationTelephone === "" || overwriteExisting) { next.locationTelephone = m.phone.slice(0, 50); applied.push("본원 전화"); }
          else { skippedExisting.push("본원 전화"); }
        }
        if (m.email) {
          if (next.locationEmail === "" || overwriteExisting) { next.locationEmail = m.email.slice(0, 200); applied.push("본원 이메일"); }
          else { skippedExisting.push("본원 이메일"); }
        }
        if (m.addressRegion) {
          if (next.addressRegion === "" || overwriteExisting) { next.addressRegion = m.addressRegion.slice(0, 100); applied.push("시·도"); }
          else { skippedExisting.push("시·도"); }
        }
        if (m.addressLocality) {
          if (next.addressLocality === "" || overwriteExisting) { next.addressLocality = m.addressLocality.slice(0, 100); applied.push("시·군·구"); }
          else { skippedExisting.push("시·군·구"); }
        }
        if (m.addressStreet) {
          if (next.streetAddress === "" || overwriteExisting) { next.streetAddress = m.addressStreet.slice(0, 200); applied.push("도로명 주소"); }
          else { skippedExisting.push("도로명 주소"); }
        }
        return next;
      });
      // L1 brand 자동 추출 — primary/accent 가 있으면 state 안 저장. 사용자가 "이 색상 적용" 클릭 후 form 안 submit 시 hidden input 으로 전달.
      if (m.brand && m.brand.primaryHex) {
        setBrandTokens({
          primaryHex: m.brand.primaryHex,
          accentHex: m.brand.accentHex,
          palette: m.brand.palette,
          source: m.brand.source,
        });
        applied.push(`Brand 색상 (${m.brand.source})`);
      }
      setAppliedFields(applied);
      // 안내 메시지 산정
      if (applied.length === 0) {
        if (skippedExisting.length > 0) {
          setAnalyzeInfo(
            `분석 결과 ${skippedExisting.length}개 필드 (${skippedExisting.join(", ")}) 가 발견되었지만 ` +
            `이미 입력된 값이 있어 보존되었습니다. 덮어쓰려면 "기존 값 덮어쓰기" 체크 후 다시 분석하세요.`,
          );
        } else {
          setAnalyzeInfo("분석 결과 추출할 수 있는 정보가 없습니다 (사이트 안 meta 태그 부재).");
        }
      }
    } catch (err) {
      console.error("[site-meta-fetch] client fetch error", err);
      setAnalyzeError("네트워크 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  }

  // featuredChannelId 의 가능한 option 리스트
  const ctaOptions: Array<{ value: string; label: string }> = [];
  if (ctaPhoneEnabled && ctaPhoneUrl.trim() !== "") ctaOptions.push({ value: "phone-1", label: `전화 (${ctaPhoneLabel})` });
  if (ctaKakaoEnabled && ctaKakaoUrl.trim() !== "") ctaOptions.push({ value: "kakao-talk-1", label: `카카오톡 (${ctaKakaoLabel})` });
  if (ctaNaverEnabled && ctaNaverUrl.trim() !== "") ctaOptions.push({ value: "naver-reservation-1", label: `네이버 예약 (${ctaNaverLabel})` });

  return (
    <div className="flex flex-col gap-5">
      {/* ADMIN_UX_REDESIGN v1.0 § 6 — 5단계 wizard stepper (sticky top) */}
      <WizardStepper currentStep={wizardStep} onStepClick={setWizardStep} />

      {/* 임시 저장 (localStorage) 복원 prompt — 페이지 진입 후 draft 가 있으면 표시 */}
      {draftAvailable && (
        <section className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm">
          <h2 className="mb-2 text-base font-medium text-amber-900">📝 임시 저장된 내용 발견</h2>
          <p className="mb-3 text-xs text-amber-900">
            마지막 입력 시간: {new Date(draftAvailable.savedAt).toLocaleString("ko-KR")} · 작성 중 페이지를 떠나셨던 내용입니다. 복원하시겠습니까?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyDraft((data) => setValues(data as ClinicProfileInitial))}
              className="rounded-md bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800"
            >
              ✓ 복원
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="rounded-md border border-amber-400 px-3 py-1.5 text-xs text-amber-900 hover:bg-amber-100"
            >
              ✕ 삭제
            </button>
          </div>
        </section>
      )}

      {/* 자동 저장 상태 표시 — 최근 저장 시간 (lastSavedAt) */}
      {lastSavedAt && !draftAvailable && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span aria-hidden>💾</span>
          <span>임시 저장됨: {new Date(lastSavedAt).toLocaleTimeString("ko-KR")} (이 브라우저에 자동 저장 · 발행 시 자동 삭제)</span>
        </div>
      )}

      <section className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
        <h2 className="mb-2 text-base font-medium text-blue-900">사이트 URL 자동 분석 (onboarding)</h2>
        <p className="mb-3 text-xs text-blue-800">
          기존 의료기관 웹사이트 URL 을 입력하면 og 이미지·favicon·메타 정보를 비어 있는 필드에 채워줍니다.
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://example-clinic.com"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {analyzing ? "분석 중…" : "분석"}
          </button>
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={overwriteExisting}
            onChange={(e) => setOverwriteExisting(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          기존 입력된 값도 분석 결과로 덮어쓰기 (default: 빈 필드만 채움)
        </label>
        {analyzeError && <div className="mt-2 text-xs text-rose-700">{analyzeError}</div>}
        {appliedFields.length > 0 && (
          <div className="mt-2 text-xs text-emerald-800">
            ✓ 적용된 필드: {appliedFields.join(", ")}{overwriteExisting ? " (덮어쓰기 모드)" : " (빈 필드만)"}
          </div>
        )}
        {analyzeInfo && (
          <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            ℹ {analyzeInfo}
          </div>
        )}
        {brandTokens.primaryHex && (
          <div className="mt-3 rounded-md border border-blue-200 bg-white p-3">
            <div className="mb-2 text-xs font-medium text-blue-900">
              🎨 추출된 Brand 색상 (source: {brandTokens.source}) — 저장 시 사이트 안 자동 적용
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {brandTokens.primaryHex && (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-8 w-8 rounded-md border border-slate-300"
                    style={{ backgroundColor: brandTokens.primaryHex }}
                    aria-label="primary"
                  />
                  <code className="text-xs text-slate-700">primary {brandTokens.primaryHex}</code>
                </div>
              )}
              {brandTokens.accentHex && (
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-8 w-8 rounded-md border border-slate-300"
                    style={{ backgroundColor: brandTokens.accentHex }}
                    aria-label="accent"
                  />
                  <code className="text-xs text-slate-700">accent {brandTokens.accentHex}</code>
                </div>
              )}
              {brandTokens.palette.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">palette:</span>
                  {brandTokens.palette.map((hex) => (
                    <span
                      key={hex}
                      className="inline-block h-5 w-5 rounded border border-slate-300"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setBrandTokens({ primaryHex: null, accentHex: null, palette: [], source: "none" })}
                className="ml-auto text-xs text-rose-700 hover:underline"
              >
                ✕ 추출 결과 제거
              </button>
            </div>
          </div>
        )}
      </section>

      <form action={formAction} className="flex flex-col gap-6">
        {/* L1 brand 자동 추출 결과 hidden input — server action 안 zod 안 parse */}
        <input
          type="hidden"
          name="brandTokens"
          value={brandTokens.primaryHex ? JSON.stringify(brandTokens) : ""}
        />
        {/* 폼 상단 status banner (자동 scroll 타깃 — id="clinic-form-status-banner") */}
        <div id="clinic-form-status-banner">
          {state?.ok === true && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              ✅ <strong>저장되었습니다.</strong>
            </div>
          )}
          {state?.ok === false && (errorCount > 0 || formError) && (
            <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
              ❌ <strong>저장 실패</strong>
              {formError && <div className="mt-1">{formError}</div>}
              {errorCount > 0 && (
                <div className="mt-1 text-xs">
                  {errorCount}개 필드 오류 — 첫 오류 필드: <code className="rounded bg-rose-100 px-1 py-0.5 font-mono">{firstErrorFieldName}</code> (자동 스크롤됨)
                </div>
              )}
            </div>
          )}
        </div>

        {/* (a) 기관 정체성 = wizard step 1 */}
        <fieldset id="wizard-step-1" className="flex flex-col gap-4 rounded-md border border-slate-200 p-4 scroll-mt-20">
          <legend className="px-1 text-sm font-medium text-slate-900">
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-fg-inverse">1</span>{" "}
            브랜드 (기관 정체성)
          </legend>
          <Field name="name" label="기관명" required value={values.name} onChange={(v) => setField("name", v)} errors={fieldErrors.name} maxLength={100} />
          <Field name="description" label="간략 소개" required value={values.description} onChange={(v) => setField("description", v)} errors={fieldErrors.description} textarea minLength={80} maxLength={300} hint="80~300자" />
          <Field name="logoUrl" label="로고 URL" required type="url" value={values.logoUrl} onChange={(v) => setField("logoUrl", v)} errors={fieldErrors.logoUrl} maxLength={2048} hint="권장 400×400 (1:1) · 사이트 헤더/푸터/JSON-LD organization logo" />
          <Field name="ogImageUrl" label="OG 이미지 URL" required type="url" value={values.ogImageUrl} onChange={(v) => setField("ogImageUrl", v)} errors={fieldErrors.ogImageUrl} maxLength={2048} hint="권장 1200×630 (1.91:1) · 페이스북·카카오·LinkedIn 공유 미리보기" />
          <Field name="businessRegistrationNumber" label="사업자등록번호" value={values.businessRegistrationNumber} onChange={(v) => setField("businessRegistrationNumber", v)} errors={fieldErrors.businessRegistrationNumber} placeholder="000-00-00000" />
          <details className="rounded-md border border-slate-200 bg-white p-3 text-sm">
            <summary className="cursor-pointer">선택 필드</summary>
            <div className="mt-3 flex flex-col gap-4">
              <Field name="alternateName" label="대체명" value={values.alternateName} onChange={(v) => setField("alternateName", v)} errors={fieldErrors.alternateName} maxLength={100} />
              <Field name="legalEntityName" label="법인명" value={values.legalEntityName} onChange={(v) => setField("legalEntityName", v)} errors={fieldErrors.legalEntityName} maxLength={200} />
              <Field name="slogan" label="슬로건" value={values.slogan} onChange={(v) => setField("slogan", v)} errors={fieldErrors.slogan} maxLength={200} />
              <Field name="longDescription" label="상세 설명" value={values.longDescription} onChange={(v) => setField("longDescription", v)} errors={fieldErrors.longDescription} textarea maxLength={2000} />
              <Field name="foundingDate" label="설립일" type="date" value={values.foundingDate} onChange={(v) => setField("foundingDate", v)} errors={fieldErrors.foundingDate} placeholder="2024-01-01" />
              <Field name="founder" label="설립자" value={values.founder} onChange={(v) => setField("founder", v)} errors={fieldErrors.founder} maxLength={100} />
            </div>
          </details>

          {/* Phase 4 C 하이브리드 정교화: ClinicMetadataEditor 구조화 폼 (5 섹션 row 별 add/remove) */}
          <details className="text-sm text-slate-600 mt-2">
            <summary className="cursor-pointer">고급 — 페이지 컨텐츠 metadata (5 섹션 폼)</summary>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-xs text-slate-500 leading-relaxed">
                메인/about/treatments 페이지의 컨텐츠 (4 pillars · 3원칙 · KeyStats · System Strengths · sectionCopy) 를 row 별 폼으로 관리합니다.
                비워두면 page.tsx 의 fallback hardcode 가 사용됩니다.
              </p>
              {/* hidden input — server action 안 FormData 안 metadataJson 키로 전달 */}
              <input type="hidden" name="metadataJson" value={values.metadataJson} />
              <ClinicMetadataEditor
                value={values.metadataJson}
                onChange={(v) => setField("metadataJson", v)}
                errors={fieldErrors.metadataJson}
              />
            </div>
          </details>
        </fieldset>

        {/* (b) 본원 위치·연락·시간 = wizard step 2+3 (위치/연락 + 진료/예약) */}
        <fieldset id="wizard-step-2" className="flex flex-col gap-4 rounded-md border border-slate-200 p-4 scroll-mt-20">
          <legend className="px-1 text-sm font-medium text-slate-900">
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-fg-inverse">2 · 3</span>{" "}
            위치 · 연락 · 진료시간 · 예약 채널
          </legend>
          <p className="text-xs text-slate-600">이 정보로 LocationProfile(main) 이 자동 생성되며, 5종 정책 문서의 변수에도 사용됩니다.</p>

          {/* 주소 찾기 — 다음 우편번호 popup. 4 필드 동시 채움. 항상 덮어쓰기 (사용자 명시 선택) */}
          <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
            <AddressSearchButton
              onSelect={(a) => {
                setValues((prev) => ({
                  ...prev,
                  addressRegion: a.region.slice(0, 100),
                  addressLocality: a.locality.slice(0, 100),
                  streetAddress: a.street.slice(0, 200),
                  postalCode: a.postalCode.slice(0, 20),
                }));
              }}
            />
            <span className="text-xs text-slate-600">시·도 / 시·군·구 / 도로명 / 우편번호 4 필드를 한번에 채웁니다.</span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field name="addressRegion" label="시·도" required value={values.addressRegion} onChange={(v) => setField("addressRegion", v)} errors={fieldErrors.addressRegion} maxLength={100} placeholder="서울특별시" />
            <Field name="addressLocality" label="시·군·구" required value={values.addressLocality} onChange={(v) => setField("addressLocality", v)} errors={fieldErrors.addressLocality} maxLength={100} placeholder="강남구" />
          </div>
          <Field name="streetAddress" label="도로명 주소" required value={values.streetAddress} onChange={(v) => setField("streetAddress", v)} errors={fieldErrors.streetAddress} maxLength={200} placeholder="테스트로 1" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field name="postalCode" label="우편번호" required value={values.postalCode} onChange={(v) => setField("postalCode", v)} errors={fieldErrors.postalCode} maxLength={20} placeholder="06000" />
            <Field name="addressCountry" label="국가 코드 (ISO 3166-1 alpha-2)" required value={values.addressCountry} onChange={(v) => setField("addressCountry", v.toUpperCase())} errors={fieldErrors.addressCountry} maxLength={2} hint="대문자 2자" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field name="locationTelephone" label="본원 전화" required value={values.locationTelephone} onChange={(v) => setField("locationTelephone", v)} errors={fieldErrors.locationTelephone} placeholder="02-1234-5678" />
            <Field name="locationEmail" label="본원 이메일" type="email" value={values.locationEmail} onChange={(v) => setField("locationEmail", v)} errors={fieldErrors.locationEmail} placeholder="info@example.com" />
          </div>

          <div id="wizard-step-3" className="flex flex-col gap-2 scroll-mt-20">
            <label className="text-sm font-medium">
              <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-fg-inverse">3</span>{" "}
              진료 시간
            </label>
            {fieldErrors.businessHours && <span className="text-xs text-rose-700">{fieldErrors.businessHours.join(", ")}</span>}
            <div className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
              {DAYS.map((day) => {
                const d = values.businessHours[day];
                const dayHeaderId = `bh-header-${day}`;
                const dayInputsId = `bh-inputs-${day}`;
                const dayErrorId = `bh-error-${day}`;
                const dayErrorKeys = (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).filter((k) => typeof k === "string" && k.startsWith(`businessHours.${day}`));
                const dayErrorMessages = dayErrorKeys.flatMap((k) => fieldErrors[k] ?? []);
                return (
                  <div key={day} role="group" aria-labelledby={dayHeaderId} className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <span id={dayHeaderId} className="w-16 text-sm">{DAY_LABEL[day]}</span>
                      {/* LLC-08 patch: 휴진 toggle 의 aria-controls — 해당 row 의 input group id 지목 */}
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          name={`businessHours_${day}_closed`}
                          checked={d.closed}
                          onChange={(e) => setDay(day, { closed: e.target.checked })}
                          aria-controls={dayInputsId}
                          aria-expanded={!d.closed}
                        />
                        휴진
                      </label>
                      {!d.closed && (
                        <span id={dayInputsId} className="flex items-center gap-3">
                          <input
                            type="time"
                            name={`businessHours_${day}_open`}
                            value={d.open ?? ""}
                            onChange={(e) => setDay(day, { open: e.target.value })}
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                            aria-label={`${DAY_LABEL[day]} 오픈 시간`}
                            aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
                          />
                          <span className="text-xs">~</span>
                          <input
                            type="time"
                            name={`businessHours_${day}_close`}
                            value={d.close ?? ""}
                            onChange={(e) => setDay(day, { close: e.target.value })}
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                            aria-label={`${DAY_LABEL[day]} 마감 시간`}
                            aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
                          />
                          <label className="ml-2 flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              name={`businessHours_${day}_lunchEnabled`}
                              checked={d.lunchEnabled}
                              onChange={(e) => setDay(day, { lunchEnabled: e.target.checked })}
                              aria-expanded={d.lunchEnabled}
                            />
                            점심
                          </label>
                          {d.lunchEnabled && (
                            <>
                              <input
                                type="time"
                                name={`businessHours_${day}_lunchFrom`}
                                value={d.lunchFrom ?? ""}
                                onChange={(e) => setDay(day, { lunchFrom: e.target.value })}
                                className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                                aria-label={`${DAY_LABEL[day]} 점심 시작`}
                                aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
                              />
                              <span className="text-xs">~</span>
                              <input
                                type="time"
                                name={`businessHours_${day}_lunchTo`}
                                value={d.lunchTo ?? ""}
                                onChange={(e) => setDay(day, { lunchTo: e.target.value })}
                                className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                                aria-label={`${DAY_LABEL[day]} 점심 종료`}
                                aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
                              />
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    {dayErrorMessages.length > 0 && (
                      <p id={dayErrorId} role="alert" className="text-xs text-rose-700">{dayErrorMessages.join(", ")}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">예약 채널 (최소 1개)</label>
            {fieldErrors.primaryCtas && <span className="text-xs text-rose-700">{fieldErrors.primaryCtas.join(", ")}</span>}
            <div className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
              <CtaRow type="phone" label="예약하기" enabled={ctaPhoneEnabled} setEnabled={setCtaPhoneEnabled} labelVal={ctaPhoneLabel} setLabelVal={setCtaPhoneLabel} urlVal={ctaPhoneUrl} setUrlVal={setCtaPhoneUrl} urlPlaceholder="tel:+82-2-1234-5678" />
              <CtaRow type="kakao-talk" label="카카오톡 상담" enabled={ctaKakaoEnabled} setEnabled={setCtaKakaoEnabled} labelVal={ctaKakaoLabel} setLabelVal={setCtaKakaoLabel} urlVal={ctaKakaoUrl} setUrlVal={setCtaKakaoUrl} urlPlaceholder="https://pf.kakao.com/_..." />
              <CtaRow type="naver-reservation" label="네이버 예약" enabled={ctaNaverEnabled} setEnabled={setCtaNaverEnabled} labelVal={ctaNaverLabel} setLabelVal={setCtaNaverLabel} urlVal={ctaNaverUrl} setUrlVal={setCtaNaverUrl} urlPlaceholder="https://booking.naver.com/booking/..." />
            </div>
          </div>

          {ctaOptions.length > 0 && (
            <label className="flex flex-col gap-1 text-sm">
              <span>강조 채널 <span className="ml-1 text-rose-600">*</span></span>
              <select
                name="featuredChannelId"
                value={values.featuredChannelId}
                onChange={(e) => setField("featuredChannelId", e.target.value)}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
              >
                <option value="">— 선택 —</option>
                {ctaOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {fieldErrors.featuredChannelId && <span className="text-xs text-rose-700">{fieldErrors.featuredChannelId.join(", ")}</span>}
            </label>
          )}
        </fieldset>

        {/* (c) 정책 변수 = wizard step 4 */}
        <fieldset id="wizard-step-4" className="flex flex-col gap-4 rounded-md border border-slate-200 p-4 scroll-mt-20">
          <legend className="px-1 text-sm font-medium text-slate-900">
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-fg-inverse">4</span>{" "}
            정책 변수 (개인정보 보호책임자 등)
          </legend>
          <p className="text-xs text-slate-600">5종 정책 문서(개인정보처리방침·이용약관·비급여·환불·민원)의 변수에 사용됩니다.</p>
          <Field name="policyContactPerson" label="개인정보 보호책임자" required value={values.policyContactPerson} onChange={(v) => setField("policyContactPerson", v)} errors={fieldErrors.policyContactPerson} maxLength={100} />
          <Field name="policyContactEmail" label="보호책임자 이메일" required type="email" value={values.policyContactEmail} onChange={(v) => setField("policyContactEmail", v)} errors={fieldErrors.policyContactEmail} maxLength={200} />
          <Field name="policyContactPhone" label="보호책임자 전화" required value={values.policyContactPhone} onChange={(v) => setField("policyContactPhone", v)} errors={fieldErrors.policyContactPhone} placeholder="02-1234-5678" />
          <Field name="policyEffectiveDate" label="기본 시행일 (5종 정책 공통 default)" required type="date" value={values.policyEffectiveDate} onChange={(v) => setField("policyEffectiveDate", v)} errors={fieldErrors.policyEffectiveDate} />

          {/* ADMIN_BUSINESS_ENTITIES v1 § 3 — 운영자 ↔ 클라이언트 일상 contact (외부 비공개 · 사이트 미노출) */}
          <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50/50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <span aria-hidden className="text-base">📞</span>
              <span className="text-sm font-medium text-fg-default">운영 contact (어드민 전용)</span>
              <span className="text-[11px] text-fg-muted">사이트 안 미노출 — 운영자가 클라이언트에게 연락할 때 사용</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field name="primaryContactName" label="담당자 이름" value={values.primaryContactName} onChange={(v) => setField("primaryContactName", v)} errors={fieldErrors.primaryContactName} maxLength={100} placeholder="예: 홍길동" />
              <Field name="primaryContactRole" label="역할" value={values.primaryContactRole} onChange={(v) => setField("primaryContactRole", v)} errors={fieldErrors.primaryContactRole} maxLength={80} placeholder="예: 대표원장 · 실무자 · 디자이너" />
              <Field name="primaryContactPhone" label="전화" value={values.primaryContactPhone} onChange={(v) => setField("primaryContactPhone", v)} errors={fieldErrors.primaryContactPhone} maxLength={40} placeholder="010-1234-5678" />
              <Field name="primaryContactEmail" label="이메일" type="email" value={values.primaryContactEmail} onChange={(v) => setField("primaryContactEmail", v)} errors={fieldErrors.primaryContactEmail} maxLength={200} />
            </div>
          </div>
        </fieldset>

        {/* (d) 5 LegalDocument effective date override = wizard step 5 (발행 직전) */}
        <fieldset id="wizard-step-5" className="flex flex-col gap-3 rounded-md border border-slate-200 p-4 scroll-mt-20">
          <legend className="px-1 text-sm font-medium text-slate-900">
            <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-fg-inverse">5</span>{" "}
            발행 · 정책 문서 시행일 (선택 · 미입력 시 기본 시행일 사용)
          </legend>
          <p className="text-xs text-amber-800">
            본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다.
          </p>
          <div className="flex flex-col gap-2">
            {CLOSED_DOC_TYPES.map((t) => {
              const headerId = `legal-override-${t}`;
              const bodyId = `legal-override-body-${t}`;
              // LLC-08 patch: summary 의 aria-controls 로 본문 group 을 가리키고, 입력 group 에는 aria-labelledby 로 summary 연결
              return (
                <details key={t} className="rounded-md border border-slate-200 bg-white p-2">
                  <summary id={headerId} aria-controls={bodyId} className="cursor-pointer text-sm">
                    {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
                  </summary>
                  <div id={bodyId} role="group" aria-labelledby={headerId} className="mt-2">
                    <Field
                      name={`legalDocEffective_${t}`}
                      label={`${DOC_TYPE_LABEL[t]} 시행일 override`}
                      type="date"
                      value={values.legalDocEffectiveOverrides[t]}
                      onChange={(v) => setLegalDocOverride(t, v)}
                      errors={fieldErrors[`legalDocEffectiveOverrides.${t}`]}
                    />
                  </div>
                </details>
              );
            })}
          </div>
        </fieldset>

        {/* Submit 영역 — 버튼 바로 위에 mirror status (긴 form 안 사용자가 스크롤 안 해도 결과 즉시 확인) */}
        <div className="sticky bottom-0 -mx-6 flex flex-col gap-2 border-t border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
          {state?.ok === true && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              ✅ 저장되었습니다.
            </div>
          )}
          {state?.ok === false && (errorCount > 0 || formError) && (
            <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              ❌ 저장 실패 — {formError ?? `${errorCount}개 필드 오류 (${firstErrorFieldName})`}
            </div>
          )}
          {/* 5단계 wizard navigation — 이전/다음 + Submit (step 5 안 만) */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setWizardStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : 1))}
              disabled={wizardStep === 1}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              ← 이전 단계
            </button>
            <span className="text-xs text-slate-500">단계 {wizardStep} / 5</span>
            {wizardStep < 5 ? (
              <button
                type="button"
                onClick={() => setWizardStep((s) => (s < 5 ? ((s + 1) as 2 | 3 | 4 | 5) : 5))}
                className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover"
              >
                다음 단계 →
              </button>
            ) : (
              <SubmitButton />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function WizardStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: 1 | 2 | 3 | 4 | 5;
  onStepClick: (step: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const STEPS: Array<{ id: 1 | 2 | 3 | 4 | 5; label: string; icon: string }> = [
    { id: 1, label: "브랜드", icon: "🏷️" },
    { id: 2, label: "위치/연락", icon: "📍" },
    { id: 3, label: "진료/예약", icon: "🕒" },
    { id: 4, label: "정책", icon: "📋" },
    { id: 5, label: "발행", icon: "🚀" },
  ];
  return (
    <nav
      aria-label="ClinicProfile wizard steps"
      className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-md border border-border bg-elevated px-4 py-2 shadow-sm"
    >
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => onStepClick(step.id)}
            aria-current={currentStep === step.id ? "step" : undefined}
            className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs transition ${
              currentStep === step.id
                ? "bg-brand-primary text-fg-inverse"
                : currentStep > step.id
                ? "text-success hover:bg-subtle"
                : "text-fg-muted hover:bg-subtle"
            }`}
          >
            <span aria-hidden>{step.icon}</span>
            <span className="font-medium">
              {step.id}. {step.label}
            </span>
          </button>
          {idx < STEPS.length - 1 && <span className="flex-1 border-t border-border" aria-hidden />}
        </div>
      ))}
    </nav>
  );
}

function CtaRow({
  type,
  label,
  enabled,
  setEnabled,
  labelVal,
  setLabelVal,
  urlVal,
  setUrlVal,
  urlPlaceholder,
}: {
  type: "phone" | "kakao-talk" | "naver-reservation";
  label: string;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  labelVal: string;
  setLabelVal: (v: string) => void;
  urlVal: string;
  setUrlVal: (v: string) => void;
  urlPlaceholder: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 last:border-0">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        {label}
      </label>
      {enabled && (
        <div className="grid grid-cols-1 gap-2 pl-6 md:grid-cols-2">
          <input
            type="text"
            name={`cta_${type}_label`}
            value={labelVal}
            onChange={(e) => setLabelVal(e.target.value)}
            placeholder="표시 라벨"
            required
            className="rounded-md border border-slate-300 px-2 py-1 text-xs invalid:border-rose-400"
          />
          <input
            type="text"
            name={`cta_${type}_targetUrl`}
            value={urlVal}
            onChange={(e) => setUrlVal(e.target.value)}
            placeholder={urlPlaceholder}
            required
            className="rounded-md border border-slate-300 px-2 py-1 text-xs invalid:border-rose-400"
          />
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : "저장"}
    </button>
  );
}
