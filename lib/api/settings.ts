import { api } from './client';
import type { Tenant, UpdateTenantRequest } from './types';

export const tenantApi = {
  get: (id: string) =>
    api.get<Tenant>(`/tenants/${id}`),

  update: (id: string, body: UpdateTenantRequest) =>
    api.patch<Tenant>(`/tenants/${id}`, body),

  getWebhookSecret: (id: string) =>
    api.get<{ webhookSecret: string }>(`/tenants/${id}/webhook-secret`),

  rotateWebhookSecret: (id: string) =>
    api.post<{ webhookSecret: string }>(`/tenants/${id}/webhook-secret`, {}),

  verifySignature: (id: string, payload: string, signature: string) =>
    api.post<{ valid: boolean }>(`/tenants/${id}/webhook-secret/verify`, { payload, signature }),

  purgeQueue: (destinationId: string) =>
    api.delete(`/queues/${destinationId}`),
};
