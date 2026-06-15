import { Suspense } from 'react';
import { Metadata } from 'next';
import { OverviewStats } from './overview-stats';
import { OverviewChart } from './overview-chart';
import { OpenCircuitBreakers } from './open-circuit-breakers';
import { RecentCriticalEvents } from './recent-critical-events';
import { PageHeader } from '@/components/dashboard/page-header';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Visão Geral — HookSentry',
};

function StatsSkeletons() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão Geral"
        description="Resumo de saúde do sistema nas últimas 24 horas."
      />

      <Suspense fallback={<StatsSkeletons />}>
        <OverviewStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
            <OverviewChart />
          </Suspense>
        </div>
        <div className="space-y-4">
          <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
            <OpenCircuitBreakers />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-48 rounded-xl" />}>
        <RecentCriticalEvents />
      </Suspense>
    </div>
  );
}
