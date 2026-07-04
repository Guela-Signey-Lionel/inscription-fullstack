import apiClient, { setTokens, clearTokens } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  VerifyOtpRequest,
  UtilisateurResponse,
  UpdateProfilRequest,
  ChangePasswordRequest,
} from './types';

// Réexporter UtilisateurResponse depuis types
import type { UtilisateurResponse as _UR } from './types';

const BASE = '/auth';

export const authApi = {
  /** Connexion email/password */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(`${BASE}/login`, data);
    setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  },

  /** Inscription nouveau candidat */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(`${BASE}/register`, data);
    setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  },

  /** Vérifier OTP email */
  verifyOtp: async (data: VerifyOtpRequest): Promise<void> => {
    await apiClient.post(`${BASE}/verify-otp`, data);
  },

  /** Renvoyer OTP */
  sendOtp: async (email: string): Promise<void> => {
    await apiClient.post(`${BASE}/send-otp`, null, { params: { email } });
  },

  /** Refresh token */
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(`${BASE}/refresh`, null, {
      headers: { 'X-Refresh-Token': refreshToken },
    });
    setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  },

  /** Profil utilisateur connecté */
  getMe: async (): Promise<import('./types').UtilisateurResponse> => {
    const res = await apiClient.get<import('./types').UtilisateurResponse>(`${BASE}/me`);
    return res.data;
  },

  /** Mettre à jour son profil */
  updateMe: async (data: UpdateProfilRequest): Promise<import('./types').UtilisateurResponse> => {
    const res = await apiClient.put<import('./types').UtilisateurResponse>(`${BASE}/me`, data);
    return res.data;
  },

  /** Changer son mot de passe */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post(`${BASE}/change-password`, data);
  },

  /** Déconnexion (nettoyage local) */
  logout: (): void => {
    clearTokens();
  },
};
