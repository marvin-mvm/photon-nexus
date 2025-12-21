import { EntropySlice } from '@/types/photon';
import { cn } from '@/lib/utils';

interface EntropyTankProps {
  slices: EntropySlice[];
}

export function EntropyTank({ slices }: EntropyTankProps) {
  const consumedCount = slices.filter((s) => s.consumed).length;
  const totalCount = slices.length;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Entropy Tank
        </h3>
        <span className="text-xs font-mono text-primary">
          {totalCount - consumedCount}/{totalCount}
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground mb-3">512-bit Slice Grid</p>

      {/* 8x8 grid visualization */}
      <div className="grid grid-cols-8 gap-1">
        {slices.map((slice) => (
          <div
            key={slice.id}
            className={cn(
              'aspect-square rounded-sm transition-all duration-500',
              slice.consumed
                ? 'bg-muted/30 animate-consume'
                : 'bg-primary/80 glow-primary'
            )}
            title={`Slice ${slice.id}: ${slice.consumed ? 'Consumed' : 'Available'}`}
          />
        ))}
      </div>

      {/* Status indicator */}
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground uppercase tracking-wider">Status</span>
        <span
          className={cn(
            'font-bold uppercase',
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
