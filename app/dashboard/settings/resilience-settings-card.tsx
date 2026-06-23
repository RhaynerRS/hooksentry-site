'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tenant } from '@/lib/api/types';
import { tenantApi } from '@/lib/api/settings';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Pencil, Check, X } from 'lucide-react';

const BACKOFF_TABLE = [
  { attempt: '1', delay: '2 min' },
  { attempt: '2', delay: '5 min' },
  { attempt: '3', delay: '15 min' },
  { attempt: '4', delay: '1h' },
  { attempt: '5+', delay: '6h' },
];

interface Props {
  tenantId: string;
  maxTrys: number;
  circuitBreakerTimer: number;
  isAdmin: boolean;
  onUpdate: (updated: Tenant) => void;
}

export function ResilienceSettingsCard({ tenantId, maxTrys, circuitBreakerTimer, isAdmin, onUpdate }: Props) {
  const t = useTranslations('settings.resilience');
  const tc = useTranslations('common');
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [maxTrysValue, setMaxTrysValue] = useState(maxTrys);
  const [timerValue, setTimerValue] = useState(circuitBreakerTimer);
  const [saving, setSaving] = useState(false);

  const minutes = Math.round(circuitBreakerTimer / 60);

  const startEdit = () => {
    setMaxTrysValue(maxTrys);
    setTimerValue(circuitBreakerTimer);
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = async () => {
    if (maxTrysValue < 1 || timerValue < 1) {
      toast({ title: t('validationError'), variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const updated = await tenantApi.update(tenantId, {
        maxTrys: maxTrysValue,
        circuitBreakerTimer: timerValue,
      });
      onUpdate(updated);
      setEditing(false);
      toast({ title: t('editSuccess') });
    } catch {
      toast({ title: t('editError'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        {isAdmin && !editing && (
          <Button size="sm" variant="outline" onClick={startEdit} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            {t('editButton')}
          </Button>
        )}
        {editing && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={cancel} disabled={saving} className="gap-1.5">
              <X className="h-3.5 w-3.5" />
              {tc('cancel')}
            </Button>
            <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
              <Check className="h-3.5 w-3.5" />
              {tc('save')}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {editing ? (
          <div className="space-y-2">
            <Label htmlFor="maxTrys" className="text-sm font-medium">{t('maxTrys')}</Label>
            <Input
              id="maxTrys"
              type="number"
              min={1}
              value={maxTrysValue}
              onChange={e => setMaxTrysValue(Number(e.target.value))}
              className="w-32"
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground">{t('maxTrysDesc')}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">{t('maxTrys')}</p>
            <p className="text-2xl font-bold tabular-nums">{maxTrys}</p>
            <p className="text-xs text-muted-foreground">{t('maxTrysDesc')}</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">{t('backoffTitle')}</p>
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-xs text-muted-foreground">{t('attempt')}</th>
                <th className="px-4 py-2 text-left font-medium text-xs text-muted-foreground">{t('delay')}</th>
              </tr>
            </thead>
            <tbody>
              {BACKOFF_TABLE.map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-2 tabular-nums">{row.attempt}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.delay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
