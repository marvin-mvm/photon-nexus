import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Play, Loader2, RotateCcw, Send, Brain, Zap, AlertTriangle } from 'lucide-react';

interface MissionControlProps {
  isRunning: boolean;
  currentPhase: string;
  credits: number;
  onStartMission: (missionId: string) => void;
  onCustomMission: (problem: string) => void;
  onReset: () => void;
}

const PRESET_MISSIONS = [
  { id: 'n-body', name: 'N-Body Stability', description: 'Solve gravitational chaos' },
  { id: 'entropy-decay', name: 'Entropy Decay', description: 'Analyze thermal equilibrium' },
  { id: 'temporal-paradox', name: 'Temporal Paradox', description: 'Resolve causal loops' },
];

export function MissionControl({
  isRunning,
  currentPhase,
  credits,
  onStartMission,
  onCustomMission,
  onReset,
}: MissionControlProps) {
  const [customProblem, setCustomProblem] = useState('');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  
  const isDepleted = credits <= 0;
  const isDisabled = isRunning || isDepleted;

  const handleStartPreset = () => {
    if (selectedMission) {
      onStartMission(selectedMission);
    }
  };

  const handleSubmitCustom = () => {
    if (customProblem.trim()) {
      onCustomMission(customProblem.trim());
      setCustomProblem('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mission Selector Panel */}
      <div className="panel-premium p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="section-header flex items-center gap-3">
            <Brain className="w-4 h-4 text-primary" /> Mission Control
          </h3>
          {isRunning && (
            <span className="text-[10px] font-mono text-primary animate-pulse tracking-wider">
              {currentPhase}
            </span>
          )}
        </div>

        {/* Preset Missions */}
        <div className="space-y-3">
          <p className="label-text">Preset Scenarios</p>
          <div className="grid gap-3">
            {PRESET_MISSIONS.map((mission) => (
              <button
                key={mission.id}
                onClick={() => setSelectedMission(mission.id)}
                disabled={isDisabled}
                className={cn(
                  'text-left p-4 rounded-2xl border transition-all duration-300',
                  selectedMission === mission.id
                    ? 'border-primary/50 bg-primary/10 text-foreground shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                    : 'border-white/5 bg-black/40 text-muted-foreground hover:border-white/10 hover:bg-white/[0.02]',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="font-bold text-sm tracking-tight">{mission.name}</div>
                <div className="text-[10px] text-muted-foreground/60 mt-1">{mission.description}</div>
              </button>
            ))}
          </div>

          {/* Premium Execute Button */}
          <button
            onClick={handleStartPreset}
            disabled={!selectedMission || isDisabled}
            className={cn(
              'btn-premium w-full mt-4 flex items-center justify-center gap-3',
              !selectedMission || isDisabled
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-foreground text-background hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]'
            )}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Perfecting Logic...
              </>
            ) : isDepleted ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Tokens Depleted
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute Mission
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Custom Problem Input */}
        <div className="space-y-3">
          <p className="label-text">Custom Problem</p>
          <div className="flex gap-3">
            <Input
              value={customProblem}
              onChange={(e) => setCustomProblem(e.target.value)}
              placeholder={isDepleted ? 'Tokens depleted...' : 'Enter your problem...'}
              disabled={isDisabled}
              className="flex-1 bg-black/40 border-white/5 rounded-xl text-sm placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isDisabled) {
                  handleSubmitCustom();
                }
              }}
            />
            <button
              onClick={handleSubmitCustom}
              disabled={!customProblem.trim() || isDisabled}
              className={cn(
                'p-3 rounded-xl border transition-all',
                !customProblem.trim() || isDisabled
                  ? 'border-white/5 text-muted-foreground/30 cursor-not-allowed'
                  : 'border-primary/30 text-primary hover:bg-primary/10'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={isRunning}
          className={cn(
            'w-full py-3 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2',
            isRunning
              ? 'text-muted-foreground/30 cursor-not-allowed'
              : 'text-muted-foreground hover:text-destructive hover:border-destructive/30'
          )}
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Status Panel */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-[2rem] p-8">
        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" /> System Status
        </h3>
        <div className="bg-black/60 p-5 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-1">
            <p className="label-text">Node State</p>
            <div className={cn(
              'w-2 h-2 rounded-full',
              isRunning ? 'bg-lobe-spatial animate-pulse' : 'bg-lobe-chrono'
            )} />
          </div>
          <p className="text-lg font-black text-foreground">
            {isRunning ? 'Processing' : 'Ready'}
            <span className="text-xs text-muted-foreground/50 font-normal ml-2">
              {isRunning ? 'Logical Delta Active' : 'Verified & Sovereign'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}