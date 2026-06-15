'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { destinationsApi } from '@/lib/api/destinations';
import { AuthType } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function NewDestinationPage() {
  const t = useTranslations('destinations');
  const tc = useTranslations('common');
  const ta = useTranslations('destinations.auth');
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [serverRateLimit, setServerRateLimit] = useState(5);
  const [authType, setAuthType] = useState<'' | AuthType>('');
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const AUTH_OPTIONS: { value: '' | AuthType; label: string }[] = [
    { value: '', label: ta('noneCreate') },
    { value: 'ApiKey', label: ta('ApiKey') },
    { value: 'BearerToken', label: ta('BearerToken') },
    { value: 'JwtBearer', label: ta('JwtBearer') },
    { value: 'BasicAuth', label: ta('BasicAuth') },
  ];

  const setCred = (key: string, val: string) =>
    setCreds(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!url.startsWith('https://')) e.url = t('new.urlError');
    if (serverRateLimit < 1 || serverRateLimit > 100) e.serverRateLimit = t('new.rateLimitError');
    if (authType === 'ApiKey') {
      if (!creds.headerName) e.headerName = '✕';
      else if (!/^[A-Za-z0-9\-_]{1,100}$/.test(creds.headerName)) e.headerName = ta('headerNameError');
      if (!creds.value) e.value = '✕';
    }
    if (authType === 'BearerToken' && !creds.token) e.token = '✕';
    if (authType === 'JwtBearer') {
      if (!creds.tokenEndpoint) e.tokenEndpoint = '✕';
      else if (!creds.tokenEndpoint.startsWith('https://')) e.tokenEndpoint = ta('tokenEndpointError');
      if (!creds.clientId) e.clientId = '✕';
      if (!creds.clientSecret) e.clientSecret = '✕';
    }
    if (authType === 'BasicAuth') {
      if (!creds.username) e.username = '✕';
      if (!creds.password) e.password = '✕';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const dest = await destinationsApi.create({
        url,
        serverRateLimit,
        authType: authType || null,
        credentials: authType ? creds : null,
      });
      sessionStorage.setItem(`hs_new_token_${dest.id}`, dest.ingestToken);
      router.push(`/dashboard/destinations/${dest.id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrors({ _form: err.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={t('new.pageTitle')} description={t('new.pageDesc')} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('new.basicSection')}
          </h2>

          <div className="space-y-1">
            <Label htmlFor="url">{t('new.urlLabel')}</Label>
            <Input id="url" type="url" placeholder={t('new.urlPlaceholder')} value={url} onChange={e => setUrl(e.target.value)} />
            {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="rateLimit">{t('new.rateLimitLabel')}</Label>
            <Input id="rateLimit" type="number" min={1} max={100} value={serverRateLimit}
              onChange={e => setServerRateLimit(Number(e.target.value))} className="w-32" />
            {errors.serverRateLimit && <p className="text-xs text-destructive">{errors.serverRateLimit}</p>}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('new.authSection')}
          </h2>

          <div className="space-y-1">
            <Label htmlFor="authType">{t('new.authTypeLabel')}</Label>
            <select id="authType" value={authType}
              onChange={e => { setAuthType(e.target.value as '' | AuthType); setCreds({}); }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {AUTH_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {authType === 'ApiKey' && (
            <>
              <CredField label={ta('headerName')} id="headerName" value={creds.headerName ?? ''} onChange={v => setCred('headerName', v)} placeholder="X-Api-Key" error={errors.headerName} />
              <CredField label={ta('value')} id="value" type="password" value={creds.value ?? ''} onChange={v => setCred('value', v)} error={errors.value} />
            </>
          )}
          {authType === 'BearerToken' && (
            <CredField label={ta('token')} id="token" type="password" value={creds.token ?? ''} onChange={v => setCred('token', v)} error={errors.token} />
          )}
          {authType === 'JwtBearer' && (
            <>
              <CredField label={ta('tokenEndpoint')} id="tokenEndpoint" value={creds.tokenEndpoint ?? ''} onChange={v => setCred('tokenEndpoint', v)} placeholder="https://auth.example.com/token" error={errors.tokenEndpoint} />
              <CredField label={ta('clientId')} id="clientId" value={creds.clientId ?? ''} onChange={v => setCred('clientId', v)} error={errors.clientId} />
              <CredField label={ta('clientSecret')} id="clientSecret" type="password" value={creds.clientSecret ?? ''} onChange={v => setCred('clientSecret', v)} error={errors.clientSecret} />
              <CredField label={ta('scope')} id="scope" value={creds.scope ?? ''} onChange={v => setCred('scope', v)} />
            </>
          )}
          {authType === 'BasicAuth' && (
            <>
              <CredField label={ta('username')} id="username" value={creds.username ?? ''} onChange={v => setCred('username', v)} error={errors.username} />
              <CredField label={ta('password')} id="password" type="password" value={creds.password ?? ''} onChange={v => setCred('password', v)} error={errors.password} />
            </>
          )}
        </section>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? t('new.submitting') : t('new.submit')}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/destinations">{tc('cancel')}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

function CredField({ label, id, type = 'text', value, onChange, placeholder, error }: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
