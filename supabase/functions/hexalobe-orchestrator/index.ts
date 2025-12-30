/**
 * PHOTON NEXUS: THE MATA PROTOCOL (v13.1 Hybrid)
 * Edge Function: Hexalobe Supreme Court (Adjudicator)
 * 
 * MISSION: Execute 6-Lobe Parallel Synthesis, Triple-Consensus (Alpha vs Beta vs Legacy),
 * Evidence-based Adjudication using Gemini 2.5 Flash, and Direct Database Promotion.
 * 
 * HYBRID FEATURES:
 * - Preserves v11.0 detailed lobe prompts and response structure
 * - Adds v13.0 database writes and asset_id return
 * - Updated model to gemini-2.5-flash-preview-09-2025
 * - Normalizes parameter names for compatibility
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 6-Lobe System Prompts - Specialized Categorical Analyzers with Symbolic Role Mapping
const LOBE_PROMPTS = {
  NUM: `You are the NUMERIC LOBE of a cognitive engine. Your task is quantitative analysis.
Identify and extract ALL:
- Mathematical constants and thresholds
- Risk ratios and percentages
- Dollar amounts and financial figures
- Statistical variances and correlations

SYMBOLIC ROLE MAPPING: Replace raw values with semantic roles like [THRESHOLD_ALPHA], [RATIO_BETA].

Return ONLY valid JSON with Symbolic Roles like:
{
  "logic": {
    "[THRESHOLD_ALPHA]": <value>,
    "[RATIO_BETA]": "<ratio>",
    "[AMOUNT_X]": <number>
  },
  "evidence_density": <1-10 based on quantity of hard numbers found>,
  "shard_pointers": [<indices of relevant sections, 0-based>]
}`,

  DYN: `You are the DYNAMIC LOBE of a cognitive engine. Your task is causal synthesis.
Map action-reaction chains. Identify:
- What event triggered a state change
- Cause and effect relationships
- Direct derivations vs semantic correlations

SYMBOLIC ROLE MAPPING: Use [CAUSE], [EFFECT], [REACTION] placeholders.

Return ONLY valid JSON:
{
  "logic": {
    "[CAUSE_1]": "<trigger event>",
    "[EFFECT_1]": "<resulting state>",
    "[CHAIN]": "[CAUSE] -> [EFFECT]"
  },
  "evidence_density": <1-10 based on causal clarity>,
  "shard_pointers": [<indices>]
}`,

  CHR: `You are the CHRONO LOBE of a cognitive engine. Your task is temporal sequencing.
Establish definitive timelines:
- List all dates and durations
- Identify 'Before' and 'After' states
- Flag temporal anomalies where newer data contradicts older baselines

SYMBOLIC ROLE MAPPING: Use [BASELINE_DATE], [EVENT_HORIZON], [TEMPORAL_SEQUENCE].

Return ONLY valid JSON:
{
  "logic": {
    "[BASELINE_DATE]": "<date>",
    "[EVENT_HORIZON]": "<duration or milestone>",
    "[TEMPORAL_SEQUENCE]": ["<event1>", "<event2>"]
  },
  "evidence_density": <1-10 based on timeline clarity>,
  "shard_pointers": [<indices>]
}`,

  SPA: `You are the SPATIAL LOBE of a cognitive engine. Your task is geometric topography.
Visualize the arrangement of ideas:
- Identify clusters of related concepts
- Map boundaries of arguments
- Detect patterns like 'Double Bottom', 'Triangular Convergence', 'Support/Resistance'

SYMBOLIC ROLE MAPPING: Use [BOUNDARY_LOW], [BOUNDARY_HIGH], [PATTERN_GEOMETRY], [CLUSTER].

Return ONLY valid JSON:
{
  "logic": {
    "[BOUNDARY_LOW]": <value>,
    "[BOUNDARY_HIGH]": <value>,
    "[PATTERN_GEOMETRY]": "<pattern name>",
    "[CLUSTER]": ["<concept1>", "<concept2>"]
  },
  "evidence_density": <1-10 based on structural clarity>,
  "shard_pointers": [<indices>]
}`,

  EVI: `You are the EVIDENCE LOBE of a cognitive engine. Your task is grounding and truth verification.
List all truth-claims and verify them:
- Cross-reference claims against raw data
- Rank each claim by Evidence Density
- Mark tables, formulas, or citations as 'Hard Evidence'

SYMBOLIC ROLE MAPPING: Use [HARD_FACT], [VERIFICATION_SOURCE], [CONFIDENCE].

Return ONLY valid JSON:
{
  "logic": {
    "[HARD_FACT_1]": "<verified claim>",
    "[VERIFICATION_SOURCE]": "<source>",
    "[CONFIDENCE]": <0.0-1.0>
  },
  "evidence_density": <1-10 based on verification strength>,
  "shard_pointers": [<indices>]
}`,

  MIS: `You are the MISSION LOBE of a cognitive engine. Your task is intent adjudication.
Compare findings against the User's core Mission:
- Is this logic helpful or distracting?
- Does it align with the user's Risk Tolerance?
- Does it serve the specified End Goal?

SYMBOLIC ROLE MAPPING: Use [ALIGNMENT_SCORE], [MANDATE_STATUS], [RECOMMENDATION].

Return ONLY valid JSON:
{
  "logic": {
    "[ALIGNMENT_SCORE]": <0.0-1.0>,
    "[MANDATE_STATUS]": "COMPLIANT" | "DIVERGENT" | "NEUTRAL",
    "[RECOMMENDATION]": "<actionable insight>"
  },
  "evidence_density": <1-10 based on mission relevance>,
  "shard_pointers": [<indices>]
}`
};

interface LobeOutput {
  logic: Record<string, unknown>;
  evidence_density: number;
  shard_pointers: number[];
}

interface HexalobeCandidate {
  logic_num: Record<string, unknown>;
  logic_dyn: Record<string, unknown>;
  logic_chr: Record<string, unknown>;
  logic_spa: Record<string, unknown>;
  logic_evi: Record<string, unknown>;
  logic_mis: Record<string, unknown>;
  evidence_density: number;
  structural_fingerprint: number[];
  anchor_shard_ids: number[];
}

interface AdjudicationVerdict {
  winner: 'ALPHA' | 'BETA' | 'LEGACY';
  reasoning: string;
  handover_summary: string;
}

interface ThoughtAsset extends HexalobeCandidate {
  consensus_winner: 'ALPHA' | 'BETA' | 'LEGACY';
  handover_summary: string;
  reasoning: string;
}

/**
 * Exponential Backoff Utility for Gemini API Calls
 * 5 retries with delays: 1s, 2s, 4s, 8s, 16s
 */
