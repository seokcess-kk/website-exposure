// @glitzy/web/components/admin/AddressSearchButton — 다음 우편번호 popup 안 주소 찾기 (P2 UX 개선 확장)
// 외부 script 동적 로딩 + popup 안 callback → 시·도 / 시·군·구 / 도로명+번지 / 우편번호 4 필드 채움.
// API key 불필요. 한국 운영자가 가장 친숙한 패턴.

"use client";

import { useCallback, useRef, useState } from "react";

const SCRIPT_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

// daum postcode v2 안 oncomplete data shape (필요 필드만)
type DaumPostcodeData = {
  zonecode: string;        // 우편번호 (5자리)
  address: string;          // 도로명 주소 (전체)
  roadAddress?: string;     // 도로명 (sido + sigungu + roadname + number)
  jibunAddress?: string;    // 지번 주소
  sido: string;             // 시·도 (예: "인천")
  sigungu: string;          // 시·군·구 (예: "부평구")
  bname?: string;           // 법정동
  buildingName?: string;    // 건물명
  roadname?: string;        // 도로명만
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: (state: string) => void;
        width?: string | number;
        height?: string | number;
      }) => { open: () => void };
    };
  }
}

export type AddressSelectPayload = {
  region: string;
  locality: string;
  street: string;
  postalCode: string;
};

export function AddressSearchButton({ onSelect }: { onSelect: (a: AddressSelectPayload) => void }) {
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  const ensureScript = useCallback((): Promise<void> => {
    if (typeof window === "undefined") return Promise.reject(new Error("not a browser"));
    if (loadedRef.current && window.daum?.Postcode) return Promise.resolve();
    if (window.daum?.Postcode) {
      loadedRef.current = true;
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => { loadedRef.current = true; resolve(); }, { once: true });
        existing.addEventListener("error", () => reject(new Error("daum postcode script load failed")), { once: true });
        return;
      }
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => { loadedRef.current = true; resolve(); };
      s.onerror = () => reject(new Error("daum postcode script load failed"));
      document.head.appendChild(s);
    });
  }, []);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      await ensureScript();
      if (!window.daum?.Postcode) throw new Error("daum.Postcode 미로드");
      new window.daum.Postcode({
        oncomplete: (data) => {
          // sido — 다음 API 안 "서울" · "부산" · "인천" 등 축약형 반환. 한국 운영 관례 (광역시도 풀명) 로 확장.
          const SIDO_FULL: Record<string, string> = {
            "서울": "서울특별시",
            "부산": "부산광역시",
            "대구": "대구광역시",
            "인천": "인천광역시",
            "광주": "광주광역시",
            "대전": "대전광역시",
            "울산": "울산광역시",
            "세종": "세종특별자치시",
            "경기": "경기도",
            "강원": "강원특별자치도",
            "충북": "충청북도",
            "충남": "충청남도",
            "전북": "전북특별자치도",
            "전남": "전라남도",
            "경북": "경상북도",
            "경남": "경상남도",
            "제주": "제주특별자치도",
          };
          const region = SIDO_FULL[data.sido] ?? data.sido;
          const locality = data.sigungu;
          // 도로명 주소 안 sido + sigungu prefix 제거 → 도로명 + 번지 + 건물명
          let street = data.roadAddress ?? data.address ?? "";
          for (const prefix of [data.sido, region, locality]) {
            if (prefix && street.startsWith(prefix)) {
              street = street.slice(prefix.length).trim();
            }
          }
          const buildingName = (data.buildingName ?? "").trim();
          if (buildingName && !street.endsWith(`(${buildingName})`)) {
            street = `${street} (${buildingName})`;
          }
          onSelect({
            region,
            locality,
            street: street.trim(),
            postalCode: data.zonecode,
          });
        },
      }).open();
    } catch (err) {
      console.error("[address-search] failed", err);
      alert("주소 검색 서비스를 불러올 수 없습니다. 직접 입력해주세요.");
    } finally {
      setLoading(false);
    }
  }, [ensureScript, onSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
    >
      <span aria-hidden>🔍</span>
      {loading ? "불러오는 중..." : "주소 찾기"}
    </button>
  );
}
