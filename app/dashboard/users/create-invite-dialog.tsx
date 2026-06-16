'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { invitesApi } from '@/lib/api/users';
import { InviteToken } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CopyButton } from '@/components/ui/copy-button';
import { AlertTriangle } from 'lucide-react';

type Step = 'form' | 'reveal';

const VALIDITY_OPTIONS = [1, 3, 7, 14, 30] as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateInviteDialog({ open, onOpenChange, onSuccess }: Props) {
  const t = useTranslations('users.invites.createDialog');
  const [step, setStep] = useState<Step>('form');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<InviteToken | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await invitesApi.create(days);
      setCreated(res);
      setStep('reveal');
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setDays(7);
    setCreated(null);
    setError('');
    onOpenChange(false);
  };

  const inviteUrl = created
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${created.token}`
    : '';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 'form' ? t('title') : t('titleReveal')}</DialogTitle>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="validity">{t('validityLabel')}</Label>
              <select
                id="validity"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {VALIDITY_OPTIONS.map(d => (
                  <option key={d} value={d}>{t(`days${d}`)}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>{t('cancel')}</Button>
              <Button onClick={handleCreate} disabled={loading}>
                {loading ? t('submitting') : t('submit')}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'reveal' && created && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('desc')}</p>
            <p className="text-sm text-muted-foreground">{t('expiry', { days })}</p>

            <div className="flex items-start gap-2 rounded-md border border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <p className="text-xs text-amber-800 dark:text-amber-200">{t('warning')}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('linkLabel')}</p>
              <div className="flex items-center gap-2 rounded-md border bg-muted p-2">
                <code className="text-xs break-all flex-1">{inviteUrl}</code>
                <CopyButton value={inviteUrl} />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>{t('done')}</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
