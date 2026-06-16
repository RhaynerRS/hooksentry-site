'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { eventsApi } from '@/lib/api/events';

type ChartRow = {
  date: string;
  delivered: number;
  criticalFailure: number;
  retry: number;
};

export function OverviewChart() {
  const t = useTranslations('overview');
  const [data, setData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
      });

      const results = await Promise.all(
        days.map(async d => {
          const from = new Date(d.setHours(0, 0, 0, 0)).toISOString();
          const to   = new Date(d.setHours(23, 59, 59, 999)).toISOString();

          const [succeeded, critical, waiting] = await Promise.all([
            eventsApi.list({ pageSize: 1, status: 'Succeeded',       from, to }),
            eventsApi.list({ pageSize: 1, status: 'CriticalFailure', from, to }),
            eventsApi.list({ pageSize: 1, status: 'WaitingRetry',    from, to }),
          ]);

          return {
            date: d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }),
            delivered: succeeded.total,
            criticalFailure: critical.total,
            retry: waiting.total,
          };
        }),
      );

      setData(results);
      setLoading(false);
    }

    load().catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('chartTitle')}</CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-foreground" />
            {t('delivered')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border border-foreground bg-background" />
            {t('criticalFailure')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#888888]" />
            {t('retry')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] animate-pulse bg-muted rounded" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">{t('chartNoData')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} barGap={3} barCategoryGap="15%">
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    delivered: t('delivered'),
                    criticalFailure: t('criticalFailure'),
                    retry: t('retry'),
                  };
                  return [value, labels[name as string] ?? name];
                }}
              />
              <Bar
                dataKey="delivered"
                fill="hsl(var(--foreground))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="criticalFailure"
                fill="hsl(var(--background))"
                stroke="hsl(var(--foreground))"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="retry"
                fill="#888888"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
