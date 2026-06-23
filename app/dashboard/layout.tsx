import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.get('hs_access_token') ?? cookieStore.get('hs_refresh_token');

  if (!hasSession) redirect('/login');

  return <DashboardShell>{children}</DashboardShell>;
}
