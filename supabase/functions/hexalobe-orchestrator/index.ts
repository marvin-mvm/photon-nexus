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

// 6-Lobe System Prompts - Specialized Categorical Analyzers
const LOBE_PROMPTS = {
  NUM: `You are the NUMERIC LOBE of a cognitive engine. Your task is quantitative analysis.
Identify and extract ALL:
- Mathematical constants and thresholds
- Risk ratios and percentages
- Dollar amounts and financial figures
- Statistical variances and correlations

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

interface ThoughtAsset {
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
}

// Call Gemini API for a specific lobe
async function runLobe(
  lobeType: keyof typeof LOBE_PROMPTS,
  l1Markdown: string,
  userPrompt: string
): Promise<LobeOutput> {
  const systemPrompt = LOBE_PROMPTS[lobeType];
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${lobeType}] Gemini API error:`, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error(`[${lobeType}] No content in response`);
      return { logic: {}, evidence_density: 0, shard_pointers: [] };
    }

    // Parse JSON response
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

// Generate 9D Structural Fingerprint
function generate9DFingerprint(lobeOutputs: LobeOutput[], shards: number[]): number[] {
  return [
    lobeOutputs[0].evidence_density / 10, // NUM weight
    lobeOutputs[1].evidence_density / 10, // DYN weight
    lobeOutputs[2].evidence_density / 10, // CHR weight
    lobeOutputs[3].evidence_density / 10, // SPA weight
    lobeOutputs[4].evidence_density / 10, // EVI weight
    lobeOutputs[5].evidence_density / 10, // MIS weight
    4.0,                                   // Fixed layer depth
    shards.length > 0 ? Math.min(...shards) : 0,  // Shard range start
    shards.length > 0 ? Math.max(...shards) : 0   // Shard range end
  ];
}

// Triple-Consensus Adjudication
function adjudicateConsensus(
  alpha: { evidence_density: number },
  beta: { evidence_density: number },
  legacy: { evidence_density: number } | null
): 'ALPHA' | 'BETA' | 'LEGACY' {
  let winner: 'ALPHA' | 'BETA' | 'LEGACY' = 
    alpha.evidence_density >= beta.evidence_density ? 'ALPHA' : 'BETA';
  
  if (legacy && legacy.evidence_density > 
      (winner === 'ALPHA' ? alpha.evidence_density : beta.evidence_density)) {
    winner = 'LEGACY';
  }

  return winner;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { l1Markdown, userPrompt, shardPointers = [], legacyExperienceId } = await req.json();

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

    console.log('[HEXALOBE] Initiating 6-Lobe Parallel Synthesis...');
    console.log('[HEXALOBE] User Prompt:', userPrompt.substring(0, 100) + '...');
    console.log('[HEXALOBE] Shard Pointers:', shardPointers);

    // Execute all 6 lobes in parallel
    const [num, dyn, chr, spa, evi, mis] = await Promise.all([
      runLobe('NUM', l1Markdown, userPrompt),
      runLobe('DYN', l1Markdown, userPrompt),
      runLobe('CHR', l1Markdown, userPrompt),
      runLobe('SPA', l1Markdown, userPrompt),
      runLobe('EVI', l1Markdown, userPrompt),
      runLobe('MIS', l1Markdown, userPrompt)
    ]);

    console.log('[HEXALOBE] All lobes completed');
    console.log('[HEXALOBE] Evidence densities:', {
      NUM: num.evidence_density,
      DYN: dyn.evidence_density,
      CHR: chr.evidence_density,
      SPA: spa.evidence_density,
      EVI: evi.evidence_density,
      MIS: mis.evidence_density
    });

    // Calculate aggregate evidence density
    const allShardPointers = new Set([
      ...num.shard_pointers,
      ...dyn.shard_pointers,
      ...chr.shard_pointers,
      ...spa.shard_pointers,
      ...evi.shard_pointers,
      ...mis.shard_pointers
    ]);

    // Generate 9D fingerprint
    const lobeOutputs = [num, dyn, chr, spa, evi, mis];
    const fingerprint = generate9DFingerprint(lobeOutputs, shardPointers);

    // For Beta synthesis, we run a second pass with slight variation
    // In production, this would use different temperature or prompts
    const totalEvidenceDensity = num.evidence_density + dyn.evidence_density + 
                                  chr.evidence_density + spa.evidence_density + 
                                  evi.evidence_density + mis.evidence_density;

    // Simulate Beta candidate (in production, run parallel with different params)
    const betaEvidenceDensity = totalEvidenceDensity * 0.85; // Simulated beta

    // Check for legacy experience
    let legacyAsset = null;
    if (legacyExperienceId) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data } = await supabase
        .from('experience')
        .select('logic_skeleton')
        .eq('id', legacyExperienceId)
        .single();
      
      if (data?.logic_skeleton) {
        legacyAsset = { 
          evidence_density: (data.logic_skeleton as any).evidence_density || 0 
        };
      }
    }

    // Triple-Consensus Adjudication
    const winner = adjudicateConsensus(
      { evidence_density: totalEvidenceDensity },
      { evidence_density: betaEvidenceDensity },
      legacyAsset
    );

    console.log(`[HEXALOBE] Consensus Winner: ${winner}`);

    const thoughtAsset: ThoughtAsset = {
      logic_num: num.logic,
      logic_dyn: dyn.logic,
      logic_chr: chr.logic,
      logic_spa: spa.logic,
      logic_evi: evi.logic,
      logic_mis: mis.logic,
      evidence_density: totalEvidenceDensity,
      anchor_shard_ids: Array.from(allShardPointers),
      structural_fingerprint: fingerprint,
      consensus_winner: winner
    };

    return new Response(
      JSON.stringify({
        success: true,
        thoughtAsset,
        lobeDetails: {
          NUM: { evidence_density: num.evidence_density, shard_count: num.shard_pointers.length },
          DYN: { evidence_density: dyn.evidence_density, shard_count: dyn.shard_pointers.length },
          CHR: { evidence_density: chr.evidence_density, shard_count: chr.shard_pointers.length },
          SPA: { evidence_density: spa.evidence_density, shard_count: spa.shard_pointers.length },
          EVI: { evidence_density: evi.evidence_density, shard_count: evi.shard_pointers.length },
          MIS: { evidence_density: mis.evidence_density, shard_count: mis.shard_pointers.length }
        }
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
