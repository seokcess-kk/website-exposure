-- @glitzy/core-content C0023b — LocationProfile release schema split
-- phone · email · latitude · longitude 안 이미 nullable (C0002 안 NULLABLE)
-- street/locality/region/postal/country 안 NOT NULL 유지 (L2 저장 차단 — entity 의 기본 정합).
-- 실 변경 없음 — 표기 만 (release schema split 패턴 적용 마커).

-- noop migration — schema 변경 없음. release-schema-split 표기 만.
SELECT 'C0023b: LocationProfile no schema change (already nullable where appropriate)' AS marker;
