'use client';

import { useState } from 'react';
import { destinationsApi } from '@/lib/api/destinations';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function IngestTokenCard({ destinationId }: { destinationId: string }) {
  const [step, setStep] = useState<'idle' | 'confirming' | 'done'>('idle');
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const { ingestToken } = await destinationsApi.rotateIngestToken(destinationId);
      setNewToken(ingestToken);
      setStep('done');
    } catch {
      setError('Falha ao regenerar o token. Tente novamente.');
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border p-5 space-y-4">
      <h3 className="font-semibold text-sm">Ingest Token</h3>

      {step === 'idle' && (
        <>
          <p className="text-sm text-muted-foreground">
            O token atual foi configurado e está ativo. Regenerar o token invalidará imediatamente o token anterior.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => setStep('confirming')}
          >
            Regenerar Token
          </Button>
        </>
      )}

      {step === 'done' && newToken && (
        <>
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              Guarde este token agora. Por segurança, ele não será exibido novamente.
              Atualize a configuração no serviço externo antes de fechar esta janela.
            </p>
          </div>
          <SecretDisplay value={newToken} label="Novo Ingest Token" />
        </>
      )}

      <ConfirmDialog
        open={step === 'confirming'}
        onOpenChange={open => { if (!open) setStep('idle'); }}
        title="Regenerar Ingest Token"
        description="O token anterior será invalidado imediatamente. Esta ação não pode ser desfeita."
        confirmLabel="Regenerar"
        destructive
        onConfirm={handleConfirm}
      />
    </div>
  );
}
