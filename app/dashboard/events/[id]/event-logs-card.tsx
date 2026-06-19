'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export function EventLogsCard({ eventId }: { eventId: string }) {
  const t = useTranslations('events.detail');
  const [grafanaUrl, setGrafanaUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(({ grafanaUrl: base }) => {
        if (!base) return;
        setGrafanaUrl(
          `${base}/explore?left=${encodeURIComponent(
            JSON.stringify({
              queries: [{ expr: `{service_name="hooksentry-worker"} | json | EventId="${eventId}"` }],
            })
          )}`
        );
      })
      .catch(() => {});
  }, [eventId]);

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
