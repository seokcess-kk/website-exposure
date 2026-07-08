// @glitzy/web/lib/admin/naver-paste-parser — NSA TOP30 paste ingestion parser
// NAVER_SEARCH_INGEST_PLAN v0.4 § 4.3·4.2 — plain text primary + HTML secondary + zod 5컬럼 + No skip + CTR /100
// cycle 3 (e)·(f) 정합 — 반환 타입 { validRows, skippedRows, errors }
// 2026-07-08 실사용 보강 — 세로(줄 단위) 복사 · 천 단위 콤마 · "%" 접미사 · "-"=0 · No 컬럼 없는 4컬럼 허용

import { z } from "zod";
import * as cheerio from "cheerio";

// === Schema (G1·G2 확정 — 5컬럼) ===

export const NaverPasteRowSchema = z.object({
  검색키워드: z.string().trim().min(1).max(500),
  클릭: z.coerce.number().int().min(0),
  노출: z.coerce.number().int().min(0),
  CTR: z.coerce.number().min(0).max(100),  // 정수 % — ingestion 단계에서 /100 변환
});

export type NaverPasteRow = z.infer<typeof NaverPasteRowSchema>;

export type PasteParseResult = {
  validRows: NaverPasteRow[];
  skippedRows: number;
  errors: Array<{ rowIndex: number; reason: string }>;
  /** parser 가 감지한 입력 형식 — UI 표시 + audit */
  detectedFormat: "tsv" | "multi-space" | "html" | "csv" | "vertical" | "unknown";
};

// === 숫자 토큰 정규화 (2026-07-08 실사용 보강) ===
// NSA 표 실복사값은 "1,234" (천 단위 콤마) · "25%" (CTR 접미사) · "-" (0 표기) 가 섞임.
// 정규화 후 숫자 검증 — 파서 전 경로 (TSV/multi-space/CSV/vertical/HTML) 공통.

function cleanNumericToken(raw: string): string {
  const t = raw.trim();
  if (t === "-") return "0";
  return t.replace(/,(?=\d{3})/g, "").replace(/%$/, "").trim();
}

function isNumericToken(raw: string): boolean {
  return /^\d+(\.\d+)?$/.test(cleanNumericToken(raw));
}

// === Entry point — format detect + parse ===

export function detectAndParse(paste: string): PasteParseResult {
  const trimmed = paste.trim();
  if (trimmed.length === 0) {
    return { validRows: [], skippedRows: 0, errors: [], detectedFormat: "unknown" };
  }

  // 1. HTML 우선 — Claude Code 등 일부 환경이 HTML 보존
  if (/<table|<tr/i.test(trimmed)) {
    return parseHtmlTable(trimmed);
  }

  // 2. plain text — primary (v1 main · <textarea> paste)
  const firstLine = trimmed.split(/\r?\n/)[0] ?? "";
  if (firstLine.includes("\t")) {
    return parseDelimited(trimmed, "\t", "tsv");
  }
  if (/\s{2,}/.test(firstLine)) {
    return parseDelimited(trimmed, /\s{2,}/, "multi-space");
  }
  if (firstLine.includes(",") && !isNumericToken(firstLine)) {
    return parseDelimited(trimmed, ",", "csv");
  }

  // 3. 세로 형식 (2026-07-08) — div 기반 표 드래그 복사 시 셀마다 줄바꿈.
  //    No/키워드/클릭/노출/CTR 이 각각 한 줄 → 5줄(또는 No 없이 4줄) 그룹 스캔.
  const vertical = parseVertical(trimmed);
  if (vertical.validRows.length > 0) {
    return vertical;
  }

  // 4. CSV fallback (엑셀 거쳐 paste)
  return parseDelimited(trimmed, ",", "csv");
}

// === parseDelimited — plain text / TSV / CSV / multi-space ===

