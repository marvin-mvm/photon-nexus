import { useCallback, useRef } from 'react';
import { LobeType } from '@/types/photon';
import { DemoStep, getDemoSequence, generateCustomSequence } from '@/lib/demoSequences';

interface UseMissionRunnerParams {
  addEntry: (lobe: LobeType, message: string) => void;
  addShard: (data: string, layer?: number) => void;
  addMindMap: (name: string, year: number, status?: 'active' | 'shredded' | 'promoted', reason?: string) => void;
  consumeEntropy: (count?: number) => void;
  setActiveLobes: (lobes: LobeType[]) => void;
  setMissionPhase: (phase: string) => void;
  setMissionProgress: (progress: number) => void;
  startMission: () => void;
  endMission: () => void;
  playLobeActivation: (index: number) => void;
  playDataIngest: () => void;
  playEntropyConsume: () => void;
  playConflict: () => void;
  playResolution: () => void;
  playShred: () => void;
  playBeep: () => void;
}

export function useMissionRunner(params: UseMissionRunnerParams) {
  const {
    addEntry,
    addShard,
    addMindMap,
    consumeEntropy,
    setActiveLobes,
    setMissionPhase,
    setMissionProgress,
    startMission,
    endMission,
    playLobeActivation,
    playDataIngest,
    playEntropyConsume,
    playConflict,
    playResolution,
    playShred,
    playBeep,
  } = params;

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const executeStep = useCallback((step: DemoStep, stepIndex: number, totalSteps: number) => {
    // Add the terminal entry
    addEntry(step.lobe, step.message);
    playBeep();

    // Update progress
    setMissionProgress((stepIndex / totalSteps) * 100);

    // Handle actions
    if (step.action) {
      switch (step.action) {
        case 'addShards':
          const shardCount = step.actionData as number;
          for (let i = 0; i < shardCount; i++) {
            addShard(`shard-${Date.now()}-${i}`, 0);
          }
          playDataIngest();
          break;

        case 'consumeEntropy':
          consumeEntropy(step.actionData as number);
          playEntropyConsume();
          break;

        case 'activateLobe':
          setActiveLobes(step.actionData as LobeType[]);
          const lobeIndex = ['NUM', 'DYN', 'CHR', 'SPA', 'EVI', 'MIS'].indexOf(step.lobe);
          playLobeActivation(lobeIndex);
          break;

        case 'deactivateLobe':
          setActiveLobes([]);
          break;

        case 'conflict':
          setMissionPhase('CONFLICT DETECTED');
          playConflict();
          break;

        case 'shred':
          const shredId = step.actionData as string;
          addMindMap(shredId, 2024, 'shredded', 'Conflict with 2025 evidence');
          playShred();
          setMissionPhase('SHREDDING');
          break;

        case 'promote':
          const promoteId = step.actionData as string;
          addMindMap(promoteId, 2025, 'promoted', 'Promoted to Instinct');
          playResolution();
          setMissionPhase('CONSOLIDATING');
          break;
      }
    }

    // Update phase based on lobe
    if (step.lobe === 'MIS' && step.message.includes('MISSION RECEIVED')) {
      setMissionPhase('INITIALIZING');
    } else if (step.message.includes('CONSENSUS')) {
      setMissionPhase('CONSENSUS');
    } else if (step.message.includes('COMPLETE')) {
      setMissionPhase('COMPLETE');
    }
  }, [
    addEntry, addShard, addMindMap, consumeEntropy, setActiveLobes,
    setMissionPhase, setMissionProgress, playBeep, playDataIngest,
    playEntropyConsume, playLobeActivation, playConflict, playResolution, playShred
  ]);

  const runMission = useCallback((missionId: string) => {
    clearTimeouts();
    startMission();

    const sequence = getDemoSequence(missionId);
    let accumulatedDelay = 0;

    sequence.forEach((step, index) => {
      accumulatedDelay += step.delay;
      const timeout = setTimeout(() => {
        executeStep(step, index + 1, sequence.length);
      }, accumulatedDelay);
      timeoutsRef.current.push(timeout);
    });

    // End mission after all steps
    const endTimeout = setTimeout(() => {
      endMission();
    }, accumulatedDelay + 1000);
    timeoutsRef.current.push(endTimeout);
  }, [clearTimeouts, startMission, endMission, executeStep]);

  const runCustomMission = useCallback((problem: string) => {
    clearTimeouts();
    startMission();

    const sequence = generateCustomSequence(problem);
    let accumulatedDelay = 0;

    sequence.forEach((step, index) => {
      accumulatedDelay += step.delay;
      const timeout = setTimeout(() => {
        executeStep(step, index + 1, sequence.length);
      }, accumulatedDelay);
      timeoutsRef.current.push(timeout);
    });

    // End mission after all steps
    const endTimeout = setTimeout(() => {
      endMission();
    }, accumulatedDelay + 1000);
    timeoutsRef.current.push(endTimeout);
  }, [clearTimeouts, startMission, endMission, executeStep]);

  return {
    runMission,
    runCustomMission,
    clearTimeouts,
  };
}
