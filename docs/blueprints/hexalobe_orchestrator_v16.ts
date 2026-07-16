/**
 * PHOTON NEXUS: THE MATA PROTOCOL (v16.6)
 * CONSOLIDATED EDGE ORCHESTRATOR
 *
 * IMPLEMENTS: 85% Handover + 12% Recency + 9D Mirror + Champion Priority
 * Blueprint status: design-stage — successor to the deployed v13.1 function.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { userPrompt, mission_id, project_id, current_vector, user_id } = await req.json();

  // 1. RECALL PHASE: Sequential Handover + Champion-Prioritized Mirror
  const [handover, mirrors] = await Promise.all([
    supabase.rpc('get_latest_handover', { current_project_id: project_id }),
    supabase.rpc('match_thought_intent_weighted', {
      query_vector: current_vector || [0,0,0,0,0,0,0,0,0],
      match_threshold: 0.7, match_count: 3, target_user_id: user_id
    })
  ]);

  // 2. SYSTEM MANDATE: Re-Anchoring, Recency, and symbolic-role symmetry
  const systemInstruction = `
    JUDICIAL ROLE: You are the Mata Protocol Logic Architect.

    A. RE-ANCHORING (Handover):
    Current State: ${handover.data?.[0]?.handover_content || "First turn."}

    B. HISTORICAL MIRROR (Evolutionary Wisdom):
    - Priority Logic (Champions): ${mirrors.data?.filter(m => m.is_champion).map(m => m.description).join(" | ")}
    - Historical Context: ${mirrors.data?.filter(m => !m.is_champion).map(m => m.description).join(" | ")}

    C. SYMBOLIC MANDATE (ULS Creation):
    Use [VARIABLE_X] instead of specific names for Logic Chips to ensure domain-agnostic growth.
  `;

  // 3. SYNTHESIS: Generate Content
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    })
  });

  const result = await response.json();
  const tokensUsed = result.usageMetadata?.totalTokenCount || 0;

  // 4. TELEMETRY: Saturation & Evolutionary Tracking
  const { data: mStats } = await supabase.from('nexus_missions').select('token_count_total, max_context_limit').eq('id', mission_id).single();
  const newTotal = (mStats?.token_count_total || 0) + tokensUsed;
  await supabase.from('nexus_missions').update({ token_count_total: newTotal }).eq('id', mission_id);

  const saturation = newTotal / (mStats?.max_context_limit || 30000);

  return new Response(JSON.stringify({
    answer: result.candidates[0].content.parts[0].text,
    telemetry: {
      saturation: saturation,
      re_anchor_required: saturation >= 0.85
    }
  }), { headers: { "Content-Type": "application/json" } });
});
