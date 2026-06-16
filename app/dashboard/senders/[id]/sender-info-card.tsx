'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SenderDetail, Destination } from '@/lib/api/types';
import { CopyButton } from '@/components/ui/copy-button';

interface SenderInfoCardProps {
  sender: SenderDetail;
  destination: Destination;
}

export function SenderInfoCard({ sender, destination }: SenderInfoCardProps) {
  const t = useTranslations('senders.info');

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">{t('title')}</h3>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('id')}</dt>
          <dd className="flex items-center gap-1">
            <span className="font-mono text-xs break-all flex-1">{sender.id}</span>
            <CopyButton value={sender.id} className="shrink-0" />
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('labelField')}</dt>
          <dd>
            {sender.label ?? <span className="text-muted-foreground">{t('noLabel')}</span>}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('destination')}</dt>
          <dd>
            <Link
              href={`/dashboard/destinations/${destination.id}`}
              className="text-xs text-primary underline-offset-4 hover:underline break-all"
            >
              {destination.url}
            </Link>
          </dd>
        </div>

        <div>
          <dt className="text-xs text-muted-foreground mb-1">{t('createdAt')}</dt>
          <dd>{new Date(sender.createdAt).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}
