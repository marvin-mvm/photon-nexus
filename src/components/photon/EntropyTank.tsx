import { EntropySlice } from '@/types/photon';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface EntropyTankProps {
  slices: EntropySlice[];
}

export function EntropyTank({ slices }: EntropyTankProps) {
  const consumedCount = slices.filter((s) => s.consumed).length;
  const totalCount = slices.length;
  const availableCount = totalCount - consumedCount;

  return (
    <div className="panel-premium p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-header flex items-center gap-3">
          <Zap className="w-4 h-4 text-primary" /> Entropy Tank Status
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">
            Industrial Mine Active
          </span>
        </div>
      </div>

      {/* 8x8 grid visualization */}
      <div className="grid grid-cols-8 gap-1.5">
        {slices.map((slice) => (
          <div
            key={slice.id}
            className={cn(
              'aspect-square rounded-sm transition-all duration-700 shadow-inner',
              slice.consumed
                ? 'bg-white/5 border border-white/5 opacity-10 rotate-45 scale-50'
                : 'bg-primary/30 border border-primary/20'
            )}
            title={`Slice ${slice.id}: ${slice.consumed ? 'Consumed' : 'Available'}`}
          />
        ))}
      </div>

      {/* Description */}
      <div className="mt-6 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
        <p className="text-[10px] text-muted-foreground/60 italic leading-relaxed">
          "Each slice represents 512 bits of physical non-deterministic chaos used for local unmasking. Shredded upon delivery."
        </p>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground/50 uppercase tracking-[0.15em]">
          {availableCount}/{totalCount} Slices Available
        </span>
        <span
          className={cn(
            'font-black uppercase tracking-[0.1em]',
            consumedCount > totalCount * 0.8
              ? 'text-destructive'
              : consumedCount > totalCount * 0.5
              ? 'text-lobe-spatial'
              : 'text-primary'
          )}
        >
          {consumedCount > totalCount * 0.8
            ? 'CRITICAL'
            : consumedCount > totalCount * 0.5
            ? 'MODERATE'
            : 'OPTIMAL'}
        </span>
      </div>
    </div>
  );
}