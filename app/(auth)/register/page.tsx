'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registrationApi, type RegistrationCapabilities } from '@/lib/api/registration';

// Coleta o fingerprint do browser. Fail-open: qualquer erro retorna null e o cadastro segue.
async function collectFingerprint(): Promise<string | null> {
  try {
    const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch {
    return null;
  }
}

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();

  const [tenantName, setTenantName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState<string | null>(null);

  const [caps, setCaps] = useState<RegistrationCapabilities | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);
  const [cfToken, setCfToken] = useState<string | null>(null);

  // Descobre quais proteções o backend exige (só existem no cloud; self-hosted → tudo false).
  useEffect(() => {
    registrationApi.getCapabilities().then(async c => {
      setCaps(c);
      if (c.fingerprintEnabled) setDeviceFingerprint(await collectFingerprint());
    });
  }, []);

  const turnstileBlocking = caps?.turnstileEnabled && !cfToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (ownerPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);

    const res = await fetch('/api/proxy/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: tenantName,
        ownerEmail,
        ownerPassword,
        ...(deviceFingerprint ? { deviceFingerprint } : {}),
        ...(cfToken ? { cfTurnstileToken: cfToken } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (res.status === 409) setError(t('conflict'));
      else if (res.status === 422 && body?.error === 'disposable_email') setError(t('disposableEmail'));
      else if (res.status === 429) setError(t('tooManyRequests'));
      else if (res.status === 400 && body?.error === 'invalid_turnstile') setError(t('turnstileFailed'));
      else setError(t('error'));
      setCfToken(null); // token Turnstile é de uso único — força novo desafio
      setLoading(false);
      return;
    }

    const data = await res.json();
    if (data.webhookSecret) {
      setWebhookSecret(data.webhookSecret);
    } else {
      router.replace('/login?registered=1');
    }

    setLoading(false);
  };

  if (webhookSecret) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('successTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('successSecret')}</p>
            <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                {t('webhookSecretLabel')}
              </p>
              <code className="break-all text-sm font-mono text-yellow-900 dark:text-yellow-100">
                {webhookSecret}
              </code>
            </div>
            <Button className="w-full" onClick={() => router.replace('/login?registered=1')}>
              {t('goToLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="tenantName">{t('tenantName')}</Label>
              <Input id="tenantName" value={tenantName} onChange={e => setTenantName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ownerEmail">{t('adminEmail')}</Label>
              <Input id="ownerEmail" type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ownerPassword">{t('adminPassword')}</Label>
              <Input id="ownerPassword" type="password" value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {caps?.turnstileEnabled && caps.turnstileSiteKey && (
              <Turnstile
                siteKey={caps.turnstileSiteKey}
                onSuccess={setCfToken}
                onError={() => setCfToken(null)}
                onExpire={() => setCfToken(null)}
              />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || turnstileBlocking}>
              {loading ? t('submitting') : t('submit')}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('hasAccount')}{' '}
            <a href="/login" className="underline">{t('signIn')}</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
