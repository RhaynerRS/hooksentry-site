'use client';

import { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/lib/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RecentCriticalEvents() {
  const [items, setItems] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.list({ status: 'CriticalFailure', pageSize: 5 })
      .then(res => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && total === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">
          Falhas Críticas Recentes
        </CardTitle>
        {total > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/events?status=CriticalFailure">Ver todos ({total})</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 animate-pulse bg-muted rounded" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b">
                <th className="text-left pb-2 font-medium">ID do Evento</th>
                <th className="text-left pb-2 font-medium">Destino</th>
                <th className="text-left pb-2 font-medium">Tentativas</th>
                <th className="text-left pb-2 font-medium">Recebido</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(event => (
                <tr key={event.id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs truncate max-w-[120px]">{event.id.slice(0, 8)}…</td>
                  <td className="py-2 truncate max-w-[180px] text-muted-foreground">{event.destinationUrl}</td>
                  <td className="py-2">{event.currentRetryCount}</td>
                  <td className="py-2 text-muted-foreground">
                    {new Date(event.acceptedAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/events/${event.id}`}>Ver</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
