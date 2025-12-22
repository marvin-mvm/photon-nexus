import { cn } from '@/lib/utils';
import { Database } from 'lucide-react';

interface MemoryGaugeProps {
  shardCount: number;
  maxShards?: number;
  layer?: number;
}

export function MemoryGauge({ shardCount, maxShards = 3000, layer = 0 }: MemoryGaugeProps) {
  const percentage = Math.min((shardCount / maxShards) * 100, 100);

  return (
    <div className="panel-premium p-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="section-header flex items-center gap-3 mb-2">
            <Database className="w-4 h-4 text-primary" /> Knowledge Horizon
          </h3>
          <p className="text-[9px] text-muted-foreground/50 uppercase tracking-[0.15em]">
            Layer {layer}: Horizontal Binary Shards
          </p>
        </div>
        <span className="value-text group-hover:text-primary transition-colors">
          {shardCount.toLocaleString()}
        </span>
      </div>

      {/* Premium progress bar */}
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary to-lobe-evidence transition-all duration-1000 rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/40 blur-sm rounded-full" />
        </div>
      </div>

      {/* Shard visualization grid */}
      <div className="mt-6 grid grid-cols-16 gap-1">
        {Array.from({ length: 32 }).map((_, i) => {
          const isActive = i < Math.floor((shardCount / maxShards) * 32);
          return (
            <div
              key={i}
              className={cn(
                'h-2 rounded-sm transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-t from-primary/60 to-primary animate-ingest'
                  : 'bg-white/5'
              )}
              style={{
                animationDelay: `${i * 30}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}