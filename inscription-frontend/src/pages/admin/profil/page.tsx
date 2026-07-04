import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { authApi } from '@/api/auth';

const DEFAULT_IMAGE = '/images/signey.jpg';
const PRESET_IMAGES = [
  { src: '/images/signey.jpg', label: 'Signey' },
  { src: '/images/rose.png', label: 'Rose' },
  { src: '/images/prince.png', label: 'Prince' },
];

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

export default function AdminProfil() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved]     = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(false);

  const [profil, setProfil] = useState({
    nom:          user?.nom     || '',
    prenom:       user?.prenom  || '',
    email:        user?.email   || '',
    telephone:    '',
    fonction:     'Administrateur',
    departement:  'Administration',
    bio:          '',
    avatar:       DEFAULT_IMAGE,
  });

  const [showImagePicker, setShowImagePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = async () => {
    setSaving(true); setSaveErr('');
    try {
      await authApi.updateMe({ nom: profil.nom, prenom: profil.prenom, bio: profil.bio });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveErr('Erreur lors de la sauvegarde. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems} title="Mon profil" subtitle="Informations de l'administrateur">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 h-32 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden bg-primary-100 shadow-lg group relative">
                <img src={profil.avatar} alt="Profil administrateur" className="w-full h-full object-cover" />
                {editing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setShowImagePicker(!showImagePicker)}>
                    <i className="ri-camera-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-16 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground-950 font-heading">{profil.prenom} {profil.nom}</h2>
                <p className="text-sm text-foreground-500 font-body">{profil.fonction}</p>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-xl bg-background-100 text-foreground-700 text-sm font-medium hover:bg-background-200 transition-all cursor-pointer font-label"
              >
                <i className={`${editing ? 'ri-close-line' : 'ri-edit-line'} w-4 h-4 inline-flex items-center justify-center mr-1`}></i>
                {editing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {/* Image picker popup */}
            {showImagePicker && editing && (
              <div className="mb-4 p-4 rounded-xl bg-background-50 border border-background-200">
                <p className="text-xs font-semibold text-foreground-600 mb-3 font-label">Choisir une photo</p>
                <div className="flex items-center gap-3 mb-3">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.src}
                      onClick={() => { setProfil({ ...profil, avatar: img.src }); setShowImagePicker(false); }}
                      className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all hover:border-primary-400 cursor-pointer ${
                        profil.avatar === img.src ? 'border-primary-500 ring-2 ring-primary-200' : 'border-background-300'
                      }`}
                    >
                      <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="h-px bg-background-200 my-2"></div>
                <button
                  onClick={() => { fileInputRef.current?.click(); }}
                  className="flex items-center gap-2 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors font-label cursor-pointer"
                >
                  <i className="ri-upload-cloud-2-line w-4 h-4 flex items-center justify-center"></i>
                  Télécharger une photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setProfil({ ...profil, avatar: ev.target.result as string });
                          setShowImagePicker(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            )}

            {saved && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                <i className="ri-check-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm text-emerald-700 font-body">Profil mis à jour avec succès</span>
              </div>
            )}
            {saveErr && (
              <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-center gap-2">
                <i className="ri-error-warning-line text-primary-600 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-sm text-primary-700 font-body">{saveErr}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Prénom</label>
                  <input
                    value={profil.prenom}
                    onChange={(e) => setProfil({ ...profil, prenom: e.target.value })}
                    readOnly={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Nom</label>
                  <input
                    value={profil.nom}
                    onChange={(e) => setProfil({ ...profil, nom: e.target.value })}
                    readOnly={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Email</label>
                  <input
                    value={profil.email}
                    onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                    readOnly={!editing}
                    type="email"
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Téléphone</label>
                  <input
                    value={profil.telephone}
                    onChange={(e) => setProfil({ ...profil, telephone: e.target.value })}
                    readOnly={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Fonction</label>
                  <input
                    value={profil.fonction}
                    onChange={(e) => setProfil({ ...profil, fonction: e.target.value })}
                    readOnly={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Département</label>
                  <input
                    value={profil.departement}
                    onChange={(e) => setProfil({ ...profil, departement: e.target.value })}
                    readOnly={!editing}
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Biographie</label>
                <textarea
                  value={profil.bio}
                  onChange={(e) => setProfil({ ...profil, bio: e.target.value })}
                  readOnly={!editing}
                  rows={3}
                  maxLength={500}
                  className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body resize-none ${
                    editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                  }`}
                ></textarea>
              </div>

              {editing && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-foreground-700 bg-background-100 hover:bg-background-200 transition-all cursor-pointer font-label"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition-all cursor-pointer font-label inline-flex items-center gap-2"
                  >
                    {saving
                      ? <><i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>Sauvegarde...</>
                      : <><i className="ri-save-line w-4 h-4 inline-flex items-center justify-center"></i>Sauvegarder</>
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Sécurité du compte</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-background-50 border border-background-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <i className="ri-lock-password-line text-primary-600 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-800 font-body">Mot de passe</p>
                  <p className="text-xs text-foreground-500 font-body">Dernière modification : 10 juin 2026</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-all cursor-pointer font-label">
                Modifier
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-background-50 border border-background-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                  <i className="ri-smartphone-line text-accent-600 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-800 font-body">Authentification à deux facteurs</p>
                  <p className="text-xs text-foreground-500 font-body">Non activée</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-accent-600 bg-accent-50 hover:bg-accent-100 transition-all cursor-pointer font-label">
                Activer
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
