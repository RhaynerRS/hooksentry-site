'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { eventsApi } from '@/lib/api/events';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';

interface EventReplayButtonProps {
  eventId: string;
  onSuccess?: () => void;
}

export function EventReplayButton({ eventId, onSuccess }: EventReplayButtonProps) {
  const t = useTranslations('events.replay');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReplay = async () => {
    setLoading(true);
    try {
      await eventsApi.replay(eventId);
      setOpen(false);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('button')}</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t('confirmTitle')}
        description={t('confirmDesc')}
        confirmLabel={t('confirmLabel')}
        loading={loading}
        onConfirm={handleReplay}
      />
    </>
  );
}
