import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

const dossiersDetail: Record<string, {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  genre: 'M' | 'F';
  adresse: string;
  formation: string;
  specialite: string;
  niveau: string;
  anneeAcademique: string;
  statut: string;
  dateCreation: string;
  dateMiseAJour: string;
  documents: { type: string; nom: string; statut: 'valide' | 'en_attente' | 'refuse' | 'manquant'; date?: string }[];
  paiement: { statut: string; montant: number; mode?: string; date?: string; reference?: string };
  historique: { action: string; auteur: string; date: string; icon: string; color: string }[];
  notes: string;
}> = {
  '1': {
    id: 'DOS-2026-001',
    nom: 'Begoto',
    prenom: 'Prince',
    email: 'begotostofil@gmail.com',
    telephone: '+237 688 08 49 74',
    dateNaissance: '15/03/2001',
    lieuNaissance: 'Bangui',
    nationalite: 'Centrafricaine',
    genre: 'M',
    adresse: 'Quartier Olembé, BP 1234, Yaoundé',
    formation: 'Licence en Informatique',
    specialite: 'Génie Logiciel',
    niveau: 'Licence',
    anneeAcademique: '2026-2027',
    statut: 'en_cours_validation',
    dateCreation: '15/05/2026',
    dateMiseAJour: '08/06/2026',
    documents: [
      { type: 'Photo d\'identité', nom: 'photo-begoto.jpg', statut: 'en_attente', date: '06/06/2026' },
      { type: 'Pièce d\'identité (CNI)', nom: 'cni-begoto.pdf', statut: 'valide', date: '05/06/2026' },
      { type: 'Diplôme du Baccalauréat', nom: 'bac-begoto.pdf', statut: 'valide', date: '05/06/2026' },
      { type: 'Relevés de notes', nom: 'releves-begoto.pdf', statut: 'refuse', date: '07/06/2026' },
      { type: 'Certificat de naissance', nom: '', statut: 'manquant' },
    ],
    paiement: {
      statut: 'non_effectue',
      montant: 50000,
    },
    historique: [
      { action: 'Relevés de notes refusé — document illisible', auteur: 'Admin PKFokam', date: '07/06/2026 - 16:48', icon: 'ri-close-line', color: 'bg-primary-100 text-primary-600' },
      { action: 'Dossier passé en cours de validation', auteur: 'Système', date: '07/06/2026 - 10:15', icon: 'ri-arrow-right-circle-line', color: 'bg-blue-100 text-blue-600' },
      { action: 'Pièce d\'identité validée', auteur: 'Admin PKFokam', date: '06/06/2026 - 14:20', icon: 'ri-check-line', color: 'bg-emerald-100 text-emerald-600' },
      { action: 'Diplôme du Baccalauréat validé', auteur: 'Admin PKFokam', date: '06/06/2026 - 14:18', icon: 'ri-check-line', color: 'bg-emerald-100 text-emerald-600' },
      { action: 'Formation sélectionnée : Licence Info - GL', auteur: 'Jean Dupont', date: '15/05/2026 - 11:05', icon: 'ri-book-open-line', color: 'bg-accent-100 text-accent-600' },
      { action: 'Dossier créé', auteur: 'Prince Begoto', date: '15/05/2026 - 10:00', icon: 'ri-add-circle-line', color: 'bg-secondary-100 text-secondary-600' },
    ],
    notes: 'Candidat sérieux, dossier quasi-complet. Relevés de notes à refournir (scan illisible). Contacter par téléphone si pas de réponse sous 48h.',
  },
  '2': {
    id: 'DOS-2026-002',
    nom: 'Zaninka',
    prenom: 'Rose',
    email: 'zaninkarose76@gmail.com',
    telephone: '+237 6 89 51 59 81',
    dateNaissance: '22/07/2000',
    lieuNaissance: 'Bangui',
    nationalite: 'Centrafricaine',
    genre: 'F',
    adresse: 'Quartier Emana, Yaoundé',
    formation: 'Master en Biotechnologie',
    specialite: 'Génie Biologique',
    niveau: 'Master',
    anneeAcademique: '2026-2027',
    statut: 'payee',
    dateCreation: '20/04/2026',
    dateMiseAJour: '01/06/2026',
    documents: [
      { type: 'Photo d\'identité', nom: 'photo-zaninka.jpg', statut: 'valide', date: '25/04/2026' },
      { type: 'Pièce d\'identité (CNI)', nom: 'cni-zaninka.pdf', statut: 'valide', date: '25/04/2026' },
      { type: 'Diplôme de Licence', nom: 'licence-zaninka.pdf', statut: 'valide', date: '28/04/2026' },
      { type: 'Relevés de notes', nom: 'releves-zaninka.pdf', statut: 'valide', date: '28/04/2026' },
    ],
    paiement: {
      statut: 'complete',
      montant: 75000,
      mode: 'carte',
      date: '28/05/2026',
      reference: 'STRIPE-TXN-8F3A2',
    },
    historique: [
      { action: 'Paiement Stripe confirmé — 75 000 FCFA', auteur: 'Stripe', date: '28/05/2026 - 09:22', icon: 'ri-bank-card-line', color: 'bg-cyan-100 text-cyan-600' },
      { action: 'Tous les documents validés', auteur: 'Admin PKFokam', date: '28/04/2026 - 15:10', icon: 'ri-check-double-line', color: 'bg-emerald-100 text-emerald-600' },
      { action: 'Dossier créé', auteur: 'Rose Zaninka', date: '20/04/2026 - 08:30', icon: 'ri-add-circle-line', color: 'bg-secondary-100 text-secondary-600' },
    ],
    notes: 'Excellent dossier. Tous les documents sont conformes. Paiement effectué. Prête pour validation scolarité.',
  },
  '3': {
    id: 'DOS-2026-003',
    nom: 'Komta',
    prenom: 'Teddy',
    email: 'teddykomta@email.com',
    telephone: '+237 688 22 11 00',
    dateNaissance: '10/11/2002',
    lieuNaissance: 'Douala',
    nationalite: 'Camerounaise',
    genre: 'M',
    adresse: 'Quartier Mballa 2, Yaoundé',
    formation: 'Licence en Économie-Gestion',
    specialite: 'Marketing',
    niveau: 'Licence',
    anneeAcademique: '2026-2027',
    statut: 'en_attente',
    dateCreation: '06/06/2026',
    dateMiseAJour: '06/06/2026',
    documents: [
      { type: 'Photo d\'identité', nom: '', statut: 'manquant' },
      { type: 'Pièce d\'identité (CNI)', nom: '', statut: 'manquant' },
      { type: 'Diplôme du Baccalauréat', nom: '', statut: 'manquant' },
      { type: 'Relevés de notes', nom: '', statut: 'manquant' },
    ],
    paiement: {
      statut: 'non_effectue',
      montant: 50000,
    },
    historique: [
      { action: 'Dossier créé — en attente de documents', auteur: 'Teddy Komta', date: '06/06/2026 - 14:22', icon: 'ri-add-circle-line', color: 'bg-secondary-100 text-secondary-600' },
    ],
    notes: '',
  },
  '4': {
    id: 'DOS-2026-004',
    nom: 'Ngoya',
    prenom: 'Steve',
    email: 'stevengoya@gmail.com',
    telephone: '+236 74 35 54 06',
    dateNaissance: '05/09/2001',
    lieuNaissance: 'Bamenda',
    nationalite: 'Camerounaise',
    genre: 'M',
    adresse: 'Quartier Commercial Avenue, Etoudi',
    formation: 'BTS Comptabilité',
    specialite: 'Comptabilité',
    niveau: 'BTS',
    anneeAcademique: '2026-2027',
    statut: 'validee_scolarite',
    dateCreation: '03/05/2026',
    dateMiseAJour: '05/06/2026',
    documents: [
      { type: 'Photo d\'identité', nom: 'photo-ngoya.jpg', statut: 'valide', date: '10/05/2026' },
      { type: 'Pièce d\'identité (CNI)', nom: 'cni-ngoya.pdf', statut: 'valide', date: '10/05/2026' },
      { type: 'Diplôme du Baccalauréat', nom: 'bac-ngoya.pdf', statut: 'valide', date: '12/05/2026' },
      { type: 'Relevés de notes', nom: 'releves-ngoya.pdf', statut: 'valide', date: '12/05/2026' },
    ],
    paiement: {
      statut: 'complete',
      montant: 50000,
      mode: 'mobile',
      date: '28/05/2026',
      reference: 'STRIPE-TXN-1B4C9',
    },
    historique: [
      { action: 'Dossier validé par la scolarité', auteur: 'Admin PKFokam', date: '05/06/2026 - 11:30', icon: 'ri-check-double-line', color: 'bg-primary-100 text-primary-600' },
      { action: 'Paiement confirmé — 50 000 FCFA', auteur: 'Stripe', date: '28/05/2026 - 14:15', icon: 'ri-bank-card-line', color: 'bg-cyan-100 text-cyan-600' },
      { action: 'Tous les documents validés', auteur: 'Admin PKFokam', date: '12/05/2026 - 16:45', icon: 'ri-check-line', color: 'bg-emerald-100 text-emerald-600' },
      { action: 'Dossier créé', auteur: 'Alice Njoya', date: '03/05/2026 - 10:00', icon: 'ri-add-circle-line', color: 'bg-secondary-100 text-secondary-600' },
    ],
    notes: 'Dossier complet et conforme. Candidature validée par la scolarité. Prête pour la rentrée.',
  },
  '5': {
    id: 'DOS-2026-005',
    nom: 'Karemamana',
    prenom: 'Jean-Marie',
    email: 'jkaremamana@gmail.com',
    telephone: '+237 6 88 33 86 17',
    dateNaissance: '18/12/2000',
    lieuNaissance: 'Brazzaville',
    nationalite: 'Congolaise',
    genre: 'M',
    adresse: 'Quartier Mbogada, Yaoundé',
    formation: 'Licence en Droit',
    specialite: 'Droit Privé',
    niveau: 'Licence',
    anneeAcademique: '2026-2027',
    statut: 'refusee',
    dateCreation: '02/05/2026',
    dateMiseAJour: '04/06/2026',
    documents: [
      { type: 'Photo d\'identité', nom: 'photo-karemamana.jpg', statut: 'valide', date: '10/05/2026' },
      { type: 'Pièce d\'identité (CNI)', nom: 'cni-karemamana.pdf', statut: 'valide', date: '10/05/2026' },
      { type: 'Diplôme du Baccalauréat', nom: 'bac-karemamana.pdf', statut: 'refuse', date: '03/06/2026' },
      { type: 'Relevés de notes', nom: 'releves-karemamana.pdf', statut: 'refuse', date: '03/06/2026' },
    ],
    paiement: {
      statut: 'echoue',
      montant: 50000,
      mode: 'carte',
      date: '02/06/2026',
      reference: 'STRIPE-TXN-FAIL-01',
    },
    historique: [
      { action: 'Dossier refusé — documents non conformes', auteur: 'Admin PKFokam', date: '04/06/2026 - 09:15', icon: 'ri-close-circle-line', color: 'bg-primary-100 text-primary-600' },
      { action: 'Paiement échoué — carte refusée', auteur: 'Stripe', date: '02/06/2026 - 16:40', icon: 'ri-error-warning-line', color: 'bg-orange-100 text-orange-600' },
      { action: 'Diplôme refusé — copie non certifiée', auteur: 'Admin PKFokam', date: '03/06/2026 - 10:30', icon: 'ri-close-line', color: 'bg-primary-100 text-primary-600' },
      { action: 'Dossier créé', auteur: 'JL Karemamana', date: '02/05/2026 - 09:00', icon: 'ri-add-circle-line', color: 'bg-secondary-100 text-secondary-600' },
    ],
    notes: 'Dossier refusé pour documents non conformes. Diplôme et relevés non certifiés. Paiement également échoué.',
  },
  '6': {
    id: 'DOS-2026-006',
    nom: 'Binga',
    prenom: 'Jehu',
    email: 'jehubinga@gmail.com',
    telephone: '+237 6 89 89 36 08',
    dateNaissance: '30/04/2001',
    lieuNaissance: 'Bangui',
    nationalite: 'Centrafricaine',
    genre: 'M',
    adresse: 'Quartier Olembé, Yaoundé',
    formation: 'Master en Génie Civil',
    specialite: 'Génie des Structures',
    niveau: 'Master',
    anneeAcademique: '2026-2027',
    statut: 'en_attente_paiement',
    dateCreation: '01/06/2026',
    dateMiseAJour: '03/06/2026',
    documents: [
      { type: 'Photo d\'identité', nom: 'photo-binga.jpg', statut: 'valide', date: '02/06/2026' },
      { type: 'Pièce d\'identité (CNI)', nom: 'cni-binga.pdf', statut: 'valide', date: '02/06/2026' },
      { type: 'Diplôme de Licence', nom: 'licence-binga.pdf', statut: 'valide', date: '03/06/2026' },
      { type: 'Relevés de notes', nom: '', statut: 'en_attente' },
    ],
    paiement: {
      statut: 'en_attente',
      montant: 75000,
    },
    historique: [
      { action: 'Dossier passé en attente de paiement', auteur: 'Système', date: '03/06/2026 - 11:00', icon: 'ri-time-line', color: 'bg-amber-100 text-amber-600' },
      { action: 'Diplôme de Licence validé', auteur: 'Admin PKFokam', date: '03/06/2026 - 10:45', icon: 'ri-check-line', color: 'bg-emerald-100 text-emerald-600' },
      { action: 'Dossier créé', auteur: 'Jehu Binga', date: '01/06/2026 - 15:20', icon: 'ri-add-circle-line', color: 'bg-secondary-100 text-secondary-600' },
    ],
    notes: 'Dossier presque complet. Manque les relevés de notes. En attente de paiement.',
  },
};

