import { MindMapAsset, LogicChip, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';
import { X, FileText, Cpu, ExternalLink } from 'lucide-react';
import React from 'react';

interface AuditTrailProps {
  asset: MindMapAsset;
  onClose: () => void;
}

export function AuditTrail({ asset, onClose }: AuditTrailProps) {
  return (
    <div className="panel-premium p-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl border border-primary/30 bg-primary/10">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-black text-primary uppercase tracking-[0.1em]">
            Audit: {asset.id.slice(0, 7).toUpperCase()}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide">
        {/* L1 Physical Proof Section */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Physical Proof (L1 Markdown)
          </h4>
          <div className="bg-black/60 border border-white/5 rounded-2xl p-5">
            {asset.l1Markdown ? (
              <pre className="text-xs text-foreground/70 whitespace-pre-wrap font-mono leading-relaxed">
                {asset.l1Markdown}
              </pre>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic">
                No L1 data available. Physical proof pending ingestion.
              </p>
            )}
          </div>
        </div>

        {/* L2 Logic Chips Section */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            Logic Chips (L2 Glossary Map)
          </h4>
          
          {asset.chips && asset.chips.length > 0 ? (
            <div className="space-y-3">
              {asset.chips.map((chip) => {
                const config = LOBE_CONFIG[chip.type];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={chip.id}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-xl border',
                      config.borderClass,
                      config.bgClass
                    )}
                  >
                    <div className={cn('p-1.5 rounded-lg', config.bgClass)}>
                      <Icon className={cn('w-3 h-3', config.className)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium', config.className)}>
                        {chip.logic}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1">
                        Shards: {chip.shardRefs.join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground/50 italic">
                No Logic Chips extracted yet.
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-white/5">
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div>
              <span className="text-muted-foreground/50 uppercase tracking-wider">Consensus</span>
              <p className={cn(
                'font-black mt-1',
                asset.consensusWinner === 'ALPHA' && 'text-lobe-chrono',
                asset.consensusWinner === 'BETA' && 'text-lobe-dynamic',
                asset.consensusWinner === 'LEGACY' && 'text-muted-foreground'
              )}>
                {asset.consensusWinner || 'LEGACY'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground/50 uppercase tracking-wider">Evidence Density</span>
              <p className="font-black text-primary mt-1">
                {asset.evidenceDensity || 0} SHARDS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all text-[10px] font-black uppercase tracking-[0.15em]">
          <ExternalLink className="w-3 h-3" />
          Export Thought DNA
        </button>
      </div>
    </div>
  );
}
