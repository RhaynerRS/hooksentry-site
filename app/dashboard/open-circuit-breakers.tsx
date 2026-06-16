'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircuitBreakerBadge } from '@/components/dashboard/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TruncatedText } from '@/components/ui/truncated-text';
import Link from 'next/link';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export function OpenCircuitBreakers() {
  const t = useTranslations('overview');
  const [open, setOpen] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    destinationsApi.list({ pageSize: 100 })
      .then(({ items }) => {
        setOpen(items.filter(d => d.circuitBreakerState === 'Open' || d.circuitBreakerState === 'HalfOpen'));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          {t('openCircuitBreakers')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        ) : open.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <div className="rounded-full bg-muted p-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-sm">{t('allClosed')}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {open.map(dest => (
              <li key={dest.id} className="flex items-center justify-between gap-2 text-sm">
                <Link href={`/dashboard/destinations/${dest.id}`} className="min-w-0 flex-1 hover:underline underline-offset-2">
                  <TruncatedText text={dest.url} className="font-mono text-xs text-muted-foreground" />
                </Link>
                <CircuitBreakerBadge state={dest.circuitBreakerState} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
