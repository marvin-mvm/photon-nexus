/**
 * 9D Structural Fingerprint Generator
 * Generates a 9-dimensional vector for cognitive topology matching
 * 
 * Dimensions:
 * [0] avg - Average word length
 * [1] min - Minimum word length
 * [2] max - Maximum word length
 * [3] numericDensity - Density of numeric content (NUM lobe)
 * [4] dynamicDensity - Density of dynamic/change-related terms (DYN lobe)
 * [5] chronoDensity - Density of time-related terms (CHR lobe)
 * [6] spatialDensity - Density of pattern/trend terms (SPA lobe)
 * [7] evidenceDensity - Density of evidence/data terms (EVI lobe)
 * [8] missionalDensity - Density of goal/strategy terms (MIS lobe)
 */

export function generate9DFingerprint(sourceMaterial: string): number[] {
  if (!sourceMaterial || sourceMaterial.trim().length === 0) {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  const words = sourceMaterial.split(/\s+/).filter(Boolean);
  const length = words.length || 1;

  // Calculate word length statistics
  const wordLengths = words.map(w => w.length);
  const avg = wordLengths.length > 0
    ? wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length
    : 0;
  const min = wordLengths.length > 0 ? Math.min(...wordLengths) : 0;
  const max = wordLengths.length > 0 ? Math.max(...wordLengths) : 0;

  // Lobe density approximations (pattern matching heuristics)
  const numericDensity = (sourceMaterial.match(/\d+(\.\d+)?/g) || []).length / length;
  
  const dynamicDensity = (sourceMaterial.match(
    /\b(change|shift|move|grow|decline|increase|decrease|rise|fall|volatile|momentum|velocity|acceleration)\b/gi
  ) || []).length / length;
  
  const chronoDensity = (sourceMaterial.match(
    /\b(day|week|month|year|time|date|period|cycle|quarter|annual|daily|weekly|monthly|yearly|Q[1-4]|20\d{2})\b/gi
  ) || []).length / length;
  
  const spatialDensity = (sourceMaterial.match(
    /\b(pattern|trend|high|low|support|resistance|level|zone|range|channel|breakout|breakdown|pivot)\b/gi
  ) || []).length / length;
  
  const evidenceDensity = (sourceMaterial.match(
    /\b(data|evidence|source|ref|shard|proof|cite|verify|confirm|validate|fact|statistic|metric|indicator)\b/gi
  ) || []).length / length;
  
  const missionalDensity = (sourceMaterial.match(
    /\b(goal|objective|mission|target|strategy|plan|action|execute|achieve|outcome|result|decision)\b/gi
  ) || []).length / length;

  return [
    Number(avg.toFixed(3)),
    min,
    max,
    Number(numericDensity.toFixed(4)),
    Number(dynamicDensity.toFixed(4)),
    Number(chronoDensity.toFixed(4)),
    Number(spatialDensity.toFixed(4)),
    Number(evidenceDensity.toFixed(4)),
    Number(missionalDensity.toFixed(4))
  ];
}

/**
 * Converts a 9D fingerprint to a formatted string for display
 */
export function fingerprintToString(fingerprint: number[]): string {
  if (fingerprint.length !== 9) return 'Invalid fingerprint';
  
  const labels = ['AVG', 'MIN', 'MAX', 'NUM', 'DYN', 'CHR', 'SPA', 'EVI', 'MIS'];
  return fingerprint.map((v, i) => `${labels[i]}:${v}`).join(' | ');
}
