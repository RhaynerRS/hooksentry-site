'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();

  const [tenantName, setTenantName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [webhookSecret, setWebhookSecret] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (adminPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);

    const res = await fetch('/api/proxy/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: tenantName, adminEmail, adminPassword }),
    });

    if (!res.ok) {
      if (res.status === 409) setError(t('conflict'));
      else setError(t('error'));
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
              <Label htmlFor="adminEmail">{t('adminEmail')}</Label>
              <Input id="adminEmail" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="adminPassword">{t('adminPassword')}</Label>
              <Input id="adminPassword" type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
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
