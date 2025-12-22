-- ==========================================
-- 1. USER INFRASTRUCTURE
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text,
  credit_balance int DEFAULT 50,
  total_prompts_executed int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 2. THE EXPERIENCE TABLE (The "Wisdom" Registry)
-- ==========================================
CREATE TABLE IF NOT EXISTS experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  session_id uuid,
  title text,
  description text,
  handover_summary text,
  logic_skeleton jsonb,
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SHREDDED', 'ARCHIVED')),
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 3. ENTROPY & SECURITY
-- ==========================================
CREATE TABLE IF NOT EXISTS photon_pool (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_payload text NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'shredded')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shred_audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  seed_id uuid,
  shredded_at timestamptz DEFAULT now(),
  signature text
);

-- ==========================================
-- 4. COGNITIVE MEMORY (EAM)
-- ==========================================
CREATE TABLE IF NOT EXISTS knowledge_shards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content_masked text NOT NULL,
  layer int DEFAULT 0,
  parent_id uuid REFERENCES knowledge_shards(id),
  seed_reference uuid REFERENCES photon_pool(id),
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 5. NEXUS_MISSIONS (The Chat Sessions)
-- ==========================================
CREATE TABLE IF NOT EXISTS nexus_missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text DEFAULT 'New Mission',
  dialogue_logs jsonb,
  context_saturation_pct int DEFAULT 0,
  current_experience_id uuid REFERENCES experience(id),
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 6. AUTOMATION & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, credit_balance)
  VALUES (new.id, new.raw_user_meta_data->>'username', 50);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 7. MANAGEMENT UTILITY: DECOMMISSION
-- ==========================================
CREATE OR REPLACE FUNCTION decommission_session(target_session_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE experience SET status = 'ARCHIVED' WHERE session_id = target_session_id;
  UPDATE nexus_missions SET dialogue_logs = '[]'::jsonb WHERE id = target_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- 8. ACCESS CONTROL (RLS)
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE photon_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_shards ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexus_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shred_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage own shards" ON knowledge_shards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own experience" ON experience FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own missions" ON nexus_missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own audit logs" ON shred_audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read photon pool" ON photon_pool FOR SELECT USING (true);

-- ==========================================
-- 9. INITIAL DEMO SEEDING
-- ==========================================
INSERT INTO photon_pool (raw_payload)
SELECT encode(gen_random_bytes(64), 'base64') FROM generate_series(1, 100);