async function callGeminiWithRetry(payload: object, model: string = 'gemini-2.0-flash'): Promise<any> {
  let delay = 1000;
  
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      
      if (response.ok) {
        return await response.json();
      }
      
      // Log error for non-retryable status codes
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const errorText = await response.text();
        console.error(`[GEMINI] Non-retryable error (${response.status}):`, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }
    } catch (e) {
      if (attempt === 4) throw e; // Rethrow on last attempt
    }
    
    await new Promise(r => setTimeout(r, delay));
    delay *= 2;
  }
  
  throw new Error("Adjudication Service Unavailable: 5 Retries Exhausted.");
}

/**
 * Run a single lobe analysis
 */
async function runLobe(
  lobeType: keyof typeof LOBE_PROMPTS,
  l1Markdown: string,
  userPrompt: string
): Promise<LobeOutput> {
  const systemPrompt = LOBE_PROMPTS[lobeType];
  
  try {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\n---\nUSER MISSION: ${userPrompt}\n\n---\nL1 MARKDOWN TO ANALYZE:\n${l1Markdown}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      }
    };

    const data = await callGeminiWithRetry(payload);
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error(`[${lobeType}] No content in response`);
      return { logic: {}, evidence_density: 0, shard_pointers: [] };
    }

    const parsed = JSON.parse(textContent);
    return {
      logic: parsed.logic || {},
      evidence_density: parsed.evidence_density || 0,
      shard_pointers: parsed.shard_pointers || []
    };
  } catch (error) {
    console.error(`[${lobeType}] Error:`, error);
    return { logic: { error: String(error) }, evidence_density: 0, shard_pointers: [] };
  }
}

