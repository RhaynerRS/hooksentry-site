'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Event } from '@/lib/api/types';
import { EventStatusBadge } from '@/components/dashboard/status-badge';
import { CopyButton } from '@/components/ui/copy-button';

function validDate(s: string | null | undefined): string | null {
  if (!s) return null;
  return new Date(s).getFullYear() > 1 ? s : null;
}

export function EventInfoCard({ event }: { event: Event }) {
  const t = useTranslations('events.detail');

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">{t('infoTitle')}</h3>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('id')}</dt>
          <dd className="flex items-center gap-1">
            <span className="font-mono text-xs break-all flex-1">{event.id}</span>
            <CopyButton value={event.id} className="shrink-0" />
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('destination')}</dt>
          <dd>
            <Link
              href={`/dashboard/destinations/${event.destinationId}`}
              className="text-xs text-primary underline-offset-4 hover:underline break-all"
            >
              {event.destinationUrl}
            </Link>
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('status')}</dt>
          <dd><EventStatusBadge status={event.status} /></dd>
        </div>

        {event.idempotencyKey && (
          <div>
            <dt className="text-xs text-muted-foreground mb-1">{t('idempotencyKey')}</dt>
            <dd className="font-mono text-xs break-all">{event.idempotencyKey}</dd>
          </div>
        )}

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('attempts')}</dt>
          <dd>{event.currentRetryCount}</dd>
        </div>

        {validDate(event.nextAttemptAt) && (
          <div>
            <dt className="text-xs text-muted-foreground mb-1">{t('nextAttempt')}</dt>
            <dd>{new Date(event.nextAttemptAt!).toLocaleString()}</dd>
          </div>
        )}

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('receivedAt')}</dt>
          <dd>{new Date(event.acceptedAt).toLocaleString()}</dd>
        </div>

        {validDate(event.deliveredAt) && (
          <div>
            <dt className="text-xs text-muted-foreground mb-1">{t('deliveredAt')}</dt>
            <dd>{new Date(event.deliveredAt!).toLocaleString()}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
