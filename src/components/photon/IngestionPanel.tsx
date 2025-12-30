import { Layers, Zap } from 'lucide-react';
import { LobeType, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';

interface IngestionPanelProps {
  sourceMaterial: string;
  onSourceMaterialChange: (value: string) => void;
  isLiveMode: boolean;
  isThinking: boolean;
  activeLobes: LobeType[];
}

export function IngestionPanel({
  sourceMaterial,
  onSourceMaterialChange,
  isLiveMode,
  isThinking,
  activeLobes
}: IngestionPanelProps) {
  return (
    <div className="panel-premium h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-white/5">
        <Layers className="w-5 h-5 text-primary" />
        <h2 className="section-header">Ingestion Engine</h2>
        {isLiveMode && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Zap className="w-3 h-3 text-lobe-spatial animate-pulse" />
            <span className="text-[9px] font-black text-lobe-spatial uppercase">
              LIVE AI
            </span>
          </div>
        )}
      </div>

      {/* L1 Markdown Input */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            L1 Markdown Source Material
          </p>
          {isLiveMode && !sourceMaterial && (
            <span className="text-[8px] font-bold text-destructive uppercase animate-pulse">
              Required for Live AI
            </span>
          )}
        </div>
        <textarea
          value={sourceMaterial}
          onChange={(e) => onSourceMaterialChange(e.target.value)}
          placeholder="Paste document content here for Live AI ingestion...

Example:
Price hit 200 EMA at $42k. Bullish divergence on RSI.
Volume spike 2.3x average on breakout candle.
Support zone established at $38,500-$39,200.

This context will be processed by the 6-lobe system for cognitive synthesis."
          className={cn(
            "flex-1 bg-background border rounded-2xl p-4 text-[11px] leading-relaxed",
            "outline-none resize-none font-mono",
            "placeholder:text-muted-foreground/30 placeholder:leading-relaxed",
            "transition-all duration-300",
            isLiveMode && !sourceMaterial
              ? "border-destructive/30 focus:border-destructive/50"
              : "border-white/10 focus:border-primary/50"
          )}
        />
        {sourceMaterial && (
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
            <span className="font-bold uppercase">Words:</span>
            <span className="text-foreground font-black">
              {sourceMaterial.split(/\s+/).filter(Boolean).length}
            </span>
            <span className="mx-2 text-white/10">|</span>
            <span className="font-bold uppercase">Chars:</span>
            <span className="text-foreground font-black">{sourceMaterial.length}</span>
          </div>
        )}
      </div>

      {/* Hexalobe Status Grid */}
      <div className="p-6 border-t border-white/5">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">
          Hexalobe Status
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(LOBE_CONFIG) as [LobeType, typeof LOBE_CONFIG[LobeType]][]).map(([key, config]) => {
            const isActive = activeLobes.includes(key);
            const Icon = config.icon;
            
            return (
              <div
                key={key}
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2 transition-all duration-300",
                  isActive
                    ? `${config.bgClass} ${config.borderClass}`
                    : "border-white/5 opacity-40"
                )}
              >
                <Icon className={cn(
                  "w-3 h-3 transition-all",
                  isActive ? config.className : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-[8px] font-black uppercase",
                  isActive ? config.className : "text-muted-foreground"
                )}>
                  {config.name}
                </span>
                {isActive && isThinking && (
                  <div className={cn(
                    "ml-auto w-1.5 h-1.5 rounded-full animate-pulse",
                    config.className.replace('text-', 'bg-')
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
