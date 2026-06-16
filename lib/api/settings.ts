import { api } from './client';
import type { Tenant } from './types';

export const tenantApi = {
  get: (id: string) =>
    api.get<Tenant>(`/tenants/${id}`),

  getWebhookSecret: (id: string) =>
    api.get<{ webhookSecret: string }>(`/tenants/${id}/webhook-secret`),

  rotateWebhookSecret: (id: string) =>
    api.post<{ webhookSecret: string }>(`/tenants/${id}/webhook-secret`, {}),

  purgeQueue: (destinationId: string) =>
    api.delete(`/queues/${destinationId}`),
};
