import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeJwtPayload } from '@/lib/auth/jwt';

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('hs_access_token')?.value;
  const user = token ? decodeJwtPayload(token) : null;

  if (!user || user.role !== 'Admin') redirect('/dashboard');

  return <>{children}</>;
}
