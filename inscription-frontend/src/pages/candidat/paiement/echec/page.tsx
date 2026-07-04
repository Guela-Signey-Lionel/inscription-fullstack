import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ErreurState {
  code: string;
  message: string;
  date: string;
  montant: number;
  tentative: number;
}

const defaultErreur: ErreurState = {
  code: 'CARD_DECLINED',
  message: 'Carte refusée par l\'émetteur',
  date: new Date().toISOString(),
  montant: 50000,
  tentative: 2,
};

export default function PaiementEchec() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const erreur: ErreurState = (location.state as ErreurState) || defaultErreur;

  const formattedDate = new Date(erreur.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedHeure = new Date(erreur.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Failure Card */}
        <div className="bg-white rounded-3xl border border-background-200/70 p-8 md:p-10 text-center shadow-sm">
          {/* Error Icon */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping opacity-30"></div>
            <div className="absolute inset-0 rounded-full bg-primary-100"></div>
            <div className="absolute inset-2 rounded-full bg-primary-500 flex items-center justify-center">
              <i className="ri-close-line text-white text-5xl w-14 h-14 flex items-center justify-center"></i>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground-950 mb-2">
            Paiement échoué
          </h1>
          <p className="text-foreground-500 text-sm font-body mb-3">
            Votre paiement n&apos;a pas pu être traité. Aucun montant n&apos;a été débité.
          </p>

          {/* Error Reason */}
          <div className="bg-primary-50 rounded-2xl border border-primary-200 p-4 mb-8">
            <div className="flex items-start gap-3">
              <i className="ri-error-warning-line text-primary-500 w-5 h-5 flex items-center justify-center mt-0.5"></i>
              <div className="text-left">
                <p className="text-sm font-semibold text-primary-700 font-body">Motif du refus</p>
                <p className="text-sm text-primary-600 font-body mt-1">{erreur.message}</p>
                <p className="text-xs text-primary-500 font-body mt-1.5">Code erreur : {erreur.code}</p>
              </div>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-background-50 rounded-2xl border border-background-200/70 p-5 mb-8 text-left">
            <h3 className="text-xs font-semibold text-foreground-500 uppercase tracking-wider mb-4 font-label">Résumé de la tentative</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Date</span>
                <span className="text-sm font-medium text-foreground-700 font-body">{formattedDate} à {formattedHeure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Montant</span>
                <span className="text-lg font-bold font-heading text-foreground-950">{erreur.montant.toLocaleString('fr-FR')} <span className="text-sm font-normal text-foreground-500">FCFA</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-500 font-body">Tentative n°</span>
                <span className="text-sm font-medium text-foreground-700 font-body">{erreur.tentative}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              to="/candidat/inscription"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-restart-line w-4 h-4 flex items-center justify-center"></i>
              Réessayer le paiement
            </Link>
            <Link
              to="/candidat/tableau-de-bord"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-background-100 text-foreground-700 text-sm font-semibold hover:bg-background-200 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-folder-user-line w-4 h-4 flex items-center justify-center"></i>
              Mon dossier
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-left">
            <p className="text-xs font-semibold text-amber-800 font-label mb-2">
              <i className="ri-lightbulb-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
              Conseils pour réussir votre paiement
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <i className="ri-checkbox-circle-line text-amber-600 w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
                <span className="text-xs text-amber-700 font-body">Vérifiez que votre carte n&apos;est pas expirée</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-checkbox-circle-line text-amber-600 w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
                <span className="text-xs text-amber-700 font-body">Assurez-vous d&apos;avoir suffisamment de fonds</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-checkbox-circle-line text-amber-600 w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
                <span className="text-xs text-amber-700 font-body">Essayez avec un autre mode de paiement (Mobile Money)</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-checkbox-circle-line text-amber-600 w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
                <span className="text-xs text-amber-700 font-body">Contactez votre banque pour autoriser les paiements en ligne</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Support */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <a href="mailto:support@pkfokam.cm" className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium font-body">
            <i className="ri-mail-line w-3.5 h-3.5 flex items-center justify-center"></i>
            support@pkfokam.cm
          </a>
          <span className="text-foreground-300">|</span>
          <span className="text-xs text-foreground-400 font-body">Propulsé par Stripe</span>
        </div>
      </div>
    </div>
  );
}