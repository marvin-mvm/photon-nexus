import { LobeType } from '@/types/photon';

export interface DemoStep {
  delay: number;
  lobe: LobeType;
  message: string;
  action?: 'addShards' | 'consumeEntropy' | 'conflict' | 'shred' | 'promote' | 'activateLobe' | 'deactivateLobe';
  actionData?: any;
}

export const N_BODY_DEMO_SEQUENCE: DemoStep[] = [
  // Phase 1: Mission Initialization
  { delay: 500, lobe: 'MIS', message: 'MISSION RECEIVED: N-Body Stability Analysis' },
  { delay: 800, lobe: 'MIS', message: 'Target: 3-body gravitational system with perturbation vectors', action: 'activateLobe', actionData: ['MIS'] },
  { delay: 600, lobe: 'CHR', message: 'Temporal context loaded: 2025-Q4 orbital mechanics dataset', action: 'activateLobe', actionData: ['MIS', 'CHR'] },
  { delay: 400, lobe: 'NUM', message: 'Initializing numerical integration frameworks...', action: 'activateLobe', actionData: ['MIS', 'CHR', 'NUM'] },
  
  // Phase 2: Data Ingestion
  { delay: 1000, lobe: 'NUM', message: 'Loading gravitational constants: G = 6.67430×10⁻¹¹ m³⋅kg⁻¹⋅s⁻²' },
  { delay: 300, lobe: 'NUM', message: 'Mass ratios computed: M₁:M₂:M₃ = 1.0:0.954:0.003', action: 'addShards', actionData: 16 },
  { delay: 500, lobe: 'SPA', message: 'Spatial coordinates mapped to 6D phase space', action: 'activateLobe', actionData: ['NUM', 'SPA'] },
  { delay: 400, lobe: 'SPA', message: 'Orbital plane inclinations: 7.155°, 3.394°, 1.850°', action: 'addShards', actionData: 12 },
  { delay: 600, lobe: 'DYN', message: 'Dynamic stability analysis initiated', action: 'activateLobe', actionData: ['SPA', 'DYN'] },
  { delay: 300, lobe: 'DYN', message: 'Lyapunov exponent calculation: λ > 0 detected', action: 'consumeEntropy', actionData: 4 },
  
  // Phase 3: Evidence Gathering
  { delay: 800, lobe: 'EVI', message: 'Cross-referencing historical orbital data...', action: 'activateLobe', actionData: ['DYN', 'EVI'] },
  { delay: 500, lobe: 'EVI', message: 'Found: MMP-442 (2024 Predictive Model)', action: 'addShards', actionData: 20 },
  { delay: 400, lobe: 'EVI', message: 'Comparing against 2025 observational data...' },
  { delay: 700, lobe: 'EVI', message: '⚠ ANOMALY DETECTED: 2024 model divergence at t+180 days', action: 'conflict' },
  
  // Phase 4: Conflict Resolution
  { delay: 1200, lobe: 'CHR', message: 'Temporal analysis: 2024 dataset lacks Kirkwood gap corrections', action: 'activateLobe', actionData: ['EVI', 'CHR'] },
  { delay: 600, lobe: 'NUM', message: 'Recalculating with updated resonance frequencies...', action: 'consumeEntropy', actionData: 6 },
  { delay: 800, lobe: 'DYN', message: 'New stability boundary: 3.27 AU < a < 3.31 AU', action: 'addShards', actionData: 24 },
  { delay: 500, lobe: 'MIS', message: 'CONFLICT RESOLUTION: Shredding outdated Mind Map MMP-442', action: 'shred', actionData: 'MMP-442' },
  
  // Phase 5: Lobe Debate
  { delay: 1000, lobe: 'NUM', message: 'PROPOSAL: Adopt symplectic integration for long-term stability', action: 'activateLobe', actionData: ['NUM'] },
  { delay: 400, lobe: 'DYN', message: 'COUNTER: Symplectic methods fail at close encounters', action: 'activateLobe', actionData: ['NUM', 'DYN'] },
  { delay: 500, lobe: 'NUM', message: 'RESPONSE: Regularization transforms can handle singularities' },
  { delay: 400, lobe: 'CHR', message: 'SUPPORT: KS regularization proven effective in 2024 studies', action: 'activateLobe', actionData: ['NUM', 'DYN', 'CHR'] },
  { delay: 600, lobe: 'DYN', message: 'CONCEDE: Accepting regularized symplectic approach', action: 'consumeEntropy', actionData: 4 },
  { delay: 400, lobe: 'EVI', message: 'CONSENSUS REACHED: All lobes in agreement', action: 'activateLobe', actionData: ['NUM', 'DYN', 'CHR', 'EVI', 'SPA', 'MIS'] },
  
  // Phase 6: Memory Consolidation
  { delay: 800, lobe: 'MIS', message: 'Consolidating findings to horizontal memory layer...' },
  { delay: 400, lobe: 'SPA', message: 'Encoding stable orbital configurations', action: 'addShards', actionData: 28 },
  { delay: 300, lobe: 'CHR', message: 'Temporal markers synchronized: 2025.342 - 2025.891', action: 'addShards', actionData: 16 },
  { delay: 500, lobe: 'NUM', message: 'Numerical precision verified: ε < 10⁻¹²', action: 'addShards', actionData: 12 },
  { delay: 600, lobe: 'MIS', message: 'Creating new Mind Map: MMP-505 (N-Body 2025 Revision)', action: 'promote', actionData: 'MMP-505' },
  
  // Phase 7: Resolution
  { delay: 800, lobe: 'MIS', message: 'MISSION COMPLETE: N-Body stability analysis resolved', action: 'consumeEntropy', actionData: 2 },
  { delay: 400, lobe: 'EVI', message: 'Total shards ingested: 128 | Mind Maps updated: 2' },
  { delay: 600, lobe: 'MIS', message: '✓ System stable. Awaiting next mission parameters...', action: 'deactivateLobe', actionData: [] },
];

