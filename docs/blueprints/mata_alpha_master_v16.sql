-- ==========================================
-- PHOTON NEXUS: THE MATA PROTOCOL (v16.6)
-- MASTER ALPHA_TEST SCHEMA (CUMULATIVE)
-- Blueprint status: design-stage.
-- ==========================================

-- 1. TRACKING INFRASTRUCTURE
ALTER TABLE nexus_missions
ADD COLUMN IF NOT EXISTS token_count_total int DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_context_limit int DEFAULT 30000,
ADD COLUMN IF NOT EXISTS project_id uuid;

-- 2. EXPERIENCE TABLE (The Sovereign Memory)
-- Storing: Handover Tokens, Standard Mind Maps, and ULS Assets.
CREATE TABLE IF NOT EXISTS experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  session_id uuid,
  title text,
  description text,
  prompt_origin text,
  handover_summary text,

  -- The 6-Lobe Logic Chips
  logic_num jsonb, logic_dyn jsonb, logic_chr jsonb,
  logic_spa jsonb, logic_evi jsonb, logic_mis jsonb,

  -- The 9D Mirror DNA
  structural_fingerprint vector(9),
  evidence_density int DEFAULT 0,

  -- Maturation & Clustering (NEW in v16.6)
  is_domain_agnostic boolean DEFAULT false,
  parent_logic_id uuid REFERENCES experience(id), -- Points to the "Cluster Root"
  is_champion boolean DEFAULT false, -- True if this is the highest-density version

  status text DEFAULT 'PROMOTED', -- PROMOTED, SHREDDED, ARCHIVED
  created_at timestamptz DEFAULT now()
);

-- 3. FUNCTION: 9D MIRROR RECALL (88/12 Weighted + Champion Priority)
-- Similarity-weighted recall with recency decay and champion-first ordering.
CREATE OR REPLACE FUNCTION match_thought_intent_weighted(
  query_vector vector(9),
  match_threshold float,
  match_count int,
  target_user_id uuid
)
RETURNS TABLE (
  id uuid,
  description text,
  final_score float,
  is_recent boolean,
  is_champion boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.description,
    (
      (1 - (e.structural_fingerprint <=> query_vector)) * 0.88 +
      (GREATEST(0, 1 - (extract(epoch from (now() - e.created_at)) / 2592000)) * 0.12)
    ) AS final_score,
    (now() - e.created_at < interval '24 hours') as is_recent,
    e.is_champion
  FROM experience e
  WHERE e.user_id = target_user_id AND e.status = 'PROMOTED'
    AND (1 - (e.structural_fingerprint <=> query_vector)) > match_threshold
  -- EVOLUTIONARY RULE: Always prioritize Champions if logical similarity is nearly equal
  ORDER BY e.is_champion DESC, final_score DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNCTION: BCE COLLISION DETECTION (L2 ∩ L2)
CREATE OR REPLACE FUNCTION get_l2_collisions()
RETURNS TABLE (var_name text, source_shard bigint, target_shard bigint, source_text text, target_text text) AS $$
BEGIN
  RETURN QUERY
  SELECT a.var_name, a.shard_pointer, b.shard_pointer, s1.content, s2.content
  FROM l2_glossary a JOIN l2_glossary b ON a.var_name = b.var_name
  JOIN pyramid_shards s1 ON a.shard_pointer = s1.id
  JOIN pyramid_shards s2 ON b.shard_pointer = s2.id
  WHERE a.shard_pointer < b.shard_pointer AND a.user_id = b.user_id AND a.user_id = auth.uid()
    AND s1.layer_depth = 1 AND s2.layer_depth = 1
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. FUNCTION: HANDOVER RETRIEVAL
CREATE OR REPLACE FUNCTION get_latest_handover(current_project_id uuid)
RETURNS TABLE (handover_content text) AS $$
BEGIN
  RETURN QUERY
  SELECT handover_summary FROM experience e
  JOIN nexus_missions m ON e.session_id = m.id
  WHERE m.project_id = current_project_id AND e.handover_summary IS NOT NULL
  ORDER BY e.created_at DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
