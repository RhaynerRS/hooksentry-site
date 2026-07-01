import { AuthUser } from '@/lib/types/auth';

// The JWT `role` claim carries the numeric UserRole ordinal ("0"/"1"/"10"/"20"),
// while the rest of the app (and REST responses) use the role name. Map it here so
// every consumer of AuthUser.role can compare against 'Developer' | 'Admin' | 'Owner' | 'Viewer'.
const ROLE_BY_CLAIM: Record<string, AuthUser['role']> = {
  '0': 'Developer',
  '1': 'Admin',
  '10': 'Owner',
  '20': 'Viewer',
};

export function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const rawRole = String(payload.role);
    return {
      userId: payload.sub,
      tenantId: payload.tenant_id,
      email: payload.email,
      // Fall back to the raw value if the backend ever emits the name directly.
      role: ROLE_BY_CLAIM[rawRole] ?? (rawRole as AuthUser['role']),
    };
  } catch {
    return null;
  }
}
