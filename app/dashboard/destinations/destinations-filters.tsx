'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { DestinationStatus, GetDestinationsParams } from '@/lib/api/types';

const STATUS_OPTIONS: DestinationStatus[] = ['Active', 'Inactive', 'Suspended'];

interface DestinationsFiltersProps {
  params: GetDestinationsParams;
  onFilterChange: (key: string, value: string | null) => void;
}

export function DestinationsFilters({ params, onFilterChange }: DestinationsFiltersProps) {
  const t = useTranslations('destinations.filters');
  const ts = useTranslations('status.destination');
  const router = useRouter();

  const hasFilters = !!params.status;

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

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/destinations')}
        >
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
