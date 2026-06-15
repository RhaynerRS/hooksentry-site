'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { EventStatus, GetEventsParams } from '@/lib/api/types';

const STATUS_OPTIONS: EventStatus[] = [
  'Pending',
  'Processing',
  'Succeeded',
  'Failed',
  'WaitingRetry',
  'CriticalFailure',
  'Cancelled',
  'AuthenticationFailed',
];

interface EventsFiltersProps {
  params: GetEventsParams;
  onFilterChange: (key: string, value: string | null) => void;
}

export function EventsFilters({ params, onFilterChange }: EventsFiltersProps) {
  const t = useTranslations('events.filters');
  const ts = useTranslations('status.event');
  const router = useRouter();

  const hasFilters = !!(params.status || params.destinationId || params.from || params.to);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{t('status')}</label>
        <select
          value={params.status ?? ''}
          onChange={e => onFilterChange('status', e.target.value || null)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">{t('statusAll')}</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{ts(s as Parameters<typeof ts>[0])}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{t('destinationId')}</label>
        <Input
          value={params.destinationId ?? ''}
          onChange={e => onFilterChange('destinationId', e.target.value || null)}
          placeholder={t('destinationPlaceholder')}
          className="h-9 w-56"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{t('from')}</label>
        <Input
          type="date"
          value={params.from ?? ''}
          onChange={e => onFilterChange('from', e.target.value || null)}
          className="h-9 w-40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">{t('to')}</label>
        <Input
          type="date"
          value={params.to ?? ''}
          onChange={e => onFilterChange('to', e.target.value || null)}
          className="h-9 w-40"
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/events')}
        >
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
