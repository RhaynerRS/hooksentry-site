'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendersApi } from '@/lib/api/senders';
import { JsonViewer } from '@/components/dashboard/json-viewer';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { ChevronDown, ChevronRight, FileCode } from 'lucide-react';

interface Props {
  senderId: string;
  mapping: Record<string, unknown> | null;
}

const DSL_EXAMPLE = `{
  "userId": "id",
  "name": "user:name",
  "firstTag": "tags[0]"
}`;

const PLACEHOLDER = `{
  "outputField": "inputField",
  "nested": "obj:field",
  "arrayItem": "arr[0]"
}`;

export function SenderMappingSection({ senderId, mapping: initialMapping }: Props) {
  const t = useTranslations('senders.mapping');
  const [mapping, setMapping] = useState(initialMapping);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState('');
  const [saving, setSaving] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [dslOpen, setDslOpen] = useState(false);

  const openEditor = () => {
    setDraft(mapping ? JSON.stringify(mapping, null, 2) : '{}');
    setDraftError('');
    setMode('edit');
  };

  const handleSave = async () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(draft);
    } catch (e) {
      setDraftError(t('jsonError', { detail: (e as Error).message }));
      return;
    }
    setSaving(true);
    try {
      await sendersApi.setMapping(senderId, parsed);
      setMapping(parsed);
      setMode('view');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await sendersApi.deleteMapping(senderId);
      setMapping(null);
      setRemoveOpen(false);
    } finally {
      setRemoving(false);
    }
  };

  if (mode === 'edit') {
    return (
      <div className="rounded-lg border p-5 space-y-4">
        <h3 className="font-semibold text-sm">{t('title')}</h3>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium">{t('editorTitle')}</label>
          <textarea
            className="w-full min-h-[200px] rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
            value={draft}
            onChange={e => { setDraft(e.target.value); setDraftError(''); }}
            placeholder={PLACEHOLDER}
            spellCheck={false}
          />
          {draftError && <p className="text-sm text-destructive">{draftError}</p>}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setDslOpen(v => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {dslOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {t('dslTitle')}
          </button>

          {dslOpen && (
            <div className="mt-2 rounded-md bg-muted p-3 text-xs space-y-2">
              <p className="text-muted-foreground">{t('dslDesc')}</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-1 pr-4 font-medium">Expression</th>
                    <th className="py-1 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr><td className="pr-4 py-0.5">"field"</td><td className="py-0.5 font-sans text-muted-foreground">Copies root field</td></tr>
                  <tr><td className="pr-4 py-0.5">"obj:field"</td><td className="py-0.5 font-sans text-muted-foreground">Accesses obj.field</td></tr>
                  <tr><td className="pr-4 py-0.5">"arr[n]"</td><td className="py-0.5 font-sans text-muted-foreground">Array index n</td></tr>
                  <tr><td className="pr-4 py-0.5">"a+b"</td><td className="py-0.5 font-sans text-muted-foreground">Sum / concat</td></tr>
                </tbody>
              </table>
              <div>
                <p className="text-muted-foreground mb-1">Example:</p>
                <pre className="text-xs whitespace-pre-wrap">{DSL_EXAMPLE}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? t('saving') : t('save')}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMode('view')} disabled={saving}>
            {t('cancel')}
          </Button>
        </div>
      </div>
    );
  }

  if (!mapping) {
    return (
      <div className="rounded-lg border p-8 text-center space-y-3">
        <FileCode className="h-8 w-8 mx-auto text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">{t('emptyTitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('emptyDesc')}</p>
        </div>
        <Button size="sm" onClick={openEditor}>{t('configureButton')}</Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">{t('title')}</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={openEditor}>{t('editButton')}</Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setRemoveOpen(true)}
            >
              {t('removeButton')}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <JsonViewer value={mapping} />
        </div>
        <p className="px-5 py-2 text-xs text-muted-foreground border-t">{t('footer')}</p>
      </div>

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={open => { if (!open) setRemoveOpen(false); }}
        title={t('removeConfirmTitle')}
        description={t('removeConfirmDesc')}
        confirmLabel={t('removeConfirmLabel')}
        destructive
        loading={removing}
        onConfirm={handleRemove}
      />
    </>
  );
}
