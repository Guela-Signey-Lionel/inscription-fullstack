import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginWithMicrosoft, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/candidat/tableau-de-bord', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/candidat/tableau-de-bord', { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    const success = await loginWithGoogle();
    if (success) {
      navigate('/candidat/tableau-de-bord', { replace: true });
    }
  };

  const handleMicrosoftLogin = async () => {
    clearError();
    const success = await loginWithMicrosoft();
    if (success) {
      navigate('/candidat/tableau-de-bord', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />

      <main className="flex items-center justify-center min-h-screen px-4 pt-20 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
                <i className="ri-graduation-cap-fill text-white text-base w-4 h-4 flex items-center justify-center"></i>
              </div>
              <span className="text-xl font-bold font-heading text-foreground-950">
                EduRegister
              </span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950">
              Bienvenue
            </h1>
            <p className="text-foreground-600 text-sm mt-2 font-body">
              Connectez-vous à votre espace candidat ou administration
            </p>
          </div>

          <div className="bg-background-50 border border-background-200/70 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-xl border border-background-300 hover:bg-background-100 hover:border-background-400 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-google-fill text-lg w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm font-medium text-foreground-800 font-label">
                  Continuer avec Google
                </span>
              </button>
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-xl border border-background-300 hover:bg-background-100 hover:border-background-400 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-microsoft-fill text-lg w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm font-medium text-foreground-800 font-label">
                  Continuer avec Microsoft
                </span>
              </button>
            </div>

            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-background-200"></div>
              <span className="text-xs text-foreground-400 font-medium font-label">
                ou par email
              </span>
              <div className="flex-1 h-px bg-background-200"></div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-start gap-2.5">
                <i className="ri-error-warning-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center mt-0.5"></i>
                <p className="text-xs text-primary-700 font-body">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    placeholder="vous@exemple.fr"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    placeholder="Votre mot de passe"
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 cursor-pointer"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm w-4 h-4 flex items-center justify-center`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                  />
                  <span className="text-xs text-foreground-600 font-body">
                    Se souvenir de moi
                  </span>
                </label>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium font-body"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all cursor-pointer whitespace-nowrap font-label mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>


          </div>

          <p className="text-center text-sm text-foreground-600 mt-6 font-body">
            Pas encore de compte ?{' '}
            <Link
              to="/inscription-compte"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Créer un compte
            </Link>
          </p>

          <p className="text-center text-sm text-foreground-600 mt-3 font-body">
            Vous êtes administrateur ?{' '}
            <Link
              to="/connexion-admin"
              className="text-foreground-500 hover:text-foreground-700 font-medium"
            >
              Espace administration
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}