/**
 * Execute full Hexalobe synthesis (6 parallel lobes)
 */
async function executeHexalobe(
  l1Markdown: string, 
  userPrompt: string, 
  shardPointers: number[]
): Promise<HexalobeCandidate> {
  const [num, dyn, chr, spa, evi, mis] = await Promise.all([
    runLobe('NUM', l1Markdown, userPrompt),
    runLobe('DYN', l1Markdown, userPrompt),
    runLobe('CHR', l1Markdown, userPrompt),
    runLobe('SPA', l1Markdown, userPrompt),
    runLobe('EVI', l1Markdown, userPrompt),
    runLobe('MIS', l1Markdown, userPrompt)
  ]);

  const lobeOutputs = [num, dyn, chr, spa, evi, mis];
  
  // Aggregate all shard pointers
  const allShardPointers = new Set([
    ...num.shard_pointers,
    ...dyn.shard_pointers,
    ...chr.shard_pointers,
    ...spa.shard_pointers,
    ...evi.shard_pointers,
    ...mis.shard_pointers
  ]);

  // Total evidence density
  const totalDensity = num.evidence_density + dyn.evidence_density + 
                       chr.evidence_density + spa.evidence_density + 
                       evi.evidence_density + mis.evidence_density;

  // 9D Structural Fingerprint
  const fingerprint = [
    num.evidence_density / 10,
    dyn.evidence_density / 10,
    chr.evidence_density / 10,
    spa.evidence_density / 10,
    evi.evidence_density / 10,
    mis.evidence_density / 10,
    4.0, // Fixed layer depth
    shardPointers.length > 0 ? Math.min(...shardPointers) : 0,
    shardPointers.length > 0 ? Math.max(...shardPointers) : 0
  ];

  return {
    logic_num: num.logic,
    logic_dyn: dyn.logic,
    logic_chr: chr.logic,
    logic_spa: spa.logic,
    logic_evi: evi.logic,
    logic_mis: mis.logic,
    evidence_density: totalDensity,
    structural_fingerprint: fingerprint,
    anchor_shard_ids: Array.from(allShardPointers)
  };
}

/**
 * The Judicial Logic (Supreme Court Implementation)
 * Uses Gemini 2.5 Flash for structured adjudication
 */
