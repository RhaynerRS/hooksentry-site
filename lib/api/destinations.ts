import { api } from './client';
import type {
  Destination, CreateDestinationRequest, UpdateDestinationRequest,
  IngestTokenResponse, PaginatedResponse, PaginationParams,
} from './types';

export const destinationsApi = {
  list: (params?: PaginationParams) =>
    api.get<PaginatedResponse<Destination>>(
      `/destinations?Qt=${params?.pageSize ?? 20}&Pg=${params?.page ?? 1}&CpOrd=id&TpOrd=Desc`
    ),

  get: (id: string) =>
    api.get<Destination>(`/destinations/${id}`),

  create: (body: CreateDestinationRequest) =>
    api.post<Destination>('/destinations', body),

  update: (id: string, body: UpdateDestinationRequest) =>
    api.patch<Destination>(`/destinations/${id}`, body),

  rotateIngestToken: (id: string) =>
    api.post<IngestTokenResponse>(`/destinations/${id}/ingest-token`),
};
