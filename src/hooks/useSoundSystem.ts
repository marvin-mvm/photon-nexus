import { useCallback, useRef, useState, useEffect } from 'react';

interface OscillatorConfig {
  frequency: number;
  type: OscillatorType;
  duration: number;
  volume?: number;
}

export function useSoundSystem() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      setIsInitialized(true);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(({ frequency, type, duration, volume = 0.1 }: OscillatorConfig) => {
    if (isMuted) return;
    
    const ctx = initAudio();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [isMuted, initAudio]);

  const playBeep = useCallback(() => {
    playTone({ frequency: 880, type: 'sine', duration: 0.05, volume: 0.05 });
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone({ frequency: 1200, type: 'square', duration: 0.02, volume: 0.03 });
  }, [playTone]);

  const playLobeActivation = useCallback((lobeIndex: number) => {
    const frequencies = [440, 523, 659, 784, 880, 1047]; // Different tones for each lobe
    playTone({ 
      frequency: frequencies[lobeIndex % 6], 
      type: 'sine', 
      duration: 0.15, 
      volume: 0.08 
    });
  }, [playTone]);

  const playDataIngest = useCallback(() => {
    playTone({ frequency: 200, type: 'sawtooth', duration: 0.1, volume: 0.04 });
    setTimeout(() => {
      playTone({ frequency: 400, type: 'sine', duration: 0.1, volume: 0.06 });
    }, 50);
  }, [playTone]);

  const playEntropyConsume = useCallback(() => {
    playTone({ frequency: 150, type: 'triangle', duration: 0.08, volume: 0.03 });
  }, [playTone]);

  const playConflict = useCallback(() => {
    playTone({ frequency: 200, type: 'sawtooth', duration: 0.2, volume: 0.1 });
    setTimeout(() => {
      playTone({ frequency: 150, type: 'square', duration: 0.3, volume: 0.08 });
    }, 100);
  }, [playTone]);

  const playResolution = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone({ frequency: freq, type: 'sine', duration: 0.2, volume: 0.06 });
      }, i * 100);
    });
  }, [playTone]);

  const playShred = useCallback(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone({ 
          frequency: 100 + Math.random() * 200, 
          type: 'sawtooth', 
          duration: 0.05, 
          volume: 0.05 
        });
      }, i * 30);
    }
  }, [playTone]);

  const playAmbient = useCallback(() => {
    playTone({ frequency: 60, type: 'sine', duration: 2.0, volume: 0.02 });
    playTone({ frequency: 90, type: 'sine', duration: 2.0, volume: 0.015 });
  }, [playTone]);

  // Neural Mirror match sound - dual-tone ascending ping
  const playMirrorMatch = useCallback(() => {
    playTone({ frequency: 600, type: 'sine', duration: 0.1, volume: 0.04 });
    setTimeout(() => {
      playTone({ frequency: 900, type: 'sine', duration: 0.1, volume: 0.04 });
    }, 50);
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isMuted,
    isInitialized: !!audioContextRef.current,
    initAudio,
    toggleMute,
    playTone,
    playBeep,
    playClick,
    playLobeActivation,
    playDataIngest,
    playEntropyConsume,
    playConflict,
    playResolution,
    playShred,
    playAmbient,
    playMirrorMatch,
  };
}
