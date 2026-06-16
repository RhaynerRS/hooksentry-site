'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/dashboard/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTab } from './users-tab';
import { InvitesTab } from './invites-tab';

export default function UsersPage() {
  const t = useTranslations('users');

  return (
    <div className="space-y-6">
      <PageHeader title={t('pageTitle')} description={t('pageDesc')} />
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">{t('tabs.members')}</TabsTrigger>
          <TabsTrigger value="invites">{t('tabs.invites')}</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-4">
          <UsersTab />
        </TabsContent>
        <TabsContent value="invites" className="mt-4">
          <InvitesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
