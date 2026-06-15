'use client';

import { useEffect, useState } from 'react';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { DestinationsTable } from './destinations-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DestinationsPage() {
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
        title="Destinos"
        description="URLs de destino para entrega de webhooks."
        action={
          <Button asChild>
            <Link href="/dashboard/destinations/new">Novo Destino</Link>
          </Button>
        }
      />
      <DestinationsTable destinations={destinations} total={total} loading={loading} />
    </div>
  );
}
