'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiKeysApi } from '@/lib/api/api-keys';
import { ApiKey } from '@/lib/api/types';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { Pagination } from '@/components/dashboard/pagination';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';

interface ApiKeysTableProps {
  keys: ApiKey[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onRevoke: () => void;
  onPageChange: (page: number) => void;
}

export function ApiKeysTable({ keys, total, page, pageSize, loading, onRevoke, onPageChange }: ApiKeysTableProps) {
  const t = useTranslations('apiKeys');
  const [revokeKey, setRevokeKey] = useState<ApiKey | null>(null);
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!revokeKey) return;
    setRevoking(true);
    try {
      await apiKeysApi.revoke(revokeKey.id);
      setRevokeKey(null);
      onRevoke();
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-md" />
        ))}
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <EmptyState
        icon={KeyRound}
        title={t('table.empty')}
        description=""
        action={null}
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('table.name')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.status')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.createdAt')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.revokedAt')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {keys.map(key => (
                <tr
                  key={key.id}
                  className={`border-b last:border-0 ${!key.isActive ? 'opacity-60' : 'hover:bg-muted/30'}`}
                >
                  <td className="px-4 py-3 font-medium">{key.name}</td>
                  <td className="px-4 py-3">
                    {key.isActive ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {t('table.active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                        {t('table.revoked')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(key.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {key.revokedAt ? new Date(key.revokedAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {key.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
                        onClick={() => setRevokeKey(key)}
                      >
                        {t('table.revoke')}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination total={total} page={page} pageSize={pageSize} onPageChange={onPageChange} />
      </div>

      <ConfirmDialog
        open={!!revokeKey}
        onOpenChange={open => { if (!open) setRevokeKey(null); }}
        title={t('revokeDialog.title', { name: revokeKey?.name ?? '' })}
        description={t('revokeDialog.desc')}
        confirmLabel={t('revokeDialog.confirm')}
        destructive
        loading={revoking}
        onConfirm={handleRevoke}
      />
    </>
  );
}
