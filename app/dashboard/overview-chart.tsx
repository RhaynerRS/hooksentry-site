'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { eventsApi } from '@/lib/api/events';

type ChartRow = {
  date: string;
  delivered: number;
  criticalFailure: number;
  retry: number;
};

const COLORS = {
  delivered:       'hsl(var(--foreground))',
  criticalFailure: 'hsl(var(--destructive))',
  retry:           '#888888',
} as const;

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
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground" />
            {t('delivered')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-destructive" />
            {t('criticalFailure')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#888888]" />
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
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
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
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
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
              <Line
                type="monotone"
                dataKey="delivered"
                stroke={COLORS.delivered}
                strokeWidth={2}
                dot={{ r: 4, fill: COLORS.delivered, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.delivered, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="criticalFailure"
                stroke={COLORS.criticalFailure}
                strokeWidth={2}
                dot={{ r: 4, fill: COLORS.criticalFailure, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.criticalFailure, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="retry"
                stroke={COLORS.retry}
                strokeWidth={2}
                dot={{ r: 4, fill: COLORS.retry, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.retry, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
