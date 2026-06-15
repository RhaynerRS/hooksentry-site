'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { eventsApi } from '@/lib/api/events';
import { Event, EventStatus, GetEventsParams } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { EventsFilters } from './events-filters';
import { EventsTable } from './events-table';

export default function EventsPage() {
  const t = useTranslations('events');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const params: GetEventsParams = {
    page:          Number(searchParams.get('page') ?? 1),
    pageSize:      20,
    status:        (searchParams.get('status') as EventStatus) || undefined,
    destinationId: searchParams.get('destinationId') || undefined,
    from:          searchParams.get('from') || undefined,
    to:            searchParams.get('to') || undefined,
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventsApi.list(params);
      setEvents(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  const updateFilter = (key: string, value: string | null) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    if (key !== 'page') sp.delete('page');
    router.push(`/dashboard/events?${sp}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('pageTitle')} description={t('pageDesc')} />
      <EventsFilters params={params} onFilterChange={updateFilter} />
      <EventsTable
        events={events}
        total={total}
        page={params.page ?? 1}
        pageSize={20}
        loading={loading}
        onPageChange={p => updateFilter('page', String(p))}
        onReplaySuccess={load}
      />
    </div>
  );
}
