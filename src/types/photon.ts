export type LobeType = 'NUM' | 'DYN' | 'CHR' | 'SPA' | 'EVI' | 'MIS';

export interface LobeEntry {
  id: string;
  lobe: LobeType;
  message: string;
  timestamp: number;
  isRevealing?: boolean;
  revealed?: boolean;
}

export interface Shard {
  id: string;
  layer: number;
  data: string;
  createdAt: number;
}

export interface MindMapAsset {
  id: string;
  name: string;
  status: 'active' | 'shredded' | 'promoted';
  year: number;
  reason?: string;
  timestamp: number;
}

export interface EntropySlice {
  id: number;
  consumed: boolean;
}

export interface MissionState {
  isRunning: boolean;
  currentPhase: string;
  progress: number;
  shardCount: number;
  activeLobes: LobeType[];
}

export const LOBE_CONFIG: Record<LobeType, { label: string; color: string; className: string }> = {
  NUM: { label: 'Numeric', color: 'lobe-numeric', className: 'text-lobe-numeric' },
  DYN: { label: 'Dynamic', color: 'lobe-dynamic', className: 'text-lobe-dynamic' },
  CHR: { label: 'Chrono', color: 'lobe-chrono', className: 'text-lobe-chrono' },
  SPA: { label: 'Spatial', color: 'lobe-spatial', className: 'text-lobe-spatial' },
  EVI: { label: 'Evidence', color: 'lobe-evidence', className: 'text-lobe-evidence' },
  MIS: { label: 'Mission', color: 'lobe-mission', className: 'text-lobe-mission' },
};
