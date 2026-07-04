export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'candidat';
  avatarUrl?: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface CandidatDossier {
  id: string;
  statut: 'brouillon' | 'en_attente' | 'en_cours_validation' | 'validee_scolarite' | 'validee_finance' | 'en_attente_paiement' | 'payee' | 'refusee';
  formation: string;
  etapeCourante: number;
  dateCreation: string;
  dateMiseAJour: string;
  progression: number;
  documents: {
    type: string;
    statut: 'manquant' | 'en_attente' | 'valide' | 'refuse';
    nom?: string;
  }[];
  paiement: {
    statut: 'non_effectue' | 'en_attente' | 'complete' | 'echoue';
    montant: number;
    date?: string;
  };
}

export const adminCredentials: AdminCredentials = {
  email: 'signeylguela@gmail.com',
  password: 'Admin@1234',
};

export const mockCandidats: User[] = [
  {
    id: 'candidat-001',
    email: 'begotostofil@gmail.com',
    nom: 'Begoto',
    prenom: 'Stofil',
    role: 'candidat',
    avatarUrl: 'public/images/prince.png',
  },
  {
    id: 'candidat-002',
    email: 'zaninkarose76@gmail.com',
    nom: 'Zaninka',
    prenom: 'Rosee',
    role: 'candidat',
    avatarUrl: 'public/images/rose.png',
  },
];

export const mockAdmin: User = {
  id: 'admin-001',
  email: 'signeylguela@gmail.com',
  nom: 'Guela',
  prenom: 'Signey',
  role: 'admin',
  avatarUrl: 'public/images/Sig.jpg',
};

export const mockDossiers: Record<string, CandidatDossier> = {
  'candidat-001': {
    id: 'dossier-001',
    statut: 'en_cours_validation',
    formation: 'Licence en Informatique - Génie Logiciel',
    etapeCourante: 3,
    dateCreation: '2026-05-15',
    dateMiseAJour: '2026-06-08',
    progression: 60,
    documents: [
      { type: 'Pièce d\'identité', statut: 'valide', nom: 'cni-begoto.pdf' },
      { type: 'Diplôme du Baccalauréat', statut: 'valide', nom: 'bac-begoto.pdf' },
      { type: 'Photo d\'identité', statut: 'en_attente', nom: 'photo-begoto.jpg' },
      { type: 'Relevés de notes', statut: 'manquant' },
    ],
    paiement: {
      statut: 'non_effectue',
      montant: 50000,
    },
  },
  'candidat-002': {
    id: 'dossier-002',
    statut: 'payee',
    formation: 'Master en Biotechnologie',
    etapeCourante: 5,
    dateCreation: '2026-04-20',
    dateMiseAJour: '2026-06-01',
    progression: 100,
    documents: [
      { type: 'Pièce d\'identité', statut: 'valide', nom: 'cni-zaninka.pdf' },
      { type: 'Diplôme de Licence', statut: 'valide', nom: 'licence-zaninka.pdf' },
      { type: 'Photo d\'identité', statut: 'valide', nom: 'photo-zaninka.jpg' },
      { type: 'Relevés de notes', statut: 'valide', nom: 'releves-zaninka.pdf' },
    ],
    paiement: {
      statut: 'complete',
      montant: 75000,
      date: '2026-05-28',
    },
  },
};