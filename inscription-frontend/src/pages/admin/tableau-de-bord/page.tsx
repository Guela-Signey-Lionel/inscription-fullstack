import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useMemo } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

const inscriptionData = [
  { jour: 'Lun', inscriptions: 8, validés: 5 },
  { jour: 'Mar', inscriptions: 12, validés: 9 },
  { jour: 'Mer', inscriptions: 15, validés: 11 },
  { jour: 'Jeu', inscriptions: 10, validés: 7 },
  { jour: 'Ven', inscriptions: 18, validés: 14 },
  { jour: 'Sam', inscriptions: 6, validés: 4 },
  { jour: 'Dim', inscriptions: 3, validés: 2 },
];

const mensuelData = [
  { mois: 'Jan', inscriptions: 45, validés: 32, recettes: 1250000 },
  { mois: 'Fév', inscriptions: 62, validés: 48, recettes: 1850000 },
  { mois: 'Mar', inscriptions: 78, validés: 55, recettes: 2200000 },
  { mois: 'Avr', inscriptions: 95, validés: 70, recettes: 2850000 },
  { mois: 'Mai', inscriptions: 120, validés: 88, recettes: 3400000 },
  { mois: 'Juin', inscriptions: 134, validés: 103, recettes: 4100000 },
];

const statusData = [
  { name: 'Validés', value: 103, color: 'oklch(var(--primary-500))' },
  { name: 'En attente', value: 84, color: '#d97706' },
  { name: 'En cours', value: 45, color: '#3b82f6' },
  { name: 'Refusés', value: 12, color: 'oklch(var(--primary-500))' },
  { name: 'Payés', value: 92, color: '#0891b2' },
];

const formationData = [
  { formation: 'Licence Info', candidats: 340, taux: 92, couleur: 'oklch(var(--primary-500))' },
  { formation: 'Master Biotech', candidats: 210, taux: 88, couleur: 'oklch(var(--primary-400))' },
  { formation: 'Licence Éco', candidats: 185, taux: 85, couleur: 'oklch(var(--accent-500))' },
  { formation: 'BTS Compta', candidats: 156, taux: 90, couleur: 'oklch(var(--accent-400))' },
  { formation: 'Licence Droit', candidats: 142, taux: 78, couleur: 'oklch(var(--secondary-400))' },
  { formation: 'Master Génie', candidats: 98, taux: 95, couleur: 'oklch(var(--secondary-500))' },
];

const genreData = [
  { name: 'Hommes', value: 412, color: 'oklch(var(--primary-500))' },
  { name: 'Femmes', value: 358, color: 'oklch(var(--accent-500))' },
];

const paiementModeData = [
  { name: 'Mobile Money', value: 385, color: 'oklch(var(--primary-500))' },
  { name: 'Carte bancaire', value: 220, color: 'oklch(var(--accent-500))' },
  { name: 'Virement', value: 95, color: 'oklch(var(--secondary-400))' },
  { name: 'Espèces', value: 70, color: '#d97706' },
];

const funnelData = [
  { etape: 'Inscrits', valeur: 770, color: 'oklch(var(--primary-500))', largeur: '100%' },
  { etape: 'Formation choisie', valeur: 680, color: 'oklch(var(--primary-400))', largeur: '88%' },
  { etape: 'Documents soumis', valeur: 520, color: 'oklch(var(--accent-500))', largeur: '68%' },
  { etape: 'Paiement effectué', valeur: 350, color: 'oklch(var(--accent-400))', largeur: '45%' },
  { etape: 'Validés scolarité', valeur: 280, color: 'oklch(var(--secondary-400))', largeur: '36%' },
  { etape: 'Inscrits définitifs', valeur: 245, color: 'oklch(var(--secondary-500))', largeur: '32%' },
];

