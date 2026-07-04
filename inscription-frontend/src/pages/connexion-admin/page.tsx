import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/tableau-de-bord', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/admin/tableau-de-bord', { replace: true });
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold font-label mb-4">
              <i className="ri-shield-check-line w-3.5 h-3.5 flex items-center justify-center"></i>
              Espace Administration
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950">
              Administration
            </h1>
            <p className="text-foreground-600 text-sm mt-2 font-body">
              Connectez-vous pour gérer les dossiers, les inscriptions et la plateforme
            </p>
          </div>

          <div className="bg-background-50 border border-background-200/70 rounded-2xl p-6 md:p-8">
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
                  Adresse email administrateur
                </label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    placeholder="admin@exemple.fr"
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
                  <>
                    <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center"></i>
                    Accéder à l&apos;administration
                  </>
                )}
              </button>
            </form>


          </div>

          <p className="text-center text-sm text-foreground-600 mt-6 font-body">
            Vous êtes candidat ?{' '}
            <Link
              to="/connexion"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Espace étudiant
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}