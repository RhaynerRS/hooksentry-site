'use client';

import { useTranslations } from 'next-intl';
import { Destination } from '@/lib/api/types';
import { CircuitBreakerBadge } from '@/components/dashboard/status-badge';

export function CircuitBreakerCard({ destination: dest }: { destination: Destination }) {
  const t = useTranslations('destinations.circuitBreaker');

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">{t('title')}</h3>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('stateLabel')}</dt>
          <dd><CircuitBreakerBadge state={dest.circuitBreakerState} /></dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('failuresLabel')}</dt>
          <dd>{dest.circuitBreakerFailures}</dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('thresholdLabel')}</dt>
          <dd>{t('thresholdValue')}</dd>
        </div>

        {(dest.circuitBreakerState === 'Open' || dest.circuitBreakerState === 'HalfOpen') && dest.circuitBreakerNextCheckAt && (
          <div>
            <dt className="text-xs text-muted-foreground mb-1">{t('nextCheckLabel')}</dt>
            <dd>{new Date(dest.circuitBreakerNextCheckAt).toLocaleString()}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
