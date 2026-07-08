// @glitzy/web/components/forms/DoctorProfileForm
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useFormSuccessToast } from "@/hooks/useFormSuccessToast";
import { Field } from "./Field";
import { ImageSourceField } from "./ImageSourceField";
import { AdvancedSection } from "./AdvancedSection";
import { AdminLivePreview, EmptyPreview, PreviewText, type AppliedLocation } from "./AdminLivePreview";
import { useAutoSlug } from "@/hooks/useAutoSlug";
import { slugify } from "@/lib/slugify";
import type { SaveResult } from "@/lib/save-result";
import {
  CREDENTIAL_TYPES,
  CREDENTIAL_TYPE_LABEL,
  type CredentialFormEntry,
  type CredentialType,
} from "@/lib/doctor-metadata";

export type DoctorProfileInitial = {
  slug: string;
  name: string;
  title: string;
  jobTitle: string;
  honorific: string;
  bio: string;
  photoUrl: string;
  /** 약력 섹션 전용 사진 (Hero photoUrl 과 별도) */
  cvPhotoUrl: string;
  displayOrder: string;
  active: boolean;
  /** 의료기관 인증 스키마 — schema.org Physician.hasCredential 매핑 */
  credentials: CredentialFormEntry[];
  /** comma-separated 자유 입력 — schema.org Physician.medicalSpecialty 매핑 */
  medicalSpecialties: string;
};

const empty: DoctorProfileInitial = {
  slug: "",
  name: "",
  title: "",
  jobTitle: "",
  honorific: "",
  bio: "",
  photoUrl: "",
  cvPhotoUrl: "",
  displayOrder: "0",
  active: true,
  credentials: [],
  medicalSpecialties: "",
};

function emptyCredentialEntry(): CredentialFormEntry {
  return { type: "license", name: "", issuer: "", issuedAt: "", identifier: "", url: "" };
}

