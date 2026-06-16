'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { sendersApi } from '@/lib/api/senders';
import { destinationsApi } from '@/lib/api/destinations';
import { SenderDetail, Destination } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { SenderInfoCard } from './sender-info-card';
import { SenderIngestTokenCard } from './sender-ingest-token-card';
import { SenderMappingSection } from './sender-mapping-section';
import { SenderDangerZone } from './sender-danger-zone';

export default function SenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('senders');
  const [sender, setSender] = useState<SenderDetail | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [mapping, setMapping] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await sendersApi.get(id);
        const dest = await destinationsApi.get(s.destinationId);

        let mappingData: Record<string, unknown> | null = null;
        try {
          const mappingRes = await sendersApi.getMapping(id);
          mappingData = mappingRes.mapping;
        } catch {
          // 404 means no mapping configured — not an error
        }

        if (!cancelled) {
          setSender(s);
          setDestination(dest);
          setMapping(mappingData);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-32" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (notFound || !sender || !destination) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('detail.notFound')}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/senders">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('detail.back')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard/senders">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('detail.back')}
          </Link>
        </Button>
      </div>

      <PageHeader
        title={sender.label ?? t('table.noName')}
        description={destination.url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SenderInfoCard sender={sender} destination={destination} />
        <SenderIngestTokenCard senderId={sender.id} />
      </div>

      <SenderMappingSection senderId={sender.id} mapping={mapping} />

      <SenderDangerZone senderId={sender.id} label={sender.label} />
    </div>
  );
}
