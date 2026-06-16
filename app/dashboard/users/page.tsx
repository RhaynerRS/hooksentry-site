'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/dashboard/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UsersTab } from './users-tab';
import { InvitesTab } from './invites-tab';

export default function UsersPage() {
  const t = useTranslations('users');
  const [activeTab, setActiveTab] = useState('members');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title={t('pageTitle')} description={t('pageDesc')} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="members">{t('tabs.members')}</TabsTrigger>
            <TabsTrigger value="invites">{t('tabs.invites')}</TabsTrigger>
          </TabsList>
          {activeTab === 'invites' && (
            <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
              {t('invites.generateButton')}
            </Button>
          )}
        </div>
        <TabsContent value="members" className="mt-4">
          <UsersTab />
        </TabsContent>
        <TabsContent value="invites" className="mt-4">
          <InvitesTab createOpen={inviteDialogOpen} onCreateOpenChange={setInviteDialogOpen} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
