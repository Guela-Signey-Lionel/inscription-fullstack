import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CandidatLayout from '@/components/layout/CandidatLayout';

export default function CandidatParametres() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    langue: 'fr',
    fuseauHoraire: 'Africa/Douala',
  });

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <CandidatLayout title="Paramètres" subtitle="Gérez vos préférences de compte">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-background-200/70 p-2">
            {[
              { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
              { id: 'affichage', label: 'Affichage', icon: 'ri-computer-line' },
              { id: 'confidentialite', label: 'Confidentialité', icon: 'ri-shield-check-line' },
            ].map((tab) => (
              <button
                key={tab.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground-700 hover:bg-background-50 transition-colors font-body text-left cursor-pointer"
              >
                <i className={`${tab.icon} w-5 h-5 flex items-center justify-center text-foreground-400`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-800 font-body">Notifications par email</p>
                  <p className="text-xs text-foreground-500 font-body">Recevoir les mises à jour sur l&apos;avancement de votre dossier</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.emailNotifications ? 'bg-primary-500' : 'bg-background-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.emailNotifications ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="h-px bg-background-100"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-800 font-body">Notifications SMS</p>
                  <p className="text-xs text-foreground-500 font-body">Recevoir des alertes par SMS pour les étapes importantes</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, smsNotifications: !settings.smsNotifications })}
                  className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.smsNotifications ? 'bg-primary-500' : 'bg-background-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.smsNotifications ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="h-px bg-background-100"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground-800 font-body">Newsletter</p>
                  <p className="text-xs text-foreground-500 font-body">Recevoir les actualités et offres de formation</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, newsletter: !settings.newsletter })}
                  className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${settings.newsletter ? 'bg-primary-500' : 'bg-background-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${settings.newsletter ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Affichage et langue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Langue</label>
                <select
                  value={settings.langue}
                  onChange={(e) => setSettings({ ...settings, langue: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Fuseau horaire</label>
                <select
                  value={settings.fuseauHoraire}
                  onChange={(e) => setSettings({ ...settings, fuseauHoraire: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                >
                  <option value="Africa/Douala">Afrique/Douala (UTC+1)</option>
                  <option value="Africa/Ndjamena">Afrique/Ndjamena (UTC+1)</option>
                  <option value="Africa/Brazzaville">Afrique/Brazzaville (UTC+1)</option>
                  <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Confidentialité</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-background-50 border border-background-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                    <i className="ri-download-cloud-2-line text-secondary-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Télécharger mes données</p>
                    <p className="text-xs text-foreground-500 font-body">Obtenez une copie de toutes vos données personnelles</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-foreground-600 bg-background-100 hover:bg-background-200 transition-all cursor-pointer font-label">
                  Exporter
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-background-50 border border-background-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <i className="ri-delete-bin-line text-primary-600 w-5 h-5 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">Supprimer mon compte</p>
                    <p className="text-xs text-foreground-500 font-body">Supprimez définitivement votre compte et toutes vos données</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all cursor-pointer font-label">
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="text-sm text-emerald-600 font-medium font-body flex items-center gap-1">
                <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                Paramètres sauvegardés
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
        </div>
      </div>
    </CandidatLayout>
  );
}