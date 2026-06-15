import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Sender — HookSentry' };

export default function SenderDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Detalhe do Sender" />
    </div>
  );
}
