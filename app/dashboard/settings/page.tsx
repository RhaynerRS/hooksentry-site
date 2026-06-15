import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Configurações — HookSentry' };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Configurações gerais do tenant."
      />
    </div>
  );
}
