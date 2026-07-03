'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { tenantApi } from '@/lib/api/settings';
import { usageApi } from '@/lib/api/cloud';
import { Tenant, UsageResponse } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import { TenantInfoCard } from './tenant-info-card';
import { WebhookSecretCard } from './webhook-secret-card';
import { ResilienceSettingsCard } from './resilience-settings-card';
import { IntegrationGuideCard } from './integration-guide-card';
import { UsageCard } from './usage-card';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [webhookSecret, setWebhookSecret] = useState('');
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [docsUrl, setDocsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.tenantId) return;
    Promise.all([
      tenantApi.get(user.tenantId),
      tenantApi.getWebhookSecret(user.tenantId),
    ]).then(([t, s]) => {
      setTenant(t);
      setWebhookSecret(s.webhookSecret);
    }).finally(() => setLoading(false));
  }, [user?.tenantId]);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(({ deploymentMode, docsUrl }) => {
        setDocsUrl(docsUrl ?? null);
        if (deploymentMode !== 'cloud') return;
        return usageApi.get().then(setUsage);
      })
      .catch(() => {});
  }, []);

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
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDesc')}
        action={
          docsUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={docsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('viewDocs')}
              </a>
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TenantInfoCard
          tenant={tenant}
          isAdmin={isAdmin}
          onUpdate={setTenant}
        />
        <WebhookSecretCard tenantId={tenant?.id ?? ''} secret={webhookSecret} />
      </div>

      {usage && <UsageCard usage={usage} />}

      <ResilienceSettingsCard
        tenantId={tenant?.id ?? ''}
        maxTrys={tenant?.maxTrys ?? 10}
        circuitBreakerTimer={tenant?.circuitBreakerTimer ?? 300}
        isAdmin={isAdmin}
        onUpdate={setTenant}
      />

      <IntegrationGuideCard tenantId={tenant?.id ?? ''} />
    </div>
  );
}
