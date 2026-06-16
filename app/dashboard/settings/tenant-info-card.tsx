'use client';

import { useTranslations } from 'next-intl';
import { Tenant } from '@/lib/api/types';
import { CopyButton } from '@/components/ui/copy-button';
import { Badge } from '@/components/ui/badge';

interface Props {
  tenant: Tenant | null;
  isAdmin: boolean;
}

export function TenantInfoCard({ tenant, isAdmin }: Props) {
  const t = useTranslations('settings.tenantInfo');

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        {isAdmin && <Badge variant="secondary">{t('adminBadge')}</Badge>}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground shrink-0">{t('name')}</dt>
          <dd className="font-medium text-right">{tenant?.name ?? '—'}</dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground shrink-0">{t('id')}</dt>
          <dd className="flex items-center gap-1.5 min-w-0">
            <code className="text-xs font-mono truncate">{tenant?.id ?? '—'}</code>
            {tenant?.id && <CopyButton value={tenant.id} />}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground shrink-0">{t('createdAt')}</dt>
          <dd className="text-right text-muted-foreground">
            {tenant?.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : '—'}
          </dd>
        </div>
      </dl>
    </div>
  );
}
