// extractFaqPairsFromMarkdown — 아티클 본문 FAQ block → FAQPage JSON-LD 파서
// CONTENT_AI_DRAFT 프롬프트 강제 구조 (`## 자주 묻는 질문` + `### Q. <질문>` + 답변 50~150자) 정합.

import { describe, it, expect } from "vitest";
import { extractFaqPairsFromMarkdown } from "./markdown";

const FULL_MD = `다이어트 한약이란 체질에 맞춘 처방으로 대사를 돕는 치료입니다. 핵심은 개인 맞춤입니다.

## 다이어트 한약의 원리

기초 대사량과 체질 진단이 중심입니다.

- 항목 하나
- 항목 둘

## 자주 묻는 질문

### Q. 다이어트 한약은 안전한가요?

체질에 맞춰 처방하면 일반적으로 안전합니다. 복용 전 의료진 상담이 권장됩니다.

### Q. 복용 기간은 얼마나 되나요?

보통 4~12주가 권장되며 개인별로 다릅니다.

정리하면, 다이어트 한약은 체질 진단이 선행되어야 합니다.`;

describe("extractFaqPairsFromMarkdown", () => {
  it("FAQ 섹션의 Q&A 쌍 추출 + 'Q.' prefix 제거", () => {
    const pairs = extractFaqPairsFromMarkdown(FULL_MD);
    expect(pairs).toHaveLength(2);
    expect(pairs[0]!.question).toBe("다이어트 한약은 안전한가요?");
    expect(pairs[0]!.answer).toContain("일반적으로 안전합니다");
    expect(pairs[1]!.question).toBe("복용 기간은 얼마나 되나요?");
  });

  it("FAQ 뒤 conclusion 문단은 마지막 답변에 흡수되지 않음", () => {
    const pairs = extractFaqPairsFromMarkdown(FULL_MD);
    expect(pairs[1]!.answer).not.toContain("정리하면");
  });

  it("FAQ 섹션 밖 H3 는 무시", () => {
    const md = "## 일반 섹션\n\n### 소제목\n\n내용.\n\n## 자주 묻는 질문\n\n### Q. 질문?\n\n답변.";
    const pairs = extractFaqPairsFromMarkdown(md);
    expect(pairs).toHaveLength(1);
    expect(pairs[0]!.question).toBe("질문?");
  });

  it("FAQ 섹션 없으면 []", () => {
    expect(extractFaqPairsFromMarkdown("## 일반\n\n내용.")).toEqual([]);
  });

  it("답변 markdown 은 plain text 로 변환", () => {
    const md = "## 자주 묻는 질문\n\n### Q. 질문?\n\n**굵은** 답변 [링크](/daeatdiet-incheon/insights) 포함.";
    const pairs = extractFaqPairsFromMarkdown(md);
    expect(pairs[0]!.answer).toBe("굵은 답변 링크 포함.");
  });

  it("질문도 plain text 로 변환 (link/HTML strip) + Q1./Q: prefix 대응", () => {
    const md =
      "## 자주 묻는 질문\n\n### Q1. [다이어트 한약](/x) 은 <b>안전</b>한가요?\n\n네, 일반적으로 안전합니다.";
    const pairs = extractFaqPairsFromMarkdown(md);
    expect(pairs[0]!.question).toBe("다이어트 한약 은 안전한가요?");
  });
});
