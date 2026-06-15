'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { eventsApi } from '@/lib/api/events';

export function OverviewChart() {
  const t = useTranslations('overview');
  const [data, setData] = useState<Record<string, string | number>[]>([]);
  const [loading, setLoading] = useState(true);

  const deliveredLabel = t('delivered');
  const criticalLabel = t('criticalFailure');
  const retryLabel = t('retry');

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
            [deliveredLabel]: succeeded.total,
            [criticalLabel]: critical.total,
            [retryLabel]: waiting.total,
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
      <CardHeader>
        <CardTitle className="text-sm font-medium">{t('chartTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 animate-pulse bg-muted rounded" />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">{t('chartNoData')}</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} barSize={14}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey={deliveredLabel} fill="var(--color-success)"     stackId="a" />
              <Bar dataKey={criticalLabel}  fill="var(--color-destructive)" stackId="a" />
              <Bar dataKey={retryLabel}     fill="var(--color-warning)"     stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
