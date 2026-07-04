import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRef } from 'react';

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

type TabId = 'general' | 'notifications' | 'securite' | 'paiement' | 'sauvegarde';

const tabs: { id: TabId; label: string; icon: string; desc: string }[] = [
  { id: 'general', label: 'Général', icon: 'ri-building-line', desc: 'Informations de l\'établissement' },
  { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line', desc: 'Paramètres de communication' },
  { id: 'securite', label: 'Sécurité', icon: 'ri-shield-check-line', desc: 'Protection et accès' },
  { id: 'paiement', label: 'Paiement', icon: 'ri-bank-card-line', desc: 'Configuration financière' },
  { id: 'sauvegarde', label: 'Sauvegarde', icon: 'ri-database-2-line', desc: 'Export et restauration' },
];

export default function AdminParametres() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [saved, setSaved] = useState(false);
  const [backupFileName, setBackupFileName] = useState('parametres-pkfokam-2026-06-10');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<string | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const fileRestoreRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    nomEtablissement: 'PKFokam Institute of Excellence',
    emailContact: 'contact@pkfokam.cm',
    telephone: '+237 687 789 930',
    adresse: 'Yaoundé, Cameroun',
    fraisInscription: '50000',
    delaiValidation: '72',
    devise: 'XAF',
    notificationsEmail: true,
    notificationsSMS: false,
    notifNouveauDossier: true,
    notifPaiement: true,
    notifValidation: false,
    modeMaintenance: false,
    doubleAuth: true,
    dureeSession: '480',
    tentativesMax: '5',
    ipsAutorisees: '',
    modePaiementCarte: true,
    modePaiementMobile: true,
    modePaiementVirement: false,
    stripeModeTest: true,
    stripeClePublique: 'pk_test_••••••••••••••••••••',
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backupFileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRestoreSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreFile(file);
    setRestoreError(null);
    setRestoreSuccess(false);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        setRestorePreview(JSON.stringify(parsed, null, 2));
      } catch {
        setRestoreError('Fichier JSON invalide. Vérifiez le format.');
        setRestorePreview(null);
      }
    };
    reader.onerror = () => {
      setRestoreError('Erreur de lecture du fichier.');
    };
    reader.readAsText(file);
  };

  const handleRestoreExecute = () => {
    if (!restorePreview) return;
    setRestoreLoading(true);
    setRestoreError(null);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(restorePreview);
        setSettings((prev) => ({ ...prev, ...parsed }));
        setRestoreLoading(false);
        setRestoreSuccess(true);
        setRestoreFile(null);
        setRestorePreview(null);
        setTimeout(() => setRestoreSuccess(false), 4000);
      } catch {
        setRestoreLoading(false);
        setRestoreError('Impossible de restaurer les paramètres.');
      }
    }, 1200);
  };

  return (
    <DashboardLayout navItems={adminNavItems} title="Paramètres" subtitle={tabs.find(t => t.id === activeTab)?.desc}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-background-200/70 p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-foreground-600 hover:bg-background-50 hover:text-foreground-800'
                }`}
              >
                <i className={`${tab.icon} w-5 h-5 flex items-center justify-center ${
                  activeTab === tab.id ? 'text-primary-500' : 'text-foreground-400'
                }`}></i>
                <div>
                  <p className="font-body">{tab.label}</p>
                  <p className="text-xs text-foreground-400 font-body mt-0.5 hidden lg:block">{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab: Général */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl border border-background-200/70 p-6">
              <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Nom de l&apos;établissement</label>
                  <input
                    value={settings.nomEtablissement}
                    onChange={(e) => updateSetting('nomEtablissement', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Email de contact</label>
                  <input
                    value={settings.emailContact}
                    onChange={(e) => updateSetting('emailContact', e.target.value)}
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Téléphone</label>
                  <input
                    value={settings.telephone}
                    onChange={(e) => updateSetting('telephone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Adresse</label>
                  <input
                    value={settings.adresse}
                    onChange={(e) => updateSetting('adresse', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-background-200/70 p-6">
              <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Paramètres de notification</h3>
              <p className="text-xs text-foreground-500 mb-6 font-body">Configurez comment et quand les notifications sont envoyées aux administrateurs et candidats.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Notifications par email</p>
                    <p className="text-xs text-foreground-500 font-body mt-0.5">Envoyer des emails aux candidats et administrateurs</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notificationsEmail', !settings.notificationsEmail)}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.notificationsEmail ? 'bg-primary-500' : 'bg-background-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.notificationsEmail ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="h-px bg-background-100"></div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Notifications SMS</p>
                    <p className="text-xs text-foreground-500 font-body mt-0.5">Envoyer des SMS aux candidats pour les étapes clés</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notificationsSMS', !settings.notificationsSMS)}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.notificationsSMS ? 'bg-primary-500' : 'bg-background-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.notificationsSMS ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="h-px bg-background-100"></div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Alerte nouveau dossier</p>
                    <p className="text-xs text-foreground-500 font-body mt-0.5">Notifier les admins quand un candidat soumet son dossier</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifNouveauDossier', !settings.notifNouveauDossier)}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.notifNouveauDossier ? 'bg-primary-500' : 'bg-background-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.notifNouveauDossier ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="h-px bg-background-100"></div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Alerte paiement reçu</p>
                    <p className="text-xs text-foreground-500 font-body mt-0.5">Notifier quand un paiement est confirmé</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifPaiement', !settings.notifPaiement)}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.notifPaiement ? 'bg-primary-500' : 'bg-background-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.notifPaiement ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="h-px bg-background-100"></div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Rapport hebdomadaire</p>
                    <p className="text-xs text-foreground-500 font-body mt-0.5">Recevoir un résumé hebdomadaire des statistiques</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifValidation', !settings.notifValidation)}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.notifValidation ? 'bg-primary-500' : 'bg-background-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.notifValidation ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="h-px bg-background-100"></div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Mode maintenance</p>
                    <p className="text-xs text-foreground-500 font-body mt-0.5">Rendre la plateforme inaccessible aux candidats</p>
                  </div>
                  <button
                    onClick={() => updateSetting('modeMaintenance', !settings.modeMaintenance)}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.modeMaintenance ? 'bg-accent-500' : 'bg-background-300'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.modeMaintenance ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Sécurité */}
          {activeTab === 'securite' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Authentification</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground-800 font-body">Double authentification (2FA)</p>
                      <p className="text-xs text-foreground-500 font-body mt-0.5">Exiger un code de vérification à chaque connexion admin</p>
                    </div>
                    <button
                      onClick={() => updateSetting('doubleAuth', !settings.doubleAuth)}
                      className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.doubleAuth ? 'bg-emerald-500' : 'bg-background-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.doubleAuth ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="h-px bg-background-100"></div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Durée de session (minutes)</label>
                    <input
                      value={settings.dureeSession}
                      onChange={(e) => updateSetting('dureeSession', e.target.value)}
                      type="number"
                      className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                    />
                    <p className="text-xs text-foreground-400 mt-1 font-body">Après cette durée, les administrateurs seront déconnectés automatiquement.</p>
                  </div>
                  <div className="h-px bg-background-100"></div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Tentatives de connexion max</label>
                    <input
                      value={settings.tentativesMax}
                      onChange={(e) => updateSetting('tentativesMax', e.target.value)}
                      type="number"
                      className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                    />
                    <p className="text-xs text-foreground-400 mt-1 font-body">Nombre de tentatives avant blocage temporaire du compte.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Contrôle d&apos;accès</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Adresses IP autorisées</label>
                  <input
                    value={settings.ipsAutorisees}
                    onChange={(e) => updateSetting('ipsAutorisees', e.target.value)}
                    placeholder="Ex: 192.168.1.1, 10.0.0.0/24"
                    className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                  />
                  <p className="text-xs text-foreground-400 mt-1 font-body">Laissez vide pour autoriser toutes les adresses IP. Séparez les entrées par des virgules.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Journal d&apos;activité</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Connexion admin', user: 'signeylguela@gmail.com', date: '10/06/2026 08:45', ip: '192.168.1.100' },
                    { action: 'Modification paramètres', user: 'signeylguela@gmail.com', date: '09/06/2026 14:22', ip: '192.168.1.100' },
                    { action: 'Validation dossier', user: 'signeylguela@gmail.com', date: '09/06/2026 11:10', ip: '192.168.1.100' },
                    { action: 'Connexion admin', user: 'signeylguela@gmail.com', date: '08/06/2026 16:30', ip: '192.168.1.101' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-background-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background-200 flex items-center justify-center">
                          <i className="ri-history-line text-foreground-500 w-4 h-4 flex items-center justify-center"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground-800 font-body">{log.action}</p>
                          <p className="text-xs text-foreground-400 font-body">{log.date} — IP: {log.ip}</p>
                        </div>
                      </div>
                      <span className="text-xs text-foreground-500 font-body">{log.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Paiement */}
          {activeTab === 'paiement' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Configuration des frais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Frais d&apos;inscription</label>
                    <div className="relative">
                      <input
                        value={settings.fraisInscription}
                        onChange={(e) => updateSetting('fraisInscription', e.target.value)}
                        type="number"
                        className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-400 font-body">FCFA</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Délai de validation (heures)</label>
                    <input
                      value={settings.delaiValidation}
                      onChange={(e) => updateSetting('delaiValidation', e.target.value)}
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Devise</label>
                    <select
                      value={settings.devise}
                      onChange={(e) => updateSetting('devise', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body cursor-pointer"
                    >
                      <option value="XAF">XAF — Franc CFA</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="USD">USD — Dollar US</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Modes de paiement acceptés</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center">
                        <i className="ri-bank-card-line text-foreground-600 w-5 h-5 flex items-center justify-center"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-800 font-body">Carte bancaire</p>
                        <p className="text-xs text-foreground-500 font-body">Visa, Mastercard</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('modePaiementCarte', !settings.modePaiementCarte)}
                      className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.modePaiementCarte ? 'bg-primary-500' : 'bg-background-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.modePaiementCarte ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="h-px bg-background-100"></div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center">
                        <i className="ri-smartphone-line text-foreground-600 w-5 h-5 flex items-center justify-center"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-800 font-body">Mobile Money</p>
                        <p className="text-xs text-foreground-500 font-body">Orange Money, MTN Mobile Money</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('modePaiementMobile', !settings.modePaiementMobile)}
                      className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.modePaiementMobile ? 'bg-primary-500' : 'bg-background-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.modePaiementMobile ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="h-px bg-background-100"></div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center">
                        <i className="ri-building-line text-foreground-600 w-5 h-5 flex items-center justify-center"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-800 font-body">Virement bancaire</p>
                        <p className="text-xs text-foreground-500 font-body">Paiement manuel via compte bancaire</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('modePaiementVirement', !settings.modePaiementVirement)}
                      className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.modePaiementVirement ? 'bg-primary-500' : 'bg-background-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.modePaiementVirement ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Configuration Stripe</h3>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <i className="ri-information-line text-amber-600 w-5 h-5 flex items-center justify-center mt-0.5"></i>
                    <div>
                      <p className="text-sm font-medium text-amber-800 font-body">Stripe non connecté</p>
                      <p className="text-xs text-amber-700 mt-1 font-body">
                        Connectez votre compte Stripe pour activer les paiements réels. En attendant, les paiements sont simulés en mode démonstration.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground-800 font-body">Mode test Stripe</p>
                      <p className="text-xs text-foreground-500 font-body mt-0.5">Utiliser les clés de test Stripe pour les simulations</p>
                    </div>
                    <button
                      onClick={() => updateSetting('stripeModeTest', !settings.stripeModeTest)}
                      className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.stripeModeTest ? 'bg-amber-500' : 'bg-background-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.stripeModeTest ? 'left-6' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="h-px bg-background-100"></div>
                  <div>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Clé publique Stripe</label>
                    <div className="relative">
                      <input
                        value={settings.stripeClePublique}
                        onChange={(e) => updateSetting('stripeClePublique', e.target.value)}
                        type="text"
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-100 text-sm text-foreground-500 font-mono cursor-not-allowed"
                      />
                      <i className="ri-lock-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 w-4 h-4 flex items-center justify-center"></i>
                    </div>
                    <p className="text-xs text-foreground-400 mt-1 font-body">La clé est gérée automatiquement après connexion Stripe.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Sauvegarde */}
          {activeTab === 'sauvegarde' && (
            <div className="space-y-6">
              {/* Export */}
              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <i className="ri-download-2-line text-primary-600 w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Exporter la configuration</h3>
                    <p className="text-xs text-foreground-500 mt-1 font-body">
                      Téléchargez tous vos paramètres actuels au format JSON. Ce fichier pourra être réimporté ultérieurement.
                    </p>
                  </div>
                </div>

                <div className="bg-background-50 rounded-xl p-4 mb-5">
                  <label className="block text-xs font-medium text-foreground-600 mb-2 font-body">Nom du fichier de sauvegarde</label>
                  <div className="flex items-center gap-2">
                    <input
                      value={backupFileName}
                      onChange={(e) => setBackupFileName(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-background-200 bg-white text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-mono"
                    />
                    <span className="text-sm text-foreground-400 font-body flex-shrink-0">.json</span>
                  </div>
                </div>

                <div className="bg-background-50 rounded-xl p-4 mb-5 border border-background-200">
                  <p className="text-xs font-semibold text-foreground-700 mb-3 font-label">Aperçu des données à exporter</p>
                  <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto border border-background-100">
                    <pre className="text-[11px] text-foreground-600 font-mono whitespace-pre-wrap">
                      {JSON.stringify(settings, null, 2)}
                    </pre>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-foreground-400 font-body">
                      {Object.keys(settings).length} paramètres
                    </span>
                    <span className="text-xs text-foreground-400 font-body">
                      ~{(JSON.stringify(settings).length / 1024).toFixed(1)} Ko
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleExportJSON}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer font-label whitespace-nowrap"
                >
                  <i className="ri-download-2-line w-4 h-4 flex items-center justify-center"></i>
                  Exporter en JSON
                </button>
              </div>

              {/* Import / Restore */}
              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <i className="ri-upload-2-line text-amber-600 w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider font-label">Restaurer une configuration</h3>
                    <p className="text-xs text-foreground-500 mt-1 font-body">
                      Importez un fichier JSON précédemment exporté pour restaurer vos paramètres. Attention : les paramètres actuels seront écrasés.
                    </p>
                  </div>
                </div>

                {/* Restore Alerts */}
                {restoreSuccess && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <i className="ri-check-double-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
                    <div>
                      <p className="text-sm font-medium text-emerald-800 font-body">Paramètres restaurés avec succès</p>
                      <p className="text-xs text-emerald-600 font-body mt-0.5">Tous les paramètres ont été mis à jour.</p>
                    </div>
                  </div>
                )}
                {restoreError && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 flex items-center gap-3">
                    <i className="ri-error-warning-line text-primary-500 w-5 h-5 flex items-center justify-center"></i>
                    <p className="text-sm font-medium text-primary-700 font-body">{restoreError}</p>
                  </div>
                )}

                <input
                  ref={fileRestoreRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleRestoreSelect}
                />

                <div
                  onClick={() => fileRestoreRef.current?.click()}
                  className={`mb-5 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                    restoreFile
                      ? 'border-primary-300 bg-primary-50/30'
                      : 'border-background-300 bg-background-50 hover:border-primary-300 hover:bg-primary-50/10'
                  }`}
                >
                  {restoreFile ? (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                        <i className="ri-file-code-line text-primary-600 w-6 h-6 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm font-semibold text-foreground-800 font-body">{restoreFile.name}</p>
                      <p className="text-xs text-foreground-400 font-body mt-1">
                        {(restoreFile.size / 1024).toFixed(1)} Ko — Cliquez pour changer
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-background-200 flex items-center justify-center mx-auto mb-3">
                        <i className="ri-file-upload-line text-foreground-400 w-6 h-6 flex items-center justify-center"></i>
                      </div>
                      <p className="text-sm text-foreground-600 font-body mb-1">
                        Cliquez pour sélectionner un fichier JSON
                      </p>
                      <p className="text-xs text-foreground-400 font-body">
                        ou glissez-déposez votre fichier ici
                      </p>
                    </div>
                  )}
                </div>

                {restorePreview && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-foreground-700 mb-2 font-label">Aperçu des données à restaurer</p>
                    <div className="bg-background-50 rounded-xl p-4 max-h-40 overflow-y-auto border border-background-200">
                      <pre className="text-[11px] text-foreground-600 font-mono whitespace-pre-wrap">
                        {restorePreview}
                      </pre>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleRestoreExecute}
                  disabled={!restoreFile || restoreLoading || !!restoreError}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-all cursor-pointer font-label whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {restoreLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                      Restauration en cours...
                    </>
                  ) : (
                    <>
                      <i className="ri-refresh-line w-4 h-4 flex items-center justify-center"></i>
                      Restaurer les paramètres
                    </>
                  )}
                </button>
              </div>

              {/* Historique sauvegardes */}
              <div className="bg-white rounded-2xl border border-background-200/70 p-6">
                <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">
                  <i className="ri-history-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
                  Historique des sauvegardes
                </h3>
                <div className="space-y-3">
                  {[
                    { nom: 'parametres-pkfokam-2026-06-10.json', date: '10/06/2026 à 08:45', taille: '4.2 Ko', type: 'automatique' },
                    { nom: 'parametres-pkfokam-2026-06-01.json', date: '01/06/2026 à 12:00', taille: '4.1 Ko', type: 'manuel' },
                    { nom: 'parametres-pkfokam-2026-05-15.json', date: '15/05/2026 à 16:30', taille: '3.9 Ko', type: 'automatique' },
                  ].map((backup, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background-50 border border-background-100">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                          <i className="ri-file-code-line text-primary-600 w-4 h-4 flex items-center justify-center"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground-800 font-body">{backup.nom}</p>
                          <p className="text-xs text-foreground-400 font-body">
                            {backup.date} — {backup.taille}
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium font-label ${
                              backup.type === 'automatique' ? 'bg-primary-50 text-primary-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {backup.type === 'automatique' ? 'Auto' : 'Manuel'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-lg bg-background-100 text-foreground-500 flex items-center justify-center hover:bg-background-200 transition-colors cursor-pointer" title="Télécharger">
                        <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {activeTab !== 'securite' && activeTab !== 'sauvegarde' && (
            <div className="flex items-center justify-end gap-3">
              {saved && (
                <span className="text-sm text-emerald-600 font-medium font-body flex items-center gap-1 animate-in">
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                  Paramètres sauvegardés avec succès
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
              >
                <i className="ri-save-line w-4 h-4 inline-flex items-center justify-center mr-1"></i>
                Sauvegarder
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}