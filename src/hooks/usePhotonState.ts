import { useState, useCallback } from 'react';
import { LobeEntry, Shard, MindMapAsset, EntropySlice, MissionState, LobeType } from '@/types/photon';

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

  const clearAll = useCallback(() => {
    setEntries([]);
    setShards([]);
    setMindMaps([]);
    resetEntropy();
    setMissionState({
      isRunning: false,
      currentPhase: 'IDLE',
      progress: 0,
      shardCount: 0,
      activeLobes: [],
    });
  }, [resetEntropy]);

  return {
    // State
    entries,
    shards,
    mindMaps,
    entropySlices,
    missionState,
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
  };
}
