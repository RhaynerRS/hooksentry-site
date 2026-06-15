'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination, AuthType } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function EditDestinationPage() {
  const tn = useTranslations('destinations.new');
  const te = useTranslations('destinations.edit');
  const ta = useTranslations('destinations.auth');
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState('');
  const [serverRateLimit, setServerRateLimit] = useState(5);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [authType, setAuthType] = useState<'' | AuthType>('');
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const AUTH_OPTIONS: { value: '' | AuthType; label: string }[] = [
    { value: '', label: ta('none') },
    { value: 'ApiKey', label: ta('ApiKey') },
    { value: 'BearerToken', label: ta('BearerToken') },
    { value: 'JwtBearer', label: ta('JwtBearer') },
    { value: 'BasicAuth', label: ta('BasicAuth') },
  ];

  const setCred = (key: string, val: string) =>
    setCreds(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    destinationsApi.get(id)
      .then(d => {
        setDest(d);
        setUrl(d.url);
        setServerRateLimit(d.serverRateLimit);
        setStatus(d.status === 'Suspended' ? 'Active' : d.status as 'Active' | 'Inactive');
        setAuthType(d.authType ?? '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!url.startsWith('https://')) e.url = tn('urlError');
    if (serverRateLimit < 1 || serverRateLimit > 100) e.serverRateLimit = tn('rateLimitError');
    if (authType === 'ApiKey' && creds.headerName && !/^[A-Za-z0-9\-_]{1,100}$/.test(creds.headerName)) {
      e.headerName = ta('headerNameError');
    }
    if (authType === 'JwtBearer' && creds.tokenEndpoint && !creds.tokenEndpoint.startsWith('https://')) {
      e.tokenEndpoint = ta('tokenEndpointError');
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const hasCredChanges = Object.values(creds).some(v => v !== '');
      await destinationsApi.update(id, {
        url,
        serverRateLimit,
        status,
        authType: authType || null,
        credentials: hasCredChanges ? creds : undefined,
        removeAuth: !authType ? true : undefined,
      });
      router.push(`/dashboard/destinations/${id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrors({ _form: err.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton className="h-96 rounded-md" />;
  if (!dest) return <p className="text-muted-foreground">{te('notFound')}</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={te('pageTitle')} description={dest.url} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {tn('basicSection')}
          </h2>

          <div className="space-y-1">
            <Label htmlFor="url">{tn('urlLabel')}</Label>
            <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} />
            {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="rateLimit">{tn('rateLimitLabel')}</Label>
            <Input id="rateLimit" type="number" min={1} max={100} value={serverRateLimit}
              onChange={e => setServerRateLimit(Number(e.target.value))} className="w-32" />
            {errors.serverRateLimit && <p className="text-xs text-destructive">{errors.serverRateLimit}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">{te('statusLabel')}</Label>
            <select id="status" value={status}
              onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Active">{te('statusActive')}</option>
              <option value="Inactive">{te('statusInactive')}</option>
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {te('authSection')}
          </h2>

          <p className="text-xs text-muted-foreground">{te('credNote')}</p>

          <div className="space-y-1">
            <Label htmlFor="authType">{tn('authTypeLabel')}</Label>
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
              <CredField label={ta('value')} id="value" type="password" value={creds.value ?? ''} onChange={v => setCred('value', v)} />
            </>
          )}
          {authType === 'BearerToken' && (
            <CredField label={ta('token')} id="token" type="password" value={creds.token ?? ''} onChange={v => setCred('token', v)} />
          )}
          {authType === 'JwtBearer' && (
            <>
              <CredField label={ta('tokenEndpoint')} id="tokenEndpoint" value={creds.tokenEndpoint ?? ''} onChange={v => setCred('tokenEndpoint', v)} placeholder="https://auth.example.com/token" error={errors.tokenEndpoint} />
              <CredField label={ta('clientId')} id="clientId" value={creds.clientId ?? ''} onChange={v => setCred('clientId', v)} />
              <CredField label={ta('clientSecret')} id="clientSecret" type="password" value={creds.clientSecret ?? ''} onChange={v => setCred('clientSecret', v)} />
              <CredField label={ta('scope')} id="scope" value={creds.scope ?? ''} onChange={v => setCred('scope', v)} />
            </>
          )}
          {authType === 'BasicAuth' && (
            <>
              <CredField label={ta('username')} id="username" value={creds.username ?? ''} onChange={v => setCred('username', v)} />
              <CredField label={ta('password')} id="password" type="password" value={creds.password ?? ''} onChange={v => setCred('password', v)} />
            </>
          )}
        </section>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? te('submitting') : te('submit')}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/destinations/${id}`}>{te('cancel')}</Link>
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
