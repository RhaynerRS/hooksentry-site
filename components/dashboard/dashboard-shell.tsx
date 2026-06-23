'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { Logo } from '@/components/logo';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { ColorModeSwitcher } from '@/components/color-mode-switcher';
import { LanguageSwitcher } from '@/components/dashboard/language-switcher';
import {
  LayoutDashboard, Webhook, Zap, Radio, Key, Users, Settings, LogOut, Menu,
} from 'lucide-react';

interface NavItem {
  labelKey: Parameters<ReturnType<typeof useTranslations<'nav'>>>[0];
  href: string;
  adminOnly?: boolean;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'overview',      href: '/dashboard',              icon: LayoutDashboard },
  { labelKey: 'destinations',  href: '/dashboard/destinations', icon: Webhook },
  { labelKey: 'events',        href: '/dashboard/events',       icon: Zap },
  { labelKey: 'senders',       href: '/dashboard/senders',      icon: Radio },
  { labelKey: 'apiKeys',       href: '/dashboard/api-keys',     icon: Key },
  { labelKey: 'users',         href: '/dashboard/users',        icon: Users, adminOnly: true },
  { labelKey: 'settings',      href: '/dashboard/settings',     icon: Settings },
];

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    item => !item.adminOnly || user?.role === 'Admin',
  );

  const sidebar = (
    <nav className="flex flex-col h-full">
      <div className="px-4 py-4 h-14 border-b">
        <Logo />
      </div>
      <ul className="flex-1 py-4 space-y-1 px-2">
        {visibleItems.map(item => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.labelKey as string)}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('signOut')}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r bg-background flex-col">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-background border-r">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b flex items-center px-4 gap-3 flex-shrink-0">
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Breadcrumbs />
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ColorModeSwitcher />
          </div>
        </header>

        <main className="flex-1 overflow-auto px-48 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
