// ============================================================
// Types partagés — alignés avec les DTOs Spring Boot
// ============================================================

// ---- Authentification ----
export interface LoginRequest {
  email: string;
  motDePasse: string;       // Spring attend "motDePasse"
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  utilisateur: UserInfo;
}

export interface UserInfo {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'CANDIDAT' | 'AGENT_SCOLARITE' | 'AGENT_FINANCIER' | 'SUPER_ADMIN';
}

// Role normalisé pour le frontend
export type FrontendRole = 'admin' | 'candidat';

export function toFrontendRole(role: UserInfo['role']): FrontendRole {
  return role === 'CANDIDAT' ? 'candidat' : 'admin';
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: FrontendRole;
  backendRole: UserInfo['role'];
  actif?: boolean;
  avatarUrl?: string;
  dateCreation?: string;
}

// ---- OTP ----
export interface VerifyOtpRequest {
  email: string;
  code: string;
}

// ---- Profil ----
export interface UpdateProfilRequest {
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

// ---- Formations ----
export interface Formation {
  id: string;
  nom: string;
  code: string;
  filiere: string;
  niveau: string;
  placesDisponibles: number;
  placesTotal: number;
  fraisInscription: number;
  prerequis?: string;
  description?: string;
  actif: boolean;
}

// ---- Dossiers / Inscriptions ----
export type DossierStatut =
  | 'BROUILLON'
  | 'SOUMIS'
  | 'EN_VALIDATION_DOC'
  | 'DOCS_VALIDES'
  | 'EN_VALIDATION_FIN'
  | 'APPROUVE'
  | 'REJETE'
  | 'EN_ATTENTE_COMPLEMENT'
  | 'EXPIRE';

export interface InscriptionResponse {
  id: string;
  numeroReference: string;
  candidatId: string;
  candidatNom: string;
  formationNom: string | null;
  formationCode: string | null;
  statut: DossierStatut;
  typeInscription: string | null;
  anneeAcademique: string | null;
  dateNaissance: string | null;
  sexe: string | null;
  nationalite: string | null;
  telephone: string | null;
  adresse: string | null;
  emailVerifie: boolean;
  dateCreation: string;
  dateSoumission: string | null;
}

export interface CreateInscriptionRequest {
  typeInscription: string;
  anneeAcademique: string;
}

export interface UpdateInscriptionRequest {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  sexe?: string;
  nationalite?: string;
  telephone?: string;
  adresse?: string;
  formationId?: string;
  typeInscription?: string;
  anneeAcademique?: string;
}

export interface TransitionRequest {
  action: string;
  motif?: string;
}

export interface SuiviPublicResponse {
  numeroReference: string;
  statut: DossierStatut;
  dateCreation: string;
  dateSoumission: string | null;
  formationNom: string | null;
}

// ---- Documents ----
export type DocumentStatut = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
export type TypeDocument = 'CNI_PASSEPORT' | 'DIPLOME' | 'RELEVE_NOTES' | 'PHOTO_IDENTITE' | 'AUTRE';

export interface DocumentResponse {
  id: string;
  inscriptionId: string;
  typeDocument: TypeDocument;
  nomOriginal: string;
  nomStockage: string;
  mimeType: string;
  taille: number;
  statut: DocumentStatut;
  motifRejet: string | null;
  validateurId: string | null;
  dateUpload: string;
  dateValidation: string | null;
}

export interface ValiderDocumentRequest {
  statut: 'VALIDE' | 'REJETE';
  motifRejet?: string;
}

// ---- Paiement ----
export interface CreatePaymentIntentRequest {
  inscriptionId: string;
  montant: number;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  montant: number;
  devise: string;
}

export interface PaiementResponse {
  id: string;
  inscriptionId: string;
  stripePaymentIntentId: string;
  montant: number;
  devise: string;
  statut: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  dateConfirmation: string | null;
  dateCreation: string;
}

// ---- Messages ----
export interface MessageResponse {
  id: string;
  expediteurRole: 'admin' | 'candidat';
  contenu: string;
  pieceJointeUrl: string | null;
  pieceJointeNom: string | null;
  lu: boolean;
  dateEnvoi: string;
}

export interface ConversationSummary {
  id: string;
  candidatId: string;
  candidatNom: string;
  candidatPrenom: string;
  inscriptionId: string | null;
  formation: string;
  objet: string;
  derniereDate: string;
  nonLu: number;
  statut: 'actif' | 'resolu' | 'ferme';
  dernierMessage: MessageResponse | null;
}

export interface ConversationDetail {
  id: string;
  candidatId: string;
  candidatNom: string;
  candidatPrenom: string;
  inscriptionId: string | null;
  formation: string;
  objet: string;
  statut: 'actif' | 'resolu' | 'ferme';
  dateCreation: string;
  messages: MessageResponse[];
}

export interface EnvoyerMessageRequest {
  conversationId: string;
  contenu: string;
  pieceJointeUrl?: string;
  pieceJointeNom?: string;
}

export interface CreerConversationRequest {
  inscriptionId?: string;
  objet: string;
  premierMessage: string;
}

// ---- Admin Stats ----
export interface StatsResponse {
  total: number;
  brouillons: number;
  soumis: number;
  enValidation: number;
  approuves: number;
  rejetes: number;
  expires: number;
}

// ---- Pagination ----
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ---- Erreurs ----
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
}
