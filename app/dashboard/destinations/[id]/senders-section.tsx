'use client';

import { useState } from 'react';
import { sendersApi } from '@/lib/api/senders';
import { Sender } from '@/lib/api/types';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface Props {
  destinationId: string;
  initialSenders: Sender[];
}

export function SendersSection({ destinationId, initialSenders }: Props) {
  const [senders, setSenders] = useState<Sender[]>(initialSenders);
  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [newIngestToken, setNewIngestToken] = useState<string | null>(null);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { sender, ingestToken } = await sendersApi.create(destinationId, { label: label || undefined });
      setSenders(prev => [sender, ...prev]);
      setNewIngestToken(ingestToken);
      setCreateOpen(false);
      setLabel('');
      setTokenDialogOpen(true);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await sendersApi.delete(deleteId);
    setSenders(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Senders</h3>
        <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Sender
        </Button>
      </div>

      {senders.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
          Nenhum sender cadastrado para este destino.
        </p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Label</th>
                <th className="px-4 py-3 text-left font-medium">Mapeamento</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {senders.map(sender => (
                <tr key={sender.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{sender.label ?? <span className="text-muted-foreground">Sem nome</span>}</td>
                  <td className="px-4 py-3">{sender.hasMapping ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(sender.id)}
                    >
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Sender</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="senderLabel">Label (opcional)</Label>
              <Input
                id="senderLabel"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="Meu serviço externo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Criando...' : 'Criar Sender'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ingest token display after create */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sender criado</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Use o Ingest Token abaixo para configurar o envio de webhooks.
              Por segurança, ele não será exibido novamente.
            </p>
            {newIngestToken && (
              <SecretDisplay value={newIngestToken} label="Ingest Token" />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setTokenDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title="Remover Sender"
        description="Esta ação é irreversível. O sender será removido permanentemente."
        confirmLabel="Remover"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
