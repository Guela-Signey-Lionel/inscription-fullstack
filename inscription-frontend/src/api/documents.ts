import apiClient from './client';
import type { DocumentResponse, ValiderDocumentRequest } from './types';

const BASE = '/documents';

export const documentsApi = {
  /** Uploader un document (candidat) */
  upload: async (
    inscriptionId: string,
    typeDocument: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<DocumentResponse> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<DocumentResponse>(
      `${BASE}/upload`,
      form,
      {
        params: { inscriptionId, typeDocument },
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
      },
    );
    return res.data;
  },

  /** Documents d'un dossier */
  byInscription: async (inscriptionId: string): Promise<DocumentResponse[]> => {
    const res = await apiClient.get<DocumentResponse[]>(`${BASE}/inscription/${inscriptionId}`);
    return res.data;
  },

  /** Valider / Rejeter un document (admin) */
  valider: async (id: string, data: ValiderDocumentRequest): Promise<DocumentResponse> => {
    const res = await apiClient.patch<DocumentResponse>(`${BASE}/${id}/statut`, data);
    return res.data;
  },
};
