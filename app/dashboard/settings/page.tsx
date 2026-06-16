'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { tenantApi } from '@/lib/api/settings';
import { Tenant } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { TenantInfoCard } from './tenant-info-card';
import { WebhookSecretCard } from './webhook-secret-card';
import { ResilienceSettingsCard } from './resilience-settings-card';
import { IntegrationGuideCard } from './integration-guide-card';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.tenantId) return;
    tenantApi.get(user.tenantId)
      .then(setTenant)
      .finally(() => setLoading(false));
  }, [user?.tenantId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-md" />
          <Skeleton className="h-48 rounded-md" />
        </div>
        <Skeleton className="h-64 rounded-md" />
      </div>
    );
  }

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="space-y-6">
      <PageHeader title={t('pageTitle')} description={t('pageDesc')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TenantInfoCard tenant={tenant} isAdmin={isAdmin} />
        <WebhookSecretCard secret={tenant?.webhookSecret ?? ''} />
      </div>

      <ResilienceSettingsCard
        maxTrys={tenant?.maxTrys ?? 10}
        circuitBreakerTimer={tenant?.circuitBreakerTimer ?? 300}
      />

      <IntegrationGuideCard tenantId={tenant?.id ?? ''} />
    </div>
  );
}
