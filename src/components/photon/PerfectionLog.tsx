import { MindMapAsset, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';
import { Database, CheckCircle2, AlertTriangle, Trash2, ChevronRight } from 'lucide-react';

interface PerfectionLogProps {
  assets: MindMapAsset[];
  selectedAsset?: MindMapAsset | null;
  onSelectAsset?: (asset: MindMapAsset) => void;
}

export function PerfectionLog({ assets, selectedAsset, onSelectAsset }: PerfectionLogProps) {
  const sortedAssets = [...assets].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="panel-premium p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-header">Thought Assets</h3>
        <span className="text-[10px] text-muted-foreground/50 font-bold">
          {assets.length} REGISTERED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {sortedAssets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <Database className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-[10px] tracking-[0.2em] uppercase">No assets logged yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset?.(asset)}
                className={cn(
                  'group p-6 rounded-[1.5rem] border transition-all duration-300 cursor-pointer hover:scale-[1.02]',
                  selectedAsset?.id === asset.id && 'bg-primary/10 border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.15)]',
                  asset.status === 'shredded' && 'border-destructive/20 bg-destructive/5 opacity-40 grayscale',
                  asset.status === 'promoted' && selectedAsset?.id !== asset.id && 'border-lobe-chrono/30 bg-lobe-chrono/5',
                  asset.status === 'active' && selectedAsset?.id !== asset.id && 'border-white/5 bg-black/40 hover:border-white/10'
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-[10px] font-black px-2 py-0.5 rounded border uppercase',
                      asset.status === 'shredded' ? 'text-destructive border-destructive/30' : 
                      asset.status === 'promoted' ? 'text-lobe-chrono border-lobe-chrono/30' :
                      'text-primary border-primary/30'
                    )}>
                      {asset.id.slice(0, 7).toUpperCase()}
                    </span>
                    {asset.consensusWinner && asset.consensusWinner !== 'LEGACY' && (
                      <span className={cn(
                        'text-[9px] font-bold uppercase',
                        asset.consensusWinner === 'ALPHA' ? 'text-lobe-chrono' : 'text-lobe-dynamic'
                      )}>
                        {asset.consensusWinner}
                      </span>
                    )}
                  </div>
                  <ChevronRight className={cn(
                    'w-4 h-4 text-muted-foreground/30 transition-all',
                    selectedAsset?.id === asset.id && 'text-primary rotate-90'
                  )} />
                </div>

                {/* Title */}
                <p className={cn(
                  'text-sm font-bold mb-3 line-clamp-2',
                  asset.status === 'shredded' ? 'line-through text-muted-foreground/50' : 'text-foreground'
                )}>
                  {asset.prompt || asset.name}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    {asset.status === 'active' && <CheckCircle2 className="w-3 h-3 text-muted-foreground/50" />}
                    {asset.status === 'promoted' && <CheckCircle2 className="w-3 h-3 text-lobe-chrono animate-pulse" />}
                    {asset.status === 'shredded' && <Trash2 className="w-3 h-3 text-destructive" />}
                    <span className="text-muted-foreground/50 uppercase font-bold tracking-wider">
                      DENSITY: {asset.evidenceDensity || 0}
                    </span>
                  </div>
                  <span className="text-muted-foreground/40 font-bold">{asset.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
