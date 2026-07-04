import CandidatLayout from '@/components/layout/CandidatLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { documentsApi } from '@/api/documents';
import type { DocumentResponse } from '@/api/types';

// ── Helpers ──────────────────────────────────────────────────

const statutConfig: Record<string, { label: string; className: string }> = {
  BROUILLON:              { label: 'Brouillon',         className: 'bg-secondary-100 text-secondary-700' },
  SOUMIS:                 { label: 'Soumis',            className: 'bg-amber-100 text-amber-700' },
  EN_VALIDATION_DOC:      { label: 'En validation',     className: 'bg-blue-100 text-blue-700' },
  DOCS_VALIDES:           { label: 'Docs validés',      className: 'bg-teal-100 text-teal-700' },
  EN_VALIDATION_FIN:      { label: 'Valid. financière', className: 'bg-indigo-100 text-indigo-700' },
  APPROUVE:               { label: 'Approuvé',          className: 'bg-emerald-100 text-emerald-700' },
  REJETE:                 { label: 'Refusé',            className: 'bg-primary-100 text-primary-700' },
  EN_ATTENTE_COMPLEMENT:  { label: 'Complément requis', className: 'bg-orange-100 text-orange-700' },
  EXPIRE:                 { label: 'Expiré',            className: 'bg-background-200 text-foreground-500' },
};

