'use client';

import { useEffect, useState } from 'react';
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
      label: 'Eventos (24h)',
      value: stats.total.toLocaleString('pt-BR'),
      icon: Zap,
      description: 'Total aceitos',
      highlight: 'normal' as const,
    },
    {
      label: 'Taxa de Sucesso',
      value: `${successRate}%`,
      icon: CheckCircle,
      description: `${stats.succeeded.toLocaleString('pt-BR')} entregues`,
      highlight: successRate < 90 ? 'warning' : 'normal',
    },
    {
      label: 'Falha Crítica',
      value: stats.critical.toLocaleString('pt-BR'),
      icon: AlertTriangle,
      description: 'Aguardando replay',
      highlight: stats.critical > 0 ? 'error' : 'normal',
    },
    {
      label: 'Pendentes',
      value: stats.pending.toLocaleString('pt-BR'),
      icon: Clock,
      description: 'Na fila agora',
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
