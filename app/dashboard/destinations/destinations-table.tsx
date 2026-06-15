'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Destination } from '@/lib/api/types';
import { DestinationStatusBadge, CircuitBreakerBadge } from '@/components/dashboard/status-badge';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Pagination } from '@/components/dashboard/pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Webhook } from 'lucide-react';

interface DestinationsTableProps {
  destinations: Destination[];
  total: number;
  page: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export function DestinationsTable({ destinations, total, page, pageSize, loading, onPageChange }: DestinationsTableProps) {
  const t = useTranslations('destinations');

  if (loading) return <Skeleton className="h-48 rounded-md" />;

  if (destinations.length === 0) {
    return (
      <EmptyState
        icon={Webhook}
        title={t('empty.title')}
        description={t('empty.description')}
        action={
          <Button asChild>
            <Link href="/dashboard/destinations/new">{t('empty.action')}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">{t('table.url')}</th>
              <th className="px-4 py-3 text-left font-medium">{t('table.status')}</th>
              <th className="px-4 py-3 text-left font-medium">{t('table.circuitBreaker')}</th>
              <th className="px-4 py-3 text-left font-medium">{t('table.rateLimit')}</th>
              <th className="px-4 py-3 text-left font-medium">{t('table.auth')}</th>
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
                        {t('table.failures', { count: dest.circuitBreakerFailures })}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{dest.serverRateLimit} req/s</td>
                <td className="px-4 py-3 text-muted-foreground">{dest.authType ?? '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/destinations/${dest.id}`}>{t('table.details')}</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination total={total} page={page} pageSize={pageSize} onPageChange={onPageChange} />
    </div>
  );
}