function StatutBadge({ statut }: { statut: string }) {
  const c = statutConfig[statut] || { label: statut, className: 'bg-secondary-100 text-secondary-700' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-label ${c.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {c.label}
    </span>
  );
}

function DocumentStatusBadge({ statut }: { statut: string }) {
  const map: Record<string, { label: string; className: string; icon: string }> = {
    VALIDE:    { label: 'Validé',     className: 'text-emerald-600 bg-emerald-50',   icon: 'ri-check-line' },
    EN_ATTENTE:{ label: 'En attente', className: 'text-amber-600 bg-amber-50',       icon: 'ri-time-line' },
    REJETE:    { label: 'Refusé',     className: 'text-primary-600 bg-primary-50',   icon: 'ri-close-line' },
  };
  const c = map[statut] || { label: 'En attente', className: 'text-foreground-400 bg-background-100', icon: 'ri-subtract-line' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium font-label ${c.className}`}>
      <i className={`${c.icon} w-3 h-3 flex items-center justify-center`}></i>
      {c.label}
    </span>
  );
}

function statutToProgression(statut: string): number {
  const map: Record<string, number> = {
    BROUILLON: 10, SOUMIS: 30, EN_VALIDATION_DOC: 50,
    DOCS_VALIDES: 65, EN_VALIDATION_FIN: 75, APPROUVE: 100,
    REJETE: 30, EN_ATTENTE_COMPLEMENT: 45, EXPIRE: 30,
  };
  return map[statut] ?? 10;
}

function statutToEtape(statut: string): number {
  const map: Record<string, number> = {
    BROUILLON: 1, SOUMIS: 2, EN_VALIDATION_DOC: 3,
    DOCS_VALIDES: 3, EN_VALIDATION_FIN: 4, APPROUVE: 5,
    REJETE: 2, EN_ATTENTE_COMPLEMENT: 3, EXPIRE: 2,
  };
  return map[statut] ?? 1;
}

const etapesInfos = [
  { label: 'Identité',    icon: 'ri-user-line' },
  { label: 'Formation',   icon: 'ri-book-open-line' },
  { label: 'Documents',   icon: 'ri-file-copy-2-line' },
  { label: 'Paiement',    icon: 'ri-bank-card-line' },
  { label: 'Confirmation',icon: 'ri-verified-badge-line' },
];

// ── Component ─────────────────────────────────────────────────

export default function CandidatDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, dossier } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);

  useEffect(() => {
    if (dossier) {
      documentsApi.byInscription(dossier.id)
        .then(setDocuments)
        .catch(() => setDocuments([]));
    }
  }, [dossier]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return <Navigate to="/connexion" replace />;

  if (!dossier) {
    return (
      <CandidatLayout title="Mon espace" subtitle="Bienvenue sur votre espace candidat">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <i className="ri-file-add-line text-primary-600 text-3xl w-10 h-10 flex items-center justify-center"></i>
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground-950 mb-3">
            Aucun dossier d&apos;inscription
          </h2>
          <p className="text-foreground-600 text-sm font-body mb-8">
            Vous n&apos;avez pas encore créé de dossier. Lancez votre inscription en quelques clics.
          </p>
          <button
            onClick={() => navigate('/candidat/inscription')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
            Nouvelle inscription
          </button>
        </div>
      </CandidatLayout>
    );
  }

  const progression   = statutToProgression(dossier.statut);
  const etapeCourante = statutToEtape(dossier.statut);
  const docsValides   = documents.filter(d => d.statut === 'VALIDE').length;
  const docsTotal     = documents.length;
  const docsProgress  = docsTotal > 0 ? Math.round((docsValides / docsTotal) * 100) : 0;

  return (
    <CandidatLayout title="Mon dossier" subtitle={`Bonjour ${user.prenom}, suivez l'avancement de votre candidature`}>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-heading mb-2">Bonjour, {user.prenom} !</h2>
            <p className="text-white/80 text-sm font-body max-w-md">
              Votre dossier est <strong className="text-white">{progression}%</strong> complet.
              {progression < 100 && ' Continuez pour finaliser votre inscription.'}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Link
                to="/candidat/inscription"
                className="px-4 py-2 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors font-label whitespace-nowrap inline-flex items-center gap-2"
              >
                <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                Continuer l&apos;inscription
              </Link>
              <StatutBadge statut={dossier.statut} />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Progression */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">Progression</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 flex-shrink-0">
              <CircularProgressbar
                value={progression}
                text={`${progression}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: 'oklch(var(--primary-500))',
                  textColor: 'oklch(var(--foreground-950))',
                  trailColor: 'oklch(var(--background-200))',
                })}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground-800 font-body mb-1">Étape {etapeCourante} sur 5</p>
              <p className="text-xs text-foreground-500 font-body mb-3">
                {etapeCourante === 1 ? 'Commencez par renseigner vos informations' :
                 etapeCourante === 2 ? 'Choisissez votre formation' :
                 etapeCourante === 3 ? 'Téléversez vos documents' :
                 etapeCourante === 4 ? 'Effectuez le paiement' :
                 'Votre inscription est complète !'}
              </p>
              <div className="w-full h-2 rounded-full bg-background-200 overflow-hidden">
                <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${progression}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">Documents</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 flex-shrink-0">
              <CircularProgressbar
                value={docsProgress}
                text={`${docsValides}/${docsTotal}`}
                styles={buildStyles({
                  textSize: '18px',
                  pathColor: 'oklch(var(--accent-500))',
                  textColor: 'oklch(var(--foreground-950))',
                  trailColor: 'oklch(var(--background-200))',
                })}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground-800 font-body mb-2">
                {docsValides} sur {docsTotal} validé{docsValides > 1 ? 's' : ''}
              </p>
              <div className="flex flex-col gap-1.5">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <span className="text-xs text-foreground-600 font-body truncate max-w-[100px]">{doc.typeDocument}</span>
                    <DocumentStatusBadge statut={doc.statut} />
                  </div>
                ))}
                {documents.length > 3 && (
                  <span className="text-xs text-foreground-400 font-body">+{documents.length - 3} autres</span>
                )}
                {documents.length === 0 && (
                  <span className="text-xs text-foreground-400 font-body">Aucun document soumis</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Infos dossier */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">Formation</h3>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <i className="ri-graduation-cap-line text-primary-600 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground-900 font-body">
                {dossier.formationNom ?? 'Non sélectionnée'}
              </p>
              <p className="text-xs text-foreground-500 mt-0.5 font-body">
                {dossier.anneeAcademique ?? '2026-2027'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 pt-4 border-t border-background-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-500 font-body">Référence</span>
              <span className="text-xs font-medium text-foreground-700 font-body font-mono">{dossier.numeroReference}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-500 font-body">Créé le</span>
              <span className="text-xs font-medium text-foreground-700 font-body">
                {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {dossier.dateSoumission && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-500 font-body">Soumis le</span>
                <span className="text-xs font-medium text-foreground-700 font-body">
                  {new Date(dossier.dateSoumission).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Étapes */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-6">
        <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Étapes de l&apos;inscription</h3>
        <div className="grid grid-cols-5 gap-3">
          {etapesInfos.map((etape, idx) => {
            const isCompleted = idx + 1 < etapeCourante;
            const isCurrent   = idx + 1 === etapeCourante;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border ${
                  isCurrent   ? 'bg-primary-50 border-primary-300' :
                  isCompleted ? 'bg-emerald-50 border-emerald-200' :
                                'bg-background-50 border-background-200 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-500 text-white' :
                  isCurrent   ? 'bg-primary-500 text-white' :
                                'bg-background-200 text-foreground-400'
                }`}>
                  {isCompleted
                    ? <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
                    : <span className="text-sm font-bold font-label">{idx + 1}</span>}
                </div>
                <span className={`text-[11px] font-medium text-center leading-tight font-label ${
                  isCurrent ? 'text-primary-700' : isCompleted ? 'text-emerald-700' : 'text-foreground-400'
                }`}>
                  {etape.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
          {etapeCourante < 5 ? (
            <Link
              to="/candidat/inscription"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all whitespace-nowrap font-label"
            >
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              Continuer l&apos;étape {etapeCourante}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-semibold font-label">
              <i className="ri-check-double-line w-4 h-4 flex items-center justify-center"></i>
              Inscription terminée
            </span>
          )}
        </div>
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Dossier documentaire</h3>
            <Link to="/candidat/inscription" className="text-xs font-medium text-primary-600 hover:text-primary-700 font-label">Gérer</Link>
          </div>
          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-background-50 border border-background-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    doc.statut === 'VALIDE' ? 'bg-emerald-100' : doc.statut === 'REJETE' ? 'bg-primary-100' : 'bg-background-200'
                  }`}>
                    <i className={`ri-file-text-line ${
                      doc.statut === 'VALIDE' ? 'text-emerald-600' : doc.statut === 'REJETE' ? 'text-primary-500' : 'text-foreground-400'
                    } w-4 h-4 flex items-center justify-center`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">{doc.typeDocument}</p>
                    <p className="text-[11px] text-foreground-400 font-body">{doc.nomOriginal}</p>
                  </div>
                </div>
                <DocumentStatusBadge statut={doc.statut} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendrier échéances */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-6">
        <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-6 font-label">
          <i className="ri-calendar-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
          Calendrier des échéances
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { date: '30 Juin',  label: 'Dépôt des documents',  icon: 'ri-file-upload-line',     color: 'bg-primary-100 text-primary-600',  urgent: true,  jours: '20 jours' },
            { date: '15 Juil.', label: 'Confirmation admission',icon: 'ri-check-double-line',    color: 'bg-amber-100 text-amber-600',      urgent: false, jours: '35 jours' },
            { date: '1er Août', label: 'Paiement des frais',   icon: 'ri-bank-card-line',        color: 'bg-primary-100 text-primary-600',  urgent: false, jours: '51 jours' },
            { date: '15 Sept.', label: 'Rentrée académique',   icon: 'ri-graduation-cap-line',   color: 'bg-emerald-100 text-emerald-600',  urgent: false, jours: '97 jours' },
          ].map((ech, idx) => (
            <div key={idx} className={`rounded-2xl border-2 p-5 relative overflow-hidden ${ech.urgent ? 'bg-primary-50/30' : 'bg-background-50'}`}>
              {ech.urgent && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold font-label">
                    <i className="ri-error-warning-line w-3 h-3 flex items-center justify-center"></i>
                    URGENT
                  </span>
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl ${ech.color} flex items-center justify-center mb-3`}>
                <i className={`${ech.icon} w-5 h-5 flex items-center justify-center`}></i>
              </div>
              <p className="text-lg font-bold font-heading text-foreground-950">{ech.date}</p>
              <p className="text-sm font-semibold text-foreground-800 font-body mt-0.5">{ech.label}</p>
              <p className="mt-3 text-xs text-foreground-400 font-body">Dans {ech.jours}</p>
            </div>
          ))}
        </div>
      </div>
    </CandidatLayout>
  );
}
