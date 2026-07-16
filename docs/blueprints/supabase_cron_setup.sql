-- ==========================================
-- PHOTON NEXUS: THE MATA PROTOCOL (v14.3)
-- AUTOMATING THE SUBCONSCIOUS (BCE CRON)
-- Blueprint status: design-stage.
-- ==========================================

-- Requirement: pg_net extension enabled in Supabase
-- This schedules the BCE Edge Function to run every hour.

-- 1. Create a job to ping the BCE Agent
SELECT
  cron.schedule(
    'bce-maturation-cycle', -- unique job name
    '0 * * * *',           -- every hour (standard cron syntax)
    $$
    SELECT
      net.http_post(
        url:='https://[YOUR_PROJECT_ID].supabase.co/functions/v1/hexalobe-orchestrator',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer [SERVICE_ROLE_KEY]"}'::jsonb,
        body:='{"action": "BCE_MATURATION_CYCLE"}'::jsonb
      );
    $$
  );

-- 2. Verify job status
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- COMMENTARY:
-- Runs the background discovery and enrichment loops on a schedule,
-- populating the experience table with cross-chunk links while the user is offline.
