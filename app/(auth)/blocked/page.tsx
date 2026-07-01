'use client';

import { useTranslations } from 'next-intl';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlockedPage() {
  const t = useTranslations('blocked');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center space-y-2">
          <ShieldAlert className="h-10 w-10 text-destructive" />
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">{t('message')}</p>
          <Button className="w-full" onClick={() => (window.location.href = '/login')}>
            {t('backToLogin')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
