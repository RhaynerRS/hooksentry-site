'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CopyButton } from '@/components/ui/copy-button';
import { ChevronDown, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Props {
  tenantId: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      {children}
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  copyable?: boolean;
}

function CodeBlock({ code, copyable = false }: CodeBlockProps) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-muted p-3">
      <pre className="text-xs overflow-x-auto flex-1">{code}</pre>
      {copyable && <CopyButton value={code} />}
    </div>
  );
}

export function IntegrationGuideCard({ tenantId }: Props) {
  const t = useTranslations('settings.integration');
  const [open, setOpen] = useState(false);

  const endpointUrl = `${API_URL}/api/v1/ingest/${tenantId || '{tenantId}'}/{token}`;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{t('title')}</h2>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {open ? t('collapse') : t('expand')}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-6 space-y-6">

          <Section title={t('ingestEndpoint.title')}>
            <p className="text-xs text-muted-foreground">{t('ingestEndpoint.desc')}</p>
            <div className="flex items-center gap-2 rounded-md bg-muted p-3">
              <code className="text-xs flex-1 break-all">POST {endpointUrl}</code>
              <CopyButton value={`POST ${endpointUrl}`} />
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                <span className="font-mono">{'{tenantId}'}</span>: {t('ingestEndpoint.tenantIdLabel')}{' '}
                <span className="font-mono">{tenantId || '—'}</span>
                {tenantId && <CopyButton value={tenantId} className="ml-1 inline-flex h-4 w-4" />}
              </li>
              <li><span className="font-mono">{'{token}'}</span>: {t('ingestEndpoint.tokenLabel')}</li>
            </ul>
          </Section>

          <Separator />

          <Section title={t('headers.title')}>
            <p className="text-xs text-muted-foreground">{t('headers.desc')}</p>
            <CodeBlock code={`X-Api-Key: hsk_...\nContent-Type: application/json`} copyable />
          </Section>

          <Separator />

          <Section title={t('idempotency.title')}>
            <p className="text-xs text-muted-foreground">{t('idempotency.desc')}</p>
            <CodeBlock code={`X-Idempotency-Key: <unique-string-per-event>`} copyable />
          </Section>

          <Separator />

          <Section title={t('signature.title')}>
            <p className="text-xs text-muted-foreground">{t('signature.desc')}</p>
          </Section>

        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
