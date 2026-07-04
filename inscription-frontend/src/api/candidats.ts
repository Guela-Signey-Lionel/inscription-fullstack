import apiClient from './client';
import type { User, UpdateProfilRequest, CandidatDossier, ConversationThread } from './types';

const BASE = '/candidats';

export const candidatsApi = {
  /**
   * Récupérer le profil du candidat connecté
   */
  getProfil: async (): Promise<User> => {
    const response = await apiClient.get<User>(`${BASE}/profil`);
    return response.data;
  },

  /**
   * Mettre à jour le profil du candidat
   */
  updateProfil: async (data: UpdateProfilRequest): Promise<User> => {
    const response = await apiClient.put<User>(`${BASE}/profil`, data);
    return response.data;
  },

  /**
   * Récupérer le dossier d'inscription du candidat connecté
   */
  getMonDossier: async (): Promise<CandidatDossier> => {
    const response = await apiClient.get<CandidatDossier>(`${BASE}/dossier`);
    return response.data;
  },

  /**
   * Récupérer les messages du candidat connecté
   */
  getMessages: async (): Promise<ConversationThread[]> => {
    const response = await apiClient.get<ConversationThread[]>(
      `${BASE}/messages`,
    );
    return response.data;
  },
};
