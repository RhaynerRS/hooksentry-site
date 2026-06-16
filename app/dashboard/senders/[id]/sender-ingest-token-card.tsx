'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendersApi } from '@/lib/api/senders';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function SenderIngestTokenCard({ senderId }: { senderId: string }) {
  const t = useTranslations('senders.ingestToken');
  const [step, setStep] = useState<'idle' | 'confirming' | 'done'>('idle');
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const { ingestToken } = await sendersApi.rotateIngestToken(senderId);
      setNewToken(ingestToken);
      setStep('done');
    } catch {
      setError(t('error'));
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">{t('title')}</h3>

      {step === 'idle' && (
        <>
          <p className="text-sm text-muted-foreground">{t('activeMessage')}</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button variant="outline" size="sm" disabled={loading} onClick={() => setStep('confirming')}>
            {t('regenerate')}
          </Button>
        </>
      )}

      {step === 'done' && newToken && (
        <>
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>{t('warning')}</p>
          </div>
          <SecretDisplay value={newToken} label={t('newTokenLabel')} />
        </>
      )}

      <ConfirmDialog
        open={step === 'confirming'}
        onOpenChange={open => { if (!open) setStep('idle'); }}
        title={t('confirmTitle')}
        description={t('confirmDesc')}
        confirmLabel={t('confirmLabel')}
        destructive
        onConfirm={handleConfirm}
      />
    </div>
  );
}
