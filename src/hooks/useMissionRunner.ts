import { useCallback, useRef } from 'react';
import { LobeType } from '@/types/photon';
import { DemoStep, getDemoSequence, generateCustomSequence } from '@/lib/demoSequences';
import type { Json } from '@/integrations/supabase/types';

interface UseMissionRunnerParams {
  addEntry: (lobe: LobeType, message: string, type?: string) => void;
  addShard: (data: string, layer?: number) => void;
  addMindMap: (name: string, year: number, status?: 'active' | 'shredded' | 'promoted', reason?: string) => void;
  consumeEntropy: (count?: number) => void;
  setActiveLobes: (lobes: LobeType[]) => void;
  setMissionPhase: (phase: string) => void;
  setMissionProgress: (progress: number) => void;
  startMission: () => void;
  endMission: () => void;
  setMirrorMatch: (value: number) => void;
  setIsMirrorActive: (active: boolean) => void;
  resetMirror: () => void;
  consumeCredit: () => void;
  // Session & saturation
  incrementSaturation: (amount: number) => void;
  setIsArchiving: (isArchiving: boolean) => void;
  sessionId: string | null;
  contextSaturation: number;
  // Supabase callbacks
  archiveToExperience?: (
    sessionId: string,
    title: string,
    handoverSummary: string,
    logicSkeleton?: Json
  ) => Promise<string | null>;
  insertExperience?: (experience: {
    session_id: string;
    title: string;
    description?: string;
    handover_summary: string;
    logic_skeleton?: Json;
    status?: 'ACTIVE' | 'SHREDDED' | 'ARCHIVED';
  }) => Promise<string | null>;
  // Sound callbacks
  playLobeActivation: (index: number) => void;
  playDataIngest: () => void;
  playEntropyConsume: () => void;
  playConflict: () => void;
  playResolution: () => void;
  playShred: () => void;
  playBeep: () => void;
  playMirrorMatch: () => void;
}

