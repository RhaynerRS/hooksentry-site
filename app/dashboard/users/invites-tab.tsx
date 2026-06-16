'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { invitesApi } from '@/lib/api/users';
import { InviteToken } from '@/lib/api/types';
import { Pagination } from '@/components/dashboard/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { InviteRow } from './invite-row';
import { CreateInviteDialog } from './create-invite-dialog';

const PAGE_SIZE = 20;

interface Props {
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

export function InvitesTab({ createOpen, onCreateOpenChange }: Props) {
  const t = useTranslations('users.invites');
  const [invites, setInvites] = useState<InviteToken[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    invitesApi.list({ page, pageSize: PAGE_SIZE })
      .then(res => {
        setInvites(res.items);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, refreshKey]);

  const handleCreated = () => {
    setPage(1);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-md" />
          ))}
        </div>
      ) : invites.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 border rounded-md">{t('empty')}</p>
      ) : (
        <>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">{t('table.status')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('table.expiresAt')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('table.createdAt')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('table.usedAt')}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {invites.map(invite => (
                  <InviteRow key={invite.id} invite={invite} />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={total} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </>
      )}

      <CreateInviteDialog
        open={createOpen}
        onOpenChange={onCreateOpenChange}
        onSuccess={handleCreated}
      />
    </div>
  );
}
