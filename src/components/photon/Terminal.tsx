import { useEffect, useRef, useState } from 'react';
import { LobeEntry, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';

interface TerminalProps {
  entries: LobeEntry[];
}

// XOR text scramble effect
function XORText({ text, isRevealing }: { text: string; isRevealing: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  useEffect(() => {
    if (!isRevealing) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const maxIterations = 8;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += text.length / maxIterations;

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, isRevealing]);

  return <span className={cn(isRevealing && 'animate-flicker')}>{displayText}</span>;
}

function TerminalEntry({ entry }: { entry: LobeEntry }) {
  const config = LOBE_CONFIG[entry.lobe];

  return (
    <div className={cn('flex gap-2 py-1 animate-slide-in', entry.isRevealing && 'opacity-80')}>
      <span className={cn('font-bold', config.className)}>[{entry.lobe}]</span>
      <span className="text-foreground/90">
        <XORText text={entry.message} isRevealing={entry.isRevealing || false} />
      </span>
    </div>
  );
}

export function Terminal({ entries }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-lobe-spatial/80" />
          <div className="w-3 h-3 rounded-full bg-lobe-chrono/80" />
        </div>
        <h2 className="text-sm font-semibold text-primary glow-text">6-LOBE INTERNAL DIALOGUE</h2>
        <div className="w-16" />
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm terminal-text scanlines"
      >
        {entries.length === 0 ? (
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="animate-cursor">▋</span>
            <span>Awaiting mission parameters...</span>
          </div>
        ) : (
          entries.map((entry) => <TerminalEntry key={entry.id} entry={entry} />)
        )}

        {/* Cursor at bottom */}
        {entries.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-primary">
            <span className="animate-cursor">▋</span>
          </div>
        )}
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20" />
    </div>
  );
}
