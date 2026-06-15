import { api } from './client';
import type { Event, GetEventsParams, PaginatedResponse } from './types';

export const eventsApi = {
  list: (params?: GetEventsParams) => {
    const qs = new URLSearchParams();
    qs.set('Qt', String(params?.pageSize ?? 20));
    qs.set('Pg', String(params?.page ?? 1));
    qs.set('CpOrd', 'acceptedAt');
    qs.set('TpOrd', 'Desc');
    if (params?.status) qs.set('Status', params.status);
    if (params?.destinationId) qs.set('DestinationUrlId', params.destinationId);
    if (params?.from) qs.set('From', params.from);
    if (params?.to) qs.set('To', params.to);
    return api.get<PaginatedResponse<Event>>(`/events?${qs}`);
  },

  get: (id: string) =>
    api.get<Event>(`/events/${id}`),

  replay: (id: string) =>
    api.post<void>(`/events/${id}/replay`),
};
