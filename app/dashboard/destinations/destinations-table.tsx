'use client';

import Link from 'next/link';
import { Destination } from '@/lib/api/types';
import { DestinationStatusBadge, CircuitBreakerBadge } from '@/components/dashboard/status-badge';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Webhook } from 'lucide-react';

interface DestinationsTableProps {
  destinations: Destination[];
  total: number;
  loading?: boolean;
}

export function DestinationsTable({ destinations, loading }: DestinationsTableProps) {
  if (loading) {
    return <Skeleton className="h-48 rounded-md" />;
  }

  if (destinations.length === 0) {
    return (
      <EmptyState
        icon={Webhook}
        title="Nenhum destino cadastrado"
        description="Crie seu primeiro destino para começar a receber webhooks."
        action={
          <Button asChild>
            <Link href="/dashboard/destinations/new">Criar Destino</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">URL</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Circuit Breaker</th>
            <th className="px-4 py-3 text-left font-medium">Rate Limit</th>
            <th className="px-4 py-3 text-left font-medium">Auth</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {destinations.map(dest => (
            <tr key={dest.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs max-w-[280px] truncate">{dest.url}</td>
              <td className="px-4 py-3">
                <DestinationStatusBadge status={dest.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <CircuitBreakerBadge state={dest.circuitBreakerState} />
                  {(dest.circuitBreakerState === 'Open' || dest.circuitBreakerState === 'HalfOpen') && (
                    <span className="text-xs text-muted-foreground">
                      {dest.circuitBreakerFailures} falha(s)
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">{dest.serverRateLimit} req/s</td>
              <td className="px-4 py-3 text-muted-foreground">{dest.authType ?? '—'}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/destinations/${dest.id}`}>Detalhes</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
