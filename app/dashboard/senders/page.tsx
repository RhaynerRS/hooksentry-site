import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Senders — HookSentry' };

export default function SendersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Senders"
        description="Fontes de webhook configuradas para este tenant."
      />
    </div>
  );
}
