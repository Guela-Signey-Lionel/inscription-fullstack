import apiClient from './client';
import type {
  InscriptionResponse,
  CreateInscriptionRequest,
  UpdateInscriptionRequest,
  TransitionRequest,
  SuiviPublicResponse,
  PagedResponse,
} from './types';

const BASE = '/inscriptions';

export const inscriptionsApi = {
  /** Créer un dossier (candidat) */
  creer: async (data: CreateInscriptionRequest): Promise<InscriptionResponse> => {
    const res = await apiClient.post<InscriptionResponse>(BASE, data);
    return res.data;
  },

  /** Auto-save wizard (candidat) */
  autoSave: async (id: string, data: UpdateInscriptionRequest): Promise<InscriptionResponse> => {
    const res = await apiClient.patch<InscriptionResponse>(`${BASE}/${id}`, data);
    return res.data;
  },

  /** Soumettre le dossier (candidat) */
  soumettre: async (id: string): Promise<InscriptionResponse> => {
    const res = await apiClient.post<InscriptionResponse>(`${BASE}/${id}/soumettre`);
    return res.data;
  },

  /** Mes dossiers (candidat) */
  mesDossiers: async (): Promise<InscriptionResponse[]> => {
    const res = await apiClient.get<InscriptionResponse[]>(`${BASE}/mes-dossiers`);
    return res.data;
  },

  /** Suivi public par référence (sans auth) */
  suiviPublic: async (reference: string): Promise<SuiviPublicResponse> => {
    const res = await apiClient.get<SuiviPublicResponse>(`${BASE}/suivi/${reference}`);
    return res.data;
  },

  /** Liste paginée (admin) */
  lister: async (params?: {
    statut?: string;
    formation?: string;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<InscriptionResponse>> => {
    const res = await apiClient.get<PagedResponse<InscriptionResponse>>(BASE, { params });
    return res.data;
  },

  /** Transition de statut (admin) */
  transition: async (id: string, data: TransitionRequest): Promise<InscriptionResponse> => {
    const res = await apiClient.post<InscriptionResponse>(`${BASE}/${id}/transition`, data);
    return res.data;
  },
};