function parseDelimited(
  text: string,
  delim: string | RegExp,
  format: "tsv" | "multi-space" | "csv",
): PasteParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) {
    return { validRows: [], skippedRows: 0, errors: [], detectedFormat: format };
  }

  // 첫 행 = header (NSA: "No\t검색 키워드\t클릭\t노출\tCTR(%)" 또는 한국어 variants).
  // header 자체는 검증 안 — data row 가 5 토큰 만족하면 OK.
  const headerTokens = lines[0]!.split(delim);
  const headerLooksLikeHeader = !isNumeric(headerTokens[0]?.trim() ?? "");

  const dataLines = headerLooksLikeHeader ? lines.slice(1) : lines;

  const validRows: NaverPasteRow[] = [];
  const errors: Array<{ rowIndex: number; reason: string }> = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i]!;
    const tokens = line.split(delim).map((t) => t.trim());

    // NSA 검색 키워드 안 공백 포함 가능 (예: "병원 마케팅 에이전시") — multi-space 구분 시 토큰 5개 초과 가능
    // → 마지막 3개 (CTR · 노출 · 클릭) 가 숫자라 가정하고 역방향 추출
    const parsed = extractRowTokens(tokens);
    if (!parsed) {
      errors.push({
        rowIndex: i + 1,
        reason: `토큰 ${tokens.length}개 — 5개 (No · 검색 키워드 · 클릭 · 노출 · CTR) 필요`,
      });
      continue;
    }

    const result = NaverPasteRowSchema.safeParse({
      검색키워드: parsed.query,
      클릭: parsed.clicks,
      노출: parsed.impressions,
      CTR: parsed.ctr,
    });
    if (!result.success) {
      errors.push({
        rowIndex: i + 1,
        reason: result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join("; "),
      });
      continue;
    }
    validRows.push(result.data);
  }

  return { validRows, skippedRows: errors.length, errors, detectedFormat: format };
}

/**
 * 4~N 토큰에서 NSA TOP30 row 추출.
 *  - 마지막 3개 (클릭 · 노출 · CTR) 는 숫자 (콤마/% 정규화 후)
 *  - 5개 이상: 첫 토큰 (No) skip · 가운데 (검색 키워드) 는 나머지 토큰 합쳐서
 *    — multi-space 구분 시 공백 포함 query 정합
 *  - 정확히 4개: No 컬럼 없는 복사 (키워드 · 클릭 · 노출 · CTR)
 */
function extractRowTokens(
  tokens: string[],
): { query: string; clicks: string; impressions: string; ctr: string } | null {
  if (tokens.length < 4) return null;
  const ctr = cleanNumericToken(tokens[tokens.length - 1]!);
  const impressions = cleanNumericToken(tokens[tokens.length - 2]!);
  const clicks = cleanNumericToken(tokens[tokens.length - 3]!);
  // 마지막 3개가 숫자 형태인지 sanity check (regex)
  if (!/^\d+(\.\d+)?$/.test(clicks) || !/^\d+(\.\d+)?$/.test(impressions) || !/^\d+(\.\d+)?$/.test(ctr)) {
    return null;
  }
  // 5개 이상 = No 포함 (첫 토큰 skip) · 4개 = No 없음 (첫 토큰이 query)
  const queryTokens = tokens.length >= 5 ? tokens.slice(1, tokens.length - 3) : tokens.slice(0, 1);
  const query = queryTokens.join(" ").trim();
  if (query.length === 0) return null;
  return { query, clicks, impressions, ctr };
}

function isNumeric(s: string): boolean {
  return /^\d+$/.test(s);
}

// === parseVertical — 셀마다 줄바꿈 복사 (div 기반 표 · 2026-07-08) ===
// header 명칭 줄 제거 후, [No]·키워드·클릭·노출·CTR 5줄 (또는 No 없이 4줄) 그룹을 순차 스캔.

const HEADER_LINE_REGEX = /^(no\.?|순위|검색\s*키워드|클릭\s*수?|노출\s*수?|ctr\s*(\(%\))?|클릭률\s*(\(%\))?)$/i;

