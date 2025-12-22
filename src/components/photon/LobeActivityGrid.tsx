import { LobeType, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface LobeActivityGridProps {
  activeLobes: LobeType[];
}

const LOBES: LobeType[] = ['NUM', 'DYN', 'CHR', 'SPA', 'EVI', 'MIS'];

export function LobeActivityGrid({ activeLobes }: LobeActivityGridProps) {
  return (
    <div className="panel-premium p-8">
      <h3 className="section-header flex items-center gap-3 mb-8">
        <Activity className="w-4 h-4 text-primary" /> Lobe Activity
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {LOBES.map((lobe) => {
          const config = LOBE_CONFIG[lobe];
          const Icon = config.icon;
          const isActive = activeLobes.includes(lobe);

          return (
            <div
              key={lobe}
              className={cn(
                'p-5 rounded-[1.5rem] border transition-all duration-500 flex flex-col items-center gap-3 relative overflow-hidden',
                isActive
                  ? 'bg-foreground text-background border-foreground scale-105 z-10 shadow-2xl'
                  : 'bg-black/60 border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-70'
              )}
            >
              <Icon className={cn(
                'w-6 h-6 transition-all',
                isActive ? 'text-background' : config.className
              )} />
              <span className={cn(
                'text-[10px] font-black uppercase tracking-tight',
                isActive && 'text-background'
              )}>
                {config.name}
              </span>
              
              {/* Active pulse overlay */}
              {isActive && (
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}