'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/api/types';
import { EventStatusBadge } from '@/components/dashboard/status-badge';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { Pagination } from '@/components/dashboard/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface EventsTableProps {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onReplaySuccess: () => void;
}

export function EventsTable({
  events,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onReplaySuccess,
}: EventsTableProps) {
  const t = useTranslations('events.table');
  const tr = useTranslations('events.replay');
  const [replayId, setReplayId] = useState<string | null>(null);
  const [replaying, setReplaying] = useState(false);

  const handleReplay = async () => {
    if (!replayId) return;
    setReplaying(true);
    try {
      await eventsApi.replay(replayId);
      setReplayId(null);
      onReplaySuccess();
    } finally {
      setReplaying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-md" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('eventId')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('destination')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('status')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('attempts')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('received')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('delivered')}</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.map(event => (
              <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs">
                  <span title={event.id}>{event.id.slice(0, 8)}…</span>
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <span className="truncate block text-xs text-muted-foreground" title={event.destinationUrl}>
                    {event.destinationUrl}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <EventStatusBadge status={event.status} />
                </td>
                <td className="px-4 py-3 tabular-nums">{event.currentRetryCount}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(event.acceptedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {event.deliveredAt ? new Date(event.deliveredAt).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/events/${event.id}`}>{t('view')}</Link>
                    </Button>
                    {event.status === 'CriticalFailure' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setReplayId(event.id)}
                      >
                        {t('replay')}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />

      <ConfirmDialog
        open={!!replayId}
        onOpenChange={open => { if (!open) setReplayId(null); }}
        title={tr('confirmTitle')}
        description={tr('confirmDesc')}
        confirmLabel={tr('confirmLabel')}
        loading={replaying}
        onConfirm={handleReplay}
      />
    </div>
  );
}
