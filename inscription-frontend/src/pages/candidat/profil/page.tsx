import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import CandidatLayout from '@/components/layout/CandidatLayout';
import { authApi } from '@/api/auth';

export default function CandidatProfil() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [saved, setSaved]       = useState(false);
  const [saveErr, setSaveErr]   = useState('');
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  const [profil, setProfil] = useState({
    nom:         user?.nom     || '',
    prenom:      user?.prenom  || '',
    email:       user?.email   || '',
    telephone:   '',
    nationalite: '',
    adresse:     '',
    bio:         '',
  });

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordSaved, setPasswordSaved]   = useState(false);
  const [passwordErr, setPasswordErr]       = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

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

  if (!isAuthenticated || !user) return <Navigate to="/connexion" replace />;

  const handleSave = async () => {
    setSaving(true); setSaveErr('');
    try {
      await authApi.updateMe({ nom: profil.nom, prenom: profil.prenom, adresse: profil.adresse, bio: profil.bio });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur lors de la sauvegarde';
      setSaveErr(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) return;
    setPasswordSaving(true); setPasswordErr('');
    try {
      await authApi.changePassword({ ancienMotDePasse: passwordForm.current, nouveauMotDePasse: passwordForm.new });
      setPasswordSaved(true);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Mot de passe actuel incorrect';
      setPasswordErr(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <CandidatLayout title="Mon profil" subtitle="Informations personnelles du candidat">
      <div className="max-w-2xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 h-32 relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden bg-primary-100 shadow-lg">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-2xl font-label">
                    {(profil.prenom[0] || '?')}{(profil.nom[0] || '?')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 px-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground-950 font-heading">{profil.prenom} {profil.nom}</h2>
                <p className="text-sm text-foreground-500 font-body">{user.email}</p>
              </div>
              <button
                onClick={() => { setEditing(!editing); setSaveErr(''); }}
                className="px-4 py-2 rounded-xl bg-background-100 text-foreground-700 text-sm font-medium hover:bg-background-200 transition-all cursor-pointer font-label"
              >
                <i className={`${editing ? 'ri-close-line' : 'ri-edit-line'} w-4 h-4 inline-flex items-center justify-center mr-1`}></i>
                {editing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

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
                {[
                  { label: 'Prénom', key: 'prenom', type: 'text' },
                  { label: 'Nom',    key: 'nom',    type: 'text' },
                  { label: 'Email',  key: 'email',  type: 'email' },
                  { label: 'Téléphone', key: 'telephone', type: 'tel' },
                  { label: 'Nationalité', key: 'nationalite', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">{label}</label>
                    <input
                      type={type}
                      value={profil[key as keyof typeof profil]}
                      onChange={(e) => setProfil({ ...profil, [key]: e.target.value })}
                      readOnly={!editing || key === 'email'}
                      className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body ${
                        editing && key !== 'email'
                          ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300'
                          : 'bg-background-100 cursor-not-allowed'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {[
                { label: 'Adresse', key: 'adresse', rows: 2 },
                { label: 'Biographie', key: 'bio',   rows: 3 },
              ].map(({ label, key, rows }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">{label}</label>
                  <textarea
                    value={profil[key as keyof typeof profil]}
                    onChange={(e) => setProfil({ ...profil, [key]: e.target.value })}
                    readOnly={!editing}
                    rows={rows}
                    maxLength={500}
                    className={`w-full px-4 py-2.5 rounded-xl border border-background-200 text-sm text-foreground-800 transition-all font-body resize-none ${
                      editing ? 'bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-300' : 'bg-background-100 cursor-not-allowed'
                    }`}
                  />
                </div>
              ))}

              {editing && (
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => { setEditing(false); setSaveErr(''); }}
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

        {/* Security Card — Mot de passe */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Changer le mot de passe</h3>

          {passwordSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <i className="ri-check-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
              <span className="text-sm text-emerald-700 font-body">Mot de passe modifié avec succès</span>
            </div>
          )}
          {passwordErr && (
            <div className="mb-4 p-3 rounded-xl bg-primary-50 border border-primary-200 flex items-center gap-2">
              <i className="ri-error-warning-line text-primary-600 w-5 h-5 flex items-center justify-center"></i>
              <span className="text-sm text-primary-700 font-body">{passwordErr}</span>
            </div>
          )}

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Mot de passe actuel</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all font-body"
                placeholder="••••••••"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all font-body"
                  placeholder="8 caractères minimum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-700 mb-1.5 font-body">Confirmer</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all font-body focus:outline-none focus:ring-2 ${
                    passwordForm.new && passwordForm.confirm && passwordForm.new !== passwordForm.confirm
                      ? 'border-primary-300 bg-primary-50 text-foreground-800 focus:ring-primary-300'
                      : 'border-background-200 bg-background-50 text-foreground-800 focus:ring-primary-300'
                  }`}
                  placeholder="••••••••"
                />
                {passwordForm.new && passwordForm.confirm && passwordForm.new !== passwordForm.confirm && (
                  <p className="text-xs text-primary-500 mt-1 font-body">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={
                !passwordForm.current ||
                !passwordForm.new ||
                passwordForm.new.length < 8 ||
                passwordForm.new !== passwordForm.confirm ||
                passwordSaving
              }
              className="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-label inline-flex items-center gap-2"
            >
              {passwordSaving
                ? <><i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>Mise à jour...</>
                : <><i className="ri-lock-line w-4 h-4 inline-flex items-center justify-center"></i>Mettre à jour le mot de passe</>
              }
            </button>
          </div>
        </div>

        {/* Security info Card */}
        <div className="bg-white rounded-2xl border border-background-200/70 p-6">
          <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">Sécurité du compte</h3>
          <div className="space-y-4">
            {[
              {
                icon: 'ri-smartphone-line', iconBg: 'bg-accent-100', iconColor: 'text-accent-600',
                title: 'Authentification à deux facteurs', sub: 'Non activée',
                btnLabel: 'Activer', btnClass: 'text-accent-600 bg-accent-50 hover:bg-accent-100',
              },
              {
                icon: 'ri-history-line', iconBg: 'bg-primary-100', iconColor: 'text-primary-600',
                title: 'Sessions actives', sub: 'Douala, Cameroun — Dernière connexion aujourd\'hui',
                btnLabel: 'Gérer', btnClass: 'text-foreground-600 bg-background-100 hover:bg-background-200',
              },
              {
                icon: 'ri-delete-bin-line', iconBg: 'bg-primary-100', iconColor: 'text-primary-600',
                title: 'Supprimer mon compte', sub: 'Cette action est irréversible',
                btnLabel: 'Supprimer', btnClass: 'text-primary-600 bg-primary-50 hover:bg-primary-100',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-4 rounded-xl bg-background-50 border border-background-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                    <i className={`${item.icon} ${item.iconColor} w-5 h-5 flex items-center justify-center`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground-800 font-body">{item.title}</p>
                    <p className="text-xs text-foreground-500 font-body">{item.sub}</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-xl text-sm font-medium ${item.btnClass} transition-all cursor-pointer font-label`}>
                  {item.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CandidatLayout>
  );
}
