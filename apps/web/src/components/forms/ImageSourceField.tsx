// @glitzy/web/components/forms/ImageSourceField — URL 입력 ↔ 파일 업로드 (Supabase Storage 직접 PUT)
// 사용자 결정 2026-05-20: Cloudflare R2 대신 Supabase Storage (vendor 단일화).
//
// 흐름:
//   1. URL mode: 외부 URL 입력 (기존 동작)
//   2. File mode: 파일 선택 → requestImageUploadUrl() server action → Supabase signed URL
//      → client 가 직접 PUT → public URL 을 hidden input 에 저장 → form submit
//
// 핵심: form submit 시점에 파일 자체는 form 안 없음. 이미 업로드 완료된 public URL 만 들어감.

"use client";

import { useEffect, useState } from "react";
import { Field } from "./Field";
import { requestImageUploadUrl } from "@/lib/admin/upload-actions";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "error"; message: string }
  | { status: "done" };

export function ImageSourceField({
  label,
  urlFieldName,
  fileFieldName: _fileFieldName, // deprecated — file 자체는 form 안 안 보냄
  modeFieldName,
  url,
  onUrlChange,
  errors,
  instanceSlug,
  uploadKind,
  recommendedSize,
  usageHint,
}: {
  label: string;
  urlFieldName: string;
  fileFieldName: string;
  modeFieldName: string;
  url: string;
  onUrlChange: (url: string) => void;
  errors?: string[];
  /** Supabase Storage signed upload URL 요청 시 instance 격리 path */
  instanceSlug: string;
  /** Supabase 안 path segment 분류 (예: "treatment-hero", "article-hero") */
  uploadKind: string;
  /** 권장 픽셀 크기 (예: "1600×900 (16:9)"). 사용자에게 가이드용 — 강제 검증 아님. */
  recommendedSize?: string;
  /** 어디에 사용되는지 한 줄 안내 (예: "메인 hero · detail 페이지 상단"). */
  usageHint?: string;
}) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleFileSelect = async (file: File | null) => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(file ? URL.createObjectURL(file) : null);
    if (!file) {
      setUploadState({ status: "idle" });
      return;
    }

    setUploadState({ status: "uploading", progress: 0 });
    try {
      // 1) server action — signed upload URL 발급
      const signed = await requestImageUploadUrl(instanceSlug, uploadKind, file.type, file.size);
      if (signed.ok === false) {
        setUploadState({ status: "error", message: signed.message });
        return;
      }

      // 2) Supabase Storage 에 직접 PUT (signed URL)
      setUploadState({ status: "uploading", progress: 30 });
      const putRes = await fetch(signed.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) {
        const body = await putRes.text().catch(() => "");
        setUploadState({ status: "error", message: `업로드 실패 (${putRes.status}) ${body.slice(0, 200)}` });
        return;
      }

      // 3) public URL 을 form 안 hidden input 에 저장 (CHECK ^https?:// 통과)
      onUrlChange(signed.publicUrl);
      setUploadState({ status: "done" });
    } catch (err) {
      setUploadState({ status: "error", message: err instanceof Error ? err.message : String(err) });
    }
  };

  const previewSrc = mode === "url" ? url : filePreview;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-slate-900">{label}</span>
          {recommendedSize ? (
            <span className="text-[11px] text-brand-primary">
              권장 크기 <span className="font-mono">{recommendedSize}</span>
            </span>
          ) : null}
          {usageHint ? (
            <span className="text-[11px] text-slate-500">{usageHint}</span>
          ) : null}
        </div>
        <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={mode === "url" ? "rounded bg-slate-900 px-2 py-1 text-white" : "px-2 py-1 text-slate-600"}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className={mode === "file" ? "rounded bg-slate-900 px-2 py-1 text-white" : "px-2 py-1 text-slate-600"}
          >
            첨부파일
          </button>
        </div>
      </div>

      {/* mode 는 server action 안 더 이상 사용 안 함 (client 가 직접 PUT 후 URL 만 form 안 들어감).
          legacy actions.ts 호환을 위해 hidden input 은 유지. */}
      <input type="hidden" name={modeFieldName} value="url" />

      {mode === "url" ? (
        <Field
          name={urlFieldName}
          label={`${label} URL`}
          type="url"
          value={url}
          onChange={onUrlChange}
          errors={errors}
          maxLength={2048}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {/* form 안에는 hidden url 만 들어감 — file 직접 안 보냄 */}
          <input type="hidden" name={urlFieldName} value={url} />

          <label className="flex flex-col gap-1 text-sm">
            <span>{label} 파일</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={uploadState.status === "uploading"}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-60"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                void handleFileSelect(file);
              }}
            />
            <span className="text-xs text-slate-500">jpg, png, webp, gif · 최대 5MB · Supabase Storage 자동 업로드</span>
          </label>

          {uploadState.status === "uploading" ? (
            <div className="text-xs text-brand-primary">업로드 중… ({uploadState.progress}%)</div>
          ) : null}
          {uploadState.status === "done" ? (
            <div className="text-xs text-emerald-700">업로드 완료 — 저장 시 적용됩니다.</div>
          ) : null}
          {uploadState.status === "error" ? (
            <div className="text-xs text-rose-700">{uploadState.message}</div>
          ) : null}

          {errors && errors.length > 0 ? (
            <div className="text-xs text-rose-700">{errors.join(", ")}</div>
          ) : null}
        </div>
      )}

      {previewSrc ? (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="" className="max-h-48 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
