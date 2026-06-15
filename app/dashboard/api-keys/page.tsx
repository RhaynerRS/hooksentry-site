import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'API Keys — HookSentry' };

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Gerencie as chaves de API do seu tenant."
      />
    </div>
  );
}
