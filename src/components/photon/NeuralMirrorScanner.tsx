import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeuralMirrorScannerProps {
  isMirrorActive: boolean;
  mirrorMatch: number;
  isThinking: boolean;
}

export function NeuralMirrorScanner({ isMirrorActive, mirrorMatch, isThinking }: NeuralMirrorScannerProps) {
  const [frequencyBars, setFrequencyBars] = useState<number[]>(Array(24).fill(0.2));

  // Animate frequency bars when thinking
  useEffect(() => {
    if (!isThinking) {
      setFrequencyBars(Array(24).fill(0.2));
      return;
    }

    const interval = setInterval(() => {
      setFrequencyBars(prev => 
        prev.map(() => 0.2 + Math.random() * 0.8)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isThinking]);

  return (
    <div className="panel-premium p-6 relative overflow-hidden">
      {/* Premium gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Header with Search icon */}
      <div className="flex items-center gap-4 mb-5">
        <div className={cn(
          'p-2.5 rounded-xl border transition-all duration-500',
          isMirrorActive 
            ? 'border-primary/50 bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
            : 'border-white/10 bg-white/5'
        )}>
          <Search className={cn(
            'w-5 h-5 transition-all',
            isThinking && 'animate-pulse',
            isMirrorActive ? 'text-primary' : 'text-muted-foreground/50'
          )} />
        </div>
        <div>
          <h3 className="section-header">Experience Scan</h3>
          <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mt-0.5">
            Intuition Lattice
          </p>
        </div>
      </div>

      {/* Frequency visualizer - 24 bars */}
      <div className="bg-black/40 rounded-2xl border border-white/5 p-4 mb-4">
        <div className="flex items-end justify-between h-12 gap-0.5">
          {frequencyBars.map((height, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-t-sm transition-all duration-100',
                isMirrorActive || isThinking
                  ? 'bg-gradient-to-t from-primary/60 to-primary'
                  : 'bg-white/10'
              )}
              style={{ 
                height: `${height * 100}%`,
                opacity: isMirrorActive || isThinking ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground/50 uppercase tracking-[0.15em] font-bold">
          ID_SPACE: GEOMETRIC
        </span>
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            isMirrorActive 
              ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))] animate-pulse'
              : 'bg-white/20'
          )} />
          <span className={cn(
            'text-[9px] font-black uppercase tracking-wider transition-colors',
            isMirrorActive ? 'text-primary' : 'text-muted-foreground/50'
          )}>
            {isMirrorActive ? 'MATCH FOUND' : 'NO ANALOGY'}
          </span>
        </div>
      </div>

      {/* Match percentage overlay when active */}
      {mirrorMatch > 0 && (
        <div className="absolute top-3 right-3 text-[10px] font-black text-primary/80">
          {mirrorMatch}%
        </div>
      )}
    </div>
  );
}
