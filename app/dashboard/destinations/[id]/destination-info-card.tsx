'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Destination } from '@/lib/api/types';
import { destinationsApi } from '@/lib/api/destinations';
import { DestinationStatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface Props {
  destination: Destination;
  onUpdated: (dest: Destination) => void;
}

export function DestinationInfoCard({ destination: dest, onUpdated }: Props) {
  const t = useTranslations('destinations.info');
  const [copied, setCopied] = useState(false);
  const [toggling, setToggling] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(dest.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStatus = async () => {
    setToggling(true);
    try {
      const updated = await destinationsApi.update(dest.id, {
        status: dest.status === 'Active' ? 'Inactive' : 'Active',
      });
      onUpdated(updated);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">{t('title')}</h3>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('urlLabel')}</dt>
          <dd className="flex items-center gap-2">
            <span className="font-mono text-xs break-all flex-1">{dest.url}</span>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={copyUrl}>
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('statusLabel')}</dt>
          <dd className="flex items-center gap-3">
            <DestinationStatusBadge status={dest.status} />
            <Button
              variant="outline"
              size="sm"
              disabled={toggling || dest.status === 'Suspended'}
              onClick={toggleStatus}
            >
              {dest.status === 'Active' ? t('deactivate') : t('activate')}
            </Button>
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('rateLimitLabel')}</dt>
          <dd>{dest.serverRateLimit} req/s</dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('authLabel')}</dt>
          <dd>{dest.authType ?? <span className="text-muted-foreground">{t('noAuth')}</span>}</dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('createdAtLabel')}</dt>
          <dd>{new Date(dest.createdAt).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}
