import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import { authApi } from '@/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.sendOtp(email.trim());
      setSubmitted(true);
    } catch {
      // Pour des raisons de sécurité on affiche quand même le succès
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
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
              Mot de passe oublié
            </h1>
            <p className="text-foreground-600 text-sm mt-2 font-body">
              {submitted
                ? 'Consultez votre boîte mail pour réinitialiser votre mot de passe.'
                : 'Saisissez votre adresse email pour recevoir un lien de réinitialisation.'}
            </p>
          </div>

          <div className="bg-background-50 border border-background-200/70 rounded-2xl p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-5">
                  <i className="ri-mail-send-line text-primary-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground-950 mb-2">
                  Email envoyé !
                </h3>
                <p className="text-sm text-foreground-500 font-body max-w-sm mx-auto leading-relaxed">
                  Si un compte est associé à <strong className="text-foreground-700">{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.
                </p>
                <p className="text-xs text-foreground-400 font-body mt-4">
                  Pensez à vérifier vos spams.
                </p>
                <Link
                  to="/connexion"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-start gap-2.5">
                    <i className="ri-error-warning-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center mt-0.5"></i>
                    <p className="text-xs text-primary-700 font-body">{error}</p>
                  </div>
                )}

                <div className="mb-5">
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="vous@exemple.fr"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all cursor-pointer whitespace-nowrap font-label disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center"></i>
                      Envoyer le lien
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-foreground-600 mt-6 font-body">
                  <Link
                    to="/connexion"
                    className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
                  >
                    <i className="ri-arrow-left-line text-sm w-4 h-4 flex items-center justify-center"></i>
                    Retour à la connexion
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}