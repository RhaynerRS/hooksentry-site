import { cloudApi } from './client';
import type { Plan, UsageResponse } from './types';

export const plansApi = {
  list: () => cloudApi.get<Plan[]>('/plans'),
};

export const usageApi = {
  get: () => cloudApi.get<UsageResponse>('/usage'),
};