// Saturation increment per step - now 12% for faster demo progression
const SATURATION_INCREMENT = {
  default: 12,
  addShards: 12,
  conflict: 12,
  promote: 12,
  shred: 12,
};

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
    setMirrorMatch,
    setIsMirrorActive,
    resetMirror,
    consumeCredit,
    incrementSaturation,
    setIsArchiving,
    sessionId,
    contextSaturation,
    archiveToExperience,
    insertExperience,
    playLobeActivation,
    playDataIngest,
    playEntropyConsume,
    playConflict,
    playResolution,
    playShred,
    playBeep,
    playMirrorMatch,
  } = params;

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const calibrationTriggeredRef = useRef(false);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    calibrationTriggeredRef.current = false;
  }, []);

  const executeStep = useCallback((step: DemoStep, stepIndex: number, totalSteps: number) => {
    // Add the terminal entry with optional type
    addEntry(step.lobe, step.message, step.type);
    playBeep();

    // Update progress
    setMissionProgress((stepIndex / totalSteps) * 100);

    // Calculate saturation increment based on action type
    let saturationInc = SATURATION_INCREMENT.default;
    if (step.action) {
      saturationInc = SATURATION_INCREMENT[step.action as keyof typeof SATURATION_INCREMENT] || SATURATION_INCREMENT.default;
    }
    incrementSaturation(saturationInc);

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
          setIsMirrorActive(false);
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
          setMirrorMatch(100);
          setIsMirrorActive(true);
          consumeCredit();

          // Insert experience into Supabase
          if (insertExperience && sessionId) {
            insertExperience({
              session_id: sessionId,
              title: `${promoteId} - Mission Complete`,
              description: 'Cognitive synthesis achieved',
              handover_summary: `Resolved ${promoteId} using 6-lobe categorical analysis. Key insight: Dynamic stability achieved through regularized symplectic integration. Mirror resonance confirmed at 100%.`,
              logic_skeleton: {
                lobes_used: ['NUM', 'DYN', 'CHR', 'SPA', 'EVI', 'MIS'],
                resolution_method: 'regularized_symplectic',
                conflict_resolved: true,
                mirror_resonance: 100,
              },
              status: 'ACTIVE',
            });
          }
          break;

        case 'mirror':
          const mirrorData = step.actionData as { percentage: number };
          setMirrorMatch(mirrorData.percentage);
          setIsMirrorActive(true);
          playMirrorMatch();
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
    setMissionPhase, setMissionProgress, setMirrorMatch, setIsMirrorActive, consumeCredit,
    incrementSaturation, sessionId, insertExperience,
    playBeep, playDataIngest, playEntropyConsume, playLobeActivation,
    playConflict, playResolution, playShred, playMirrorMatch
  ]);

  // Check if calibration balloon should be shown (at 85%)
  const checkCalibrationThreshold = useCallback((currentSaturation: number) => {
    if (currentSaturation >= 85 && !calibrationTriggeredRef.current) {
      calibrationTriggeredRef.current = true;
      
      // Add SYSTEM calibration entry to terminal (inline bridge notification)
      addEntry('MIS', 'SYSTEM: Context window at 85%. DISTILLING EXPERIENCE... Next prompt will initialize a fresh session with Handover Token.', 'SYSTEM');
      setMissionPhase('CALIBRATING');

      // Auto-archive if we have the callback
      if (archiveToExperience && sessionId) {
        setIsArchiving(true);
        archiveToExperience(
          sessionId,
          'Session Calibration Archive',
          'Automatic archive triggered at 85% context saturation. Cognitive state preserved for session continuity.',
          {
            saturation_at_archive: currentSaturation,
            auto_triggered: true,
            timestamp: new Date().toISOString(),
          }
        ).finally(() => {
          setIsArchiving(false);
        });
      }
    }
  }, [addEntry, setMissionPhase, archiveToExperience, sessionId, setIsArchiving]);

  const runMission = useCallback((missionId: string) => {
    clearTimeouts();
    resetMirror();
    calibrationTriggeredRef.current = false;
    startMission();

    const sequence = getDemoSequence(missionId);
    let accumulatedDelay = 0;
    let runningContextSaturation = contextSaturation;

    sequence.forEach((step, index) => {
      accumulatedDelay += step.delay;
      const timeout = setTimeout(() => {
        executeStep(step, index + 1, sequence.length);
        
        // Track saturation for calibration check
        const saturationInc = SATURATION_INCREMENT[step.action as keyof typeof SATURATION_INCREMENT] || SATURATION_INCREMENT.default;
        runningContextSaturation += saturationInc;
        checkCalibrationThreshold(runningContextSaturation);
      }, accumulatedDelay);
      timeoutsRef.current.push(timeout);
    });

    // End mission after all steps
    const endTimeout = setTimeout(() => {
      endMission();
    }, accumulatedDelay + 1000);
    timeoutsRef.current.push(endTimeout);
  }, [clearTimeouts, resetMirror, startMission, endMission, executeStep, contextSaturation, checkCalibrationThreshold]);

  const runCustomMission = useCallback((problem: string) => {
    clearTimeouts();
    resetMirror();
    calibrationTriggeredRef.current = false;
    startMission();

    const sequence = generateCustomSequence(problem);
    let accumulatedDelay = 0;
    let runningContextSaturation = contextSaturation;

    sequence.forEach((step, index) => {
      accumulatedDelay += step.delay;
      const timeout = setTimeout(() => {
        executeStep(step, index + 1, sequence.length);
        
        // Track saturation for calibration check
        const saturationInc = SATURATION_INCREMENT[step.action as keyof typeof SATURATION_INCREMENT] || SATURATION_INCREMENT.default;
        runningContextSaturation += saturationInc;
        checkCalibrationThreshold(runningContextSaturation);
      }, accumulatedDelay);
      timeoutsRef.current.push(timeout);
    });

    // End mission after all steps
    const endTimeout = setTimeout(() => {
      endMission();
    }, accumulatedDelay + 1000);
    timeoutsRef.current.push(endTimeout);
  }, [clearTimeouts, resetMirror, startMission, endMission, executeStep, contextSaturation, checkCalibrationThreshold]);

  return {
    runMission,
    runCustomMission,
    clearTimeouts,
  };
}
