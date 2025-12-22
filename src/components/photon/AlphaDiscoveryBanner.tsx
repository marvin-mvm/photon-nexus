import { Megaphone, History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlphaDiscoveryBannerProps {
  credits: number;
  maxCredits?: number;
}

export function AlphaDiscoveryBanner({ credits, maxCredits = 50 }: AlphaDiscoveryBannerProps) {
  const isDepleted = credits <= 0;
  
  return (
    <div className={cn(
      'border-b px-6 py-4 flex items-center justify-between transition-colors',
      isDepleted 
        ? 'bg-destructive/10 border-destructive/30' 
        : 'bg-lobe-spatial/10 border-lobe-spatial/30'
    )}>
      {/* Left: Icon and Title */}
      <div className="flex items-center gap-4">
        <div className={cn(
          'p-2 rounded-xl border',
          isDepleted
            ? 'border-destructive/30 bg-destructive/10'
            : 'border-lobe-spatial/30 bg-lobe-spatial/10'
        )}>
          <Megaphone className={cn(
            'w-4 h-4',
            isDepleted ? 'text-destructive' : 'text-lobe-spatial'
          )} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <History className={cn(
              'w-3 h-3',
              isDepleted ? 'text-destructive' : 'text-lobe-spatial'
            )} />
            <span className={cn(
              'text-[11px] font-black uppercase tracking-[0.15em]',
              isDepleted ? 'text-destructive' : 'text-lobe-spatial'
            )}>
              {isDepleted ? 'Discovery Phase Complete' : 'Sovereignty Node Discovery Phase Active'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Center: Description */}
      <div className="hidden lg:block">
        <p className="text-[10px] text-muted-foreground max-w-md text-center">
          {isDepleted 
            ? 'All training tokens consumed. Thank you for refining the Neural Mirror.'
            : 'Access restricted to 50 training tokens per node. Self-improvement cycle is live. Your prompts refine the Neural Mirror.'
          }
        </p>
      </div>
      
      {/* Right: Credits Counter */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm',
        isDepleted
          ? 'border-destructive/30 bg-destructive/10'
          : 'border-lobe-spatial/30 bg-lobe-spatial/10'
      )}>
        <span className={cn(
          'text-[11px] font-black tracking-wide',
          isDepleted ? 'text-destructive' : 'text-lobe-spatial'
        )}>
          {credits}/{maxCredits}
        </span>
        <span className={cn(
          'text-[9px] uppercase tracking-widest',
          isDepleted ? 'text-destructive/70' : 'text-lobe-spatial/70'
        )}>
          Tokens Remaining
        </span>
      </div>
    </div>
  );
}
