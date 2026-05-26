-- @glitzy/web/scripts/seed-demo-conditions.sql
-- EXPOSURE_READINESS Phase B — demo 인스턴스에 5개 conditions seed.
-- 의료 검색 유입 핵심 토픽 (산후·갱년기·복부·요요·사춘기).
-- sentinel ComplianceRecord 자동 INSERT (auto-publish-mode 정합 · 사용자 2026-05-20 결정).

DO $$
DECLARE
  v_instance_id UUID;
  v_admin_user_id UUID;
  v_treat_goodbye_id UUID;
  v_treat_postpartum_id UUID;
  v_treat_menopause_id UUID;
  v_condition_id UUID;
  v_sentinel_id UUID;
  v_seed RECORD;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-conditions: instance slug=demo 미발견.';
  END IF;

  SELECT id INTO v_admin_user_id FROM admin_user WHERE is_super_admin = true LIMIT 1;
  IF v_admin_user_id IS NULL THEN
    SELECT id INTO v_admin_user_id FROM admin_user LIMIT 1;
  END IF;
  IF v_admin_user_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-conditions: admin_user 미발견.';
  END IF;

  -- treatment_page 참조 회수 (없으면 NULL — primary_treatment_id 미설정 허용)
  SELECT id INTO v_treat_goodbye_id FROM treatment_page WHERE instance_id = v_instance_id AND slug = 'goodbye-diet' LIMIT 1;
  SELECT id INTO v_treat_postpartum_id FROM treatment_page WHERE instance_id = v_instance_id AND slug = 'postpartum-diet' LIMIT 1;
  SELECT id INTO v_treat_menopause_id FROM treatment_page WHERE instance_id = v_instance_id AND slug = 'menopause-diet' LIMIT 1;

  -- 5 conditions 정의 (slug · title · summary · body · primary_treatment_id ref)
  FOR v_seed IN
    SELECT * FROM (VALUES
      (
        'postpartum-weight-gain',
        '산후 비만 — 출산 후 빠지지 않는 체중',
        '출산 후 6~12개월 이상 지나도 체중이 회복되지 않는 상태. 호르몬 변화·수면 부족·식습관·운동 부족이 복합적으로 작용합니다. 한방에서는 산후 체질 회복을 우선합니다.',
        E'## 산후 비만의 특징\n\n출산 직후 몇 개월간의 체중 정체는 일반적인 현상이지만, 출산 후 6~12개월 이상 체중이 출산 전으로 돌아오지 않는 경우 산후 비만으로 분류합니다.\n\n### 일반 다이어트와 다른 점\n\n- 호르몬 회복 부족 (에스트로겐·프로락틴 변화)\n- 수면 부족으로 인한 코르티솔 상승\n- 골반 정렬 변화에 따른 체형 왜곡\n- 모유수유 중일 경우 무리한 감량은 부적합\n\n## 한방 접근\n\n### 1단계 · 체질 진단\n\n사상체질 + 출산 후 회복 상태 평가 (소화·수면·기력).\n\n### 2단계 · 회복 우선 처방\n\n무리한 칼로리 제한 대신 기혈 보충·소화기 회복을 먼저. 한약은 산후풍·수유 안정성을 고려해 처방.\n\n### 3단계 · 체형 회복\n\n골반 정렬·복부 탄력 회복 단계. 모유수유 종료 후 본격 감량.\n\n## 자주 묻는 질문\n\n- **모유수유 중에도 한약 가능한가요?** 산모용 한약은 수유 안정성 검증된 처방을 사용합니다. 진료 시 수유 여부를 정확히 알려 주세요.\n- **출산 후 얼마부터 시작 가능한가요?** 보통 출산 6~8주 이후 산모 회복 상태 확인 후 시작. 제왕절개·합병증 동반 시 더 늦게.',
        v_treat_postpartum_id
      ),
      (
        'menopause-weight-gain',
        '갱년기 체중 증가 — 호르몬 변화에 따른 체형 변화',
        '40대 후반~50대 여성의 에스트로겐 감소로 인한 복부 지방 축적·근육량 감소·신진대사 저하 동반 비만. 일반 다이어트가 잘 듣지 않는 특성이 있습니다.',
        E'## 갱년기 비만의 특징\n\n갱년기 호르몬 변화 (에스트로겐 감소·인슐린 저항성 상승) 가 체중 분포 자체를 바꿉니다.\n\n### 변화의 양상\n\n- 피하지방 → 내장지방 전환 (복부 비만)\n- 근육량 감소 + 기초대사량 저하\n- 수면 장애 (홍조·식은땀) → 식욕 호르몬 교란\n- 정서 변화 (우울·불안) → 식이 충동\n\n## 한방 접근\n\n### 1단계 · 호르몬 상태 평가\n\n갱년기 증후군 (홍조·우울·관절통) 동반 정도 + 사상체질 진단.\n\n### 2단계 · 갱년기 한약 + 다이어트 한약 병행\n\n갱년기 증후군 개선이 다이어트 효과의 전제. 한약 처방으로 호르몬 균형·수면·정서 회복 후 본격 감량.\n\n### 3단계 · 근육량 유지 식단\n\n극단 칼로리 제한은 근감소증 가속화. 단백질 충분 섭취 + 저강도 근력 운동 병행.\n\n## 주의사항\n\n갱년기 증상이 심한 경우 호르몬 대체 요법 (HRT) 적용 여부는 산부인과 진료가 우선. 한방 다이어트는 보완 접근입니다.',
        v_treat_menopause_id
      ),
      (
        'abdominal-obesity',
        '복부비만 — 내장지방 중심 비만',
        '체질량지수(BMI)가 정상이어도 허리둘레가 남성 90cm·여성 85cm 이상이면 복부비만. 내장지방 비중이 높아 대사질환 위험이 큽니다.',
        E'## 복부비만의 위험\n\n전체 체중보다 복부 지방의 비중이 건강에 미치는 영향이 더 큽니다.\n\n### 진단 기준\n\n- 허리둘레 남성 90cm 이상 · 여성 85cm 이상 (대한비만학회)\n- 허리/엉덩이 비율 (WHR) 남성 0.9 이상 · 여성 0.85 이상\n- 복부 CT 안 내장지방 면적 100cm² 이상\n\n### 동반 질환 위험\n\n인슐린 저항성·고혈압·이상지질혈증·지방간·심혈관계 질환.\n\n## 한방 접근\n\n### 1단계 · 체질 + 동반 질환 평가\n\n태음인 (양적 비만 경향) · 소음인 (소화 약화) 구분 + 혈압·혈당·지질 수치 확인.\n\n### 2단계 · 내장지방 표적 처방\n\n장기능 활성 + 지방 대사 촉진 한약. 약침 (복부 부위) 병행.\n\n### 3단계 · 식이 + 유산소 + 근력\n\n허리둘레는 식이 + 유산소 운동 + 근력 운동 삼각 조합이 가장 효과적.',
        v_treat_goodbye_id
      ),
      (
        'yoyo-cycle',
        '요요 반복 — 다이어트 → 재증가 → 더 늘어남',
        '식이 제한 다이어트 → 단기 감량 → 식욕 폭발 → 이전보다 체중 증가의 cycle 반복. 기초대사량 저하 + 식욕 호르몬 (렙틴·그렐린) 교란이 누적된 상태.',
        E'## 요요의 메커니즘\n\n극단 칼로리 제한 다이어트는 단기 감량 후 더 큰 체중 증가를 유발합니다.\n\n### 왜 일어나는가\n\n- **기초대사량 저하**: 칼로리 제한 시 몸이 에너지 절약 모드로 전환\n- **렙틴 저항성**: 식욕 억제 호르몬 신호가 약해짐\n- **그렐린 상승**: 식욕 자극 호르몬 분비 증가\n- **근육량 감소**: 무리한 감량은 지방 + 근육 동시 손실\n\n### 요요 반복의 누적 효과\n\n반복할수록 기초대사량은 더 낮아지고, 같은 식사량으로도 더 살이 찌는 체질로 변합니다.\n\n## 한방 접근\n\n### 1단계 · 대사 회복\n\n무리한 감량 중단 + 기혈 회복 한약. 기초대사량 정상화 우선.\n\n### 2단계 · 식욕 조절\n\n식욕 폭발의 한방 원인 (스트레스·소화 부진·수면 부족) 별 개인 처방.\n\n### 3단계 · 평생 유지 코칭\n\n극단 식이 제한 대신 평생 유지 가능한 식단·운동 패턴 정착. 3개월 사후 관리 + 다이트앱 데일리 코칭으로 요요 차단.',
        v_treat_goodbye_id
      ),
      (
        'adolescent-obesity',
        '사춘기 비만 — 성장기 체중 관리',
        '초·중·고 학생의 BMI 95 백분위수 이상. 성장기에 무리한 감량은 키 성장·호르몬 발달에 영향. 한방에서는 성장 보장 + 체형 관리 병행합니다.',
        E'## 사춘기 비만의 특수성\n\n성장기 다이어트는 성인과 완전히 다른 접근이 필요합니다.\n\n### 핵심 차이\n\n- **키 성장**: 무리한 칼로리 제한은 성장판 발달 방해\n- **호르몬 발달**: 사춘기 호르몬 (성장호르몬·성호르몬) 정상 분비 보장 필요\n- **심리적 요인**: 외모 압박·또래 관계가 식이 행동에 영향\n\n## 한방 접근\n\n### 1단계 · 성장 평가\n\n현재 키·예상 성인 키 (골 연령 검사) + 사춘기 진행 단계 확인.\n\n### 2단계 · 성장 한약 + 체형 관리 동시\n\n성장 보조 한약 (보골탕 계열) + 식이 코칭 병행. 칼로리 제한이 아닌 **식습관 교정** 중심.\n\n### 3단계 · 가족 단위 코칭\n\n부모 함께하는 식이·운동 패턴 정착. 학생 단독 다이어트는 지속 실패 + 거식·폭식 위험.\n\n## 주의사항\n\n중·고생의 BMI 95 백분위수 이상 + 동반 질환 (지방간·고혈압·전당뇨) 안에서만 적극 개입. 그 외는 식습관 + 활동량 조정으로 자연 개선 가능.',
        v_treat_goodbye_id
      )
    ) AS s(slug, title, summary, body, primary_treatment_id)
  LOOP
    -- sentinel ComplianceRecord upsert
    SELECT id INTO v_sentinel_id FROM compliance_record
     WHERE instance_id = v_instance_id
       AND content_type = 'MedicalConditionPage'::compliance_content_type
       AND content_ref = v_seed.slug
       AND metadata @> '{"sentinel":true}'::jsonb
     LIMIT 1;
    IF v_sentinel_id IS NULL THEN
      INSERT INTO compliance_record (
        instance_id, content_type, content_ref, page_risk_level,
        auto_check_result, peer_reviewer, peer_reviewed_at,
        published_at, published_by,
        record_phase, record_version, metadata
      ) VALUES (
        v_instance_id, 'MedicalConditionPage'::compliance_content_type, v_seed.slug, 'Low'::risk_level,
        '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
        v_admin_user_id, NOW(), NOW(), v_admin_user_id,
        'published'::compliance_record_phase, 1,
        '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"auto-publish-mode (review queue disabled · user 2026-05-20)"}'::jsonb
      )
      ON CONFLICT (instance_id, content_type, content_ref, record_version)
      DO UPDATE SET updated_at = NOW()
      RETURNING id INTO v_sentinel_id;
    END IF;

    -- medical_condition_page upsert
    INSERT INTO medical_condition_page (
      instance_id, slug, title, summary, body_markdown, status,
      risk_level, compliance_record_id, primary_treatment_id, published_at
    ) VALUES (
      v_instance_id, v_seed.slug, v_seed.title, v_seed.summary, v_seed.body, 'published'::content_publication_status,
      'Low'::risk_level, v_sentinel_id, v_seed.primary_treatment_id::uuid, NOW()
    )
    ON CONFLICT (instance_id, slug) DO UPDATE SET
      title = EXCLUDED.title,
      summary = EXCLUDED.summary,
      body_markdown = EXCLUDED.body_markdown,
      primary_treatment_id = EXCLUDED.primary_treatment_id,
      compliance_record_id = EXCLUDED.compliance_record_id,
      updated_at = NOW();

    RAISE NOTICE 'condition seeded: slug=% title=% primary_treatment_id=%', v_seed.slug, v_seed.title, v_seed.primary_treatment_id;
  END LOOP;

  RAISE NOTICE 'seed-demo-conditions: 5 conditions ready in demo instance';
END $$;
