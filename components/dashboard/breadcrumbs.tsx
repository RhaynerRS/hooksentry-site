'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  destinations: 'Destinos',
  events: 'Eventos',
  senders: 'Senders',
  'api-keys': 'API Keys',
  users: 'Usuários',
  settings: 'Configurações',
  new: 'Novo',
  edit: 'Editar',
  mapping: 'Mapeamento',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: SEGMENT_LABELS[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
