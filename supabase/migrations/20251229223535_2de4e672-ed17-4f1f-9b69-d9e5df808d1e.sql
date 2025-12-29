-- =========================================================================
-- PHOTON NEXUS: MATA PROTOCOL v11.0.BETA MIGRATION
-- Incremental updates for Sovereign Thought Registry
-- =========================================================================

-- Phase 1: Add updated_at column to experience table
ALTER TABLE experience 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Phase 2: Create reusable auto-update trigger function
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Phase 3: Attach triggers to tables for auto-updating timestamps
DROP TRIGGER IF EXISTS update_experience_modtime ON experience;
CREATE TRIGGER update_experience_modtime
BEFORE UPDATE ON experience
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_nexus_missions_modtime ON nexus_missions;
CREATE TRIGGER update_nexus_missions_modtime
BEFORE UPDATE ON nexus_missions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Phase 4: Create HNSW Vector Index for O(1) cosine similarity search
CREATE INDEX IF NOT EXISTS experience_structural_fingerprint_idx 
ON experience USING hnsw (structural_fingerprint vector_cosine_ops);

-- Phase 5: Create L2 Glossary Registry Table
CREATE TABLE IF NOT EXISTS l2_glossary (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  var_name text NOT NULL,
  var_type text, -- 'CONSTANT', 'THRESHOLD', 'DATE'
  shard_pointer bigint NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, var_name)
);

-- Enable RLS on l2_glossary
ALTER TABLE l2_glossary ENABLE ROW LEVEL SECURITY;

-- RLS Policy for l2_glossary
DROP POLICY IF EXISTS "User owns their glossary" ON l2_glossary;
CREATE POLICY "User owns their glossary" ON l2_glossary
FOR ALL USING (auth.uid() = user_id);

-- Phase 6: Create L2 Upsert Function
CREATE OR REPLACE FUNCTION public.upsert_l2_variable(
  p_var_name TEXT, 
  p_var_type TEXT, 
  p_shard_pointer BIGINT
)
RETURNS void AS $$
BEGIN
  INSERT INTO l2_glossary (user_id, var_name, var_type, shard_pointer)
  VALUES (auth.uid(), p_var_name, p_var_type, p_shard_pointer)
  ON CONFLICT (user_id, var_name) DO UPDATE 
  SET shard_pointer = EXCLUDED.shard_pointer,
      var_type = EXCLUDED.var_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;