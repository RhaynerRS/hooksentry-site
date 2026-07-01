'use client';

import { useTranslations } from 'next-intl';
import { UsageResponse } from '@/lib/api/types';

interface Props {
  usage: UsageResponse;
}

export function UsageCard({ usage }: Props) {
  const t = useTranslations('settings.usage');
  const { events } = usage.usage;
  const pct = Math.min(events.percentage, 100);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        <span className="text-xs text-muted-foreground">{usage.period}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('events')}</span>
          <span className={events.warning ? 'font-medium text-amber-600 dark:text-amber-400' : 'font-medium'}>
            {events.current} / {events.limit}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full ${events.warning ? 'bg-amber-500' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {events.warning && (
          <p className="text-xs text-amber-600 dark:text-amber-400">{t('warning')}</p>
        )}
      </div>
    </div>
  );
}
