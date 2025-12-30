import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface ExperienceInsert {
  session_id: string;
  title: string;
  description?: string;
  handover_summary: string;
  logic_skeleton?: Json;
  status?: 'ACTIVE' | 'SHREDDED' | 'ARCHIVED';
}

export interface ThoughtAsset {
  logic_num: Record<string, unknown>;
  logic_dyn: Record<string, unknown>;
  logic_chr: Record<string, unknown>;
  logic_spa: Record<string, unknown>;
  logic_evi: Record<string, unknown>;
  logic_mis: Record<string, unknown>;
  evidence_density: number;
  anchor_shard_ids: number[];
  structural_fingerprint: number[];
  consensus_winner: 'ALPHA' | 'BETA' | 'LEGACY';
  handover_summary?: string;
  reasoning?: string;
}

export interface LobeDetails {
  NUM: { evidence_density: number; shard_count: number };
  DYN: { evidence_density: number; shard_count: number };
  CHR: { evidence_density: number; shard_count: number };
  SPA: { evidence_density: number; shard_count: number };
  EVI: { evidence_density: number; shard_count: number };
  MIS: { evidence_density: number; shard_count: number };
}

export interface SynthesisResult {
  success: boolean;
  thoughtAsset: ThoughtAsset;
  lobeDetails: LobeDetails;
  verdict?: {
    winner: 'ALPHA' | 'BETA' | 'LEGACY';
    reasoning: string;
    handover_summary: string;
  };
  legacyShredded?: string | null;
}

export function useSupabaseSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new mission session
  const createSession = useCallback(async (title: string = 'New Mission'): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For demo mode without auth, return a local session ID
        return `demo-session-${Date.now()}`;
      }

      const { data, error: insertError } = await supabase
        .from('nexus_missions')
        .insert({
          user_id: user.id,
          title,
          context_saturation_pct: 0,
          dialogue_logs: []
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      return data?.id || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update context saturation for a session
  const updateSaturation = useCallback(async (sessionId: string, saturationPct: number): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Skip DB update in demo mode

      await supabase
        .from('nexus_missions')
        .update({ context_saturation_pct: saturationPct })
        .eq('id', sessionId);
    } catch (err) {
      console.error('Failed to update saturation:', err);
    }
  }, []);

  // Archive session to experience table
  const archiveToExperience = useCallback(async (
    sessionId: string,
    title: string,
    handoverSummary: string,
    logicSkeleton?: Json
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Demo mode - return fake experience ID
        return `demo-exp-${Date.now()}`;
      }

      const { data, error: insertError } = await supabase
        .from('experience')
        .insert([{
          user_id: user.id,
          session_id: sessionId,
          title,
          handover_summary: handoverSummary,
          logic_skeleton: logicSkeleton,
          status: 'ACTIVE'
        }])
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Link experience to the session
      if (data?.id) {
        await supabase
          .from('nexus_missions')
          .update({ current_experience_id: data.id })
          .eq('id', sessionId);
      }

      return data?.id || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive to experience');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Decommission a session (archive and clean up)
  const decommissionSession = useCallback(async (sessionId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('decommission_session', { target_session_id: sessionId });
    } catch (err) {
      console.error('Failed to decommission session:', err);
    }
  }, []);

  // Get shard count from knowledge_shards
  const getShardCount = useCallback(async (): Promise<number> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error: countError } = await supabase
        .from('knowledge_shards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) throw countError;
      return count || 0;
    } catch (err) {
      console.error('Failed to get shard count:', err);
      return 0;
    }
  }, []);

  // Insert experience directly
  const insertExperience = useCallback(async (experience: ExperienceInsert): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return `demo-exp-${Date.now()}`;
      }

      const { data, error: insertError } = await supabase
        .from('experience')
        .insert([{
          user_id: user.id,
          session_id: experience.session_id,
          title: experience.title,
          description: experience.description,
          handover_summary: experience.handover_summary,
          logic_skeleton: experience.logic_skeleton,
          status: experience.status || 'ACTIVE'
        }])
        .select('id')
        .single();

      if (insertError) throw insertError;
      return data?.id || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert experience');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user credits from profiles
  const getUserCredits = useCallback(async (): Promise<number> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 50; // Default demo credits

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      return data?.credit_balance || 50;
    } catch (err) {
      console.error('Failed to get user credits:', err);
      return 50;
    }
  }, []);

  // Hexalobe Orchestrator - Synthesize Thought Asset via 6-Lobe parallel processing
  const synthesizeThought = useCallback(async (
    l1Markdown: string,
    userPrompt: string,
    shardPointers: number[] = [],
    legacyExperienceId?: string,
    fingerprint?: number[]
  ): Promise<SynthesisResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('hexalobe-orchestrator', {
        body: { 
          l1Markdown, 
          userPrompt, 
          shardPointers, 
          legacyExperienceId,
          current_fingerprint: fingerprint || []
        }
      });

      if (invokeError) throw invokeError;
      if (!data?.success) throw new Error(data?.error || 'Synthesis failed');

      return data as SynthesisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to synthesize thought';
      setError(errorMessage);
      console.error('Synthesis error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createSession,
    updateSaturation,
    archiveToExperience,
    decommissionSession,
    getShardCount,
    insertExperience,
    getUserCredits,
    synthesizeThought,
  };
}
