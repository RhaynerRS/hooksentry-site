'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const GRAFANA_URL = process.env.NEXT_PUBLIC_GRAFANA_URL;

export function EventLogsCard({ eventId }: { eventId: string }) {
  const t = useTranslations('events.detail');

  const grafanaUrl = GRAFANA_URL
    ? `${GRAFANA_URL}/explore?left=${encodeURIComponent(
        JSON.stringify({
          queries: [{ expr: `{service_name="hooksentry-worker"} | json | EventId="${eventId}"` }],
        })
      )}`
    : null;

  return (
    <div className="rounded-lg border p-5 space-y-3">
      <h3 className="font-semibold text-sm">{t('logsTitle')}</h3>
      <p className="text-sm text-muted-foreground">{t('logsMessage')}</p>
      {grafanaUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={grafanaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('openGrafana')}
          </a>
        </Button>
      )}
    </div>
  );
}
