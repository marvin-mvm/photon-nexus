import { useEffect, useRef, useState } from 'react';
import { LobeEntry, LOBE_CONFIG } from '@/types/photon';
import { cn } from '@/lib/utils';
import { 
  Terminal as TerminalIcon, Radio, AlertTriangle, Fingerprint, Workflow,
  Database, Scale, Megaphone, User, Send
} from 'lucide-react';

interface TerminalProps {
  entries: LobeEntry[];
  contextSaturation?: number;
  isAuthenticated?: boolean;
  isThinking?: boolean;
  onSubmit?: (message: string) => void;
}

// XOR text scramble effect with premium character set
function XORText({ text, isRevealing }: { text: string; isRevealing: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = '01#$@%&*<>?/';

  useEffect(() => {
    if (!isRevealing) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iterations += 0.5;

      if (iterations >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text, isRevealing]);

  return <span className={cn(isRevealing && 'animate-flicker')}>{displayText}</span>;
}

// Context Calibration Bridge - inline system notification
function CalibrationBridge({ entry }: { entry: LobeEntry }) {
  return (
    <div className="animate-slide-in">
      <div className="bg-gradient-to-r from-lobe-spatial/20 via-lobe-spatial/10 to-lobe-spatial/20 border border-lobe-spatial/40 rounded-2xl p-6 relative overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lobe-spatial/10 to-transparent animate-pulse" />
        
        <div className="relative flex items-start gap-4">
          <div className="p-2.5 rounded-xl border border-lobe-spatial/50 bg-lobe-spatial/20">
            <Workflow className="w-5 h-5 text-lobe-spatial" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black text-lobe-spatial uppercase tracking-[0.15em]">
                Context Calibration Bridge
              </span>
              <div className="w-2 h-2 rounded-full bg-lobe-spatial animate-pulse shadow-[0_0_8px_hsl(var(--lobe-spatial))]" />
            </div>
            <p className="text-sm text-lobe-spatial/90 leading-relaxed">
              {entry.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Get icon for entry type
function getEntryIcon(type?: string) {
  switch (type) {
    case 'INGEST': return Database;
    case 'ADJUDICATION': return Scale;
    case 'PROMOTION': return Megaphone;
    case 'USER': return User;
    case 'ALERT': return AlertTriangle;
    default: return null;
  }
}

function TerminalEntry({ entry }: { entry: LobeEntry }) {
  const config = LOBE_CONFIG[entry.lobe];
  const Icon = config.icon;
  
  const isConflict = entry.type === 'CONFLICT' || entry.type === 'SHRED';
  const isSuccess = entry.type === 'SUCCESS' || entry.type === 'PROMOTION';
  const isSelf = entry.type === 'SELF';
  const isMirror = entry.type === 'MIRROR';
  const isSystem = entry.type === 'SYSTEM' || entry.type === 'CALIBRATION';
  const isUser = entry.type === 'USER';
  const isIngest = entry.type === 'INGEST';
  const isAdjudication = entry.type === 'ADJUDICATION';
  const isAlert = entry.type === 'ALERT';

  // Render special Calibration Bridge for SYSTEM entries
  if (isSystem) {
    return <CalibrationBridge entry={entry} />;
  }

  // Render USER entry with distinct styling
  if (isUser) {
    return (
      <div className="flex gap-6 animate-slide-in justify-end">
        <div className="flex-1 min-w-0 max-w-[80%]">
          <div className="flex items-center gap-3 mb-2 justify-end">
            <span className="text-[9px] text-muted-foreground/50 font-mono">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-[10px] font-black text-primary flex items-center gap-1">
              <User className="w-3 h-3" /> USER INPUT
            </span>
          </div>
          <div className="p-5 rounded-3xl border bg-primary/10 border-primary/30 text-foreground">
            {entry.message}
          </div>
        </div>
        <div className="flex-none">
          <div className="p-3 rounded-2xl border border-primary/30 bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  const TypeIcon = getEntryIcon(entry.type);

  return (
    <div className="flex gap-6 animate-slide-in">
      {/* Icon container */}
      <div className="flex-none">
        <div className={cn(
          'p-3 rounded-2xl border bg-black/60 shadow-lg transition-all duration-300',
          config.borderClass
        )}>
          <Icon className={cn('w-5 h-5', config.className)} />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-2">
          <span className={cn(
            'text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-[0.15em]',
            config.className,
            config.borderClass,
            'bg-current/5'
          )}>
            {config.name}
          </span>
          
          {entry.type === 'CONFLICT' && (
            <span className="text-[10px] font-black text-destructive flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> ANOMALY DETECTED
            </span>
          )}
          {isMirror && (
            <span className="text-[10px] font-black text-primary flex items-center gap-1">
              <Radio className="w-3 h-3" /> Neural Mirror Match
            </span>
          )}
          {isIngest && TypeIcon && (
            <span className="text-[10px] font-black text-lobe-evidence flex items-center gap-1">
              <TypeIcon className="w-3 h-3" /> L1-L2 Ingestion
            </span>
          )}
          {isAdjudication && TypeIcon && (
            <span className="text-[10px] font-black text-lobe-dynamic flex items-center gap-1">
              <TypeIcon className="w-3 h-3" /> Consensus Decision
            </span>
          )}
          {entry.type === 'PROMOTION' && TypeIcon && (
            <span className="text-[10px] font-black text-lobe-chrono flex items-center gap-1">
              <TypeIcon className="w-3 h-3" /> Asset Created
            </span>
          )}
          {isAlert && (
            <span className="text-[10px] font-black text-destructive flex items-center gap-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> THRESHOLD ALERT
            </span>
          )}
          
          <span className="text-[9px] text-muted-foreground/50 font-mono ml-auto">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        {/* Message bubble */}
        <div className={cn(
          'p-5 rounded-3xl border text-sm leading-relaxed transition-all',
          isConflict && 'bg-destructive/10 border-destructive/30 text-destructive/90',
          isSuccess && 'bg-lobe-chrono/10 border-lobe-chrono/30 text-lobe-chrono font-bold',
          isSelf && 'bg-white/5 border-white/10 text-foreground italic shadow-inner',
          isMirror && 'bg-primary/15 border-primary/40 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.15)]',
          isIngest && 'bg-lobe-evidence/10 border-lobe-evidence/30 text-lobe-evidence',
          isAdjudication && 'bg-lobe-dynamic/10 border-lobe-dynamic/30 text-lobe-dynamic',
          isAlert && 'bg-destructive/15 border-destructive/40 text-destructive animate-pulse',
          !isConflict && !isSuccess && !isSelf && !isMirror && !isIngest && !isAdjudication && !isAlert && 
            'bg-black/40 border-white/5 text-foreground/70'
        )}>
          {entry.type === 'XOR' ? (
            <XORText text={entry.message} isRevealing={entry.isRevealing || false} />
          ) : (
            entry.message
          )}
        </div>
      </div>
    </div>
  );
}

export function Terminal({ 
  entries, 
  contextSaturation = 0, 
  isAuthenticated = true,
  isThinking = false,
  onSubmit 
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  // Determine saturation color
  const getSaturationColor = () => {
    if (contextSaturation >= 85) return 'text-destructive';
    if (contextSaturation >= 50) return 'text-lobe-spatial';
    return 'text-lobe-chrono';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isAuthenticated || isThinking) return;
    onSubmit?.(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="panel-premium flex flex-col h-full">
      {/* Premium gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="bg-white/[0.02] px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            'p-2 rounded-xl border transition-all',
            entries.length > 0 ? 'border-primary/50 bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground'
          )}>
            <TerminalIcon className="w-4 h-4" />
          </div>
          <span className="section-header">Cognitive Stream Output</span>
        </div>
        <div className="flex items-center gap-6 text-[9px] font-bold">
          {/* Context Saturation Display */}
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full transition-colors',
              contextSaturation >= 85 ? 'bg-destructive animate-pulse' : 
              contextSaturation >= 50 ? 'bg-lobe-spatial' : 'bg-lobe-chrono'
            )} />
            <span className={cn('uppercase tracking-wider', getSaturationColor())}>
              Context: {contextSaturation}%
            </span>
          </div>
          <span className="text-muted-foreground/50">ENCRYPTED_LINE_V1</span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-10 space-y-7 scrollbar-hide"
      >
        {entries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <Fingerprint className="w-20 h-20 text-muted-foreground mb-6 animate-pulse" />
            <p className="text-sm tracking-[0.2em] uppercase font-black">System Awaiting Instruction</p>
            <p className="text-[10px] mt-2 text-muted-foreground/50">HNSW Vector Search Active</p>
          </div>
        ) : (
          entries.map((entry) => <TerminalEntry key={entry.id} entry={entry} />)
        )}

        {/* Cursor at bottom */}
        {entries.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-primary/60">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stream Active</span>
            <span className="animate-cursor ml-2">▋</span>
          </div>
        )}
      </div>

      {/* Command Input */}
      {onSubmit && (
        <div className="p-6 border-t border-white/5">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isAuthenticated || isThinking}
              placeholder={isAuthenticated ? "Initiate Thought Construction..." : "Ground entropy to begin..."}
              className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] py-5 px-8 pr-16 text-sm focus:outline-none focus:border-primary/50 transition-all disabled:opacity-30 placeholder:text-muted-foreground/40"
            />
            <button
              type="submit"
              disabled={!isAuthenticated || isThinking || !inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-30 disabled:hover:bg-primary/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
