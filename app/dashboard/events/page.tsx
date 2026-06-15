import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Eventos — HookSentry' };

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Eventos"
        description="Histórico de eventos recebidos com filtros e status de entrega."
      />
    </div>
  );
}
