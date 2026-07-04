import { useState, useEffect } from 'react';
import { adminApi } from '@/api/admin';
import type { StatsResponse } from '@/api/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area,
} from 'recharts';

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

const monthlyData = [
  { mois: 'Jan', inscriptions: 45, validés: 32, rejetés: 5 },
  { mois: 'Fév', inscriptions: 62, validés: 48, rejetés: 8 },
  { mois: 'Mar', inscriptions: 78, validés: 55, rejetés: 12 },
  { mois: 'Avr', inscriptions: 95, validés: 70, rejetés: 15 },
  { mois: 'Mai', inscriptions: 120, validés: 88, rejetés: 18 },
  { mois: 'Juin', inscriptions: 134, validés: 103, rejetés: 22 },
];

const monthlyDataN1 = [
  { mois: 'Jan', inscriptions: 32, validés: 24, rejetés: 4 },
  { mois: 'Fév', inscriptions: 48, validés: 35, rejetés: 7 },
  { mois: 'Mar', inscriptions: 55, validés: 40, rejetés: 9 },
  { mois: 'Avr', inscriptions: 72, validés: 54, rejetés: 11 },
  { mois: 'Mai', inscriptions: 95, validés: 70, rejetés: 15 },
  { mois: 'Juin', inscriptions: 110, validés: 85, rejetés: 19 },
];

const comparisonData = monthlyData.map((m, i) => ({
  mois: m.mois,
  '2026': m.inscriptions,
  '2025': monthlyDataN1[i].inscriptions,
}));

const recettesN = [
  { mois: 'Jan', recettes: 1250000 },
  { mois: 'Fév', recettes: 1850000 },
  { mois: 'Mar', recettes: 2200000 },
  { mois: 'Avr', recettes: 2850000 },
  { mois: 'Mai', recettes: 3400000 },
  { mois: 'Juin', recettes: 4100000 },
];

const recettesN1 = [
  { mois: 'Jan', recettes: 960000 },
  { mois: 'Fév', recettes: 1440000 },
  { mois: 'Mar', recettes: 1650000 },
  { mois: 'Avr', recettes: 2160000 },
  { mois: 'Mai', recettes: 2850000 },
  { mois: 'Juin', recettes: 3300000 },
];

const recettesComparison = recettesN.map((r, i) => ({
  mois: r.mois,
  '2026': r.recettes,
  '2025': recettesN1[i].recettes,
}));

const formationData = [
  { formation: 'Licence Info', inscriptions: 340, taux: 92 },
  { formation: 'Master Biotech', inscriptions: 210, taux: 88 },
  { formation: 'Licence Éco', inscriptions: 185, taux: 85 },
  { formation: 'BTS Compta', inscriptions: 156, taux: 90 },
  { formation: 'Licence Droit', inscriptions: 142, taux: 78 },
  { formation: 'Master Génie', inscriptions: 98, taux: 95 },
];

