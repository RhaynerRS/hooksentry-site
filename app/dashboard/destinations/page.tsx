'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination, DestinationStatus, GetDestinationsParams } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { DestinationsFilters } from './destinations-filters';
import { DestinationsTable } from './destinations-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PAGE_SIZE = 20;

export default function DestinationsPage() {
  const t = useTranslations('destinations');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const params: GetDestinationsParams = {
    page:     Number(searchParams.get('page') ?? 1),
    pageSize: PAGE_SIZE,
    status:   (searchParams.get('status') as DestinationStatus) || undefined,
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await destinationsApi.list(params);
      setDestinations(res.items);
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
    router.push(`/dashboard/destinations?${sp}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDesc')}
        action={
          <Button asChild>
            <Link href="/dashboard/destinations/new">{t('newButton')}</Link>
          </Button>
        }
      />
      <DestinationsFilters params={params} onFilterChange={updateFilter} />
      <DestinationsTable
        destinations={destinations}
        total={total}
        page={params.page ?? 1}
        pageSize={PAGE_SIZE}
        loading={loading}
        onPageChange={p => updateFilter('page', String(p))}
      />
    </div>
  );
}
