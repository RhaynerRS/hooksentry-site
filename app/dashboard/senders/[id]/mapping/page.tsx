import { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page-header';

export const metadata: Metadata = { title: 'Mapeamento — HookSentry' };

export default function SenderMappingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mapeamento"
        description="Editor de mapeamento DSL para este sender."
      />
    </div>
  );
}
