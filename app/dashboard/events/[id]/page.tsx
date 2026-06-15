import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Evento — HookSentry' };

export default function EventDetailPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Detalhe do Evento" />
    </div>
  );
}
