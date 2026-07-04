import apiClient from './client';
import type { StatsResponse } from './types';

export const adminApi = {
  /** KPIs tableau de bord */
  getStats: async (): Promise<StatsResponse> => {
    const res = await apiClient.get<StatsResponse>('/admin/stats');
    return res.data;
  },

  /** Export Excel */
  exportExcel: async (): Promise<Blob> => {
    const res = await apiClient.get('/admin/export', {
      params: { format: 'excel' },
      responseType: 'blob',
    });
    return res.data;
  },

  /** Export CSV */
  exportCsv: async (): Promise<Blob> => {
    const res = await apiClient.get('/admin/export', {
      params: { format: 'csv' },
      responseType: 'blob',
    });
    return res.data;
  },
};
