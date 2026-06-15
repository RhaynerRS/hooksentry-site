import { api, ApiClientError } from './client';
import type {
  Destination, CreateDestinationRequest, UpdateDestinationRequest,
  CreateDestinationResponse, IngestTokenResponse, PaginatedResponse, GetDestinationsParams,
} from './types';

export const destinationsApi = {
  list: (params?: GetDestinationsParams) => {
    const qs = new URLSearchParams();
    qs.set('Qt', String(params?.pageSize ?? 20));
    qs.set('Pg', String(params?.page ?? 1));
    qs.set('CpOrd', 'id');
    qs.set('TpOrd', 'Desc');
    if (params?.status) qs.set('Status', params.status);
    return api.get<PaginatedResponse<Destination>>(`/destinations?${qs}`);
  },

  get: async (id: string) => {
    const { items } = await api.get<PaginatedResponse<Destination>>(
      `/destinations?Qt=200&Pg=1&CpOrd=id&TpOrd=Desc`
    );
    const dest = items.find(d => d.id === id);
    if (!dest) throw new ApiClientError(404, 'Destino não encontrado');
    return dest;
  },

  create: (body: CreateDestinationRequest) =>
    api.post<CreateDestinationResponse>('/destinations', body),

  update: (id: string, body: UpdateDestinationRequest) =>
    api.patch<Destination>(`/destinations/${id}`, body),

  rotateIngestToken: (id: string) =>
    api.post<IngestTokenResponse>(`/destinations/${id}/ingest-token`),

  purgeQueue: (id: string) =>
    api.delete(`/queues/${id}`),
};
