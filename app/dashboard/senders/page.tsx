'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { destinationsApi } from '@/lib/api/destinations';
import { sendersApi } from '@/lib/api/senders';
import { Destination, Sender } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { SendersTable } from './senders-table';

interface SenderRow extends Sender {
  destinationUrl: string;
}

const PAGE_SIZE = 20;

export default function SendersPage() {
  const t = useTranslations('senders');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allRows, setAllRows] = useState<SenderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') ?? 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { items: destinations } = await destinationsApi.list({ pageSize: 100 });
        const sendersByDest = await Promise.all(
          destinations.map((d: Destination) => sendersApi.listByDestination(d.id, { pageSize: 50 }))
        );
        const rows = sendersByDest.flatMap((res, i) =>
          res.items.map((s: Sender) => ({ ...s, destinationUrl: destinations[i].url }))
        );
        if (!cancelled) setAllRows(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteSuccess = (id: string) => setAllRows(prev => prev.filter(s => s.id !== id));

  const handlePageChange = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', String(p));
    router.push(`/dashboard/senders?${sp}`);
  };

  const pageRows = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader title={t('pageTitle')} description={t('pageDesc')} />
      <SendersTable
        senders={pageRows}
        total={allRows.length}
        page={page}
        pageSize={PAGE_SIZE}
        loading={loading}
        onDeleteSuccess={handleDeleteSuccess}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
