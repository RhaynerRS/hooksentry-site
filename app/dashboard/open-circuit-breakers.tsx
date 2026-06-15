'use client';

import { useEffect, useState } from 'react';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircuitBreakerBadge } from '@/components/dashboard/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export function OpenCircuitBreakers() {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          Circuit Breakers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        ) : open.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todos os destinos operando normalmente.</p>
        ) : (
          <ul className="space-y-2">
            {open.map(dest => (
              <li key={dest.id} className="flex items-center justify-between text-sm">
                <Link
                  href={`/dashboard/destinations/${dest.id}`}
                  className="truncate underline-offset-2 hover:underline max-w-[160px]"
                >
                  {dest.url}
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
