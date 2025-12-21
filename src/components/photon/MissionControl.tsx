import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Play, Loader2, RotateCcw, Send } from 'lucide-react';

interface MissionControlProps {
  isRunning: boolean;
  currentPhase: string;
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
  onStartMission,
  onCustomMission,
  onReset,
}: MissionControlProps) {
  const [customProblem, setCustomProblem] = useState('');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

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
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Mission Control
        </h3>
        {isRunning && (
          <span className="text-[10px] font-mono text-primary animate-pulse">
            {currentPhase}
          </span>
        )}
      </div>

      {/* Preset Missions */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Preset Scenarios
        </p>
        <div className="grid gap-2">
          {PRESET_MISSIONS.map((mission) => (
            <button
              key={mission.id}
              onClick={() => setSelectedMission(mission.id)}
              disabled={isRunning}
              className={cn(
                'text-left p-2 rounded-md border transition-all text-xs',
                selectedMission === mission.id
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-muted/20 text-muted-foreground hover:border-primary/50',
                isRunning && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="font-semibold">{mission.name}</div>
              <div className="text-[10px] text-muted-foreground">{mission.description}</div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleStartPreset}
          disabled={!selectedMission || isRunning}
          className="w-full mt-2"
          variant={selectedMission && !isRunning ? 'default' : 'secondary'}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Mission
            </>
          )}
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-muted-foreground uppercase">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Custom Problem Input */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Custom Problem
        </p>
        <div className="flex gap-2">
          <Input
            value={customProblem}
            onChange={(e) => setCustomProblem(e.target.value)}
            placeholder="Enter your problem..."
            disabled={isRunning}
            className="flex-1 text-xs bg-muted/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isRunning) {
                handleSubmitCustom();
              }
            }}
          />
          <Button
            onClick={handleSubmitCustom}
            disabled={!customProblem.trim() || isRunning}
            size="icon"
            variant="outline"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-destructive"
        disabled={isRunning}
      >
        <RotateCcw className="w-3 h-3 mr-2" />
        Reset All
      </Button>
    </div>
  );
}