const statutConfig: Record<string, { label: string; className: string }> = {
  BROUILLON: { label: 'Brouillon', className: 'bg-secondary-100 text-secondary-700' },
  SOUMIS: { label: 'Soumis', className: 'bg-amber-100 text-amber-700' },
  EN_VALIDATION_DOC: { label: 'Validation', className: 'bg-blue-100 text-blue-700' },
  DOCS_VALIDES: { label: 'Docs OK', className: 'bg-teal-100 text-teal-700' },
  EN_VALIDATION_FIN: { label: 'Valid. Fin.', className: 'bg-indigo-100 text-indigo-700' },
  APPROUVE: { label: 'Approuvé', className: 'bg-emerald-100 text-emerald-700' },
  REJETE: { label: 'Refusé', className: 'bg-primary-100 text-primary-700' },
  EN_ATTENTE_COMPLEMENT: { label: 'Complément', className: 'bg-orange-100 text-orange-700' },
  EXPIRE: { label: 'Expiré', className: 'bg-background-200 text-foreground-500' },
};

function StatutBadge({ statut }: { statut: string }) {
  const c = statutConfig[statut] || { label: statut, className: 'bg-secondary-100 text-secondary-700' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold font-label whitespace-nowrap ${c.className}`}>
      {c.label}
    </span>
  );
}

type Periode = 'semaine' | 'mois' | 'annee';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [periode, setPeriode] = useState<Periode>('semaine');
  const [statutFilter, setStatutFilter] = useState('tous');
  const [stats, setStats] = useState<import('@/api/types').StatsResponse | null>(null);
  const [dossiersRecents, setDossiersRecents] = useState<import('@/api/types').InscriptionResponse[]>([]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      import('@/api/admin').then(({ adminApi }) => {
        adminApi.getStats().then(setStats).catch(() => {});
      });
      import('@/api/inscriptions').then(({ inscriptionsApi }) => {
        inscriptionsApi.lister({ size: 6 }).then(r => setDossiersRecents(r.content)).catch(() => {});
      });
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  const filteredDossiers = useMemo(() => {
    let dossiers = dossiersRecents.filter((d) =>
      (d.candidatNom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.formationNom || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statutFilter !== 'tous') {
      dossiers = dossiers.filter((d) => d.statut === statutFilter);
    }
    return dossiers;
  }, [searchTerm, statutFilter, dossiersRecents]);

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

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/candidat/tableau-de-bord" replace />;
  }

  const kpis = [
    {
      label: 'Dossiers totaux',
      value: stats ? stats.total.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-file-list-3-line',
      color: 'bg-primary-100 text-primary-600', trend: 'up' as const,
    },
    {
      label: 'En attente',
      value: stats ? stats.soumis.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-time-line',
      color: 'bg-amber-100 text-amber-600', trend: 'down' as const,
    },
    {
      label: 'En validation',
      value: stats ? stats.enValidation.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-loader-4-line',
      color: 'bg-blue-100 text-blue-600', trend: 'up' as const,
    },
    {
      label: 'Approuvés',
      value: stats ? stats.approuves.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-check-double-line',
      color: 'bg-emerald-100 text-emerald-600', trend: 'up' as const,
    },
    {
      label: 'Refusés',
      value: stats ? stats.rejetes.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-close-circle-line',
      color: 'bg-primary-100 text-primary-600', trend: 'down' as const,
    },
    {
      label: 'Brouillons',
      value: stats ? stats.brouillons.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-draft-line',
      color: 'bg-secondary-100 text-secondary-600', trend: 'up' as const,
    },
    {
      label: 'Expirés',
      value: stats ? stats.expires.toLocaleString('fr-FR') : '—',
      change: '', icon: 'ri-timer-flash-line',
      color: 'bg-orange-100 text-orange-600', trend: 'down' as const,
    },
    {
      label: 'Taux approbation',
      value: stats && stats.total > 0
        ? `${Math.round((stats.approuves / stats.total) * 100)}%`
        : '—',
      change: '', icon: 'ri-percent-line',
      color: 'bg-teal-100 text-teal-600', trend: 'up' as const,
    },
  ];

  const statusData = stats ? [
    { name: 'Approuvés',  value: stats.approuves,   color: '#10b981' },
    { name: 'En attente', value: stats.soumis,       color: '#d97706' },
    { name: 'Validation', value: stats.enValidation, color: '#3b82f6' },
    { name: 'Refusés',    value: stats.rejetes,      color: 'oklch(var(--primary-500))' },
    { name: 'Brouillons', value: stats.brouillons,   color: '#a1a1aa' },
  ] : [];

  const totalGenre = genreData.reduce((acc, g) => acc + g.value, 0);

  return (
    <DashboardLayout navItems={adminNavItems} title="Tableau de bord" subtitle="Vue d'ensemble des inscriptions">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-2">Bonjour, {user.prenom} !</h2>
            <p className="text-white/80 text-sm font-body max-w-md">
              Vous avez <strong className="text-white">84 dossiers</strong> en attente et <strong className="text-white">12 nouveaux</strong> aujourd'hui.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Link
                to="/admin/dossiers"
                className="px-4 py-2 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors font-label whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
              >
                <i className="ri-folder-line w-4 h-4 flex items-center justify-center"></i>
                Voir les dossiers
              </Link>
              <Link
                to="/admin/statistiques"
                className="px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors font-label whitespace-nowrap cursor-pointer inline-flex items-center gap-2"
              >
                <i className="ri-bar-chart-fill w-4 h-4 flex items-center justify-center"></i>
                Statistiques détaillées
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://readdy.ai/api/search-image?query=Minimalist%20flat%20illustration%20of%20a%20university%20administrator%20reviewing%20documents%20at%20a%20modern%20desk%2C%20with%20charts%20and%20a%20graduation%20cap%2C%20soft%20sage%20green%20and%20cream%20tones%2C%20clean%20academic%20aesthetic&width=300&height=200&seq=admin-hero-v2&orientation=landscape"
              alt="Admin illustration"
              className="w-48 h-32 object-contain rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid - 8 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-background-200/70 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                <i className={`${s.icon} w-5 h-5 flex items-center justify-center`}></i>
              </div>
              <span className={`text-xs font-semibold font-label px-2 py-0.5 rounded-full ${
                s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-500'
              }`}>
                {s.change}
              </span>
            </div>
            <p className="text-xl font-bold font-heading text-foreground-950">{s.value}</p>
            <p className="text-[11px] text-foreground-500 mt-0.5 font-body">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Periode Selector + Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly/Monthly Trends */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Tendances inscriptions</h3>
            <div className="inline-flex items-center rounded-full bg-background-100 p-0.5">
              {(['semaine', 'mois', 'annee'] as Periode[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer font-label ${
                    periode === p ? 'bg-white text-foreground-900 shadow-sm' : 'text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  {p === 'semaine' ? 'Semaine' : p === 'mois' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {periode === 'semaine' ? (
              <BarChart data={inscriptionData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="jour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} cursor={{ fill: '#f3f4f6' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="inscriptions" name="Inscriptions" fill="oklch(var(--primary-500))" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="validés" name="Validés" fill="oklch(var(--accent-400))" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            ) : (
              <LineChart data={mensuelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="inscriptions" name="Inscriptions" stroke="oklch(var(--primary-500))" strokeWidth={2.5} dot={{ r: 4, fill: 'oklch(var(--primary-500))' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="validés" name="Validés" stroke="oklch(var(--accent-500))" strokeWidth={2.5} dot={{ r: 4, fill: 'oklch(var(--accent-500))' }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Gender + Payment Distribution */}
        <div className="grid grid-cols-1 gap-6">
          {/* Gender Distribution */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Répartition par genre</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <ResponsiveContainer width={112} height={112}>
                  <PieChart>
                    <Pie data={genreData} cx="50%" cy="50%" innerRadius={36} outerRadius={52} paddingAngle={4} dataKey="value" stroke="none">
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold font-heading text-foreground-700">{totalGenre}</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {genreData.map((g, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }}></span>
                      <span className="text-sm text-foreground-700 font-body">{g.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-foreground-950 font-label">{g.value}</span>
                      <span className="text-xs text-foreground-400 ml-2 font-body">{Math.round((g.value / totalGenre) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">Modes de paiement</h3>
            <div className="space-y-3">
              {paiementModeData.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }}></span>
                      <span className="text-xs text-foreground-600 font-body">{p.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-foreground-800 font-label">{p.value}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-background-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((p.value / paiementModeData.reduce((a, b) => a + b.value, 0)) * 100)}%`,
                        backgroundColor: p.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Funnel + Formations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Pipeline d'inscription</h3>
          <div className="space-y-4">
            {funnelData.map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground-600 font-body">{f.etape}</span>
                  <span className="text-xs font-semibold text-foreground-800 font-label">{f.valeur}</span>
                </div>
                <div className="w-full h-6 rounded-lg bg-background-100 overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center px-3 transition-all"
                    style={{
                      width: f.largeur,
                      backgroundColor: f.color,
                    }}
                  >
                    <span className="text-[10px] font-semibold text-white font-label">
                      {Math.round((f.valeur / funnelData[0].valeur) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-background-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-500 font-body">Taux de conversion global</span>
              <span className="text-sm font-bold text-primary-600 font-heading">
                {Math.round((funnelData[5].valeur / funnelData[0].valeur) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Top Formations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Inscriptions par formation</h3>
          <div className="space-y-4">
            {formationData.map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 flex-shrink-0">
                  <span className="text-xs font-medium text-foreground-700 font-body block truncate">{f.formation}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full h-7 rounded-lg bg-background-100 overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center justify-end px-3 transition-all"
                      style={{
                        width: `${(f.candidats / 340) * 100}%`,
                        backgroundColor: f.couleur,
                      }}
                    >
                      <span className="text-[10px] font-bold text-white font-label">{f.candidats}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right flex-shrink-0">
                  <span className={`text-xs font-semibold font-label ${f.taux >= 90 ? 'text-emerald-600' : f.taux >= 80 ? 'text-primary-600' : 'text-amber-600'}`}>
                    {f.taux}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-background-200 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(var(--primary-500))' }}></span>
              <span className="text-xs text-foreground-500 font-body">Candidats</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground-500 font-body">Taux validation :</span>
              <span className="text-xs font-semibold text-accent-600 font-label">Moy. 88%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">Activité récente</h3>
          <div className="flex flex-col gap-4">
            {[
              { action: 'Dossier validé scolarité', target: 'Marie Kamga — Master Biotech', time: 'Il y a 2 min', icon: 'ri-check-line', color: 'bg-emerald-100 text-emerald-600' },
              { action: 'Nouveau paiement Stripe', target: 'Alice Njoya — 50 000 FCFA', time: 'Il y a 15 min', icon: 'ri-bank-card-line', color: 'bg-cyan-100 text-cyan-600' },
              { action: 'Document refusé', target: 'Pierre Tchinda — Relevé de notes', time: 'Il y a 45 min', icon: 'ri-close-line', color: 'bg-primary-100 text-primary-600' },
              { action: 'Nouveau dossier soumis', target: 'Sarah Mballa — Master Génie', time: 'Il y a 1h', icon: 'ri-file-add-line', color: 'bg-primary-100 text-primary-600' },
              { action: 'Paiement échoué', target: 'François Essomba — Carte refusée', time: 'Il y a 2h', icon: 'ri-error-warning-line', color: 'bg-orange-100 text-orange-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-background-100 last:border-0 last:pb-0">
                <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <i className={`${item.icon} w-4 h-4 flex items-center justify-center`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground-800 font-body">
                    <strong>{item.action}</strong>
                    <span className="text-foreground-500"> — {item.target}</span>
                  </p>
                  <p className="text-xs text-foreground-400 mt-0.5 font-body">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">Statuts des dossiers</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 space-y-2">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }}></span>
                    <span className="text-xs text-foreground-600 font-body">{s.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground-800 font-label">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Dossiers Table */}
      <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden">
        <div className="p-5 border-b border-background-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Dossiers récents</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 rounded-xl bg-background-100 border border-background-200 text-sm text-foreground-800 placeholder:text-foreground-400 font-body w-52 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              />
            </div>
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background-100 border border-background-200 text-xs text-foreground-700 font-body focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours_validation">En validation</option>
              <option value="payee">Payés</option>
              <option value="refusee">Refusés</option>
            </select>
            <Link
              to="/admin/dossiers"
              className="text-xs font-medium text-primary-600 hover:text-primary-700 font-label whitespace-nowrap"
            >
              Voir tout
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background-100">
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Candidat</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Formation</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Statut</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Date</th>
                <th className="text-right text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDossiers.map((d) => (
                <tr key={d.id} className="border-b border-background-100 hover:bg-background-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs font-label">
                        {(d.candidatNom || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-foreground-800 font-body">{d.candidatNom || '—'}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-foreground-600 font-body">{d.formationNom || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatutBadge statut={d.statut} />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-foreground-500 font-body">
                      {d.dateCreation ? new Date(d.dateCreation).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/admin/dossier/${d.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 font-label cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-eye-line w-3.5 h-3.5 flex items-center justify-center"></i>
                      Examiner
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDossiers.length === 0 && (
          <div className="text-center py-10">
            <i className="ri-search-line text-3xl text-foreground-300 w-10 h-10 flex items-center justify-center mx-auto mb-2"></i>
            <p className="text-sm text-foreground-400 font-body">Aucun dossier trouvé</p>
          </div>
        )}
      </div>

      {/* Calendrier des échéances */}
      <div className="mt-6 bg-white rounded-2xl border border-background-200/70 p-6">
        <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-6 font-label">
          <i className="ri-calendar-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
          Calendrier des échéances
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { date: '30 Juin', label: 'Clôture dépôt dossiers', icon: 'ri-file-warning-line', color: 'bg-primary-100 text-primary-600 border-primary-200', desc: 'Date limite de soumission des dossiers complets', jours: '20 jours', urgent: true },
            { date: '15 Juillet', label: 'Validation finale', icon: 'ri-check-double-line', color: 'bg-amber-100 text-amber-600 border-amber-200', desc: 'Dernier délai de validation par la scolarité', jours: '35 jours', urgent: false },
            { date: '1er Août', label: 'Paiement des frais', icon: 'ri-bank-card-line', color: 'bg-primary-100 text-primary-600 border-primary-200', desc: 'Date limite de paiement des frais d\'inscription', jours: '51 jours', urgent: false },
            { date: '15 Sept.', label: 'Rentrée universitaire', icon: 'ri-graduation-cap-line', color: 'bg-emerald-100 text-emerald-600 border-emerald-200', desc: 'Début des cours — année académique 2026-2027', jours: '97 jours', urgent: false },
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
              <div className={`w-12 h-12 rounded-xl ${ech.color} bg-opacity-100 flex items-center justify-center mb-3`}>
                <i className={`${ech.icon} w-6 h-6 flex items-center justify-center`}></i>
              </div>
              <p className="text-lg font-bold font-heading text-foreground-950">{ech.date}</p>
              <p className="text-sm font-semibold text-foreground-800 font-body mt-0.5">{ech.label}</p>
              <p className="text-xs text-foreground-500 font-body mt-1.5">{ech.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-foreground-400 font-body">Dans {ech.jours}</span>
                <div className={`w-full max-w-[60px] h-1.5 rounded-full ${ech.urgent ? 'bg-primary-200' : 'bg-background-200'} overflow-hidden ml-4`}>
                  <div className={`h-full rounded-full ${ech.urgent ? 'bg-primary-500' : ech.date.includes('Sept') ? 'bg-emerald-500' : ech.date.includes('Août') ? 'bg-primary-500' : 'bg-amber-500'}`} style={{ width: ech.urgent ? '85%' : ech.date.includes('Sept') ? '15%' : ech.date.includes('Août') ? '30%' : '60%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
