import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MemoryGaugeProps {
  shardCount: number;
  maxShards?: number;
  layer?: number;
}

export function MemoryGauge({ shardCount, maxShards = 128, layer = 0 }: MemoryGaugeProps) {
  const percentage = Math.min((shardCount / maxShards) * 100, 100);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Memory Gauge
        </h3>
        <span className="text-xs text-primary font-mono">
          {shardCount}/{maxShards}
        </span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-4 bg-muted/50"
          />
          {/* Glow effect when filling */}
          {shardCount > 0 && (
            <div 
              className="absolute top-0 left-0 h-4 rounded-full bg-primary/20 blur-sm transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Layer {layer}: Horizontal Shards
          </span>
          <div className={cn(
            'w-2 h-2 rounded-full transition-colors',
            shardCount > 0 ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
          )} />
        </div>

        {/* Shard visualization */}
        <div className="grid grid-cols-16 gap-0.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-sm transition-all duration-200',
                i < Math.floor((shardCount / maxShards) * 32)
                  ? 'bg-primary animate-ingest'
                  : 'bg-muted/30'
              )}
              style={{
                animationDelay: `${i * 20}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