function parseVertical(text: string): PasteParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .filter((l) => !HEADER_LINE_REGEX.test(l));

  const validRows: NaverPasteRow[] = [];
  const errors: Array<{ rowIndex: number; reason: string }> = [];

  let i = 0;
  let rowIndex = 0;
  while (i < lines.length) {
    rowIndex += 1;
    // 5줄 그룹: No(정수) + 키워드 + 숫자 3개
    if (
      lines.length - i >= 5 &&
      isNumeric(cleanNumericToken(lines[i]!)) &&
      !isNumericToken(lines[i + 1]!) &&
      isNumericToken(lines[i + 2]!) &&
      isNumericToken(lines[i + 3]!) &&
      isNumericToken(lines[i + 4]!)
    ) {
      pushVerticalRow(validRows, errors, rowIndex, lines[i + 1]!, lines[i + 2]!, lines[i + 3]!, lines[i + 4]!);
      i += 5;
      continue;
    }
    // 4줄 그룹: 키워드 + 숫자 3개 (No 컬럼 미포함 복사)
    if (
      lines.length - i >= 4 &&
      !isNumericToken(lines[i]!) &&
      isNumericToken(lines[i + 1]!) &&
      isNumericToken(lines[i + 2]!) &&
      isNumericToken(lines[i + 3]!)
    ) {
      pushVerticalRow(validRows, errors, rowIndex, lines[i]!, lines[i + 1]!, lines[i + 2]!, lines[i + 3]!);
      i += 4;
      continue;
    }
    errors.push({ rowIndex, reason: `세로 형식 그룹 불일치 — "${lines[i]!.slice(0, 30)}" 부근` });
    i += 1;
  }

  return { validRows, skippedRows: errors.length, errors, detectedFormat: "vertical" };
}

function pushVerticalRow(
  validRows: NaverPasteRow[],
  errors: Array<{ rowIndex: number; reason: string }>,
  rowIndex: number,
  query: string,
  clicks: string,
  impressions: string,
  ctr: string,
): void {
  const result = NaverPasteRowSchema.safeParse({
    검색키워드: query,
    클릭: cleanNumericToken(clicks),
    노출: cleanNumericToken(impressions),
    CTR: cleanNumericToken(ctr),
  });
  if (!result.success) {
    errors.push({
      rowIndex,
      reason: result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join("; "),
    });
    return;
  }
  validRows.push(result.data);
}

// === parseHtmlTable — cheerio (site-meta-fetch 패턴) ===

function parseHtmlTable(html: string): PasteParseResult {
  const $ = cheerio.load(html);
  const rows = $("tbody tr");
  const validRows: NaverPasteRow[] = [];
  const errors: Array<{ rowIndex: number; reason: string }> = [];

  rows.each((idx, el) => {
    const cells = $(el).find("td");
    if (cells.length < 4) {
      errors.push({ rowIndex: idx + 1, reason: `td ${cells.length}개 — 4개 (No 없음) 또는 5개 필요` });
      return;
    }
    // 5셀: cells[0] = No (skip) · 1 = 검색 키워드 (wrapper div 안 텍스트) · 2 = 클릭 · 3 = 노출 · 4 = CTR
    // 4셀: No 컬럼 없는 표 — 0 = 검색 키워드 부터
    const base = cells.length >= 5 ? 1 : 0;
    const queryRaw = $(cells[base]!).text().trim();
    const clicks = cleanNumericToken($(cells[base + 1]!).text());
    const impressions = cleanNumericToken($(cells[base + 2]!).text());
    const ctr = cleanNumericToken($(cells[base + 3]!).text());

    const result = NaverPasteRowSchema.safeParse({
      검색키워드: queryRaw,
      클릭: clicks,
      노출: impressions,
      CTR: ctr,
    });
    if (!result.success) {
      errors.push({
        rowIndex: idx + 1,
        reason: result.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`).join("; "),
      });
      return;
    }
    validRows.push(result.data);
  });

  return { validRows, skippedRows: errors.length, errors, detectedFormat: "html" };
}

// === Normalize — ingestion 단계 sentinel + CTR /100 ===

export type NormalizedNaverRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;  // 0~1 (/100 변환 후)
  pageUrl: "";  // sentinel (§ 4.5)
  avgPosition: 1000;  // sentinel (§ 4.6)
};

export function normalizeRow(row: NaverPasteRow): NormalizedNaverRow {
  return {
    query: row.검색키워드,
    clicks: row.클릭,
    impressions: row.노출,
    ctr: row.CTR / 100,
    pageUrl: "",
    avgPosition: 1000,
  };
}

// === metadata builder (§ 4.4 INSERT) ===

export function buildNaverRowMetadata(referenceDate: string): {
  dataGrain: "naver-top30-cumulative";
  collectionDate: string;
  sourceWindowLabel: string;
  positionUnavailable: true;
} {
  return {
    dataGrain: "naver-top30-cumulative",
    collectionDate: referenceDate,
    sourceWindowLabel: "NSA TOP30 누적",
    positionUnavailable: true,
  };
}