const statutWorkflowLabels: Record<string, string> = {
  brouillon: 'Brouillon',
  en_attente: 'En attente',
  en_cours_validation: 'En cours de validation',
  validee_scolarite: 'Validée scolarité',
  validee_finance: 'Validée finance',
  en_attente_paiement: 'En attente de paiement',
  payee: 'Payée',
  refusee: 'Refusée',
};

const workflowSteps = [
  { key: 'en_attente', label: 'En attente', icon: 'ri-time-line' },
  { key: 'en_cours_validation', label: 'Validation', icon: 'ri-search-eye-line' },
  { key: 'en_attente_paiement', label: 'Paiement', icon: 'ri-bank-card-line' },
  { key: 'payee', label: 'Payé', icon: 'ri-check-line' },
  { key: 'validee_scolarite', label: 'Validé', icon: 'ri-verified-badge-line' },
];

const statutConfig: Record<string, { label: string; className: string }> = {
  en_cours_validation: { label: 'En validation', className: 'bg-blue-100 text-blue-700' },
  payee: { label: 'Payée', className: 'bg-emerald-100 text-emerald-700' },
  en_attente: { label: 'En attente', className: 'bg-amber-100 text-amber-700' },
  validee_scolarite: { label: 'Validée', className: 'bg-primary-100 text-primary-700' },
  refusee: { label: 'Refusée', className: 'bg-primary-100 text-primary-700' },
  en_attente_paiement: { label: 'Paiement', className: 'bg-orange-100 text-orange-700' },
};

