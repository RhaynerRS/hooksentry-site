import { api } from './client';
import type { User, InviteToken, PaginatedResponse, PaginationParams } from './types';

export const usersApi = {
  list: (params?: PaginationParams & { status?: 'Active' | 'Inactive'; role?: 'Developer' | 'Admin' }) => {
    const qs = new URLSearchParams();
    qs.set('Qt', String(params?.pageSize ?? 20));
    qs.set('Pg', String(params?.page ?? 1));
    qs.set('CpOrd', 'id');
    qs.set('TpOrd', 'Desc');
    if (params?.status) qs.set('Status', params.status);
    if (params?.role) qs.set('Role', params.role);
    return api.get<PaginatedResponse<User>>(`/users?${qs}`);
  },

  get: (id: string) =>
    api.get<User>(`/users/${id}`),

  update: (id: string, body: Partial<Pick<User, 'role' | 'status'>>) =>
    api.patch<User>(`/users/${id}`, body),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

export const invitesApi = {
  list: (params?: PaginationParams & { status?: 'Pending' | 'Used' }) => {
    const qs = new URLSearchParams();
    qs.set('Qt', String(params?.pageSize ?? 20));
    qs.set('Pg', String(params?.page ?? 1));
    qs.set('CpOrd', 'id');
    qs.set('TpOrd', 'Desc');
    if (params?.status !== undefined) qs.set('Status', params.status === 'Pending' ? '0' : '1');
    return api.get<PaginatedResponse<InviteToken>>(`/invites?${qs}`);
  },

  create: (validityDays?: number) =>
    api.post<InviteToken>('/invites', { validityDays: validityDays ?? 7 }),
};
