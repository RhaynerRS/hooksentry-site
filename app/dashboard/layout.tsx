import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeJwtPayload } from '@/lib/auth/jwt';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('hs_access_token')?.value
             ?? cookieStore.get('hs_refresh_token')?.value;

  if (!token) redirect('/login');

  const atToken = cookieStore.get('hs_access_token')?.value;
  const user = atToken ? decodeJwtPayload(atToken) : null;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
