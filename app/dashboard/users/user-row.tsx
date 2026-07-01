'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usersApi } from '@/lib/api/users';
import { User, UserRole } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Props {
  user: User;
  isSelf: boolean;
  isCloud: boolean;
  canPromoteToOwner: boolean;
  onChange: () => void;
}

export function UserRow({ user, isSelf, isCloud, canPromoteToOwner, onChange }: Props) {
  const t = useTranslations('users');
  const { toast } = useToast();
  const [updatingRole, setUpdatingRole] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [promoting, setPromoting] = useState(false);

  const isOwner = user.role === 'Owner';

  const handleRoleChange = async (role: UserRole) => {
    setUpdatingRole(true);
    try {
      await usersApi.update(user.id, { role });
      toast({ title: t('toast.roleUpdated', { role: t(`role.${role}`) }) });
      onChange();
    } finally {
      setUpdatingRole(false);
    }
  };

  const handlePromote = async () => {
    setPromoting(true);
    try {
      await usersApi.update(user.id, { role: 'Owner' });
      toast({ title: t('toast.roleUpdated', { role: t('role.Owner') }) });
      setPromoteOpen(false);
      onChange();
    } finally {
      setPromoting(false);
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setUpdatingStatus(true);
    try {
      await usersApi.update(user.id, { status: newStatus });
      toast({ title: t('toast.statusUpdated') });
      onChange();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await usersApi.delete(user.id);
      toast({ title: t('toast.removed') });
      setRemoveOpen(false);
      onChange();
    } catch (err) {
      // O backend responde 409 { error: "last_owner" } ao remover o único Owner.
      const isLastOwner = err instanceof ApiClientError && err.status === 409;
      toast({
        title: isLastOwner ? t('toast.lastOwnerError') : t('toast.removeError'),
        variant: 'destructive',
      });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <tr className="border-b last:border-0 hover:bg-muted/30">
        <td className="px-4 py-3">{user.email}</td>
        <td className="px-4 py-3">
          {isOwner ? (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              {t('role.Owner')}
            </span>
          ) : (
            <select
              value={user.role}
              disabled={isSelf || updatingRole}
              onChange={e => handleRoleChange(e.target.value as UserRole)}
              className="rounded-md border bg-background px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Developer">{t('role.Developer')}</option>
              <option value="Admin">{t('role.Admin')}</option>
              {isCloud && <option value="Viewer">{t('role.Viewer')}</option>}
            </select>
          )}
        </td>
        <td className="px-4 py-3">
          {user.status === 'Active' ? (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {t('userStatus.Active')}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
              {t('userStatus.Inactive')}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            {canPromoteToOwner && !isSelf && !isOwner && (
              <Button
                variant="outline"
                size="sm"
                disabled={promoting}
                onClick={() => setPromoteOpen(true)}
              >
                {t('actions.promoteToOwner')}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={isSelf || updatingStatus}
              onClick={handleStatusToggle}
            >
              {user.status === 'Active' ? t('actions.deactivate') : t('actions.activate')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive"
              disabled={isSelf}
              onClick={() => setRemoveOpen(true)}
            >
              {t('actions.remove')}
            </Button>
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={open => { if (!open) setRemoveOpen(false); }}
        title={t('removeDialog.title')}
        description={t('removeDialog.desc')}
        confirmLabel={t('removeDialog.confirm')}
        destructive
        loading={removing}
        onConfirm={handleRemove}
      />

      <ConfirmDialog
        open={promoteOpen}
        onOpenChange={open => { if (!open) setPromoteOpen(false); }}
        title={t('promoteDialog.title')}
        description={t('promoteDialog.desc', { email: user.email })}
        confirmLabel={t('promoteDialog.confirm')}
        loading={promoting}
        onConfirm={handlePromote}
      />
    </>
  );
}
