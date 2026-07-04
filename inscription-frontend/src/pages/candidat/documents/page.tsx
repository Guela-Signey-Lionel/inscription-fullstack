import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import CandidatLayout from '@/components/layout/CandidatLayout';

interface FichierSoumis {
  id: string;
  type: string;
  nom: string;
  taille: string;
  dateUpload: string;
  statut: 'valide' | 'en_attente' | 'refuse';
  commentaire?: string;
}

const fichiersInitiaux: FichierSoumis[] = [
  {
    id: 'doc-1',
    type: "Pièce d'identité (CNI)",
    nom: 'cni-dupont.pdf',
    taille: '1.2 Mo',
    dateUpload: '15/05/2026 à 10:30',
    statut: 'valide',
  },
  {
    id: 'doc-2',
    type: 'Diplôme du Baccalauréat',
    nom: 'bac-dupont.pdf',
    taille: '2.8 Mo',
    dateUpload: '15/05/2026 à 10:32',
    statut: 'valide',
  },
  {
    id: 'doc-3',
    type: "Photo d'identité",
    nom: 'photo-dupont.jpg',
    taille: '0.5 Mo',
    dateUpload: '06/06/2026 à 14:15',
    statut: 'en_attente',
  },
  {
    id: 'doc-4',
    type: 'Relevés de notes',
    nom: '',
    taille: '',
    dateUpload: '',
    statut: 'en_attente',
    commentaire: 'Document non encore fourni',
  },
];

