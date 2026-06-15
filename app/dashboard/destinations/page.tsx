'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { DestinationsTable } from './destinations-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DestinationsPage() {
  const t = useTranslations('destinations');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    destinationsApi.list({ pageSize: 50 })
      .then(res => { setDestinations(res.items); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      <DestinationsTable destinations={destinations} total={total} loading={loading} />
    </div>
  );
}
