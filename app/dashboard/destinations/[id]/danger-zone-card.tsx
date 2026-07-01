'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/auth-context';
import { destinationsApi } from '@/lib/api/destinations';
import { ApiClientError } from '@/lib/api/client';
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
  const [error, setError] = useState('');

  const confirmWord = t('confirmWord');

  // Backend RequireAdminRole allows both Admin and Owner — keep the UI in sync.
  if (user?.role !== 'Admin' && user?.role !== 'Owner') return null;

  const handlePurge = async () => {
    if (input !== confirmWord) return;
    setPurging(true);
    setError('');
    try {
      await destinationsApi.purgeQueue(destinationId);
      setDone(true);
      setOpen(false);
      setInput('');
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
      else throw err;
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

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setInput(''); setError(''); } }}>
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
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setInput(''); setError(''); }}>
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
