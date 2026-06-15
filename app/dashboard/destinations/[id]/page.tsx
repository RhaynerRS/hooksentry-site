'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { destinationsApi } from '@/lib/api/destinations';
import { sendersApi } from '@/lib/api/senders';
import { Destination, Sender } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { DestinationInfoCard } from './destination-info-card';
import { IngestTokenCard } from './ingest-token-card';
import { CircuitBreakerCard } from './circuit-breaker-card';
import { SendersSection } from './senders-section';
import { DangerZoneCard } from './danger-zone-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dest, setDest] = useState<Destination | null>(null);
  const [newToken, setNewToken] = useState<string | undefined>(undefined);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`hs_new_token_${id}`);
    if (stored) {
      setNewToken(stored);
      sessionStorage.removeItem(`hs_new_token_${id}`);
    }

    Promise.all([
      destinationsApi.get(id).catch(() => null),
      sendersApi.listByDestination(id, { pageSize: 50 }).catch(() => ({ items: [] as Sender[] })),
    ]).then(([d, s]) => {
      if (!d) { setNotFound(true); return; }
      setDest(d);
      setSenders(s.items);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-md" />
          <Skeleton className="h-48 rounded-md" />
          <Skeleton className="h-48 rounded-md" />
        </div>
      </div>
    );
  }

  if (notFound || !dest) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Destino não encontrado.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/destinations">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Destino"
        description={dest.url}
        action={
          <Button variant="outline" asChild>
            <Link href={`/dashboard/destinations/${id}/edit`}>Editar</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DestinationInfoCard destination={dest} onUpdated={setDest} />
        <IngestTokenCard destinationId={dest.id} initialToken={newToken ?? undefined} />
        <CircuitBreakerCard destination={dest} />
      </div>

      <SendersSection destinationId={dest.id} initialSenders={senders} />

      <DangerZoneCard destinationId={dest.id} />
    </div>
  );
}
