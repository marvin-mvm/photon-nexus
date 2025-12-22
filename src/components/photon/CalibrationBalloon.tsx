import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Archive, AlertTriangle, Sparkles } from 'lucide-react';

interface CalibrationBalloonProps {
  saturationPct: number;
  sessionId: string;
  experienceTitle?: string;
  onArchive?: () => void;
  isArchiving?: boolean;
}

export function CalibrationBalloon({
  saturationPct,
  sessionId,
  experienceTitle,
  onArchive,
  isArchiving = false,
}: CalibrationBalloonProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Animate pulse intensity based on saturation
  useEffect(() => {
    const intensity = Math.min((saturationPct - 85) / 15, 1);
    setPulseIntensity(intensity);
  }, [saturationPct]);

  const isCritical = saturationPct >= 95;

  return (
    <div className={cn(
      'relative my-8 mx-2',
      'animate-slide-in'
    )}>
      {/* Connector line above */}
      <div className="absolute left-8 -top-4 w-px h-4 bg-gradient-to-b from-transparent to-lobe-spatial/50" />

      {/* Main balloon container */}
      <div className={cn(
        'relative rounded-3xl border-2 overflow-hidden transition-all duration-500',
        isCritical 
          ? 'border-destructive/60 bg-destructive/10' 
          : 'border-lobe-spatial/40 bg-lobe-spatial/5',
        'shadow-[0_0_30px_hsl(var(--lobe-spatial)/0.2)]'
      )}>
        {/* Animated gradient overlay */}
        <div 
          className={cn(
            'absolute inset-0 opacity-20',
            'bg-gradient-to-r from-transparent via-lobe-spatial/30 to-transparent',
            'animate-shimmer'
          )}
          style={{ animationDuration: `${2 - pulseIntensity}s` }}
        />

        {/* Pulsing border effect */}
        {isCritical && (
          <div className="absolute inset-0 rounded-3xl animate-pulse border-2 border-destructive/50" />
        )}

        {/* Header */}
        <div 
          className={cn(
            'flex items-center justify-between px-6 py-4 cursor-pointer',
            'border-b border-white/5'
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-2xl border transition-all',
              isCritical 
                ? 'border-destructive/50 bg-destructive/20 text-destructive' 
                : 'border-lobe-spatial/50 bg-lobe-spatial/20 text-lobe-spatial',
              'animate-pulse-glow'
            )}>
              {isCritical ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Brain className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-[10px] font-black uppercase tracking-[0.2em]',
                  isCritical ? 'text-destructive' : 'text-lobe-spatial'
                )}>
                  Context Calibration Required
                </span>
                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full',
                  isCritical 
                    ? 'bg-destructive/30 text-destructive' 
                    : 'bg-lobe-spatial/30 text-lobe-spatial'
                )}>
                  {saturationPct}%
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                Session memory approaching threshold — preparing cognitive distillation
              </p>
            </div>
          </div>

          {/* Progress ring */}
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={isCritical ? 'hsl(var(--destructive))' : 'hsl(var(--lobe-spatial))'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(saturationPct / 100) * 126} 126`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className={cn(
                'w-4 h-4',
                isCritical ? 'text-destructive' : 'text-lobe-spatial'
              )} />
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-6 py-5 space-y-4">
            {/* Status explanation */}
            <div className="flex gap-4 items-start">
              <div className="w-1 h-full bg-gradient-to-b from-lobe-spatial/50 to-transparent rounded-full" />
              <div className="flex-1 space-y-3">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  The cognitive stream has reached <span className="text-lobe-spatial font-bold">{saturationPct}%</span> saturation. 
                  To maintain reasoning fidelity, this session will be distilled into the <span className="text-primary font-bold">Experience Table</span>.
                </p>
                
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="w-3 h-3 text-lobe-chrono" />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-lobe-chrono">
                      Archive Preview
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    <span className="text-foreground/70">Session ID:</span> {sessionId.slice(0, 8)}...
                  </p>
                  {experienceTitle && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      <span className="text-foreground/70">Experience:</span> {experienceTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action button */}
            {onArchive && (
              <button
                onClick={onArchive}
                disabled={isArchiving}
                className={cn(
                  'w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]',
                  'border transition-all duration-300',
                  'flex items-center justify-center gap-3',
                  isArchiving
                    ? 'bg-muted/50 border-white/5 text-muted-foreground cursor-not-allowed'
                    : 'bg-lobe-spatial/20 border-lobe-spatial/40 text-lobe-spatial hover:bg-lobe-spatial/30 hover:border-lobe-spatial/60'
                )}
              >
                {isArchiving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-lobe-spatial/30 border-t-lobe-spatial rounded-full animate-spin" />
                    Archiving Cognitive State...
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    Archive to Experience Table
                  </>
                )}
              </button>
            )}

            {/* Footer info */}
            <p className="text-[8px] text-center text-muted-foreground/50 uppercase tracking-[0.1em]">
              Post-archive, a fresh session will inherit the distilled wisdom via handover summary
            </p>
          </div>
        )}
      </div>

      {/* Connector line below */}
      <div className="absolute left-8 -bottom-4 w-px h-4 bg-gradient-to-b from-lobe-spatial/50 to-transparent" />
    </div>
  );
}