export function DoctorProfileForm({
  action,
  initial,
  isNew,
  instanceSlug,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: DoctorProfileInitial | null;
  isNew: boolean;
  instanceSlug: string;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  useFormSuccessToast(state);
  const [values, setValues] = useState<DoctorProfileInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = (k: keyof DoctorProfileInitial, v: string | boolean) =>
    setValues((p) => ({ ...p, [k]: v }));

  const { markSlugDirty } = useAutoSlug({
    source: values.name,
    setSlug: (s) => set("slug", s),
    isNew,
    options: { maxLength: 64, fallbackPrefix: "doctor" },
  });
  const previewSlug = values.slug.trim() || "doctor";
  const locations: AppliedLocation[] = [
    { label: "메인 > 대표원장 이야기", href: `/${instanceSlug}#doctor-intro`, note: "대표 의료진으로 노출될 때 소개 영역에 반영됩니다." },
    { label: "메인 > 약력", href: `/${instanceSlug}#doctor-cv` },
    { label: "의료진 상세 페이지", href: `/${instanceSlug}/doctors/${previewSlug}` },
    { label: "아티클 저자/논문/미디어 연결", href: `/${instanceSlug}/doctors`, note: "콘텐츠에서 이 의료진을 선택하면 함께 연결됩니다." },
  ];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-5">
          {state?.ok === true && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
              저장되었습니다. 적용 위치에서 공개 화면을 확인할 수 있습니다.
            </div>
          )}
          {formError && (
            <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">
              {formError}
            </div>
          )}

          <Field name="name" label="이름" required value={values.name} onChange={(v) => set("name", v)} errors={fieldErrors.name} maxLength={100} />
          <Field name="title" label="직함" value={values.title} onChange={(v) => set("title", v)} errors={fieldErrors.title} maxLength={100} placeholder="예: 대표원장" />
          <Field name="bio" label="약력" textarea rows={6} value={values.bio} onChange={(v) => set("bio", v)} errors={fieldErrors.bio} maxLength={2000} />
          <ImageSourceField
            label="의료진 사진 (Hero 노출용)"
            urlFieldName="photoUrl"
            fileFieldName="photoFile"
            modeFieldName="photoMode"
            url={values.photoUrl}
            onUrlChange={(v) => set("photoUrl", v)}
            errors={fieldErrors.photoUrl}
            instanceSlug={instanceSlug}
            uploadKind="doctor-photo"
            recommendedSize="1200×1800 (2:3 · 인물 세로 hero 활용)"
            usageHint="Hero § stacked carousel + 의료진 카드 + 상세 페이지 + SiteHeader avatar"
          />
          <ImageSourceField
            label="약력 사진 (약력 섹션 전용)"
            urlFieldName="cvPhotoUrl"
            fileFieldName="cvPhotoFile"
            modeFieldName="cvPhotoMode"
            url={values.cvPhotoUrl}
            onUrlChange={(v) => set("cvPhotoUrl", v)}
            errors={fieldErrors.cvPhotoUrl}
            instanceSlug={instanceSlug}
            uploadKind="doctor-cv"
            recommendedSize="1200×1500 (4:5 · formal portrait)"
            usageHint="메인 § 약력 섹션 좌측 portrait · 비워두면 Hero 사진 자리에 배지+이름만 노출"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              value="true"
              checked={values.active}
              onChange={(e) => set("active", e.target.checked)}
            />
            <span>활성</span>
          </label>

          <AdvancedSection
            title="고급 설정"
            description="URL 식별자 · 표시 순서 · 자격·인증 등록 (필요할 때만 펼치세요)"
          >
            <Field
              name="slug"
              label="URL 식별자 (slug)"
              required
              value={values.slug}
              onChange={(v) => { markSlugDirty(); set("slug", v); }}
              // 저장 전 자동 보정 (2026-07-08 UX): 한글·공백·대문자 등 규칙 위반 입력을 focus 이탈 시
              // slugify 로 정규화 — 한글만 있으면 doctor-임의코드 폴백 (검증 에러로 저장이 막히는 것 방지).
              onBlur={() => {
                const v = values.slug.trim();
                if (/^[a-z0-9][a-z0-9-]{2,63}$/.test(v)) return;
                const source = v || values.name;
                if (!source.trim()) return;
                set("slug", slugify(source, { maxLength: 64, fallbackPrefix: "doctor" }));
              }}
              errors={fieldErrors.slug}
              maxLength={64}
              hint="영문 소문자/숫자/하이픈 3~64자 (한글 불가) · 이름 입력 시 자동 생성 · 잘못 입력해도 저장 전 자동 보정 (예: kim-ye-jin)"
            />
            <Field name="jobTitle" label="직책" value={values.jobTitle} onChange={(v) => set("jobTitle", v)} errors={fieldErrors.jobTitle} maxLength={100} />
            <Field name="honorific" label="호칭" value={values.honorific} onChange={(v) => set("honorific", v)} errors={fieldErrors.honorific} maxLength={20} placeholder="예: 박사" />
            <Field name="displayOrder" label="표시 순서" value={values.displayOrder} onChange={(v) => set("displayOrder", v)} errors={fieldErrors.displayOrder} hint="작을수록 앞 (정수)" />

            <CredentialsField
              credentials={values.credentials}
              specialties={values.medicalSpecialties}
              fieldErrors={fieldErrors}
              onSpecialtiesChange={(v) => set("medicalSpecialties", v)}
              onCredentialsChange={(next) => setValues((p) => ({ ...p, credentials: next }))}
            />
          </AdvancedSection>

          <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <SubmitButton isNew={isNew} />
          </div>
        </div>

        <AdminLivePreview locations={locations}>
          {values.name.trim() || values.bio.trim() || values.photoUrl.trim() ? (
            <article className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-200">
                  {values.photoUrl.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={values.photoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">사진</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase text-slate-400">의료진</div>
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-950">
                    <PreviewText value={values.name} fallback="이름" />
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    <PreviewText value={values.title || values.jobTitle} fallback="직함" />
                  </p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                <PreviewText value={values.bio} fallback="약력이 여기에 표시됩니다." />
              </p>
            </article>
          ) : (
            <EmptyPreview label="이름과 약력을 입력하면 의료진 미리보기가 표시됩니다." />
          )}
        </AdminLivePreview>
      </div>
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "저장 중…" : isNew ? "추가" : "저장"}
    </button>
  );
}

// === Credentials + medicalSpecialty 입력 UI (의료기관 인증 스키마) ===
//   schema.org Physician.hasCredential / medicalSpecialty 매핑 SoT.
//   FormData 안 prefixed name (`credentials[i].type` 등) — server action 의 readCredentialsFromFormData 와 컨벤션 일치.

