'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  text: string;
  className?: string;
}

export function TruncatedText({ text, className }: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('truncate block cursor-default', className)}>{text}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm break-all font-mono text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
