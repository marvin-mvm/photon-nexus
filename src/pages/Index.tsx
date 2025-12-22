import { Terminal } from '@/components/photon/Terminal';
import { LobeActivityGrid } from '@/components/photon/LobeActivityGrid';
import { MemoryGauge } from '@/components/photon/MemoryGauge';
import { EntropyTank } from '@/components/photon/EntropyTank';
import { PerfectionLog } from '@/components/photon/PerfectionLog';
import { MissionControl } from '@/components/photon/MissionControl';
import { MirrorResonanceGauge } from '@/components/photon/MirrorResonanceGauge';
import { NeuralMirrorScanner } from '@/components/photon/NeuralMirrorScanner';
import { AlphaDiscoveryBanner } from '@/components/photon/AlphaDiscoveryBanner';
import { CalibrationBalloon } from '@/components/photon/CalibrationBalloon';
import { usePhotonState } from '@/hooks/usePhotonState';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useMissionRunner } from '@/hooks/useMissionRunner';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
import { Volume2, VolumeX, Zap } from 'lucide-react';

const Index = () => {
  const photonState = usePhotonState();
  const soundSystem = useSoundSystem();
  const supabaseSession = useSupabaseSession();

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
    setMirrorMatch: photonState.setMirrorMatch,
    setIsMirrorActive: photonState.setIsMirrorActive,
    resetMirror: photonState.resetMirror,
    consumeCredit: photonState.consumeCredit,
    // Session & saturation
    incrementSaturation: photonState.incrementSaturation,
    setIsArchiving: photonState.setIsArchiving,
    sessionId: photonState.sessionState.sessionId,
    contextSaturation: photonState.sessionState.contextSaturation,
    // Supabase callbacks
    archiveToExperience: supabaseSession.archiveToExperience,
    insertExperience: supabaseSession.insertExperience,
    // Sound callbacks
    playLobeActivation: soundSystem.playLobeActivation,
    playDataIngest: soundSystem.playDataIngest,
    playEntropyConsume: soundSystem.playEntropyConsume,
    playConflict: soundSystem.playConflict,
    playResolution: soundSystem.playResolution,
    playShred: soundSystem.playShred,
    playBeep: soundSystem.playBeep,
    playMirrorMatch: soundSystem.playMirrorMatch,
  });

  const handleStartMission = async (missionId: string) => {
    if (photonState.credits <= 0) return;
    soundSystem.initAudio();
    
    // Create session if not exists
    if (!photonState.sessionState.sessionId) {
      const newSessionId = await supabaseSession.createSession(missionId);
      if (newSessionId) {
        photonState.setSessionId(newSessionId);
      }
    }
    
    missionRunner.runMission(missionId);
  };

  const handleCustomMission = async (problem: string) => {
    if (photonState.credits <= 0) return;
    soundSystem.initAudio();
    
    if (!photonState.sessionState.sessionId) {
      const newSessionId = await supabaseSession.createSession('Custom Mission');
      if (newSessionId) {
        photonState.setSessionId(newSessionId);
      }
    }
    
    missionRunner.runCustomMission(problem);
  };

  const handleReset = () => {
    missionRunner.clearTimeouts();
    photonState.clearAll();
  };

  const handleArchive = async () => {
    if (!photonState.sessionState.sessionId) return;
    
    photonState.setIsArchiving(true);
    await supabaseSession.archiveToExperience(
      photonState.sessionState.sessionId,
      'Manual Archive',
      'User-initiated cognitive state preservation.',
      { manual: true, saturation: photonState.sessionState.contextSaturation }
    );
    photonState.setIsArchiving(false);
  };

  const showCalibrationBalloon = photonState.sessionState.contextSaturation >= 85;

  return (
    <div className="min-h-screen bg-background noise-overlay">
      {photonState.missionState.isRunning && photonState.missionState.activeLobes.includes('MIS') && (
        <div className="fixed inset-0 pointer-events-none z-40 bg-lobe-mission/5 animate-pulse" />
      )}

      <AlphaDiscoveryBanner credits={photonState.credits} />

      <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50 px-10 py-5">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30 group hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-primary fill-primary/20" />
              </div>
              {photonState.missionState.isRunning && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tighter uppercase flex items-center gap-3">
                Photon Nexus
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground font-bold">
                  v1.0.4-BETA
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${photonState.missionState.isRunning ? 'bg-lobe-spatial animate-pulse' : 'bg-lobe-chrono'}`} />
                <p className="text-[9px] text-muted-foreground font-bold tracking-[0.2em] uppercase">
                  {photonState.missionState.isRunning ? 'System: Processing Logical Delta' : 'System: Node Verified & Ready'}
                </p>
              </div>
            </div>
          </div>

          <MirrorResonanceGauge 
            mirrorMatch={photonState.mirrorMatch}
            isMirrorActive={photonState.isMirrorActive}
          />

          <button
            onClick={soundSystem.toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            {soundSystem.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto p-10">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="h-[600px]">
              <Terminal 
                entries={photonState.entries} 
                contextSaturation={photonState.sessionState.contextSaturation}
              />
            </div>
            
            {showCalibrationBalloon && (
              <CalibrationBalloon
                saturationPct={photonState.sessionState.contextSaturation}
                sessionId={photonState.sessionState.sessionId || 'demo-session'}
                onArchive={handleArchive}
                isArchiving={photonState.sessionState.isArchiving}
              />
            )}
            
            <div className="h-[300px]">
              <PerfectionLog assets={photonState.mindMaps} />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <MissionControl
              isRunning={photonState.missionState.isRunning}
              currentPhase={photonState.missionState.currentPhase}
              credits={photonState.credits}
              onStartMission={handleStartMission}
              onCustomMission={handleCustomMission}
              onReset={handleReset}
            />

            <NeuralMirrorScanner
              isMirrorActive={photonState.isMirrorActive}
              mirrorMatch={photonState.mirrorMatch}
              isThinking={photonState.missionState.isRunning}
            />

            <LobeActivityGrid activeLobes={photonState.missionState.activeLobes} />
            <MemoryGauge shardCount={photonState.missionState.shardCount} maxShards={3000} layer={0} />
            <EntropyTank slices={photonState.entropySlices} />
          </div>
        </div>
      </main>

      <footer className="p-20 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex gap-10 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">
            <span className="hover:text-primary transition-colors cursor-help">Kernel: Verified</span>
            <span className="hover:text-primary transition-colors cursor-help">Network: Sovereignty Node #882</span>
            <span className="hover:text-primary transition-colors cursor-help">Compliance: Zero-Knowledge</span>
          </div>
          <p className="text-[9px] text-muted-foreground/20 font-bold max-w-lg leading-relaxed uppercase tracking-[0.1em]">
            Photon Entropy Protocol | Physical Root of Trust Secured by Optical PUF | Unauthorized Reconstruction Mathematically Impossible
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
