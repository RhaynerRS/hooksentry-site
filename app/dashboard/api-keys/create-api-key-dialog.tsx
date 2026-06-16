'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiKeysApi } from '@/lib/api/api-keys';
import { CreateApiKeyResponse } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hooksentry.com';

type Step = 'form' | 'reveal';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateApiKeyDialog({ open, onOpenChange, onSuccess }: Props) {
  const t = useTranslations('apiKeys.createDialog');
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreateApiKeyResponse | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError(t('nameRequired')); return; }
    setLoading(true);
    setError('');
    try {
      const res = await apiKeysApi.create(name.trim());
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
    setName('');
    setCreated(null);
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' ? t('title') : t('titleReveal')}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="keyname">{t('nameLabel')}</Label>
              <Input
                id="keyname"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={100}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">{t('nameHint')}</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t('submitting') : t('submit')}
              </Button>
            </div>
          </form>
        )}

        {step === 'reveal' && created && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-md border border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  {t('warningTitle')}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-0.5">
                  {t('warningDesc')}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">{created.name}</p>
              <SecretDisplay value={created.key} label={t('keyLabel')} />
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1 text-xs text-muted-foreground">{t('usageTitle')}</p>
              <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                {`curl -X POST \\
  ${API_URL}/api/v1/ingest/{tenantId}/{token} \\
  -H "X-Api-Key: ${created.key}" \\
  -H "Content-Type: application/json" \\
  -d '{"event": "test"}'`}
              </pre>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleClose}>{t('done')}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
