import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { authApi, getToken } from '@/api';
import type { AuthResponse, UserInfo, InscriptionResponse } from '@/api/types';
import { inscriptionsApi } from '@/api/inscriptions';

// ── Types exposés au frontend ───────────────────────────────
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'candidat';
  backendRole: UserInfo['role'];
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  dossier: InscriptionResponse | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithMicrosoft: () => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  refreshDossier: () => Promise<void>;
}

// ── Helpers ─────────────────────────────────────────────────
const USER_KEY = 'eduregister_user';

function mapUser(info: UserInfo): User {
  return {
    id: info.id,
    email: info.email,
    nom: info.nom,
    prenom: info.prenom,
    role: info.role === 'CANDIDAT' ? 'candidat' : 'admin',
    backendRole: info.role,
  };
}

function loadUser(): User | null {
  try {
    const s = localStorage.getItem(USER_KEY);
    return s ? (JSON.parse(s) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(u: User | null) {
  try {
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  } catch { /* ignore */ }
}

// ── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Restaure l'utilisateur seulement s'il y a un token valide
    return getToken() ? loadUser() : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dossier, setDossier] = useState<InscriptionResponse | null>(null);

  // ── Charge le dossier du candidat ────────────────────────
  const refreshDossier = useCallback(async () => {
    if (!user || user.role !== 'candidat') return;
    try {
      const dossiers = await inscriptionsApi.mesDossiers();
      // Prend le dossier le plus récent
      setDossier(dossiers.length > 0 ? dossiers[dossiers.length - 1] : null);
    } catch {
      setDossier(null);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'candidat') refreshDossier();
  }, [user, refreshDossier]);

  // ── Écoute l'expiration de session ───────────────────────
  useEffect(() => {
    const handler = () => {
      setUser(null);
      setDossier(null);
      saveUser(null);
    };
    window.addEventListener('eduregister:session-expired', handler);
    return () => window.removeEventListener('eduregister:session-expired', handler);
  }, []);

  // ── Login email/password ─────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res: AuthResponse = await authApi.login({ email, motDePasse: password });
      const u = mapUser(res.utilisateur);
      setUser(u);
      saveUser(u);
      return true;
    } catch (err: unknown) {
      const msg = extractError(err, 'Email ou mot de passe incorrect.');
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── OAuth2 Google / Microsoft ────────────────────────────
  // Le backend gère le redirect OAuth2. Le frontend redirige vers le backend
  // qui renverra le token dans l'URL de callback.
  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';
    window.location.href = `${apiBase.replace('/api/v1', '')}/oauth2/authorization/google`;
    return true;
  }, []);

  const loginWithMicrosoft = useCallback(async (): Promise<boolean> => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';
    window.location.href = `${apiBase.replace('/api/v1', '')}/oauth2/authorization/microsoft`;
    return true;
  }, []);

  // ── Logout ───────────────────────────────────────────────
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setDossier(null);
    saveUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin',
        isLoading,
        error,
        dossier,
        login,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        clearError,
        refreshDossier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}

// ── Utilitaire extraction erreur axios ───────────────────────
function extractError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: { message?: string } } };
    return e.response?.data?.message || fallback;
  }
  return fallback;
}
