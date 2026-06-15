'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { EventInfoCard } from './event-info-card';
import { EventPayloadCard } from './event-payload-card';
import { EventLogsCard } from './event-logs-card';
import { EventReplayButton } from './event-replay-button';

export default function EventDetailPage() {
  const t = useTranslations('events.detail');
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    eventsApi.get(id)
      .then(setEvent)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-md" />
          <Skeleton className="h-64 rounded-md" />
        </div>
        <Skeleton className="h-32 rounded-md" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">{t('notFound')}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/events">{t('back')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t('pageTitle')} ${event.id.slice(0, 8)}…`}
        description={event.destinationUrl}
        action={
          event.status === 'CriticalFailure'
            ? <EventReplayButton eventId={event.id} onSuccess={load} />
            : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventInfoCard event={event} />
        <EventPayloadCard payload={event.payload} />
      </div>

      <EventLogsCard eventId={event.id} />
    </div>
  );
}
