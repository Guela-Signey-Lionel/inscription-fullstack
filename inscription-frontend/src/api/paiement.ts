import apiClient from './client';
import type {
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
  PaiementResponse,
} from './types';

export const paiementApi = {
  /** Créer un PaymentIntent Stripe (candidat) */
  creerIntent: async (data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
    const res = await apiClient.post<PaymentIntentResponse>('/paiements/intent', data);
    return res.data;
  },

  /** Statut paiement d'un dossier */
  getByInscription: async (inscriptionId: string): Promise<PaiementResponse> => {
    const res = await apiClient.get<PaiementResponse>(`/paiements/inscription/${inscriptionId}`);
    return res.data;
  },
};
