import { useState, useCallback } from 'react';
import { LobeEntry, Shard, MindMapAsset, EntropySlice, MissionState, LobeType, SessionState } from '@/types/photon';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function usePhotonState() {
  const [entries, setEntries] = useState<LobeEntry[]>([]);
  const [shards, setShards] = useState<Shard[]>([]);
  const [mindMaps, setMindMaps] = useState<MindMapAsset[]>([]);
  const [entropySlices, setEntropySlices] = useState<EntropySlice[]>(
    Array.from({ length: 64 }, (_, i) => ({ id: i, consumed: false }))
  );
  const [missionState, setMissionState] = useState<MissionState>({
    isRunning: false,
    currentPhase: 'IDLE',
    progress: 0,
    shardCount: 0,
    activeLobes: [],
  });
  
  // Mirror state for Neural Mirror Indicator
  const [mirrorMatch, setMirrorMatch] = useState(0);
  const [isMirrorActive, setIsMirrorActive] = useState(false);
  
  // Credits (Entropy Vouchers) - 50 training tokens
  const [credits, setCredits] = useState(50);

  // Session state for Calibration Balloon
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionId: null,
    contextSaturation: 0,
    currentExperienceId: null,
    isArchiving: false,
  });

  const consumeCredit = useCallback(() => {
    setCredits((prev) => Math.max(0, prev - 1));
  }, []);

  const resetCredits = useCallback(() => {
    setCredits(50);
  }, []);

  const addEntry = useCallback((lobe: LobeType, message: string) => {
    const entry: LobeEntry = {
      id: generateId(),
      lobe,
      message,
      timestamp: Date.now(),
      isRevealing: true,
      revealed: false,
    };
    setEntries((prev) => [...prev, entry]);
    
    // Mark as revealed after animation
    setTimeout(() => {
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, isRevealing: false, revealed: true } : e))
      );
    }, 300);

    return entry;
  }, []);

  const addShard = useCallback((data: string, layer: number = 0) => {
    const shard: Shard = {
      id: generateId(),
      layer,
      data,
      createdAt: Date.now(),
    };
    setShards((prev) => [...prev, shard]);
    setMissionState((prev) => ({ ...prev, shardCount: prev.shardCount + 1 }));
    return shard;
  }, []);

  const addMindMap = useCallback((name: string, year: number, status: MindMapAsset['status'] = 'active', reason?: string) => {
    const asset: MindMapAsset = {
      id: generateId(),
      name,
      status,
      year,
      reason,
      timestamp: Date.now(),
    };
    setMindMaps((prev) => [...prev, asset]);
    return asset;
  }, []);

  const shredMindMap = useCallback((id: string, reason: string) => {
    setMindMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'shredded' as const, reason } : m))
    );
  }, []);

  const promoteMindMap = useCallback((id: string) => {
    setMindMaps((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'promoted' as const } : m))
    );
  }, []);

  const consumeEntropy = useCallback((count: number = 1) => {
    setEntropySlices((prev) => {
      const unconsumed = prev.filter((s) => !s.consumed);
      const toConsume = unconsumed.slice(0, count).map((s) => s.id);
      return prev.map((s) => (toConsume.includes(s.id) ? { ...s, consumed: true } : s));
    });
  }, []);

  const resetEntropy = useCallback(() => {
    setEntropySlices(Array.from({ length: 64 }, (_, i) => ({ id: i, consumed: false })));
  }, []);

  const setActiveLobes = useCallback((lobes: LobeType[]) => {
    setMissionState((prev) => ({ ...prev, activeLobes: lobes }));
  }, []);

  const setMissionPhase = useCallback((phase: string) => {
    setMissionState((prev) => ({ ...prev, currentPhase: phase }));
  }, []);

  const setMissionProgress = useCallback((progress: number) => {
    setMissionState((prev) => ({ ...prev, progress }));
  }, []);

  const startMission = useCallback(() => {
    setMissionState((prev) => ({ ...prev, isRunning: true, currentPhase: 'INITIALIZING', progress: 0 }));
  }, []);

  const endMission = useCallback(() => {
    setMissionState((prev) => ({ ...prev, isRunning: false, currentPhase: 'COMPLETE', activeLobes: [] }));
  }, []);

  const resetMirror = useCallback(() => {
    setMirrorMatch(0);
    setIsMirrorActive(false);
  }, []);

  // Session state management
  const setSessionId = useCallback((sessionId: string | null) => {
    setSessionState(prev => ({ ...prev, sessionId }));
  }, []);

  const incrementSaturation = useCallback((amount: number) => {
    setSessionState(prev => ({
      ...prev,
      contextSaturation: Math.min(100, prev.contextSaturation + amount),
    }));
  }, []);

  const setContextSaturation = useCallback((value: number) => {
    setSessionState(prev => ({ ...prev, contextSaturation: value }));
  }, []);

  const setIsArchiving = useCallback((isArchiving: boolean) => {
    setSessionState(prev => ({ ...prev, isArchiving }));
  }, []);

  const setCurrentExperienceId = useCallback((experienceId: string | null) => {
    setSessionState(prev => ({ ...prev, currentExperienceId: experienceId }));
  }, []);

  const resetSession = useCallback(() => {
    setSessionState({
      sessionId: null,
      contextSaturation: 0,
      currentExperienceId: null,
      isArchiving: false,
    });
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    setShards([]);
    setMindMaps([]);
    resetEntropy();
    resetMirror();
    resetSession();
    setMissionState({
      isRunning: false,
      currentPhase: 'IDLE',
      progress: 0,
      shardCount: 0,
      activeLobes: [],
    });
  }, [resetEntropy, resetMirror, resetSession]);

  return {
    // State
    entries,
    shards,
    mindMaps,
    entropySlices,
    missionState,
    mirrorMatch,
    isMirrorActive,
    credits,
    sessionState,
    // Actions
    addEntry,
    addShard,
    addMindMap,
    shredMindMap,
    promoteMindMap,
    consumeEntropy,
    resetEntropy,
    setActiveLobes,
    setMissionPhase,
    setMissionProgress,
    startMission,
    endMission,
    clearAll,
    setMirrorMatch,
    setIsMirrorActive,
    resetMirror,
    consumeCredit,
    resetCredits,
    // Session actions
    setSessionId,
    incrementSaturation,
    setContextSaturation,
    setIsArchiving,
    setCurrentExperienceId,
    resetSession,
  };
}
