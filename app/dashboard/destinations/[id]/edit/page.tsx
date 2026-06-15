'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { destinationsApi } from '@/lib/api/destinations';
import { Destination, AuthType } from '@/lib/api/types';
import { ApiClientError } from '@/lib/api/client';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const AUTH_OPTIONS: { value: '' | AuthType; label: string }[] = [
  { value: '', label: 'Nenhuma (remover auth atual)' },
  { value: 'ApiKey', label: 'API Key' },
  { value: 'BearerToken', label: 'Bearer Token' },
  { value: 'JwtBearer', label: 'JWT Bearer (OAuth2)' },
  { value: 'BasicAuth', label: 'Basic Auth' },
];

export default function EditDestinationPage() {
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
    if (!url.startsWith('https://')) e.url = 'A URL deve começar com https://';
    if (serverRateLimit < 1 || serverRateLimit > 100) e.serverRateLimit = 'Entre 1 e 100';
    if (authType === 'ApiKey' && creds.headerName && !/^[A-Za-z0-9\-_]{1,100}$/.test(creds.headerName)) {
      e.headerName = 'Apenas letras, números, - e _';
    }
    if (authType === 'JwtBearer' && creds.tokenEndpoint && !creds.tokenEndpoint.startsWith('https://')) {
      e.tokenEndpoint = 'Deve começar com https://';
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
  if (!dest) return <p className="text-muted-foreground">Destino não encontrado.</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Editar Destino"
        description={dest.url}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors._form && <p className="text-sm text-destructive">{errors._form}</p>}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Configuração Básica
          </h2>

          <div className="space-y-1">
            <Label htmlFor="url">URL de entrega</Label>
            <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} />
            {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="rateLimit">Rate limit (req/s)</Label>
            <Input
              id="rateLimit"
              type="number"
              min={1}
              max={100}
              value={serverRateLimit}
              onChange={e => setServerRateLimit(Number(e.target.value))}
              className="w-32"
            />
            {errors.serverRateLimit && <p className="text-xs text-destructive">{errors.serverRateLimit}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Active">Ativo</option>
              <option value="Inactive">Inativo</option>
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Autenticação
          </h2>

          <p className="text-xs text-muted-foreground">
            Deixe os campos de credencial vazios para manter a configuração atual.
          </p>

          <div className="space-y-1">
            <Label htmlFor="authType">Tipo de autenticação</Label>
            <select
              id="authType"
              value={authType}
              onChange={e => { setAuthType(e.target.value as '' | AuthType); setCreds({}); }}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {AUTH_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {authType === 'ApiKey' && (
            <>
              <CredField label="Nome do Header" id="headerName" value={creds.headerName ?? ''} onChange={v => setCred('headerName', v)} placeholder="X-Api-Key" error={errors.headerName} />
              <CredField label="Valor" id="value" type="password" value={creds.value ?? ''} onChange={v => setCred('value', v)} />
            </>
          )}
          {authType === 'BearerToken' && (
            <CredField label="Token" id="token" type="password" value={creds.token ?? ''} onChange={v => setCred('token', v)} />
          )}
          {authType === 'JwtBearer' && (
            <>
              <CredField label="Token Endpoint" id="tokenEndpoint" value={creds.tokenEndpoint ?? ''} onChange={v => setCred('tokenEndpoint', v)} placeholder="https://auth.servico.com/token" error={errors.tokenEndpoint} />
              <CredField label="Client ID" id="clientId" value={creds.clientId ?? ''} onChange={v => setCred('clientId', v)} />
              <CredField label="Client Secret" id="clientSecret" type="password" value={creds.clientSecret ?? ''} onChange={v => setCred('clientSecret', v)} />
              <CredField label="Scope (opcional)" id="scope" value={creds.scope ?? ''} onChange={v => setCred('scope', v)} />
            </>
          )}
          {authType === 'BasicAuth' && (
            <>
              <CredField label="Usuário" id="username" value={creds.username ?? ''} onChange={v => setCred('username', v)} />
              <CredField label="Senha" id="password" type="password" value={creds.password ?? ''} onChange={v => setCred('password', v)} />
            </>
          )}
        </section>

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/destinations/${id}`}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

function CredField({
  label, id, type = 'text', value, onChange, placeholder, error,
}: {
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
