import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import { authApi } from '@/api/auth';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', password: '', confirmPassword: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        motDePasse: formData.password,
      });
      // Après inscription, le backend envoie automatiquement l'OTP
      setStep('otp');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Une erreur est survenue. Veuillez réessayer.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      await authApi.verifyOtp({ email: formData.email, code: otpCode.trim() });
      setSuccess(true);
      setTimeout(() => navigate('/candidat/tableau-de-bord'), 2000);
    } catch {
      setError('Code invalide ou expiré. Vérifiez votre email ou demandez un nouveau code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true); setError('');
    try {
      await authApi.sendOtp(formData.email);
    } catch {
      setError('Impossible de renvoyer le code. Réessayez dans quelques instants.');
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background-50">
        <Navbar />
        <main className="flex items-center justify-center min-h-screen px-4 pt-20 pb-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-emerald-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground-950 mb-3">
              {t('otp.succes')}
            </h2>
            <p className="text-foreground-600 text-sm font-body">
              {t('otp.redirection')}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── Étape OTP ────────────────────────────────────────
  if (step === 'otp') {
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
                <span className="text-xl font-bold font-heading text-foreground-950">EduRegister</span>
              </Link>
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-5">
                <i className="ri-mail-check-line text-primary-600 text-2xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground-950">{t('otp.verifiezEmail')}</h1>
              <p className="text-foreground-600 text-sm mt-2 font-body">
                {t('otp.codeEnvoye')}<br />
                <strong className="text-foreground-900">{formData.email}</strong>
              </p>
            </div>

            <div className="bg-background-50 border border-background-200/70 rounded-2xl p-6 md:p-8">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-start gap-2.5">
                  <i className="ri-error-warning-line text-primary-500 text-sm w-4 h-4 flex items-center justify-center mt-0.5"></i>
                  <p className="text-xs text-primary-700 font-body">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="otp" className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label">
                    {t('otp.code')}
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="123456"
                    className="w-full px-4 py-3 rounded-xl border border-background-300 bg-background-50 text-center text-2xl font-mono tracking-[0.5em] text-foreground-950 placeholder:text-foreground-300 placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length < 6}
                  className="w-full px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all cursor-pointer font-label mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting
                    ? <>                <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>{t('otp.verification')}</>
                    : t('otp.valider')}
                </button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-xs text-foreground-500 font-body mb-2">{t('otp.pasRecu')}</p>
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium font-label disabled:opacity-50 cursor-pointer"
                >
                  {resending ? 'Envoi en cours...' : t('otp.renvoyer')}
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-foreground-600 mt-6 font-body">
              <button
                onClick={() => setStep('form')}
                className="text-primary-600 hover:text-primary-700 font-semibold cursor-pointer"
              >
                {t('otp.modifierEmail')}
              </button>
            </p>
          </div>
        </main>
      </div>
    );
  }

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
              {t('register.creerCompte')}
            </h1>
            <p className="text-foreground-600 text-sm mt-2 font-body">
              {t('register.sousTitre')}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                  >
                    {t('register.prenom')}
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Jean"
                    className="w-full px-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                  >
                    {t('register.nom')}
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Dupont"
                    className="w-full px-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                >                    {t('register.email')}
                  </label>
                <div className="relative">
                  <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vous@exemple.fr"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                >                    {t('register.motDePasse')}
                  </label>
                <div className="relative">
                  <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="8 caractères minimum"
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                    minLength={8}
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

              <div>
                <label
                  htmlFor="reg-confirm"
                  className="block text-xs font-semibold text-foreground-700 mb-1.5 font-label"
                >                    {t('register.confirmer')}
                  </label>
                <div className="relative">
                  <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Répétez votre mot de passe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-background-300 text-primary-500 focus:ring-primary-400 cursor-pointer"
                  required
                />
                <span className="text-xs text-foreground-600 font-body leading-relaxed">
                  J&apos;accepte les{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    conditions d&apos;utilisation
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    politique de confidentialité
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all cursor-pointer whitespace-nowrap font-label mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                    {t('register.creationEnCours')}
                  </>
                ) : (
                  t('register.creer')
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-foreground-600 mt-6 font-body">
            {t('register.dejaCompte')}{' '}
            <Link
              to="/connexion"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {t('register.seConnecter')}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}