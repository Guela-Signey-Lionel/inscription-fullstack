import apiClient from './client';
import type { Formation } from './types';

const BASE = '/formations';

export const formationsApi = {
  getAll: async (): Promise<Formation[]> => {
    const res = await apiClient.get<Formation[]>(BASE);
    return res.data;
  },
  getById: async (id: string): Promise<Formation> => {
    const res = await apiClient.get<Formation>(`${BASE}/${id}`);
    return res.data;
  },
};
