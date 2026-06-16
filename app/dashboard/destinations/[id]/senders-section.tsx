'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { sendersApi } from '@/lib/api/senders';
import { Sender } from '@/lib/api/types';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
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
  const t = useTranslations('senders');
  const [senders, setSenders] = useState<Sender[]>(initialSenders);
  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [newIngestToken, setNewIngestToken] = useState<string | null>(null);
  const [newSenderId, setNewSenderId] = useState<string | null>(null);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { sender, ingestToken } = await sendersApi.create(destinationId, { label: label || undefined });
      setSenders(prev => [sender, ...prev]);
      setNewIngestToken(ingestToken);
      setNewSenderId(sender.id);
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
        <h3 className="font-semibold">{t('sectionTitle')}</h3>
        <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          {t('addButton')}
        </Button>
      </div>

      {senders.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
          {t('empty')}
        </p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">{t('table.label')}</th>
                <th className="px-4 py-3 text-left font-medium">{t('table.mapping')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {senders.map(sender => (
                <tr key={sender.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {sender.label ?? <span className="text-muted-foreground">{t('table.noName')}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {sender.hasMapping ? t('table.yes') : t('table.no')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/senders/${sender.id}`}>{t('table.view')}</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(sender.id)}
                      >
                        {t('table.remove')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createDialog.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="senderLabel">{t('createDialog.labelField')}</Label>
              <Input
                id="senderLabel"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder={t('createDialog.labelPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              {t('createDialog.cancel')}
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? t('createDialog.submitting') : t('createDialog.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tokenDialog.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">{t('tokenDialog.desc')}</p>
            {newIngestToken && (
              <SecretDisplay value={newIngestToken} label={t('tokenDialog.tokenLabel')} />
            )}
            {newSenderId && (
              <p className="text-sm">
                <Link
                  href={`/dashboard/senders/${newSenderId}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t('tokenDialog.viewDetail')}
                </Link>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setTokenDialogOpen(false)}>{t('tokenDialog.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={open => { if (!open) setDeleteId(null); }}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.desc')}
        confirmLabel={t('deleteDialog.confirm')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
