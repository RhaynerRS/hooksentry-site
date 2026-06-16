'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { sendersApi } from '@/lib/api/senders';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { Pagination } from '@/components/dashboard/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface SenderRow {
  id: string;
  label: string | null;
  destinationId: string;
  destinationUrl: string;
  hasMapping: boolean;
  createdAt: string;
}

interface SendersTableProps {
  senders: SenderRow[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onDeleteSuccess: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function SendersTable({ senders, total, page, pageSize, loading, onDeleteSuccess, onPageChange }: SendersTableProps) {
  const t = useTranslations('senders');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await sendersApi.delete(deleteId);
      onDeleteSuccess(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-md" />
        ))}
      </div>
    );
  }

  if (senders.length === 0 && total === 0) {
    return (
      <div className="rounded-lg border p-8 text-center space-y-3">
        <p className="text-sm text-muted-foreground">{t('table.empty')}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/destinations">{t('table.emptyHint')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('table.label')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.destination')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.mapping')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.createdAt')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {senders.map(s => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {s.label ?? <span className="text-muted-foreground">{t('table.noName')}</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs max-w-[220px] truncate text-muted-foreground" title={s.destinationUrl}>
                    {s.destinationUrl}
                  </td>
                  <td className="px-4 py-3">
                    {s.hasMapping ? t('table.yes') : t('table.no')}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/senders/${s.id}`}>{t('table.view')}</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(s.id)}
                      >
                        {t('table.remove')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination total={total} page={page} pageSize={pageSize} onPageChange={onPageChange} />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.desc')}
        confirmLabel={t('deleteDialog.confirm')}
        loading={deleting}
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
