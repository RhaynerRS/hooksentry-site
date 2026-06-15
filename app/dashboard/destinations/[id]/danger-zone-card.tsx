'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { destinationsApi } from '@/lib/api/destinations';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DangerZoneCard({ destinationId }: { destinationId: string }) {
  const t = useTranslations('destinations.dangerZone');
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [purging, setPurging] = useState(false);
  const [done, setDone] = useState(false);

  const confirmWord = t('confirmWord');

  if (user?.role !== 'Admin') return null;

  const handlePurge = async () => {
    if (input !== confirmWord) return;
    setPurging(true);
    try {
      await destinationsApi.purgeQueue(destinationId);
      setDone(true);
      setOpen(false);
      setInput('');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="rounded-lg border border-destructive/40 p-5 space-y-4">
      <h3 className="font-semibold text-sm text-destructive">{t('title')}</h3>

      {done && <p className="text-sm text-green-600 dark:text-green-400">{t('success')}</p>}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{t('purgeTitle')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('purgeDesc')}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          {t('purgeButton')}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setInput(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialogTitle')}</DialogTitle>
            <DialogDescription>{t('dialogDesc')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="purgeConfirm">
              {t('confirmInputLabel', { word: confirmWord })}
            </Label>
            <Input
              id="purgeConfirm"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={confirmWord}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setInput(''); }}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              disabled={input !== confirmWord || purging}
              onClick={handlePurge}
            >
              {purging ? t('purging') : t('confirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
