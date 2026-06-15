'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { eventsApi } from '@/lib/api/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface Stats {
  total: number;
  succeeded: number;
  critical: number;
  pending: number;
}

export function OverviewStats() {
  const t = useTranslations('overview');
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const yesterday = new Date(Date.now() - 86400_000).toISOString();

    Promise.all([
      eventsApi.list({ pageSize: 1, from: yesterday }),
      eventsApi.list({ pageSize: 1, status: 'Succeeded', from: yesterday }),
      eventsApi.list({ pageSize: 1, status: 'CriticalFailure', from: yesterday }),
      eventsApi.list({ pageSize: 1, status: 'Pending' }),
    ]).then(([total, succeeded, critical, pending]) => {
      setStats({
        total: total.total,
        succeeded: succeeded.total,
        critical: critical.total,
        pending: pending.total,
      });
    }).catch(() => {
      setStats({ total: 0, succeeded: 0, critical: 0, pending: 0 });
    });
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const successRate = stats.total > 0
    ? Math.round((stats.succeeded / stats.total) * 100)
    : 100;

  const items = [
    {
      label: t('events24h'),
      value: stats.total.toLocaleString(),
      icon: Zap,
      description: t('totalAccepted'),
      highlight: 'normal' as const,
    },
    {
      label: t('successRate'),
      value: `${successRate}%`,
      icon: CheckCircle,
      description: t('deliveredCount', { count: stats.succeeded.toLocaleString() }),
      highlight: successRate < 90 ? 'warning' : 'normal',
    },
    {
      label: t('criticalFailure'),
      value: stats.critical.toLocaleString(),
      icon: AlertTriangle,
      description: t('awaitingReplay'),
      highlight: stats.critical > 0 ? 'error' : 'normal',
    },
    {
      label: t('pending'),
      value: stats.pending.toLocaleString(),
      icon: Clock,
      description: t('inQueueNow'),
      highlight: 'normal' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(stat => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className={
              stat.highlight === 'error' ? 'h-4 w-4 text-destructive' :
              stat.highlight === 'warning' ? 'h-4 w-4 text-orange-500' :
              'h-4 w-4 text-muted-foreground'
            } />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
