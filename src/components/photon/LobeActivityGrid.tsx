import { LobeType, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';
import { Binary, Zap, Clock, Compass, Search, Target } from 'lucide-react';

interface LobeActivityGridProps {
  activeLobes: LobeType[];
}

const LOBE_ICONS: Record<LobeType, React.ElementType> = {
  NUM: Binary,
  DYN: Zap,
  CHR: Clock,
  SPA: Compass,
  EVI: Search,
  MIS: Target,
};

const LOBES: LobeType[] = ['NUM', 'DYN', 'CHR', 'SPA', 'EVI', 'MIS'];

export function LobeActivityGrid({ activeLobes }: LobeActivityGridProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Lobe Activity
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {LOBES.map((lobe) => {
          const Icon = LOBE_ICONS[lobe];
          const config = LOBE_CONFIG[lobe];
          const isActive = activeLobes.includes(lobe);

          return (
            <div
              key={lobe}
              className={cn(
                'flex flex-col items-center justify-center p-3 rounded-md border transition-all duration-300',
                isActive
                  ? 'border-current bg-current/10 animate-pulse-glow'
                  : 'border-border bg-muted/20'
              )}
              style={isActive ? { color: `hsl(var(--${config.color}))` } : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 mb-1 transition-colors',
                  isActive ? config.className : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-bold uppercase',
                  isActive ? config.className : 'text-muted-foreground'
                )}
              >
                {lobe}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
