import { MindMapAsset } from '@/types/photon';
import { cn } from '@/lib/utils';
import { Check, X, Sparkles } from 'lucide-react';

interface PerfectionLogProps {
  assets: MindMapAsset[];
}

export function PerfectionLog({ assets }: PerfectionLogProps) {
  const sortedAssets = [...assets].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Perfection Log
      </h3>
      <p className="text-[10px] text-muted-foreground mb-3">Verified Mind Map Assets</p>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {sortedAssets.length === 0 ? (
          <div className="text-xs text-muted-foreground/50 italic">
            No assets logged yet...
          </div>
        ) : (
          sortedAssets.map((asset) => (
            <div
              key={asset.id}
              className={cn(
                'flex items-start gap-2 p-2 rounded-md border text-xs transition-all',
                asset.status === 'shredded' && 'border-destructive/50 bg-destructive/5 animate-shred',
                asset.status === 'promoted' && 'border-lobe-chrono/50 bg-lobe-chrono/5',
                asset.status === 'active' && 'border-border bg-muted/20'
              )}
            >
              <div className="mt-0.5">
                {asset.status === 'shredded' && (
                  <X className="w-3 h-3 text-destructive" />
                )}
                {asset.status === 'promoted' && (
                  <Sparkles className="w-3 h-3 text-lobe-chrono" />
                )}
                {asset.status === 'active' && (
                  <Check className="w-3 h-3 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'font-mono font-bold truncate',
                      asset.status === 'shredded' && 'text-destructive line-through',
                      asset.status === 'promoted' && 'text-lobe-chrono',
                      asset.status === 'active' && 'text-foreground'
                    )}
                  >
                    {asset.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {asset.year}
                  </span>
                </div>

                {asset.reason && (
                  <p
                    className={cn(
                      'text-[10px] mt-1 truncate',
                      asset.status === 'shredded'
                        ? 'text-destructive/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {asset.reason}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
