-- ================================================================
-- BCMS Portal – Supabase DB 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ================================================================

-- ── 확장 ──────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. bcms_users – 사용자 프로필
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_users (
  id                 UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name       TEXT        DEFAULT '',
  industry           TEXT        DEFAULT '',
  certification_goal TEXT        DEFAULT '',
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 2. bcms_bia – BIA (업무영향분석) 데이터
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_bia (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB       DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 3. bcms_risk – 리스크 평가 데이터
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_risk (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB       DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 4. bcms_bcp – BCP 전략 데이터
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_bcp (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB       DEFAULT '[]'::jsonb,
  meta       JSONB       DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 5. bcms_training – 훈련 데이터
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_training (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB       DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 6. bcms_audit – 심사 데이터
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_audit (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data       JSONB       DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 7. bcms_user_data – 범용 키-값 저장소
--    (조직, 서비스, CAPA, 갭분석 등 기타 모든 데이터)
-- ================================================================
CREATE TABLE IF NOT EXISTS bcms_user_data (
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  key        TEXT        NOT NULL,
  value      JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, key)
);

-- ================================================================
-- RLS (Row Level Security) – 사용자별 데이터 완전 격리
-- ================================================================

ALTER TABLE bcms_users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcms_bia       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcms_risk      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcms_bcp       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcms_training  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcms_audit     ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcms_user_data ENABLE ROW LEVEL SECURITY;

-- bcms_users
CREATE POLICY "users_own_row" ON bcms_users
  FOR ALL USING (auth.uid() = id);

-- bcms_bia
CREATE POLICY "bia_own_row" ON bcms_bia
  FOR ALL USING (auth.uid() = id);

-- bcms_risk
CREATE POLICY "risk_own_row" ON bcms_risk
  FOR ALL USING (auth.uid() = id);

-- bcms_bcp
CREATE POLICY "bcp_own_row" ON bcms_bcp
  FOR ALL USING (auth.uid() = id);

-- bcms_training
CREATE POLICY "training_own_row" ON bcms_training
  FOR ALL USING (auth.uid() = id);

-- bcms_audit
CREATE POLICY "audit_own_row" ON bcms_audit
  FOR ALL USING (auth.uid() = id);

-- bcms_user_data
CREATE POLICY "user_data_own_rows" ON bcms_user_data
  FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- updated_at 자동 갱신 트리거
-- ================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bcms_users_updated_at
  BEFORE UPDATE ON bcms_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bcms_bia_updated_at
  BEFORE UPDATE ON bcms_bia
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bcms_risk_updated_at
  BEFORE UPDATE ON bcms_risk
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bcms_bcp_updated_at
  BEFORE UPDATE ON bcms_bcp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bcms_training_updated_at
  BEFORE UPDATE ON bcms_training
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bcms_audit_updated_at
  BEFORE UPDATE ON bcms_audit
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bcms_user_data_updated_at
  BEFORE UPDATE ON bcms_user_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- 인덱스
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_bcms_user_data_user_id ON bcms_user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_bcms_user_data_key     ON bcms_user_data(key);

-- ================================================================
-- 완료 메시지
-- ================================================================
SELECT 'BCMS Portal 스키마 생성 완료' AS result;
