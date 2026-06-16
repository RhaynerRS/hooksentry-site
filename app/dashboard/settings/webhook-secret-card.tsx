'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { tenantApi } from '@/lib/api/settings';
import { useToast } from '@/hooks/use-toast';
import { SecretDisplay } from '@/components/dashboard/secret-display';
import { ConfirmDialog } from '@/components/dashboard/confirm-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  tenantId: string;
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

export function WebhookSecretCard({ tenantId, secret: initialSecret }: Props) {
  const t = useTranslations('settings.webhookSecret');
  const { toast } = useToast();

  const [secret, setSecret] = useState(initialSecret);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rotating, setRotating] = useState(false);

  const [codeOpen, setCodeOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyPayload, setVerifyPayload] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  const handleRotate = async () => {
    setRotating(true);
    try {
      const res = await tenantApi.rotateWebhookSecret(tenantId);
      setSecret(res.webhookSecret);
      toast({ title: t('rotateSuccess') });
    } catch {
      toast({ title: t('rotateError'), variant: 'destructive' });
    } finally {
      setRotating(false);
      setConfirmOpen(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyPayload.trim() || !verifySignature.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await tenantApi.verifySignature(tenantId, verifyPayload, verifySignature.trim());
      setVerifyResult(res.valid);
    } catch {
      toast({ title: t('verifyError'), variant: 'destructive' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{t('title')}</h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setConfirmOpen(true)}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t('rotateButton')}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{t('desc')}</p>

      <SecretDisplay value={secret} />

      <Separator />

      <Collapsible open={verifyOpen} onOpenChange={open => { setVerifyOpen(open); setVerifyResult(null); }}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 px-0 text-xs text-muted-foreground hover:text-foreground">
            {verifyOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {t('verifyTitle')}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-1">
            <Label className="text-xs">{t('verifyPayloadLabel')}</Label>
            <Textarea
              className="font-mono text-xs resize-none"
              rows={4}
              placeholder='{"event":"..."}'
              value={verifyPayload}
              onChange={e => { setVerifyPayload(e.target.value); setVerifyResult(null); }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t('verifySignatureLabel')}</Label>
            <Input
              className="font-mono text-xs"
              placeholder="sha256=..."
              value={verifySignature}
              onChange={e => { setVerifySignature(e.target.value); setVerifyResult(null); }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              disabled={verifying || !verifyPayload.trim() || !verifySignature.trim()}
              onClick={handleVerify}
            >
              {t('verifyButton')}
            </Button>
            {verifyResult === true && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                {t('verifyValid')}
              </span>
            )}
            {verifyResult === false && (
              <span className="flex items-center gap-1.5 text-sm text-destructive">
                <XCircle className="h-4 w-4" />
                {t('verifyInvalid')}
              </span>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible open={codeOpen} onOpenChange={setCodeOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1 px-0 text-xs text-muted-foreground hover:text-foreground">
            {codeOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={open => { if (!open) setConfirmOpen(false); }}
        title={t('rotateDialog.title')}
        description={t('rotateDialog.desc')}
        confirmLabel={t('rotateDialog.confirm')}
        destructive
        loading={rotating}
        onConfirm={handleRotate}
      />
    </div>
  );
}
