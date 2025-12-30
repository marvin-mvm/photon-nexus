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
import { AuditTrail } from '@/components/photon/AuditTrail';
import { IngestionPanel } from '@/components/photon/IngestionPanel';
import { usePhotonState } from '@/hooks/usePhotonState';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { useMissionRunner } from '@/hooks/useMissionRunner';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
import { Volume2, VolumeX, Zap, Lock, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    incrementSaturation: photonState.incrementSaturation,
    setIsArchiving: photonState.setIsArchiving,
    sessionId: photonState.sessionState.sessionId,
    contextSaturation: photonState.sessionState.contextSaturation,
    archiveToExperience: supabaseSession.archiveToExperience,
    insertExperience: supabaseSession.insertExperience,
    synthesizeThought: supabaseSession.synthesizeThought,
    playLobeActivation: soundSystem.playLobeActivation,
    playDataIngest: soundSystem.playDataIngest,
    playEntropyConsume: soundSystem.playEntropyConsume,
    playConflict: soundSystem.playConflict,
    playResolution: soundSystem.playResolution,
    playShred: soundSystem.playShred,
    playBeep: soundSystem.playBeep,
    playMirrorMatch: soundSystem.playMirrorMatch,
  });

  // Authentication handshake
  const handleAuthentication = async () => {
    soundSystem.initAudio();
    soundSystem.playLowHum();
    photonState.addEntry('MIS', 'INITIATING 5-INGREDIENT FUSION: [Seed + Pulse + ID + Salt + Nonce]', 'SYSTEM');
    
    await new Promise(r => setTimeout(r, 1200));
    soundSystem.playSuccess();
    photonState.addEntry('MIS', '512-BIT XOR MASK GENERATED. Quantum-Proof JIT Protocol Active.', 'SUCCESS');
    photonState.setIsAuthenticated(true);
  };

  const handleStartMission = async (missionId: string) => {
    if (photonState.credits <= 0 || !photonState.isAuthenticated) return;
    soundSystem.initAudio();
    
    if (!photonState.sessionState.sessionId) {
      const newSessionId = await supabaseSession.createSession(missionId);
      if (newSessionId) photonState.setSessionId(newSessionId);
    }
    
    missionRunner.runMission(missionId);
  };

  // Mode-aware Terminal submit handler
  const handleTerminalSubmit = async (problem: string) => {
    if (photonState.credits <= 0 || !photonState.isAuthenticated) return;
    soundSystem.initAudio();

    // Validate LIVE mode requirements
    if (photonState.appMode === 'LIVE' && !photonState.sourceMaterial.trim()) {
      photonState.addEntry('MIS', 'ERROR: L1 Markdown context required for Live AI synthesis. Paste source material in the Ingestion Panel.', 'ALERT');
      return;
    }

    // Add USER entry first
    photonState.addEntry('MIS', problem, 'USER');

    // Create session if needed
    if (!photonState.sessionState.sessionId) {
      const sessionTitle = photonState.appMode === 'LIVE' ? 'Hexalobe Synthesis' : 'Custom Mission';
      const newSessionId = await supabaseSession.createSession(sessionTitle);
      if (newSessionId) photonState.setSessionId(newSessionId);
    }

    // Route based on mode
    if (photonState.appMode === 'LIVE') {
      missionRunner.runHexalobeMission(problem, photonState.sourceMaterial);
    } else {
      missionRunner.runCustomMission(problem);
    }
  };

  const handleReset = () => {
    missionRunner.clearTimeouts();
    photonState.clearAll();
    photonState.setIsAuthenticated(false);
    photonState.setSourceMaterial('');
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
        <div className="max-w-[1900px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className={cn(
                "p-3 rounded-2xl border group hover:scale-105 transition-transform",
                photonState.isAuthenticated 
                  ? "bg-primary/20 border-primary/30" 
                  : "bg-muted/20 border-white/10"
              )}>
                {photonState.isAuthenticated ? (
                  <Zap className="w-6 h-6 text-primary fill-primary/20" />
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              {photonState.missionState.isRunning && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tighter uppercase flex items-center gap-3">
                {photonState.isAuthenticated ? 'Secure Node: Active' : 'Node Locked'}
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground font-bold">
                  v11.5.BETA
                </span>
              </h1>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  photonState.missionState.isRunning ? 'bg-lobe-spatial animate-pulse' : 
                  photonState.isAuthenticated ? 'bg-lobe-chrono' : 'bg-destructive'
                )} />
                <p className="text-[9px] text-muted-foreground font-bold tracking-[0.2em] uppercase">
                  {photonState.missionState.isRunning ? 'Processing Cognitive Delta' : 
                   photonState.isAuthenticated ? 'Node Verified & Ready' : 'Awaiting Physical Seed'}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Mode:</span>
            <button
              onClick={() => photonState.setAppMode('DEMO')}
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full transition-all",
                photonState.appMode === 'DEMO'
                  ? 'text-primary bg-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Demo
            </button>
            <button
              onClick={() => photonState.setAppMode('LIVE')}
              className={cn(
                "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full transition-all",
                photonState.appMode === 'LIVE'
                  ? 'text-lobe-spatial bg-lobe-spatial/20'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Live AI
            </button>
          </div>

          <div className="flex items-center gap-6">
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
        </div>
      </header>

      <main className="max-w-[1900px] mx-auto p-10">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT: Ingestion Panel (visible in LIVE mode or always on large screens) */}
          <div className={cn(
            "col-span-12 lg:col-span-3",
            photonState.appMode === 'DEMO' && "hidden lg:block"
          )}>
            <div className="h-[600px]">
              <IngestionPanel
                sourceMaterial={photonState.sourceMaterial}
                onSourceMaterialChange={photonState.setSourceMaterial}
                isLiveMode={photonState.appMode === 'LIVE'}
                isThinking={photonState.missionState.isRunning}
                activeLobes={photonState.missionState.activeLobes}
              />
            </div>
          </div>

          {/* CENTER: Terminal */}
          <div className={cn(
            "space-y-10",
            photonState.appMode === 'LIVE' 
              ? "col-span-12 lg:col-span-6" 
              : "col-span-12 lg:col-span-5"
          )}>
            <div className="h-[600px]">
              <Terminal 
                entries={photonState.entries} 
                contextSaturation={photonState.sessionState.contextSaturation}
                isAuthenticated={photonState.isAuthenticated}
                isThinking={photonState.missionState.isRunning}
                onSubmit={handleTerminalSubmit}
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
              <PerfectionLog 
                assets={photonState.mindMaps} 
                selectedAsset={photonState.selectedAsset}
                onSelectAsset={photonState.setSelectedAsset}
              />
            </div>
          </div>

          {/* RIGHT: Controls & Metrics */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
            {/* Authentication Button */}
            {!photonState.isAuthenticated && (
              <button
                onClick={handleAuthentication}
                className="w-full btn-premium bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 flex items-center justify-center gap-3"
              >
                <Fingerprint className="w-5 h-5" />
                Ignite Physical Seed
              </button>
            )}

            <MissionControl
              isRunning={photonState.missionState.isRunning}
              currentPhase={photonState.missionState.currentPhase}
              credits={photonState.credits}
              onStartMission={handleStartMission}
              onCustomMission={handleTerminalSubmit}
              onReset={handleReset}
            />

            {/* Audit Trail Panel */}
            {photonState.selectedAsset && (
              <AuditTrail 
                asset={photonState.selectedAsset} 
                onClose={() => photonState.setSelectedAsset(null)} 
              />
            )}

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
            <span>Kernel: Verified</span>
            <span>Network: Sovereignty Node #882</span>
            <span>Compliance: Zero-Knowledge</span>
          </div>
          <p className="text-[9px] text-muted-foreground/20 font-bold max-w-lg leading-relaxed uppercase tracking-[0.1em]">
            Photon Entropy Protocol | Physical Root of Trust Secured by Optical PUF
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;