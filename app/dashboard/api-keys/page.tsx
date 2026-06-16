'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { apiKeysApi } from '@/lib/api/api-keys';
import { ApiKey } from '@/lib/api/types';
import { PageHeader } from '@/components/dashboard/page-header';
import { ApiKeysTable } from './api-keys-table';
import { CreateApiKeyDialog } from './create-api-key-dialog';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

export default function ApiKeysPage() {
  const t = useTranslations('apiKeys');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const showInactive = searchParams.get('inactive') === '1';
  const page = Number(searchParams.get('page') ?? 1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiKeysApi.list({
        page,
        pageSize: PAGE_SIZE,
        isActive: showInactive ? undefined : true,
      });
      setKeys(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, showInactive]);

  useEffect(() => { load(); }, [load]);

  const updateFilter = (key: string, value: string | null) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value); else sp.delete(key);
    if (key !== 'page') sp.delete('page');
    router.push(`/dashboard/api-keys?${sp}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pageTitle')}
        description={t('pageDesc')}
        action={
          <Button onClick={() => setCreateOpen(true)}>{t('newButton')}</Button>
        }
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={e => updateFilter('inactive', e.target.checked ? '1' : null)}
            className="rounded"
          />
          {t('showInactive')}
        </label>
        {!loading && (
          <span className="text-sm text-muted-foreground">
            {t('count', { count: total })}
          </span>
        )}
      </div>

      <ApiKeysTable
        keys={keys}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        loading={loading}
        onRevoke={load}
        onPageChange={p => updateFilter('page', String(p))}
      />

      <CreateApiKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={load}
      />
    </div>
  );
}
