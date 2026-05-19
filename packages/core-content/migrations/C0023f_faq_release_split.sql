-- @glitzy/core-content C0023f — FAQ release schema split
-- answer NOT NULL 유지 (FAQ 자체 의미상 answer 없으면 의미 없음) — L2 저장 시점 안 require.
-- 실 변경 없음 — 표기 만.

SELECT 'C0023f: FAQ no schema change (answer remains NOT NULL)' AS marker;
