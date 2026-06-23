'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tenant } from '@/lib/api/types';
import { tenantApi } from '@/lib/api/settings';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/ui/copy-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TruncatedText } from '@/components/ui/truncated-text';
import { Pencil, Check, X } from 'lucide-react';

interface Props {
  tenant: Tenant | null;
  isAdmin: boolean;
  onUpdate: (updated: Tenant) => void;
}

export function TenantInfoCard({ tenant, isAdmin, onUpdate }: Props) {
  const t = useTranslations('settings.tenantInfo');
  const tc = useTranslations('common');
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setNameValue(tenant?.name ?? '');
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = async () => {
    if (!tenant || !nameValue.trim() || nameValue.trim() === tenant.name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const updated = await tenantApi.update(tenant.id, { name: nameValue.trim() });
      onUpdate(updated);
      setEditing(false);
      toast({ title: t('editSuccess') });
    } catch {
      toast({ title: t('editError'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        {isAdmin && <Badge variant="secondary">{t('adminBadge')}</Badge>}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground shrink-0 pt-1">{t('name')}</dt>
          <dd className="flex items-center gap-1.5 min-w-0">
            {editing ? (
              <div className="flex items-center gap-1.5">
                <Input
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  className="h-7 text-sm w-40"
                  onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
                  autoFocus
                  disabled={saving}
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={save} disabled={saving}>
                  <Check className="h-3.5 w-3.5" />
                  <span className="sr-only">{tc('save')}</span>
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancel} disabled={saving}>
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">{tc('cancel')}</span>
                </Button>
              </div>
            ) : (
              <>
                <span className="font-medium">{tenant?.name ?? '—'}</span>
                {isAdmin && (
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={startEdit}>
                    <Pencil className="h-3 w-3" />
                    <span className="sr-only">{t('editName')}</span>
                  </Button>
                )}
              </>
            )}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground shrink-0">{t('id')}</dt>
          <dd className="flex items-center gap-1.5 min-w-0">
            {tenant?.id
              ? <TruncatedText text={tenant.id} className="font-mono text-xs" />
              : <span className="text-xs">—</span>
            }
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
