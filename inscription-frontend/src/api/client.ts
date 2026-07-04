import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

const TOKEN_KEY = 'eduregister_access_token';
const REFRESH_TOKEN_KEY = 'eduregister_refresh_token';

// Port 8082 selon application.yml
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setTokens(access: string, refresh?: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  } catch { /* ignore */ }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch { /* ignore */ }
}

export function hasToken(): boolean {
  return getToken() !== null;
}

const SESSION_EXPIRED_EVENT = 'eduregister:session-expired';

function handleSessionExpired(): void {
  clearTokens();
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Injecte le JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Gestion des erreurs + refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original.url?.includes('/auth/refresh')) {
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, null, {
            headers: { 'X-Refresh-Token': refresh },
          });
          const { accessToken, refreshToken } = res.data;
          setTokens(accessToken, refreshToken);
          if (original.headers) original.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(original);
        } catch {
          handleSessionExpired();
          return Promise.reject(error);
        }
      }
      handleSessionExpired();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