export default function AdminStatistiques() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [periode, setPeriode] = useState<'semaine' | 'mois' | 'annee'>('mois');
  const [apiStats, setApiStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    adminApi.getStats().then(setApiStats).catch(() => {});
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

  const totalN = monthlyData.reduce((sum, m) => sum + m.inscriptions, 0);
  const totalN1 = monthlyDataN1.reduce((sum, m) => sum + m.inscriptions, 0);
  const croissance = ((totalN - totalN1) / totalN1 * 100).toFixed(1);

  const recettesTotalN = recettesN.reduce((sum, r) => sum + r.recettes, 0);
  const recettesTotalN1 = recettesN1.reduce((sum, r) => sum + r.recettes, 0);
  const croissanceRecettes = ((recettesTotalN - recettesTotalN1) / recettesTotalN1 * 100).toFixed(1);

  return (
    <DashboardLayout navItems={adminNavItems} title="Statistiques" subtitle="Analyse détaillée et comparatifs inter-années">
      {/* Comparison KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
              <i className="ri-user-add-line text-primary-600 w-4 h-4 flex items-center justify-center"></i>
            </div>
            <span className="text-xs text-foreground-400 font-label uppercase tracking-wider">2026</span>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground-950">
            {apiStats ? apiStats.total.toLocaleString('fr-FR') : totalN}
          </p>
          <p className="text-xs text-foreground-500 mt-1 font-body">Inscriptions totales</p>
        </div>
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-background-200 flex items-center justify-center">
              <i className="ri-user-add-line text-foreground-500 w-4 h-4 flex items-center justify-center"></i>
            </div>
            <span className="text-xs text-foreground-400 font-label uppercase tracking-wider">2025</span>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground-950">{totalN1}</p>
          <p className="text-xs text-foreground-500 mt-1 font-body">Inscriptions totales</p>
        </div>
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 rounded-lg ${Number(croissance) >= 0 ? 'bg-emerald-100' : 'bg-primary-100'} flex items-center justify-center`}>
              <i className={`${Number(croissance) >= 0 ? 'ri-arrow-up-line text-emerald-600' : 'ri-arrow-down-line text-primary-600'} w-4 h-4 flex items-center justify-center`}></i>
            </div>
            <span className="text-xs text-foreground-400 font-label uppercase tracking-wider">vs N-1</span>
          </div>
          <p className={`text-2xl font-bold font-heading ${Number(croissance) >= 0 ? 'text-emerald-600' : 'text-primary-600'}`}>+{croissance}%</p>
          <p className="text-xs text-foreground-500 mt-1 font-body">Croissance inscriptions</p>
        </div>
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 rounded-lg ${Number(croissanceRecettes) >= 0 ? 'bg-emerald-100' : 'bg-primary-100'} flex items-center justify-center`}>
              <i className={`${Number(croissanceRecettes) >= 0 ? 'ri-arrow-up-line text-emerald-600' : 'ri-arrow-down-line text-primary-600'} w-4 h-4 flex items-center justify-center`}></i>
            </div>
            <span className="text-xs text-foreground-400 font-label uppercase tracking-wider">vs N-1</span>
          </div>
          <p className={`text-2xl font-bold font-heading ${Number(croissanceRecettes) >= 0 ? 'text-emerald-600' : 'text-primary-600'}`}>
            {apiStats ? `${Math.round((apiStats.approuves / Math.max(apiStats.total, 1)) * 100)}%` : `+${croissanceRecettes}%`}
          </p>
          <p className="text-xs text-foreground-500 mt-1 font-body">
            {apiStats ? 'Taux d\'approbation' : 'Croissance recettes'}
          </p>
        </div>
      </div>

      {/* N vs N-1 Inscriptions Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Inscriptions : 2026 vs 2025</h3>
            <div className="flex items-center gap-1.5 bg-background-100 rounded-lg p-1">
              {(['semaine', 'mois', 'annee'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer font-label ${
                    periode === p ? 'bg-white text-foreground-800 shadow-sm' : 'text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  {p === 'semaine' ? 'Sem.' : p === 'mois' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="2026" stroke="oklch(var(--primary-500))" strokeWidth={2.5} dot={{ r: 4, fill: 'oklch(var(--primary-500))' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="2025" stroke="oklch(var(--accent-400))" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: 'oklch(var(--accent-400))' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* N vs N-1 Recettes Comparison */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-6 font-label">Recettes : 2026 vs 2025 (FCFA)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recettesComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(value: number) => value.toLocaleString('fr-FR') + ' FCFA'} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="2026" fill="oklch(var(--primary-500))" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="2025" fill="oklch(var(--accent-300))" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Breakdown */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-6 font-label">Évolution des inscriptions (2026)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="inscriptions" fill="oklch(var(--primary-500))" radius={[6, 6, 0, 0]} maxBarSize={35} />
              <Bar dataKey="validés" fill="oklch(var(--accent-400))" radius={[6, 6, 0, 0]} maxBarSize={35} />
              <Bar dataKey="rejetés" fill="oklch(var(--primary-500))" radius={[6, 6, 0, 0]} maxBarSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recettes Trend */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-6 font-label">Recettes mensuelles 2026 (FCFA)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={recettesN}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(value: number) => value.toLocaleString('fr-FR') + ' FCFA'} />
              <Area type="monotone" dataKey="recettes" stroke="oklch(var(--primary-500))" fill="oklch(var(--primary-100))" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Growth Table */}
      <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden mb-6">
        <div className="p-5 border-b border-background-100">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Comparatif mensuel 2026 vs 2025</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background-100">
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Mois</th>
                <th className="text-right text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Inscriptions 2026</th>
                <th className="text-right text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Inscriptions 2025</th>
                <th className="text-right text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Variation</th>
                <th className="text-right text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Tendance</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => {
                const variation = row['2026'] - row['2025'];
                const pct = ((variation / row['2025']) * 100).toFixed(1);
                return (
                  <tr key={i} className="border-b border-background-100 hover:bg-background-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground-800 font-body">{row.mois}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm font-semibold text-foreground-800 font-body">{row['2026']}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <p className="text-sm text-foreground-600 font-body">{row['2025']}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-sm font-semibold font-body ${variation >= 0 ? 'text-emerald-600' : 'text-primary-600'}`}>
                        {variation >= 0 ? '+' : ''}{variation} ({pct}%)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold font-label ${
                        variation >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-100 text-primary-700'
                      }`}>
                        <i className={`${variation >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} w-3 h-3 flex items-center justify-center`}></i>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formation Performance Table */}
      <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden">
        <div className="p-5 border-b border-background-100">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Performance par formation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-background-100">
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Formation</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Inscriptions</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Taux de validation</th>
                <th className="text-left text-[11px] font-semibold text-foreground-400 uppercase tracking-wider px-5 py-3 font-label">Progression</th>
              </tr>
            </thead>
            <tbody>
              {formationData.map((f, i) => (
                <tr key={i} className="border-b border-background-100 hover:bg-background-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-foreground-800 font-body">{f.formation}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-foreground-700 font-body">{f.inscriptions}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold font-label ${f.taux >= 90 ? 'text-emerald-600' : f.taux >= 80 ? 'text-primary-600' : 'text-amber-600'}`}>
                      {f.taux}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="w-full max-w-[200px]">
                      <div className="w-full h-2 rounded-full bg-background-200 overflow-hidden">
                        <div className="h-full rounded-full bg-primary-500" style={{ width: `${f.taux}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}