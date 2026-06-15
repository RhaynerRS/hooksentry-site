'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const KNOWN = new Set([
  'dashboard', 'destinations', 'events', 'senders',
  'api-keys', 'users', 'settings', 'new', 'edit', 'mapping',
]);

export function Breadcrumbs() {
  const t = useTranslations('breadcrumbs');
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const getLabel = (seg: string) =>
    KNOWN.has(seg) ? t(seg as Parameters<typeof t>[0]) : seg;

  const crumbs = segments.map((seg, i) => ({
    label: getLabel(seg),
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
