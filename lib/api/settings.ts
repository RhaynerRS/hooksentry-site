import { api } from './client';
import type { Tenant } from './types';

export const tenantApi = {
  get: (id: string) =>
    api.get<Tenant>(`/tenants/${id}`),

  getWebhookSecret: (id: string) =>
    api.get<{ webhookSecret: string }>(`/tenants/${id}/webhook-secret`),

  rotateWebhookSecret: (id: string) =>
    api.post<{ webhookSecret: string }>(`/tenants/${id}/webhook-secret`, {}),

  verifySignature: (id: string, payload: string, signature: string) =>
    api.post<{ valid: boolean }>(`/tenants/${id}/webhook-secret/verify`, { payload, signature }),

  purgeQueue: (destinationId: string) =>
    api.delete(`/queues/${destinationId}`),
};
