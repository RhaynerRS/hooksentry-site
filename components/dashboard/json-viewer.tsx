'use client';

import { cn } from '@/lib/utils';

interface JsonViewerProps {
  value: unknown;
  className?: string;
}

export function JsonViewer({ value, className }: JsonViewerProps) {
  let formatted: string;
  try {
    formatted = JSON.stringify(value, null, 2);
  } catch {
    formatted = String(value);
  }

  return (
    <pre
      className={cn(
        'rounded-md bg-muted p-4 text-xs font-mono overflow-auto max-h-96 whitespace-pre-wrap break-all',
        className,
      )}
    >
      {formatted}
    </pre>
  );
}
