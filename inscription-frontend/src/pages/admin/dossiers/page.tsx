import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNotifications } from '@/contexts/NotificationContext';
import { inscriptionsApi } from '@/api/inscriptions';
import type { InscriptionResponse } from '@/api/types';

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

const statutConfig: Record<string, { label: string; className: string }> = {
  en_cours_validation: { label: 'Validation', className: 'bg-blue-100 text-blue-700' },
  payee: { label: 'Payée', className: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'Attente', className: 'bg-amber-100 text-amber-700' },
  validee_scolarite: { label: 'Validée Scol.', className: 'bg-primary-100 text-primary-700' },
  validee_finance: { label: 'Validée Fin.', className: 'bg-teal-100 text-teal-700' },
  refusee: { label: 'Refusée', className: 'bg-primary-100 text-primary-700' },
  en_attente_paiement: { label: 'Paiement', className: 'bg-orange-100 text-orange-700' },
};

function StatutBadge({ statut }: { statut: string }) {
  const c = statutConfig[statut] || { label: statut, className: 'bg-secondary-100 text-secondary-700' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold font-label ${c.className}`}>
      {c.label}
    </span>
  );
}

export default function AdminDossiers() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addNotification, addToast } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('tous');
  const [allDossiers, setAllDossiers] = useState<InscriptionResponse[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    inscriptionsApi.lister({ size: 100 })
      .then((res) => setAllDossiers(res.content))
      .catch(() => setAllDossiers([]))
      .finally(() => setApiLoading(false));
  }, []);

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

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/connexion" replace />;
  }

  const filtered = allDossiers.filter((d) => {
    const nom = d.candidatNom || '';
    const formation = d.formationNom || '';
    const matchSearch =
      nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.numeroReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === 'tous' || d.statut.toLowerCase() === filterStatut;
    return matchSearch && matchStatut;
  });

  return (
    <DashboardLayout navItems={adminNavItems} title="Dossiers candidats" subtitle="Gestion et validation des dossiers d'inscription">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email ou formation..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 placeholder:text-foreground-400 font-body focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { value: 'tous', label: 'Tous' },
              { value: 'en_attente', label: 'En attente' },
              { value: 'en_cours_validation', label: 'Validation' },
              { value: 'payee', label: 'Payés' },
              { value: 'refusee', label: 'Refusés' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterStatut(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer font-label whitespace-nowrap ${
                  filterStatut === f.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-background-100 text-foreground-600 hover:bg-background-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background-100">
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Candidat</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Formation</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Statut</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Paiement</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Date</th>
                <th className="text-right text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiLoading ? (
                <tr><td colSpan={6} className="text-center py-10 text-sm text-foreground-400 font-body">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>Chargement des dossiers...
                </td></tr>
              ) : filtered.map((d) => (
                <tr key={d.id} className="border-b border-background-100 hover:bg-background-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs font-label">
                        {(d.candidatNom || '?').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-800 font-body">{d.candidatNom || '—'}</p>
                        <p className="text-xs text-foreground-400 font-body">{d.numeroReference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-foreground-600 font-body">{d.formationNom || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatutBadge statut={d.statut} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium font-label text-foreground-400">—</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-foreground-500 font-body">
                      {d.dateCreation ? new Date(d.dateCreation).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/dossier/${d.id}`}
                        className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-colors cursor-pointer"
                        title="Examiner"
                      >
                        <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                      </Link>
                      <button
                        onClick={() => {
                          inscriptionsApi.transition(d.id, { action: 'VALIDER_DOCS' })
                            .then(() => {
                              addToast(`Dossier validé : ${d.candidatNom}`, 'success');
                              setAllDossiers(prev => prev.map(x => x.id === d.id ? { ...x, statut: 'DOCS_VALIDES' as const } : x));
                            })
                            .catch(() => addToast('Erreur lors de la validation', 'error'));
                        }}
                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer" title="Valider docs">
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      <button
                        onClick={() => {
                          const motif = window.prompt('Motif de rejet :') || 'Non conforme';
                          inscriptionsApi.transition(d.id, { action: 'REJETER', motif })
                            .then(() => {
                              addToast(`Dossier refusé : ${d.candidatNom}`, 'error');
                              setAllDossiers(prev => prev.map(x => x.id === d.id ? { ...x, statut: 'REJETE' as const } : x));
                            })
                            .catch(() => addToast('Erreur lors du refus', 'error'));
                        }}
                        className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-colors cursor-pointer" title="Rejeter">
                        <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-folder-open-line text-4xl text-foreground-300 w-10 h-10 flex items-center justify-center mx-auto mb-3"></i>
            <p className="text-sm text-foreground-400 font-body">Aucun dossier trouvé</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}