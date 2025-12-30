import { Cpu, RefreshCw, TrendingUp, Layers, ShieldCheck, Brain, LucideIcon } from 'lucide-react';

export type LobeType = 'NUM' | 'DYN' | 'CHR' | 'SPA' | 'EVI' | 'MIS';

export type AppMode = 'DEMO' | 'LIVE';

export type LogEntryType = 
  | 'XOR' | 'MEM' | 'SELF' | 'SHRED' | 'SUCCESS' | 'CONFLICT' | 'MIRROR' | 'CALIBRATION' | 'SYSTEM'
  | 'USER' | 'ADJUDICATION' | 'PROMOTION' | 'ALERT' | 'INGEST';

export interface LobeEntry {
  id: string;
  lobe: LobeType;
  message: string;
  timestamp: number;
  type?: LogEntryType;
  isRevealing?: boolean;
  revealed?: boolean;
}

export interface Shard {
  id: string;
  layer: number;
  data: string;
  createdAt: number;
}

// Logic Chip for 6-lobe decomposition
export interface LogicChip {
  id: string;
  type: LobeType;
  logic: string;
  shardRefs: number[];
}

// Enhanced MindMapAsset for Triple-Consensus architecture
export interface MindMapAsset {
  id: string;
  name: string;
  prompt?: string;
  consensusWinner?: 'ALPHA' | 'BETA' | 'LEGACY';
  evidenceDensity?: number;
  chips?: LogicChip[];
  status: 'active' | 'shredded' | 'promoted';
  year: number;
  reason?: string;
  timestamp: number;
  l1Markdown?: string; // Physical proof storage
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

export interface SessionState {
  sessionId: string | null;
  contextSaturation: number;
  currentExperienceId: string | null;
  isArchiving: boolean;
}

export interface LobeConfig {
  label: string;
  name: string;
  color: string;
  className: string;
  borderClass: string;
  bgClass: string;
  glowClass: string;
  icon: LucideIcon;
}

export const LOBE_CONFIG: Record<LobeType, LobeConfig> = {
  NUM: { 
    label: 'NUM', 
    name: 'Numeric', 
    color: 'lobe-numeric', 
    className: 'text-lobe-numeric',
    borderClass: 'border-lobe-numeric/30',
    bgClass: 'bg-lobe-numeric/10',
    glowClass: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    icon: Cpu 
  },
  DYN: { 
    label: 'DYN', 
    name: 'Dynamic', 
    color: 'lobe-dynamic', 
    className: 'text-lobe-dynamic',
    borderClass: 'border-lobe-dynamic/30',
    bgClass: 'bg-lobe-dynamic/10',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    icon: RefreshCw 
  },
  CHR: { 
    label: 'CHR', 
    name: 'Chrono', 
    color: 'lobe-chrono', 
    className: 'text-lobe-chrono',
    borderClass: 'border-lobe-chrono/30',
    bgClass: 'bg-lobe-chrono/10',
    glowClass: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
    icon: TrendingUp 
  },
  SPA: { 
    label: 'SPA', 
    name: 'Spatial', 
    color: 'lobe-spatial', 
    className: 'text-lobe-spatial',
    borderClass: 'border-lobe-spatial/30',
    bgClass: 'bg-lobe-spatial/10',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    icon: Layers 
  },
  EVI: { 
    label: 'EVI', 
    name: 'Evidence', 
    color: 'lobe-evidence', 
    className: 'text-lobe-evidence',
    borderClass: 'border-lobe-evidence/30',
    bgClass: 'bg-lobe-evidence/10',
    glowClass: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
    icon: ShieldCheck 
  },
  MIS: { 
    label: 'MIS', 
    name: 'Mission', 
    color: 'lobe-mission', 
    className: 'text-lobe-mission',
    borderClass: 'border-lobe-mission/30',
    bgClass: 'bg-lobe-mission/10',
    glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    icon: Brain 
  },
};
