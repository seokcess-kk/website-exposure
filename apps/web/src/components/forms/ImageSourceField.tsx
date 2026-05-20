"use client";

import { useEffect, useState } from "react";
import { Field } from "./Field";

export function ImageSourceField({
  label,
  urlFieldName,
  fileFieldName,
  modeFieldName,
  url,
  onUrlChange,
  errors,
}: {
  label: string;
  urlFieldName: string;
  fileFieldName: string;
  modeFieldName: string;
  url: string;
  onUrlChange: (url: string) => void;
  errors?: string[];
}) {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  return (
    <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900">{label}</span>
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
      <input type="hidden" name={modeFieldName} value={mode} />
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
        <label className="flex flex-col gap-1 text-sm">
          <span>{label} 파일</span>
          <input
            name={fileFieldName}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (filePreview) URL.revokeObjectURL(filePreview);
              setFilePreview(file ? URL.createObjectURL(file) : null);
              if (file) onUrlChange("");
            }}
          />
          <span className="text-xs text-slate-500">jpg, png, webp, gif · 최대 5MB</span>
          {errors && errors.length > 0 ? <span className="text-xs text-rose-700">{errors.join(", ")}</span> : null}
        </label>
      )}
      {(mode === "url" && url) || filePreview ? (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mode === "url" ? url : filePreview!} alt="" className="max-h-48 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
