'use client';

import { useTranslations } from 'next-intl';
import { JsonViewer } from '@/components/dashboard/json-viewer';
import { CopyButton } from '@/components/ui/copy-button';

export function EventPayloadCard({ payload }: { payload: Record<string, unknown> }) {
  const t = useTranslations('events.detail');

  return (
    <div className="rounded-lg border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{t('payloadTitle')}</h3>
        <CopyButton value={JSON.stringify(payload, null, 2)} />
      </div>
      <JsonViewer value={payload} />
    </div>
  );
}
