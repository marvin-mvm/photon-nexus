-- =========================================================================
-- PHOTON NEXUS: THE MATA PROTOCOL (v11.0)
-- SOVEREIGN THOUGHT REGISTRY SCHEMA
-- =========================================================================

-- Enable vector extension for 9D Mirror Algorithm
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- 1. USER PROFILES TABLE (Enhanced)
-- ==========================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  api_key uuid DEFAULT gen_random_uuid() UNIQUE,
  credit_balance int DEFAULT 500,
  subscription_status text DEFAULT 'ACTIVE' CHECK (subscription_status IN ('ACTIVE', 'PAUSED', 'DELINQUENT')),
  device_signature text,
  last_heartbeat timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User manages own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- ==========================================
-- 2. ALTER EXPERIENCE TABLE (6-Lobe Logic)
-- ==========================================
ALTER TABLE experience 
  ADD COLUMN IF NOT EXISTS prompt_origin text,
  ADD COLUMN IF NOT EXISTS logic_num jsonb,
  ADD COLUMN IF NOT EXISTS logic_dyn jsonb,
  ADD COLUMN IF NOT EXISTS logic_chr jsonb,
  ADD COLUMN IF NOT EXISTS logic_spa jsonb,
  ADD COLUMN IF NOT EXISTS logic_evi jsonb,
  ADD COLUMN IF NOT EXISTS logic_mis jsonb,
  ADD COLUMN IF NOT EXISTS structural_fingerprint vector(9),
  ADD COLUMN IF NOT EXISTS consensus_winner text,
  ADD COLUMN IF NOT EXISTS evidence_density int,
  ADD COLUMN IF NOT EXISTS anchor_shard_ids bigint[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS physical_seed_label text;

-- Add CHECK constraint for consensus_winner
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'experience_consensus_winner_check'
  ) THEN
    ALTER TABLE experience ADD CONSTRAINT experience_consensus_winner_check 
      CHECK (consensus_winner IS NULL OR consensus_winner IN ('ALPHA', 'BETA', 'LEGACY'));
  END IF;
END $$;

-- Update status CHECK to include PROMOTED
ALTER TABLE experience DROP CONSTRAINT IF EXISTS experience_status_check;
ALTER TABLE experience ADD CONSTRAINT experience_status_check 
  CHECK (status IS NULL OR status IN ('ACTIVE', 'SHREDDED', 'ARCHIVED', 'PROMOTED'));

-- ==========================================
-- 3. ALTER NEXUS_MISSIONS TABLE
-- ==========================================
ALTER TABLE nexus_missions
  ADD COLUMN IF NOT EXISTS is_calibrating boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS parent_experience_id uuid REFERENCES experience(id);

-- Add CHECK constraint for status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'nexus_missions_status_check'
  ) THEN
    ALTER TABLE nexus_missions ADD CONSTRAINT nexus_missions_status_check 
      CHECK (status IS NULL OR status IN ('ACTIVE', 'COMPLETED', 'DECOMMISSIONED'));
  END IF;
END $$;

-- ==========================================
-- 4. THE 9D MIRROR ALGORITHM RPC
-- ==========================================
CREATE OR REPLACE FUNCTION match_thought_intent(
  query_vector vector(9), 
  match_threshold float8 DEFAULT 0.75, 
  match_count int DEFAULT 1
)
RETURNS TABLE (
  id uuid,
  title text,
  similarity float8,
  logic_mis jsonb,
  handover_summary text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id, 
    e.title,
    (1 - (e.structural_fingerprint <=> query_vector)) as sim,
    e.logic_mis,
    e.handover_summary
  FROM experience e
  WHERE e.status IN ('ACTIVE', 'PROMOTED')
  AND (1 - (e.structural_fingerprint <=> query_vector)) >= match_threshold
  ORDER BY sim DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- 5. UPDATED DECOMMISSION FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION decommission_session(target_session_id uuid)
RETURNS void AS $$
BEGIN
  -- Archive associated experiences (protect PROMOTED ones)
  UPDATE experience 
  SET status = 'ARCHIVED' 
  WHERE session_id = target_session_id 
  AND status != 'PROMOTED';

  -- Purge dialogue logs and mark session as decommissioned
  UPDATE nexus_missions 
  SET dialogue_logs = '[]'::jsonb, 
      status = 'DECOMMISSIONED',
      updated_at = now()
  WHERE id = target_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;