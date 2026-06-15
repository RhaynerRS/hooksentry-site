import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Usuários — HookSentry' };

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie usuários e convites do tenant."
      />
    </div>
  );
}
