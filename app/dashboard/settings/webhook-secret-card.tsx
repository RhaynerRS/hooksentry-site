'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  secret: string;
}

const NODE_SNIPPET = `const crypto = require('crypto');
const signature = req.headers['x-hooksentry-signature'];
const expected = 'sha256=' + crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(req.body) // raw body Buffer
  .digest('hex');
const isValid = crypto.timingSafeEqual(
  Buffer.from(signature), Buffer.from(expected)
);`;

const PYTHON_SNIPPET = `import hmac, hashlib
signature = request.headers.get('X-HookSentry-Signature')
expected = 'sha256=' + hmac.new(
  WEBHOOK_SECRET.encode(), request.body, hashlib.sha256
).hexdigest()
is_valid = hmac.compare_digest(signature, expected)`;

export function WebhookSecretCard({ secret }: Props) {
  const t = useTranslations('settings.webhookSecret');
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-base font-semibold">{t('title')}</h2>
      <p className="text-sm text-muted-foreground">{t('desc')}</p>

      <SecretDisplay value={secret} />

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 px-0 text-xs text-muted-foreground hover:text-foreground">
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {t('codeTitle')}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{t('nodeLabel')}</p>
            <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">{NODE_SNIPPET}</pre>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{t('pythonLabel')}</p>
            <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">{PYTHON_SNIPPET}</pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