export const ENTROPY_DECAY_SEQUENCE: DemoStep[] = [
  { delay: 500, lobe: 'MIS', message: 'MISSION RECEIVED: Entropy Decay Analysis' },
  { delay: 600, lobe: 'CHR', message: 'Loading thermodynamic history: 1850-2025 datasets', action: 'activateLobe', actionData: ['MIS', 'CHR'] },
  { delay: 500, lobe: 'NUM', message: 'Boltzmann constant verified: kB = 1.380649×10⁻²³ J⋅K⁻¹', action: 'addShards', actionData: 32 },
  { delay: 700, lobe: 'DYN', message: 'Modeling irreversible process trajectories...', action: 'activateLobe', actionData: ['NUM', 'DYN'] },
  { delay: 400, lobe: 'SPA', message: 'Phase space volume increasing monotonically', action: 'consumeEntropy', actionData: 8 },
  { delay: 600, lobe: 'EVI', message: 'Second Law confirmed: dS/dt ≥ 0 in all observed systems', action: 'addShards', actionData: 24 },
  { delay: 800, lobe: 'MIS', message: 'ANALYSIS COMPLETE: Entropy decay nominal', action: 'promote', actionData: 'MMP-601' },
];

export const TEMPORAL_PARADOX_SEQUENCE: DemoStep[] = [
  { delay: 500, lobe: 'MIS', message: 'MISSION RECEIVED: Temporal Paradox Resolution' },
  { delay: 700, lobe: 'CHR', message: '⚠ ALERT: Causal loop detected at t=-42.7s', action: 'activateLobe', actionData: ['MIS', 'CHR'] },
  { delay: 500, lobe: 'EVI', message: 'Evidence of retrocausal influence in dataset', action: 'conflict' },
  { delay: 600, lobe: 'DYN', message: 'Novikov self-consistency analysis initiated', action: 'activateLobe', actionData: ['CHR', 'DYN'] },
  { delay: 800, lobe: 'NUM', message: 'Closed timelike curves: CTC violation threshold 0.003', action: 'addShards', actionData: 40 },
  { delay: 500, lobe: 'SPA', message: 'Worldline topology: consistent with block universe', action: 'consumeEntropy', actionData: 10 },
  { delay: 700, lobe: 'CHR', message: 'RESOLUTION: Paradox dissolves under fixed-point interpretation', action: 'addShards', actionData: 32 },
  { delay: 600, lobe: 'MIS', message: 'MISSION COMPLETE: Causal consistency preserved', action: 'promote', actionData: 'MMP-701' },
];

export function getDemoSequence(missionId: string): DemoStep[] {
  switch (missionId) {
    case 'n-body':
      return N_BODY_DEMO_SEQUENCE;
    case 'entropy-decay':
      return ENTROPY_DECAY_SEQUENCE;
    case 'temporal-paradox':
      return TEMPORAL_PARADOX_SEQUENCE;
    default:
      return N_BODY_DEMO_SEQUENCE;
  }
}

export function generateCustomSequence(problem: string): DemoStep[] {
  return [
    { delay: 500, lobe: 'MIS', message: `MISSION RECEIVED: ${problem}` },
    { delay: 600, lobe: 'NUM', message: 'Parsing problem parameters...', action: 'activateLobe', actionData: ['MIS', 'NUM'] },
    { delay: 500, lobe: 'CHR', message: 'Establishing temporal context...', action: 'addShards', actionData: 16 },
    { delay: 700, lobe: 'SPA', message: 'Mapping solution space topology...', action: 'activateLobe', actionData: ['NUM', 'SPA'] },
    { delay: 500, lobe: 'DYN', message: 'Analyzing dynamic constraints...', action: 'consumeEntropy', actionData: 4 },
    { delay: 800, lobe: 'EVI', message: 'Gathering supporting evidence...', action: 'addShards', actionData: 24 },
    { delay: 600, lobe: 'NUM', message: 'PROPOSAL: Apply heuristic optimization', action: 'activateLobe', actionData: ['EVI', 'NUM'] },
    { delay: 400, lobe: 'DYN', message: 'SUPPORT: Convergence criteria met', action: 'activateLobe', actionData: ['EVI', 'NUM', 'DYN'] },
    { delay: 500, lobe: 'CHR', message: 'CONSENSUS: Solution pathway identified', action: 'addShards', actionData: 20 },
    { delay: 700, lobe: 'MIS', message: `MISSION COMPLETE: "${problem}" analyzed`, action: 'promote', actionData: 'MMP-CUSTOM' },
    { delay: 400, lobe: 'EVI', message: 'Total shards ingested: 60 | New insights: 1' },
    { delay: 500, lobe: 'MIS', message: '✓ Awaiting next mission parameters...', action: 'deactivateLobe', actionData: [] },
  ];
}
