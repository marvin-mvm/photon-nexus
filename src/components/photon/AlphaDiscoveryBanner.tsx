import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlphaDiscoveryBannerProps {
  credits: number;
  maxCredits?: number;
}

export function AlphaDiscoveryBanner({ credits, maxCredits = 50 }: AlphaDiscoveryBannerProps) {
  const isDepleted = credits <= 0;
  
  return (
    <div className={cn(
      'border-b px-6 py-3 flex items-center justify-between transition-colors',
      isDepleted 
        ? 'bg-destructive/10 border-destructive/30' 
        : 'bg-gradient-to-r from-lobe-spatial/10 via-lobe-spatial/5 to-lobe-spatial/10 border-lobe-spatial/30'
    )}>
      {/* Left: Icon and Title */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-1.5 rounded-lg border',
          isDepleted
            ? 'border-destructive/30 bg-destructive/10'
            : 'border-lobe-spatial/30 bg-lobe-spatial/10'
        )}>
          <Megaphone className={cn(
            'w-3.5 h-3.5',
            isDepleted ? 'text-destructive' : 'text-lobe-spatial'
          )} />
        </div>
        <span className={cn(
          'text-[10px] font-black uppercase tracking-[0.12em]',
          isDepleted ? 'text-destructive' : 'text-lobe-spatial'
        )}>
          {isDepleted ? 'Discovery Phase Complete' : 'Public Test Phase Active: Explore Self-Improving AGI Grounded in Physical Entropy'}
        </span>
      </div>
      
      {/* Right: Credits Counter */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm',
        isDepleted
          ? 'border-destructive/30 bg-destructive/10'
          : 'border-lobe-spatial/30 bg-black/40'
      )}>
        <span className={cn(
          'text-[11px] font-black',
          isDepleted ? 'text-destructive' : 'text-lobe-spatial'
        )}>
          {credits}/{maxCredits}
        </span>
        <span className={cn(
          'text-[9px] uppercase tracking-wide',
          isDepleted ? 'text-destructive/70' : 'text-muted-foreground'
        )}>
          Experiment Tokens
        </span>
      </div>
    </div>
  );
}
