import { AuthUser } from '@/lib/types/auth';

export function decodeJwtPayload(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.sub,
      tenantId: payload.tenant_id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
