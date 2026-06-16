'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { invitesApi } from '@/lib/api/users';
import { InviteToken } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InviteRow } from './invite-row';
import { CreateInviteDialog } from './create-invite-dialog';

export function InvitesTab() {
  const t = useTranslations('users.invites');
  const [invites, setInvites] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await invitesApi.list({ pageSize: 50 });
      setInvites(res.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>{t('generateButton')}</Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-md" />
          ))}
        </div>
      ) : invites.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 border rounded-md">{t('empty')}</p>
      ) : (
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
      )}

      <CreateInviteDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={load}
      />
    </div>
  );
}
