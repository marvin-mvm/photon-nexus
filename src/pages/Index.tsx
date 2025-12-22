import { Terminal } from '@/components/photon/Terminal';
import { LobeActivityGrid } from '@/components/photon/LobeActivityGrid';
import { MemoryGauge } from '@/components/photon/MemoryGauge';
import { EntropyTank } from '@/components/photon/EntropyTank';
import { PerfectionLog } from '@/components/photon/PerfectionLog';
import { MissionControl } from '@/components/photon/MissionControl';
import { usePhotonState } from '@/hooks/usePhotonState';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useMissionRunner } from '@/hooks/useMissionRunner';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const photonState = usePhotonState();
  const soundSystem = useSoundSystem();

  const missionRunner = useMissionRunner({
    addEntry: photonState.addEntry,
    addShard: photonState.addShard,
    addMindMap: photonState.addMindMap,
    consumeEntropy: photonState.consumeEntropy,
    setActiveLobes: photonState.setActiveLobes,
    setMissionPhase: photonState.setMissionPhase,
    setMissionProgress: photonState.setMissionProgress,
    startMission: photonState.startMission,
    endMission: photonState.endMission,
    playLobeActivation: soundSystem.playLobeActivation,
    playDataIngest: soundSystem.playDataIngest,
    playEntropyConsume: soundSystem.playEntropyConsume,
    playConflict: soundSystem.playConflict,
    playResolution: soundSystem.playResolution,
    playShred: soundSystem.playShred,
    playBeep: soundSystem.playBeep,
  });

  const handleStartMission = (missionId: string) => {
    soundSystem.initAudio();
    missionRunner.runMission(missionId);
  };

  const handleCustomMission = (problem: string) => {
    soundSystem.initAudio();
    missionRunner.runCustomMission(problem);
  };

  const handleReset = () => {
    missionRunner.clearTimeouts();
    photonState.clearAll();
  };

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse glow-primary" />
            <h1 className="text-lg font-bold text-primary glow-text tracking-wider">
              PHOTON NEXUS
            </h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Public AGI Experiment
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={soundSystem.toggleMute}
            className="text-muted-foreground hover:text-foreground"
          >
            {soundSystem.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
          {/* Left Column - Terminal */}
          <div className="col-span-8 flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <Terminal entries={photonState.entries} />
            </div>
            
            {/* Perfection Log - Bottom */}
            <div className="h-48">
              <PerfectionLog assets={photonState.mindMaps} />
            </div>
          </div>

          {/* Right Column - Telemetry */}
          <div className="col-span-4 flex flex-col gap-4">
            <MissionControl
              isRunning={photonState.missionState.isRunning}
              currentPhase={photonState.missionState.currentPhase}
              onStartMission={handleStartMission}
              onCustomMission={handleCustomMission}
              onReset={handleReset}
            />

            <LobeActivityGrid activeLobes={photonState.missionState.activeLobes} />

            <MemoryGauge
              shardCount={photonState.missionState.shardCount}
              maxShards={128}
              layer={0}
            />

            <EntropyTank slices={photonState.entropySlices} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
