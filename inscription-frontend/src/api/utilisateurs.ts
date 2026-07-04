import apiClient from './client';
import type { UtilisateurResponse } from './types';

export const utilisateursApi = {
  lister: async (role?: string): Promise<UtilisateurResponse[]> => {
    const res = await apiClient.get<UtilisateurResponse[]>('/admin/utilisateurs', {
      params: role ? { role } : undefined,
    });
    return res.data;
  },

  getById: async (id: string): Promise<UtilisateurResponse> => {
    const res = await apiClient.get<UtilisateurResponse>(`/admin/utilisateurs/${id}`);
    return res.data;
  },

  toggleStatut: async (id: string): Promise<UtilisateurResponse> => {
    const res = await apiClient.patch<UtilisateurResponse>(`/admin/utilisateurs/${id}/statut`);
    return res.data;
  },

  updateRole: async (id: string, role: string): Promise<UtilisateurResponse> => {
    const res = await apiClient.put<UtilisateurResponse>(`/admin/utilisateurs/${id}/role`, { role });
    return res.data;
  },
};
