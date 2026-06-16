'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usersApi } from '@/lib/api/users';
import { User } from '@/lib/api/types';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRow } from './user-row';
import { Skeleton } from '@/components/ui/skeleton';

export function UsersTab() {
  const t = useTranslations('users');
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({ pageSize: 100 });
      setUsers(res.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">{t('table.email')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('table.role')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('table.status')}</th>
            <th className="px-4 py-3 text-left font-medium">{t('table.memberSince')}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === currentUser?.userId}
              onChange={load}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
