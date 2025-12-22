import { MindMapAsset } from '@/types/photon';
import { cn } from '@/lib/utils';
import { Database, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

interface PerfectionLogProps {
  assets: MindMapAsset[];
}

export function PerfectionLog({ assets }: PerfectionLogProps) {
  const sortedAssets = [...assets].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="panel-premium p-8 h-full flex flex-col">
      <h3 className="section-header mb-6">Asset Registry</h3>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedAssets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <Database className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-[10px] tracking-[0.2em] uppercase">No assets logged yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedAssets.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  'group p-6 rounded-[1.5rem] border transition-all duration-500',
                  asset.status === 'shredded' && 'border-destructive/20 bg-destructive/5 opacity-30 grayscale',
                  asset.status === 'promoted' && 'border-lobe-chrono/30 bg-lobe-chrono/5 shadow-[0_0_40px_rgba(34,197,94,0.1)]',
                  asset.status === 'active' && 'border-white/5 bg-black/40'
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-xl',
                      asset.status === 'shredded' ? 'bg-destructive/10' : 'bg-primary/10'
                    )}>
                      {asset.status === 'shredded' ? (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      ) : (
                        <Database className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className={cn(
                      'text-[11px] font-black',
                      asset.status === 'shredded' ? 'text-destructive' : 'text-primary'
                    )}>
                      {asset.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 font-bold">{asset.year}</span>
                </div>

                {/* Description */}
                {asset.reason && (
                  <p className={cn(
                    'text-sm font-medium leading-snug mb-4',
                    asset.status === 'shredded' ? 'line-through text-muted-foreground/50' : 'text-foreground/80'
                  )}>
                    {asset.reason}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {asset.status === 'active' && <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/50" />}
                    {asset.status === 'promoted' && <CheckCircle2 className="w-3.5 h-3.5 text-lobe-chrono animate-pulse" />}
                    {asset.status === 'shredded' && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                    <span className="text-[10px] uppercase font-black tracking-[0.1em] text-muted-foreground/50">
                      {asset.status}
                    </span>
                  </div>
                  {asset.status !== 'shredded' && (
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}