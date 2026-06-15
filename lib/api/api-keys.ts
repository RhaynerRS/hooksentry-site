import { api } from './client';
import type { ApiKey, CreateApiKeyResponse, PaginatedResponse, PaginationParams } from './types';

export const apiKeysApi = {
  list: (params?: PaginationParams & { isActive?: boolean }) => {
    const qs = new URLSearchParams();
    qs.set('Qt', String(params?.pageSize ?? 20));
    qs.set('Pg', String(params?.page ?? 1));
    qs.set('CpOrd', 'id');
    qs.set('TpOrd', 'Desc');
    if (params?.isActive !== undefined) qs.set('IsActive', String(params.isActive));
    return api.get<PaginatedResponse<ApiKey>>(`/apikeys?${qs}`);
  },

  create: (name: string) =>
    api.post<CreateApiKeyResponse>('/apikeys', { name }),

  revoke: (id: string) =>
    api.delete(`/apikeys/${id}`),
};
