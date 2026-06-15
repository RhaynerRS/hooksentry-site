'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SecretDisplay({ value, label = 'Segredo' }: { value: string; label?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md border bg-muted p-3">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <code className={cn(
          'flex-1 font-mono text-sm break-all',
          !revealed && 'select-none tracking-widest',
        )}>
          {revealed ? value : '•'.repeat(Math.min(value.length, 40))}
        </code>
        <Button variant="ghost" size="icon" onClick={() => setRevealed(r => !r)}>
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={copy}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
