'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';

const BACKOFF_TABLE = [
  { attempt: '1', delay: '2 min' },
  { attempt: '2', delay: '5 min' },
  { attempt: '3', delay: '15 min' },
  { attempt: '4', delay: '1h' },
  { attempt: '5+', delay: '6h' },
];

interface Props {
  maxTrys: number;
  circuitBreakerTimer: number;
}

export function ResilienceSettingsCard({ maxTrys, circuitBreakerTimer }: Props) {
  const t = useTranslations('settings.resilience');
  const minutes = Math.round(circuitBreakerTimer / 60);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <h2 className="text-base font-semibold">{t('title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium">{t('maxTrys')}</p>
          <p className="text-2xl font-bold tabular-nums">{maxTrys}</p>
          <p className="text-xs text-muted-foreground">{t('maxTrysDesc')}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">{t('timer')}</p>
          <p className="text-2xl font-bold tabular-nums">{circuitBreakerTimer}<span className="text-base font-normal text-muted-foreground ml-1">s</span></p>
          <p className="text-xs text-muted-foreground">{t('timerDesc', { minutes })}</p>
        </div>
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
        <p className="text-xs text-muted-foreground">{t('supportNote')}</p>
      </div>
    </div>
  );
}