function StatutBadge({ statut }: { statut: string }) {
  const c = statutConfig[statut] || { label: statut, className: 'bg-secondary-100 text-secondary-700' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold font-label whitespace-nowrap ${c.className}`}>
      {c.label}
    </span>
  );
}

function DocBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; className: string; icon: string }> = {
    valide: { label: 'Validé', className: 'text-emerald-600 bg-emerald-50', icon: 'ri-check-line' },
    en_attente: { label: 'En attente', className: 'text-amber-600 bg-amber-50', icon: 'ri-time-line' },
    refuse: { label: 'Refusé', className: 'text-primary-600 bg-primary-50', icon: 'ri-close-line' },
    manquant: { label: 'Manquant', className: 'text-foreground-400 bg-background-100', icon: 'ri-subtract-line' },
  };
  const c = config[statut] || config.manquant;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium font-label ${c.className}`}>
      <i className={`${c.icon} w-3 h-3 flex items-center justify-center`}></i>
      {c.label}
    </span>
  );
}

export default function AdminDossierDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addNotification, addToast } = useNotifications();

  const [dossierApi, setDossierApi] = useState<import('@/api/types').InscriptionResponse | null>(null);
  const [documents, setDocuments]   = useState<import('@/api/types').DocumentResponse[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [actionNote, setActionNote]   = useState('');
  const [currentStatut, setCurrentStatut] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isLoading) return;
    Promise.all([
      import('@/api/inscriptions').then(({ inscriptionsApi }) => inscriptionsApi.lister({ size: 200 })),
    ]).then(([paged]) => {
      const found = paged.content.find(d => d.id === id) || null;
      setDossierApi(found);
      if (found) {
        import('@/api/documents').then(({ documentsApi }) =>
          documentsApi.byInscription(id).then(setDocuments).catch(() => setDocuments([]))
        );
      }
    }).catch(() => setDossierApi(null))
      .finally(() => setFetchLoading(false));
  }, [id, isLoading]);

  if (isLoading || fetchLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/connexion" replace />;
  }

  if (!dossierApi) {
    return (
      <DashboardLayout navItems={adminNavItems} title="Dossier introuvable" subtitle="Le dossier demandé n'existe pas">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <i className="ri-file-unknow-line text-primary-500 text-3xl w-10 h-10 flex items-center justify-center"></i>
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground-950 mb-3">Dossier introuvable</h2>
          <p className="text-foreground-500 text-sm font-body mb-6">Ce dossier n&apos;existe pas ou vous n&apos;avez pas les droits.</p>
          <Link to="/admin/dossiers" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all whitespace-nowrap font-label">
            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
            Retour aux dossiers
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Adaptateur : mappe InscriptionResponse → forme attendue par le rendu
  const dossier = {
    id:               dossierApi.numeroReference,
    nom:              (dossierApi.candidatNom || '').split(' ').slice(1).join(' ') || dossierApi.candidatNom || '',
    prenom:           (dossierApi.candidatNom || '').split(' ')[0] || '',
    email:            '',
    telephone:        dossierApi.telephone || '',
    dateNaissance:    dossierApi.dateNaissance || '',
    lieuNaissance:    '',
    nationalite:      dossierApi.nationalite || '',
    genre:            dossierApi.sexe === 'FEMININ' ? 'F' as const : 'M' as const,
    adresse:          dossierApi.adresse || '',
    formation:        dossierApi.formationNom || '',
    specialite:       dossierApi.formationCode || '',
    niveau:           '',
    anneeAcademique:  dossierApi.anneeAcademique || '',
    statut:           dossierApi.statut,
    dateCreation:     dossierApi.dateCreation ? new Date(dossierApi.dateCreation).toLocaleDateString('fr-FR') : '',
    dateMiseAJour:    dossierApi.dateSoumission ? new Date(dossierApi.dateSoumission).toLocaleDateString('fr-FR') : '',
    documents:        documents.map(doc => ({
      type:    doc.typeDocument,
      nom:     doc.nomOriginal,
      statut:  (doc.statut === 'VALIDE' ? 'valide' : doc.statut === 'REJETE' ? 'refuse' : 'en_attente') as 'valide' | 'en_attente' | 'refuse' | 'manquant',
      date:    doc.dateUpload ? new Date(doc.dateUpload).toLocaleDateString('fr-FR') : '',
      id:      doc.id,
    })),
    paiement:         { statut: 'inconnu', montant: 0 },
    historique:       [] as { action: string; auteur: string; date: string; icon: string; color: string }[],
    notes:            '',
  };

  const workflowIndex = workflowSteps.findIndex((w) => w.key === dossier.statut);
  const isRefused = dossier.statut === 'REJETE';
  const isFinalState = dossier.statut === 'APPROUVE';

  const handleAction = (action: string) => {
    setActionModal(action);
    setActionNote('');
    if (action === 'valider')  setCurrentStatut('APPROUVE');
    else if (action === 'refuser')  setCurrentStatut('REJETE');
    else if (action === 'demander') setCurrentStatut('EN_ATTENTE_COMPLEMENT');
    else if (action === 'valider_docs') setCurrentStatut('DOCS_VALIDES');
  };

  const executeAction = async () => {
    if (!currentStatut) return;
    setActionLoading(true);
    try {
      const actionMap: Record<string, string> = {
        APPROUVE:              'APPROUVER',
        REJETE:                'REJETER',
        EN_ATTENTE_COMPLEMENT: 'DEMANDER_COMPLEMENT',
        DOCS_VALIDES:          'VALIDER_DOCS',
      };
      await import('@/api/inscriptions').then(({ inscriptionsApi }) =>
        inscriptionsApi.transition(dossierApi.id, { action: actionMap[currentStatut] || currentStatut, motif: actionNote || undefined })
      );
      setActionModal(null);
      const labels: Record<string, string> = {
        APPROUVE: 'approuvé', REJETE: 'refusé', EN_ATTENTE_COMPLEMENT: 'en attente de complément', DOCS_VALIDES: 'documents validés',
      };
      const label = labels[currentStatut] || currentStatut;
      addNotification(`Dossier ${dossier.id} ${label} — ${dossier.prenom} ${dossier.nom}`, currentStatut === 'APPROUVE' ? 'success' : currentStatut === 'REJETE' ? 'error' : 'warning');
      addToast(`Dossier ${label} : ${dossier.prenom} ${dossier.nom}`, currentStatut === 'APPROUVE' ? 'success' : currentStatut === 'REJETE' ? 'error' : 'warning');
      setSuccessMessage(`Statut mis à jour : ${label}`);
      setDossierApi(prev => prev ? { ...prev, statut: currentStatut as typeof prev.statut } : prev);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      addToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleValidateDoc = async (docId: string, statut: 'VALIDE' | 'REJETE', motif?: string) => {
    try {
      const { documentsApi } = await import('@/api/documents');
      const updated = await documentsApi.valider(docId, { statut, motifRejet: motif });
      setDocuments(prev => prev.map(d => d.id === docId ? updated : d));
      addToast(statut === 'VALIDE' ? 'Document validé' : 'Document refusé', statut === 'VALIDE' ? 'success' : 'error');
    } catch {
      addToast('Erreur lors de la validation du document', 'error');
    }
  };

  const isActionDisabled = isRefused || isFinalState;

  return (
    <DashboardLayout navItems={adminNavItems} title={`Dossier ${dossier.id}`} subtitle={`${dossier.prenom} ${dossier.nom} — ${dossier.formation}`}>
      {/* Success Toast */}
      {successMessage && (
        <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium font-body flex items-center gap-3 animate-pulse ${
          currentStatut === 'validee_scolarite' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          currentStatut === 'refusee' ? 'bg-primary-50 text-primary-700 border border-primary-200' :
          'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          <i className={`w-5 h-5 flex items-center justify-center ${
            currentStatut === 'validee_scolarite' ? 'ri-check-double-line' :
            currentStatut === 'refusee' ? 'ri-close-circle-line' :
            'ri-information-line'
          }`}></i>
          {successMessage}
        </div>
      )}

      {/* Top Bar: Back + Statut + Actions */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dossiers"
            className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-heading text-foreground-950">{dossier.prenom} {dossier.nom}</h2>
              <StatutBadge statut={dossier.statut} />
            </div>
            <p className="text-xs text-foreground-500 font-body mt-0.5">{dossier.id} — Créé le {dossier.dateCreation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isActionDisabled && (
            <>
              <button
                onClick={() => handleAction('demander')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer font-label whitespace-nowrap"
                title="Demander des compléments"
              >
                <i className="ri-file-edit-line w-3.5 h-3.5 flex items-center justify-center"></i>
                Compléments
              </button>
              <button
                onClick={() => handleAction('refuser')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-50 text-primary-600 text-xs font-semibold hover:bg-primary-100 transition-colors cursor-pointer font-label whitespace-nowrap"
              >
                <i className="ri-close-line w-3.5 h-3.5 flex items-center justify-center"></i>
                Refuser
              </button>
              <button
                onClick={() => handleAction('valider')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors cursor-pointer font-label whitespace-nowrap"
              >
                <i className="ri-check-line w-3.5 h-3.5 flex items-center justify-center"></i>
                Valider
              </button>
            </>
          )}
          {isFinalState && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-50 text-primary-600 text-xs font-semibold font-label">
              <i className="ri-verified-badge-line w-3.5 h-3.5 flex items-center justify-center"></i>
              Dossier finalisé
            </span>
          )}
          {isRefused && (
            <button
              onClick={() => handleAction('valider')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition-colors cursor-pointer font-label whitespace-nowrap"
            >
              <i className="ri-restart-line w-3.5 h-3.5 flex items-center justify-center"></i>
              Réexaminer
            </button>
          )}
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-6 mb-6">
        <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-6 font-label">Workflow de validation</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-background-200 z-0"></div>
          {workflowSteps.map((step, idx) => {
            const isCompleted = idx < workflowIndex;
            const isCurrent = idx === workflowIndex;
            const isSkipped = (!isCompleted && !isCurrent) && !isRefused;
            const stepClass = isRefused
              ? 'bg-primary-100 border-primary-300 text-primary-400'
              : isCompleted
              ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
              : isCurrent
              ? 'bg-primary-100 border-primary-300 text-primary-600 ring-4 ring-primary-50'
              : 'bg-background-100 border-background-200 text-foreground-300';

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${stepClass}`}>
                  {isCompleted && !isRefused ? (
                    <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                  ) : isRefused ? (
                    <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                  ) : (
                    <i className={`${step.icon} w-4 h-4 flex items-center justify-center`}></i>
                  )}
                </div>
                <span className={`text-[10px] font-semibold mt-2 text-center font-label ${
                  isRefused ? 'text-primary-400' :
                  isCompleted ? 'text-emerald-700' :
                  isCurrent ? 'text-primary-700' :
                  'text-foreground-300'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: Candidate Info + Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">
              <i className="ri-user-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
              Identité du candidat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-foreground-400 font-body">Nom complet</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.prenom} {dossier.nom}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Email</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.email}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Téléphone</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.telephone}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Genre</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.genre === 'M' ? 'Masculin' : 'Féminin'}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Date de naissance</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.dateNaissance}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Lieu de naissance</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.lieuNaissance}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Nationalité</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.nationalite}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Adresse</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.adresse}</p>
              </div>
            </div>
          </div>

          {/* Formation Card */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">
              <i className="ri-graduation-cap-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
              Formation choisie
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-foreground-400 font-body">Formation</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.formation}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Spécialité</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.specialite}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Niveau</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.niveau}</p>
              </div>
              <div>
                <span className="text-xs text-foreground-400 font-body">Année académique</span>
                <p className="text-sm font-semibold text-foreground-900 font-body mt-0.5">{dossier.anneeAcademique}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">
              <i className="ri-file-copy-2-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
              Documents fournis
            </h3>
            <div className="space-y-3">
              {dossier.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background-50 border border-background-100 hover:border-background-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.statut === 'valide' ? 'bg-emerald-100' :
                      doc.statut === 'refuse' ? 'bg-primary-100' :
                      doc.statut === 'en_attente' ? 'bg-amber-100' :
                      'bg-background-200'
                    }`}>
                      <i className={`${
                        doc.statut === 'manquant' ? 'ri-file-upload-line' : 'ri-file-text-line'
                      } ${
                        doc.statut === 'valide' ? 'text-emerald-600' :
                        doc.statut === 'refuse' ? 'text-primary-500' :
                        doc.statut === 'en_attente' ? 'text-amber-600' :
                        'text-foreground-400'
                      } w-5 h-5 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground-800 font-body">{doc.type}</p>
                      <p className="text-[11px] text-foreground-400 font-body mt-0.5">
                        {doc.nom || 'Aucun fichier'} {doc.date ? `— ${doc.date}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DocBadge statut={doc.statut} />
                    {doc.id && doc.statut !== 'manquant' && doc.statut !== 'valide' && (
                      <button
                        onClick={() => handleValidateDoc(doc.id!, 'VALIDE')}
                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer" title="Valider">
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    )}
                    {doc.id && doc.statut === 'en_attente' && (
                      <button
                        onClick={() => {
                          const motif = window.prompt('Motif de refus (optionnel) :') || undefined;
                          handleValidateDoc(doc.id!, 'REJETE', motif);
                        }}
                        className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center hover:bg-primary-100 transition-colors cursor-pointer" title="Refuser">
                        <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Paiement + Notes + History */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">
              <i className="ri-bank-card-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
              Paiement
            </h3>
            <div className="text-center py-2 mb-4">
              <div className="text-3xl font-bold font-heading text-foreground-950">
                {dossier.paiement.montant.toLocaleString('fr-FR')} <span className="text-lg text-foreground-400">FCFA</span>
              </div>
              <p className="text-xs text-foreground-500 font-body mt-1">Frais d&apos;inscription</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-500 font-body">Statut</span>
                <span className={`text-xs font-semibold font-label ${
                  dossier.paiement.statut === 'complete' ? 'text-emerald-600' :
                  dossier.paiement.statut === 'en_attente' ? 'text-amber-600' :
                  dossier.paiement.statut === 'echoue' ? 'text-primary-600' :
                  'text-foreground-400'
                }`}>
                  {dossier.paiement.statut === 'complete' ? 'Payé' :
                   dossier.paiement.statut === 'en_attente' ? 'En attente' :
                   dossier.paiement.statut === 'echoue' ? 'Échoué' :
                   'Non effectué'}
                </span>
              </div>
              {dossier.paiement.mode && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-500 font-body">Mode</span>
                  <span className="text-xs font-medium text-foreground-700 font-body">
                    {dossier.paiement.mode === 'carte' ? 'Carte bancaire' : dossier.paiement.mode === 'mobile' ? 'Mobile Money' : 'Virement'}
                  </span>
                </div>
              )}
              {dossier.paiement.date && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-500 font-body">Date</span>
                  <span className="text-xs font-medium text-foreground-700 font-body">{dossier.paiement.date}</span>
                </div>
              )}
              {dossier.paiement.reference && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-500 font-body">Réf. transaction</span>
                  <span className="text-xs font-mono font-medium text-foreground-700">{dossier.paiement.reference}</span>
                </div>
              )}
            </div>
            {dossier.paiement.statut === 'complete' && (
              <button className="mt-4 w-full py-2 rounded-xl bg-primary-50 text-primary-600 text-xs font-semibold hover:bg-primary-100 transition-colors cursor-pointer font-label">
                <i className="ri-download-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                Télécharger le reçu
              </button>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-4 font-label">
              <i className="ri-sticky-note-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
              Notes admin
            </h3>
            <textarea
              defaultValue={dossier.notes}
              rows={4}
              maxLength={500}
              placeholder="Ajouter une note interne..."
              className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 font-body resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
            ></textarea>
            <button className="mt-3 w-full py-2 rounded-xl bg-secondary-100 text-secondary-700 text-xs font-semibold hover:bg-secondary-200 transition-colors cursor-pointer font-label">
              Enregistrer la note
            </button>
          </div>

          {/* History Timeline */}
          <div className="bg-white rounded-2xl border border-background-200/70 p-6">
            <h3 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-5 font-label">
              <i className="ri-history-line w-4 h-4 inline-flex items-center justify-center mr-2"></i>
              Historique
            </h3>
            <div className="flex flex-col gap-4">
              {dossier.historique.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-background-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <i className={`${item.icon} w-4 h-4 flex items-center justify-center`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground-800 font-body">{item.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-foreground-500 font-body">{item.auteur}</span>
                      <span className="text-[11px] text-foreground-300">—</span>
                      <span className="text-[11px] text-foreground-400 font-body">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActionModal(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 z-10">
            <div className="text-center mb-5">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                actionModal === 'valider' ? 'bg-emerald-100' :
                actionModal === 'refuser' ? 'bg-primary-100' :
                'bg-amber-100'
              }`}>
                <i className={`w-6 h-6 flex items-center justify-center ${
                  actionModal === 'valider' ? 'ri-check-line text-emerald-600' :
                  actionModal === 'refuser' ? 'ri-close-line text-primary-600' :
                  'ri-file-edit-line text-amber-600'
                }`}></i>
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground-950">
                {actionModal === 'valider' ? 'Valider le dossier' :
                 actionModal === 'refuser' ? 'Refuser le dossier' :
                 'Demander des compléments'}
              </h3>
              <p className="text-sm text-foreground-500 font-body mt-1">
                {actionModal === 'valider' ? 'Confirmez la validation définitive de ce dossier.' :
                 actionModal === 'refuser' ? 'Cette action est irréversible. Le candidat sera notifié.' :
                 'Le candidat sera invité à fournir les documents manquants.'}
              </p>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium text-foreground-600 mb-1.5 font-body">Note (optionnelle)</label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder={
                  actionModal === 'valider' ? 'Exemple : Dossier complet et conforme. Bienvenue !' :
                  actionModal === 'refuser' ? 'Exemple : Documents non conformes. Relevés illisibles.' :
                  'Exemple : Merci de fournir votre certificat de naissance.'
                }
                className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-sm text-foreground-800 font-body resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              ></textarea>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActionModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-background-100 text-foreground-600 text-sm font-semibold hover:bg-background-200 transition-colors cursor-pointer font-label"
              >
                Annuler
              </button>
              <button
                onClick={executeAction}
                disabled={actionLoading}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors cursor-pointer font-label disabled:opacity-50 ${
                  actionModal === 'valider' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  actionModal === 'refuser' ? 'bg-primary-500 hover:bg-primary-600' :
                  'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {actionLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>
                    Traitement...
                  </span>
                ) : (
                  actionModal === 'valider' ? 'Confirmer la validation' :
                  actionModal === 'refuser' ? 'Confirmer le refus' :
                  'Envoyer la demande'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