function CredentialsField({
  credentials,
  specialties,
  fieldErrors,
  onCredentialsChange,
  onSpecialtiesChange,
}: {
  credentials: CredentialFormEntry[];
  specialties: string;
  fieldErrors: Record<string, string[]>;
  onCredentialsChange: (next: CredentialFormEntry[]) => void;
  onSpecialtiesChange: (next: string) => void;
}) {
  const updateAt = (i: number, patch: Partial<CredentialFormEntry>) => {
    const next = credentials.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    onCredentialsChange(next);
  };
  const removeAt = (i: number) => {
    onCredentialsChange(credentials.filter((_, idx) => idx !== i));
  };
  const addOne = () => {
    onCredentialsChange([...credentials, emptyCredentialEntry()]);
  };

  return (
    <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
      <legend className="px-2 text-sm font-semibold text-slate-700">자격·인증 · 전문분야</legend>
      <p className="text-xs text-slate-500">
        의료기관 인증 스키마 (schema.org <code>Physician.hasCredential</code> · <code>medicalSpecialty</code>) 로 자동 변환됩니다.
        면허 / 전문의 / 학회 인증 / 학회 회원 / 학력 5종으로 구분 저장됩니다.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700">전문분야</label>
        <input
          type="text"
          name="medicalSpecialties"
          value={specialties}
          onChange={(e) => onSpecialtiesChange(e.target.value)}
          placeholder="예: 비만의학, 한방재활의학"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">쉼표(,) 로 구분. JSON-LD <code>medicalSpecialty</code> 로 출력.</p>
      </div>

      <div className="flex flex-col gap-3">
        {credentials.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
            등록된 자격·인증이 없습니다.
          </p>
        ) : (
          credentials.map((c, i) => {
            const nameErr = fieldErrors[`credentials.${i}.name`];
            const urlErr = fieldErrors[`credentials.${i}.url`];
            return (
              <div key={i} className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 md:grid-cols-[8rem_minmax(0,1fr)_auto]">
                <div>
                  <label className="block text-xs font-medium text-slate-600">구분</label>
                  <select
                    name={`credentials[${i}].type`}
                    value={c.type}
                    onChange={(e) => updateAt(i, { type: e.target.value as CredentialType })}
                    className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                  >
                    {CREDENTIAL_TYPES.map((t) => (
                      <option key={t} value={t}>{CREDENTIAL_TYPE_LABEL[t]}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600">인증·자격명 *</label>
                    <input
                      type="text"
                      name={`credentials[${i}].name`}
                      value={c.name}
                      onChange={(e) => updateAt(i, { name: e.target.value })}
                      placeholder="예: 한의사 면허 · 대한비만학회 인정의 · 경희대 한의학과 졸업"
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                    {nameErr ? <p className="mt-1 text-xs text-rose-600">{nameErr.join(" · ")}</p> : null}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">발급 기관</label>
                    <input
                      type="text"
                      name={`credentials[${i}].issuer`}
                      value={c.issuer}
                      onChange={(e) => updateAt(i, { issuer: e.target.value })}
                      placeholder="예: 보건복지부"
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">발급 연도/일자</label>
                    <input
                      type="text"
                      name={`credentials[${i}].issuedAt`}
                      value={c.issuedAt}
                      onChange={(e) => updateAt(i, { issuedAt: e.target.value })}
                      placeholder="예: 2018 또는 2018-03-15"
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">자격번호</label>
                    <input
                      type="text"
                      name={`credentials[${i}].identifier`}
                      value={c.identifier}
                      onChange={(e) => updateAt(i, { identifier: e.target.value })}
                      placeholder="선택 (예: 12345)"
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">검증 URL</label>
                    <input
                      type="url"
                      name={`credentials[${i}].url`}
                      value={c.url}
                      onChange={(e) => updateAt(i, { url: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                    {urlErr ? <p className="mt-1 text-xs text-rose-600">{urlErr.join(" · ")}</p> : null}
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 hover:border-rose-400 hover:text-rose-600"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })
        )}
        <button
          type="button"
          onClick={addOne}
          className="self-start rounded-md border border-dashed border-slate-400 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-600 hover:text-slate-900"
        >
          + 자격·인증 추가
        </button>
      </div>
    </fieldset>
  );
}
