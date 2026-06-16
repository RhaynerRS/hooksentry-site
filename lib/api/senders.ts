import { api } from './client';
import type {
  Sender, SenderDetail, CreateSenderRequest, CreateSenderResponse,
  IngestTokenResponse, PaginatedResponse, PaginationParams,
} from './types';

export const sendersApi = {
  listByDestination: (destinationId: string, params?: PaginationParams) =>
    api.get<PaginatedResponse<Sender>>(
      `/destinations/${destinationId}/senders?Qt=${params?.pageSize ?? 20}&Pg=${params?.page ?? 1}&CpOrd=id&TpOrd=Desc`
    ),

  get: (id: string) =>
    api.get<SenderDetail>(`/senders/${id}`),

  create: (destinationId: string, body: CreateSenderRequest) =>
    api.post<CreateSenderResponse>(`/destinations/${destinationId}/senders`, body),

  delete: (id: string) =>
    api.delete(`/senders/${id}`),

  rotateIngestToken: (id: string) =>
    api.post<IngestTokenResponse>(`/senders/${id}/ingest-token`),

  getMapping: (id: string) =>
    api.get<{ mapping: Record<string, unknown> | null }>(`/senders/${id}/mapping`),

  setMapping: (id: string, mapping: Record<string, unknown>) =>
    api.post<void>(`/senders/${id}/mapping`, mapping),

  deleteMapping: (id: string) =>
    api.delete(`/senders/${id}/mapping`),
};