export default function CandidatDocuments() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fichiers, setFichiers] = useState<FichierSoumis[]>(fichiersInitiaux);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<FichierSoumis | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement...</p>
        </div>
      </div>
    );
  }

  const typesRequis = [
    "Pièce d'identité (CNI)",
    'Diplôme du Baccalauréat',
    "Photo d'identité",
    'Relevés de notes',
  ];

  const handleFileSelect = (docId: string) => {
    fileInputRef.current?.click();
    setUploadingFor(docId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const taille = file.size < 1024 * 1024
      ? `${Math.round(file.size / 1024)} Ko`
      : `${(file.size / (1024 * 1024)).toFixed(1)} Mo`;

    setFichiers((prev) =>
      prev.map((f) =>
        f.id === uploadingFor
          ? { ...f, nom: file.name, taille, dateUpload: dateStr, statut: 'en_attente' as const, commentaire: undefined }
          : f
      )
    );

    addToast(`Fichier "${file.name}" téléversé avec succès`, 'success');
    setUploadingFor(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(docId);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const taille = file.size < 1024 * 1024
      ? `${Math.round(file.size / 1024)} Ko`
      : `${(file.size / (1024 * 1024)).toFixed(1)} Mo`;

    setFichiers((prev) =>
      prev.map((f) =>
        f.id === docId
          ? { ...f, nom: file.name, taille, dateUpload: dateStr, statut: 'en_attente' as const, commentaire: undefined }
          : f
      )
    );

    addToast(`Fichier "${file.name}" téléversé avec succès`, 'success');
  };

  const valides = fichiers.filter((f) => f.statut === 'valide').length;
  const total = fichiers.length;
  const progression = total > 0 ? Math.round((valides / total) * 100) : 0;

  return (
    <CandidatLayout title="Mes documents" subtitle="Gérez et téléversez vos pièces justificatives">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <i className="ri-file-copy-2-line text-primary-600 w-5 h-5 flex items-center justify-center"></i>
            </div>
            <div>
              <p className="text-xs text-foreground-500 font-body">Total documents</p>
              <p className="text-xl font-bold font-heading text-foreground-950">{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <i className="ri-check-double-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
            </div>
            <div>
              <p className="text-xs text-foreground-500 font-body">Validés</p>
              <p className="text-xl font-bold font-heading text-foreground-950">{valides}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-background-200/70 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <i className="ri-time-line text-amber-600 w-5 h-5 flex items-center justify-center"></i>
            </div>
            <div>
              <p className="text-xs text-foreground-500 font-body">En attente</p>
              <p className="text-xl font-bold font-heading text-foreground-950">{total - valides}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground-700 font-label">Progression documentaire</h3>
          <span className="text-xs font-semibold text-foreground-600 font-label">{progression}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-background-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-500"
            style={{ width: `${progression}%` }}
          ></div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-6">
        <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">
          <i className="ri-file-list-3-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
          Pièces justificatives requises
        </h3>
        <p className="text-xs text-foreground-500 mb-6 font-body">
          Formats acceptés : PDF, JPG, PNG. Taille maximale : 10 Mo par fichier.
        </p>

        <div className="space-y-3">
          {fichiers.map((fichier) => (
            <div
              key={fichier.id}
              onDragOver={(e) => handleDragOver(e, fichier.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, fichier.id)}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                dragOver === fichier.id
                  ? 'border-primary-400 bg-primary-50/50'
                  : fichier.statut === 'valide'
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : fichier.statut === 'refuse'
                  ? 'border-primary-200 bg-primary-50/30'
                  : 'border-background-200 bg-background-50 hover:border-background-300'
              }`}
            >
              {/* File Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                fichier.statut === 'valide' ? 'bg-emerald-100' :
                fichier.statut === 'refuse' ? 'bg-primary-100' :
                fichier.nom ? 'bg-primary-100' : 'bg-background-200'
              }`}>
                {fichier.nom ? (
                  <i className={`${
                    fichier.nom.endsWith('.pdf') ? 'ri-file-pdf-line' :
                    fichier.nom.endsWith('.jpg') || fichier.nom.endsWith('.png') || fichier.nom.endsWith('.jpeg') ? 'ri-image-line' :
                    'ri-file-text-line'
                  } ${
                    fichier.statut === 'valide' ? 'text-emerald-600' :
                    fichier.statut === 'refuse' ? 'text-primary-500' :
                    'text-primary-600'
                  } w-6 h-6 flex items-center justify-center`}></i>
                ) : (
                  <i className="ri-upload-cloud-2-line text-foreground-400 w-6 h-6 flex items-center justify-center"></i>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground-800 font-body">{fichier.type}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-label ${
                    fichier.statut === 'valide' ? 'bg-emerald-100 text-emerald-700' :
                    fichier.statut === 'refuse' ? 'bg-primary-100 text-primary-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {fichier.statut === 'valide' ? 'Validé' : fichier.statut === 'refuse' ? 'Refusé' : 'En attente'}
                  </span>
                </div>
                {fichier.nom ? (
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-xs text-foreground-600 font-body">{fichier.nom}</span>
                    <span className="text-[10px] text-foreground-400 font-body">{fichier.taille}</span>
                    <span className="text-[10px] text-foreground-400 font-body">{fichier.dateUpload}</span>
                  </div>
                ) : (
                  <p className="text-xs text-foreground-400 font-body mt-1 italic">
                    {fichier.commentaire || 'Aucun fichier téléversé'}
                  </p>
                )}
                {fichier.statut === 'refuse' && fichier.commentaire && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-primary-50 border border-primary-100">
                    <div className="flex items-start gap-2">
                      <i className="ri-error-warning-line text-primary-500 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                      <p className="text-xs text-primary-700 font-body">{fichier.commentaire}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {fichier.nom && (
                  <button
                    onClick={() => setPreviewDoc(fichier)}
                    className="w-9 h-9 rounded-lg bg-background-100 text-foreground-600 flex items-center justify-center hover:bg-background-200 transition-colors cursor-pointer"
                    title="Prévisualiser"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                )}
                {fichier.statut !== 'valide' && (
                  <button
                    onClick={() => handleFileSelect(fichier.id)}
                    disabled={uploadingFor === fichier.id}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer font-label whitespace-nowrap ${
                      fichier.nom
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {uploadingFor === fichier.id ? (
                      <span className="inline-flex items-center gap-1.5">
                        <i className="ri-loader-4-line animate-spin w-3.5 h-3.5 flex items-center justify-center"></i>
                        Upload...
                      </span>
                    ) : fichier.nom ? (
                      <>
                        <i className="ri-refresh-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                        Remplacer
                      </>
                    ) : (
                      <>
                        <i className="ri-upload-cloud-2-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                        Téléverser
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Drag & Drop Zone */}
        <div className="mt-6 p-6 rounded-xl border-2 border-dashed border-background-300 bg-background-50 text-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
            <i className="ri-drag-drop-line text-primary-600 w-6 h-6 flex items-center justify-center"></i>
          </div>
          <p className="text-sm text-foreground-600 font-body mb-1">
            Glissez-déposez vos fichiers ici
          </p>
          <p className="text-xs text-foreground-400 font-body mb-4">
            ou cliquez sur "Téléverser" pour chaque document requis
          </p>
          <button
            onClick={() => {
              const premierManquant = fichiers.find((f) => !f.nom || f.statut === 'refuse');
              if (premierManquant) handleFileSelect(premierManquant.id);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer font-label whitespace-nowrap"
          >
            <i className="ri-upload-cloud-2-line w-4 h-4 flex items-center justify-center"></i>
            Téléverser des fichiers
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewDoc(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold font-heading text-foreground-950">{previewDoc.type}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-lg bg-background-100 flex items-center justify-center text-foreground-500 hover:bg-background-200 cursor-pointer"
              >
                <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="bg-background-50 rounded-xl p-8 mb-5 flex items-center justify-center border border-background-200">
              {previewDoc.nom?.endsWith('.pdf') ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    <i className="ri-file-pdf-line text-primary-500 text-3xl w-10 h-10 flex items-center justify-center"></i>
                  </div>
                  <p className="text-sm font-semibold text-foreground-800 font-body">{previewDoc.nom}</p>
                  <p className="text-xs text-foreground-400 font-body mt-1">Prévisualisation PDF non disponible</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    <i className="ri-image-line text-primary-600 text-3xl w-10 h-10 flex items-center justify-center"></i>
                  </div>
                  <p className="text-sm font-semibold text-foreground-800 font-body">{previewDoc.nom}</p>
                  <p className="text-xs text-foreground-400 font-body mt-1">Prévisualisation image non disponible</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-500 font-body">Nom du fichier</span>
                <span className="text-xs font-medium text-foreground-700 font-body">{previewDoc.nom}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-500 font-body">Taille</span>
                <span className="text-xs font-medium text-foreground-700 font-body">{previewDoc.taille}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-500 font-body">Date de dépôt</span>
                <span className="text-xs font-medium text-foreground-700 font-body">{previewDoc.dateUpload}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-500 font-body">Statut</span>
                <span className={`text-xs font-semibold font-label ${
                  previewDoc.statut === 'valide' ? 'text-emerald-600' :
                  previewDoc.statut === 'refuse' ? 'text-primary-600' :
                  'text-amber-600'
                }`}>
                  {previewDoc.statut === 'valide' ? 'Validé' : previewDoc.statut === 'refuse' ? 'Refusé' : 'En attente de validation'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewDoc(null)}
                className="flex-1 py-2.5 rounded-xl bg-background-100 text-foreground-600 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer font-label"
              >
                Fermer
              </button>
              {previewDoc.statut !== 'valide' && (
                <button
                  onClick={() => { setPreviewDoc(null); handleFileSelect(previewDoc.id); }}
                  className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors cursor-pointer font-label"
                >
                  <i className="ri-upload-cloud-2-line w-4 h-4 inline-flex items-center justify-center mr-1"></i>
                  Remplacer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </CandidatLayout>
  );
}