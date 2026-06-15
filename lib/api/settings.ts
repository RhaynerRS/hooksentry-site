import { api } from './client';
import type { Tenant } from './types';

export const tenantApi = {
  get: (id: string) =>
    api.get<Tenant>(`/tenants/${id}`),

  purgeQueue: (destinationId: string) =>
    api.delete(`/queues/${destinationId}`),
};
