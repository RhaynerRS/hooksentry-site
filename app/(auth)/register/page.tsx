'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
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
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tenantName, adminEmail, adminPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? 'Erro ao criar conta. Tente novamente.');
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
            <CardTitle>Conta criada com sucesso!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Guarde este segredo — não será exibido novamente.
            </p>
            <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-950">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">Webhook Secret</p>
              <code className="break-all text-sm font-mono text-yellow-900 dark:text-yellow-100">{webhookSecret}</code>
            </div>
            <Button className="w-full" onClick={() => router.replace('/login?registered=1')}>
              Ir para o login
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
          <CardTitle>Criar Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="tenantName">Nome do Tenant</Label>
              <Input id="tenantName" value={tenantName} onChange={e => setTenantName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="adminEmail">Email do administrador</Label>
              <Input id="adminEmail" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="adminPassword">Senha</Label>
              <Input id="adminPassword" type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta? <a href="/login" className="underline">Entrar</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
