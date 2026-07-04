import apiClient from './client';
import type {
  ConversationSummary,
  ConversationDetail,
  MessageResponse,
  EnvoyerMessageRequest,
  CreerConversationRequest,
} from './types';

const BASE = '/messages';

export const messagesApi = {
  /** Conversations du candidat connecté */
  mesConversations: async (): Promise<ConversationSummary[]> => {
    const res = await apiClient.get<ConversationSummary[]>(`${BASE}/mes-conversations`);
    return res.data;
  },

  /** Toutes les conversations (admin) */
  toutesConversations: async (): Promise<ConversationSummary[]> => {
    const res = await apiClient.get<ConversationSummary[]>(`${BASE}/conversations`);
    return res.data;
  },

  /** Détail d'une conversation avec messages */
  detail: async (id: string): Promise<ConversationDetail> => {
    const res = await apiClient.get<ConversationDetail>(`${BASE}/conversations/${id}`);
    return res.data;
  },

  /** Créer une conversation (candidat) */
  creer: async (data: CreerConversationRequest): Promise<ConversationDetail> => {
    const res = await apiClient.post<ConversationDetail>(`${BASE}/conversations`, data);
    return res.data;
  },

  /** Envoyer un message */
  envoyer: async (data: EnvoyerMessageRequest): Promise<MessageResponse> => {
    const res = await apiClient.post<MessageResponse>(`${BASE}/envoyer`, data);
    return res.data;
  },

  /** Marquer les messages d'une conv comme lus */
  marquerLus: async (conversationId: string): Promise<void> => {
    await apiClient.post(`${BASE}/conversations/${conversationId}/marquer-lus`);
  },

  /** Mettre à jour le statut d'une conversation (admin) */
  updateStatut: async (id: string, statut: 'actif' | 'resolu' | 'ferme'): Promise<ConversationSummary> => {
    const res = await apiClient.patch<ConversationSummary>(
      `${BASE}/conversations/${id}/statut`,
      { statut },
    );
    return res.data;
  },
};
