import apiClient from './client';
import type {
  CandidatDossier,
  CreationDossierRequest,
  SoumettreDossierRequest,
  ListeDossiersParams,
  PageResponse,
  ValidationDocumentRequest,
  Document,
} from './types';

const BASE = '/dossiers';

export const dossiersApi = {
  /**
   * Créer un nouveau dossier d'inscription
   */
  creer: async (data: CreationDossierRequest): Promise<CandidatDossier> => {
    const response = await apiClient.post<CandidatDossier>(BASE, data);
    return response.data;
  },

  /**
   * Récupérer un dossier par son ID
   */
  getById: async (id: string): Promise<CandidatDossier> => {
    const response = await apiClient.get<CandidatDossier>(`${BASE}/${id}`);
    return response.data;
  },

  /**
   * Mettre à jour un dossier (étape en cours, données)
   */
  update: async (
    id: string,
    data: Partial<CandidatDossier>,
  ): Promise<CandidatDossier> => {
    const response = await apiClient.put<CandidatDossier>(
      `${BASE}/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Soumettre un dossier pour validation
   */
  soumettre: async (
    data: SoumettreDossierRequest,
  ): Promise<CandidatDossier> => {
    const response = await apiClient.post<CandidatDossier>(
      `${BASE}/${data.dossierId}/soumettre`,
    );
    return response.data;
  },

  /**
   * Téléverser un document pour un dossier
   */
  uploadDocument: async (
    dossierId: string,
    type: string,
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post<Document>(
      `${BASE}/${dossierId}/documents`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percent);
          }
        },
      },
    );
    return response.data;
  },

  /**
   * Supprimer un document
   */
  deleteDocument: async (
    dossierId: string,
    documentId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${BASE}/${dossierId}/documents/${documentId}`,
    );
  },

  /**
   * Récupérer l'URL de téléchargement d'un document
   */
  getDocumentUrl: async (
    dossierId: string,
    documentId: string,
  ): Promise<{ url: string }> => {
    const response = await apiClient.get<{ url: string }>(
      `${BASE}/${dossierId}/documents/${documentId}/download`,
    );
    return response.data;
  },

  // ---- Routes Admin ----

  /**
   * Lister tous les dossiers (admin)
   */
  lister: async (
    params?: ListeDossiersParams,
  ): Promise<PageResponse<CandidatDossier>> => {
    const response = await apiClient.get<PageResponse<CandidatDossier>>(BASE, {
      params,
    });
    return response.data;
  },

  /**
   * Valider ou refuser un document (admin)
   */
  validerDocument: async (
    dossierId: string,
    data: ValidationDocumentRequest,
  ): Promise<Document> => {
    const response = await apiClient.put<Document>(
      `${BASE}/${dossierId}/documents/${data.documentId}/valider`,
      data,
    );
    return response.data;
  },

  /**
   * Mettre à jour le statut d'un dossier (admin)
   */
  updateStatut: async (
    dossierId: string,
    statut: string,
    commentaire?: string,
  ): Promise<CandidatDossier> => {
    const response = await apiClient.put<CandidatDossier>(
      `${BASE}/${dossierId}/statut`,
      { statut, commentaire },
    );
    return response.data;
  },
};
