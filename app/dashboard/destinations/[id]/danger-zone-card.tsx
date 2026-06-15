'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { destinationsApi } from '@/lib/api/destinations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CONFIRM_WORD = 'PURGAR';

export function DangerZoneCard({ destinationId }: { destinationId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [purging, setPurging] = useState(false);
  const [done, setDone] = useState(false);

  if (user?.role !== 'Admin') return null;

  const handlePurge = async () => {
    if (input !== CONFIRM_WORD) return;
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
      <h3 className="font-semibold text-sm text-destructive">Zona de Perigo</h3>

      {done && (
        <p className="text-sm text-green-600 dark:text-green-400">Fila purgada com sucesso.</p>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Purgar fila</p>
          <p className="text-xs text-muted-foreground mt-1">
            Cancela permanentemente todos os eventos pendentes e aguardando retentativa para este destino.
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
          Purgar Fila
        </Button>
      </div>

      <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) setInput(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purgar fila do destino</DialogTitle>
            <DialogDescription>
              Esta ação cancelará permanentemente todos os eventos PENDENTES e AGUARDANDO_RETENTATIVA
              para este destino. Esta operação é irreversível.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="purgeConfirm">
              Digite <strong>{CONFIRM_WORD}</strong> para confirmar
            </Label>
            <Input
              id="purgeConfirm"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={CONFIRM_WORD}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setInput(''); }}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={input !== CONFIRM_WORD || purging}
              onClick={handlePurge}
            >
              {purging ? 'Purgando...' : 'Purgar Fila'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
