'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { sendersApi } from '@/lib/api/senders';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { Button } from '@/components/ui/button';

interface Props {
  senderId: string;
  label: string | null;
}

export function SenderDangerZone({ senderId }: Props) {
  const t = useTranslations('senders.dangerZone');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await sendersApi.delete(senderId);
      router.push('/dashboard/senders');
    } catch {
      setRemoving(false);
      setOpen(false);
    }
  };

  return (
    <div className="rounded-lg border border-destructive/30 p-5 space-y-4">
      <h3 className="font-semibold text-sm text-destructive">{t('title')}</h3>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{t('removeTitle')}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{t('removeDesc')}</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="shrink-0"
          onClick={() => setOpen(true)}
        >
          {t('removeButton')}
        </Button>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={o => { if (!o) setOpen(false); }}
        title={t('confirmTitle')}
        description={t('confirmDesc')}
        confirmLabel={t('confirmLabel')}
        destructive
        loading={removing}
        onConfirm={handleRemove}
      />
    </div>
  );
}