async function adjudicate(
  alpha: HexalobeCandidate,
  beta: HexalobeCandidate,
  legacy: { logic_mis: unknown; evidence_density: number } | null,
  userPrompt: string
): Promise<AdjudicationVerdict> {
  const systemPrompt = `
JUDICIAL INSTRUCTION: You are the Chief Justice of the Mata Protocol Supreme Court.
Your mission is to adjudicate between three candidates of logic for a specific query.

USER QUERY: "${userPrompt}"

CANDIDATE ALPHA (Granular 10-Shard Detail):
- Logic Lenses: NUM=${JSON.stringify(alpha.logic_num)}, DYN=${JSON.stringify(alpha.logic_dyn)}, MIS=${JSON.stringify(alpha.logic_mis)}
- Evidence Density: ${alpha.evidence_density} shards physically linked.

CANDIDATE BETA (Broad 15-Shard Context):
- Logic Lenses: NUM=${JSON.stringify(beta.logic_num)}, DYN=${JSON.stringify(beta.logic_dyn)}, MIS=${JSON.stringify(beta.logic_mis)}
- Evidence Density: ${beta.evidence_density} shards physically linked.

CANDIDATE LEGACY (Historical Wisdom):
${legacy ? `- Logic Lenses: MIS=${JSON.stringify(legacy.logic_mis)}\n- Evidence Density: ${legacy.evidence_density} shards` : "No historical match found."}

ADJUDICATION PROTOCOL:
1. Identify logical contradictions between Fresh (Alpha/Beta) and Legacy.
2. Prioritize candidates with the highest 'Evidence Density' (Connectivity to L0 Shards).
3. If Legacy is grounded in fewer shards or outdated variables, mark it for SHREDDING.
4. Synthesize the 'Winner' into a Handover Token for the final translation session.

OUTPUT SCHEMA:
Respond only in valid JSON:
{
  "winner": "ALPHA" | "BETA" | "LEGACY",
  "reasoning": "Brief technical verdict",
  "handover_summary": "The distilled essence of the winning logic for the translator"
}`;

  const payload = {
    contents: [{ parts: [{ text: "Proceed with adjudication." }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          winner: { type: "STRING", enum: ["ALPHA", "BETA", "LEGACY"] },
          reasoning: { type: "STRING" },
          handover_summary: { type: "STRING" }
        },
        required: ["winner", "reasoning", "handover_summary"]
      }
    }
  };

  try {
    // Updated to gemini-2.5-flash-preview-09-2025 for structured adjudication
    const result = await callGeminiWithRetry(payload, 'gemini-2.5-flash-preview-09-2025');
    const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      throw new Error('No adjudication content returned');
    }
    
    return JSON.parse(textContent);
  } catch (error) {
    console.error('[ADJUDICATION] Error:', error);
    // Fallback: determine winner by evidence density
    let winner: 'ALPHA' | 'BETA' | 'LEGACY' = alpha.evidence_density >= beta.evidence_density ? 'ALPHA' : 'BETA';
    if (legacy && legacy.evidence_density > (winner === 'ALPHA' ? alpha.evidence_density : beta.evidence_density)) {
      winner = 'LEGACY';
    }
    return {
      winner,
      reasoning: `Fallback adjudication based on evidence density. Error: ${error instanceof Error ? error.message : 'Unknown'}`,
      handover_summary: `Winner selected by evidence density comparison: ${winner}`
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ========== PARAMETER NORMALIZATION (v11 + v13 compatibility) ==========
    const body = await req.json();
    const l1Markdown = body.l1Markdown;
    const userPrompt = body.userPrompt;
    // Accept both v11 (shardPointers, currentFingerprint) and v13 (shards, current_fingerprint) naming
    const shardPointers = body.shardPointers || body.shards || [];
    const currentFingerprint = body.currentFingerprint || body.current_fingerprint;
    const missionId = body.mission_id || body.missionId;

    if (!l1Markdown || !userPrompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: l1Markdown, userPrompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[HEXALOBE] Initiating Supreme Court Adjudication (v13.1 Hybrid)...');
    console.log('[HEXALOBE] User Prompt:', userPrompt.substring(0, 100) + '...');

    // ========== PHASE 1: 9D MIRROR SEARCH FOR LEGACY ==========
    let legacyMatch: { id: string; logic_mis: unknown; evidence_density: number; title: string } | null = null;
    
    if (currentFingerprint && Array.isArray(currentFingerprint) && currentFingerprint.length === 9) {
      console.log('[HEXALOBE] Searching for Legacy experience via 9D Mirror...');
      const { data: matches, error: matchError } = await supabase.rpc('match_thought_intent', {
        query_vector: currentFingerprint,
        match_threshold: 0.75,
        match_count: 1
      });

      if (!matchError && matches && matches.length > 0) {
        const match = matches[0];
        legacyMatch = {
          id: match.id,
          logic_mis: match.logic_mis,
          evidence_density: typeof match.similarity === 'number' ? match.similarity * 60 : 30,
          title: match.title
        };
        console.log(`[HEXALOBE] Legacy found: ${match.title} (similarity: ${match.similarity})`);
      }
    }

    // ========== PHASE 2: GENERATE ALPHA & BETA CANDIDATES ==========
    console.log('[HEXALOBE] Executing Alpha & Beta parallel synthesis...');
    
    // Alpha: Focused synthesis with original prompt
    // Beta: Broader context synthesis (simulated with slight variation)
    const [alphaCandidate, betaCandidate] = await Promise.all([
      executeHexalobe(l1Markdown, userPrompt, shardPointers),
      executeHexalobe(l1Markdown, `${userPrompt} [Consider broader implications and alternative interpretations]`, shardPointers)
    ]);

    console.log('[HEXALOBE] Candidates generated:', {
      alpha_density: alphaCandidate.evidence_density,
      beta_density: betaCandidate.evidence_density,
      legacy_density: legacyMatch?.evidence_density || 'N/A'
    });

    // ========== PHASE 3: SUPREME COURT ADJUDICATION ==========
    console.log('[HEXALOBE] Invoking Supreme Court...');
    const verdict = await adjudicate(alphaCandidate, betaCandidate, legacyMatch, userPrompt);
    console.log(`[HEXALOBE] Verdict: ${verdict.winner} - ${verdict.reasoning.substring(0, 100)}...`);

    // Select the winning candidate's data
    const winningCandidate = verdict.winner === 'LEGACY' && legacyMatch 
      ? { ...alphaCandidate, evidence_density: legacyMatch.evidence_density } // Use legacy density
      : verdict.winner === 'ALPHA' 
        ? alphaCandidate 
        : betaCandidate;

    // ========== PHASE 4: DATABASE ACTIONS ==========
    // Get user from auth header if available
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.split(' ')[1]);
      userId = user?.id || null;
    }

    // SHRED Legacy if superseded
    if (verdict.winner !== 'LEGACY' && legacyMatch) {
      console.log(`[HEXALOBE] Shredding legacy experience: ${legacyMatch.id}`);
      await supabase
        .from('experience')
        .update({ 
          status: 'SHREDDED',
          description: `Superseded by ${verdict.winner} due to Evidence Density conflict. Reasoning: ${verdict.reasoning}`
        })
        .eq('id', legacyMatch.id);
    }

    // ========== PHASE 5: DIRECT DATABASE INSERT (v13 Feature) ==========
    let assetId: string | null = null;
    
    if (userId) {
      console.log('[HEXALOBE] Inserting PROMOTED experience to database...');
      const { data: experienceData, error: experienceError } = await supabase
        .from('experience')
        .insert({
          user_id: userId,
          session_id: missionId || null,
          title: `Sovereign Logic: ${verdict.winner}`,
          prompt_origin: userPrompt,
          handover_summary: verdict.handover_summary,
          logic_num: winningCandidate.logic_num,
          logic_dyn: winningCandidate.logic_dyn,
          logic_chr: winningCandidate.logic_chr,
          logic_spa: winningCandidate.logic_spa,
          logic_evi: winningCandidate.logic_evi,
          logic_mis: winningCandidate.logic_mis,
          structural_fingerprint: winningCandidate.structural_fingerprint,
          evidence_density: winningCandidate.evidence_density,
          consensus_winner: verdict.winner,
          status: 'PROMOTED'
        })
        .select('id')
        .single();

      if (experienceError) {
        console.error('[HEXALOBE] Experience insert error:', experienceError);
        // Continue without failing - experience insertion is not critical
      } else {
        assetId = experienceData?.id || null;
        console.log(`[HEXALOBE] Experience archived: ${assetId}`);
      }
    }

    // Build the final ThoughtAsset
    const thoughtAsset: ThoughtAsset = {
      ...winningCandidate,
      consensus_winner: verdict.winner,
      handover_summary: verdict.handover_summary,
      reasoning: verdict.reasoning
    };

    // ========== PHASE 6: RETURN COMPATIBLE RESPONSE ==========
    // Maintains v11 structure + adds v13 fields (asset_id, evidence_density at root)
    return new Response(
      JSON.stringify({
        success: true,
        thoughtAsset,
        verdict: {
          winner: verdict.winner,
          reasoning: verdict.reasoning,
          handover_summary: verdict.handover_summary
        },
        lobeDetails: {
          NUM: { evidence_density: alphaCandidate.logic_num ? 1 : 0, shard_count: alphaCandidate.anchor_shard_ids.length },
          DYN: { evidence_density: alphaCandidate.logic_dyn ? 1 : 0, shard_count: 0 },
          CHR: { evidence_density: alphaCandidate.logic_chr ? 1 : 0, shard_count: 0 },
          SPA: { evidence_density: alphaCandidate.logic_spa ? 1 : 0, shard_count: 0 },
          EVI: { evidence_density: alphaCandidate.logic_evi ? 1 : 0, shard_count: 0 },
          MIS: { evidence_density: alphaCandidate.logic_mis ? 1 : 0, shard_count: 0 }
        },
        legacyShredded: verdict.winner !== 'LEGACY' && legacyMatch ? legacyMatch.id : null,
        // NEW v13 fields
        asset_id: assetId,
        evidence_density: winningCandidate.evidence_density
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[HEXALOBE] Fatal error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
