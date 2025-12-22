import { cn } from '@/lib/utils';

interface MirrorResonanceGaugeProps {
  mirrorMatch: number;
  isMirrorActive: boolean;
}

export function MirrorResonanceGauge({ mirrorMatch, isMirrorActive }: MirrorResonanceGaugeProps) {
  // Calculate which bars should be lit based on percentage
  // 0-25% = 1 bar, 25-50% = 2 bars, 50-75% = 3 bars, 75-100% = 4 bars
  const barsLit = mirrorMatch > 0 ? Math.ceil(mirrorMatch / 25) : 0;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end gap-1">
        <span className={cn(
          'text-[9px] font-black uppercase tracking-[0.15em] transition-colors',
          isMirrorActive ? 'text-primary' : 'text-muted-foreground/50'
        )}>
          {isMirrorActive ? 'Intuition Active' : 'First-time Thinking'}
        </span>
        
        {/* 4-bar resonance indicator */}
        <div className="flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-3 h-4 rounded-sm transition-all duration-300',
                i < barsLit
                  ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]'
                  : 'bg-white/10'
              )}
            />
          ))}
        </div>
      </div>
      
      <div className="text-right">
        <span className={cn(
          'text-xs font-bold transition-colors',
          mirrorMatch > 0 ? 'text-primary' : 'text-muted-foreground/40'
        )}>
          Mirror: {mirrorMatch}%
        </span>
      </div>
    </div>
  );
}
