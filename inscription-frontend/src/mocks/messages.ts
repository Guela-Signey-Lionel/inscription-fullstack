export interface Message {
  id: string;
  sender: 'admin' | 'candidat';
  text: string;
  date: string;
  lu: boolean;
  pieceJointe?: string;
}

export interface ConversationThread {
  id: string;
  candidatId: string;
  candidatNom: string;
  candidatPrenom: string;
  candidatAvatar: string;
  dossierId: string;
  formation: string;
  objet: string;
  derniereDate: string;
  nonLu: number;
  statut: 'actif' | 'resolu' | 'ferme';
  messages: Message[];
}

export const mockConversations: ConversationThread[] = [
  {
    id: 'conv-001',
    candidatId: 'candidat-001',
    candidatNom: 'Begoto',
    candidatPrenom: 'Prince',
    candidatAvatar: 'BP',
    dossierId: 'DOS-2026-001',
    formation: 'Licence Info - GL',
    objet: 'Relevés de notes illisibles',
    derniereDate: '10/06/2026 14:22',
    nonLu: 0,
    statut: 'actif',
    messages: [
      { id: 'msg-001', sender: 'admin', text: "Bonjour M. Prince, nous avons examiné votre dossier. Malheureusement, les relevés de notes que vous avez soumis sont de mauvaise qualité et illisibles. Pourriez-vous les numériser à nouveau en haute résolution ? Merci.", date: '07/06/2026 16:48', lu: true },
      { id: 'msg-002', sender: 'candidat', text: "Bonjour, merci de m'avoir informé. Je vais refaire la numérisation et vous les renvoyer dans la journée. Désolé pour ce désagrément.", date: '08/06/2026 09:15', lu: true },
      { id: 'msg-003', sender: 'admin', text: "Pas de souci, prenez votre temps. Une fois les nouveaux relevés téléchargés, le processus de validation reprendra immédiatement.", date: '08/06/2026 09:30', lu: true },
      { id: 'msg-004', sender: 'candidat', text: "Voici les nouveaux relevés de notes en pièce jointe. J'espère que la qualité est suffisante cette fois.", date: '10/06/2026 14:22', lu: true, pieceJointe: 'releves-dupont-v2.pdf' },
    ],
  },
  {
    id: 'conv-002',
    candidatId: 'candidat-001',
    candidatNom: 'Begoto',
    candidatPrenom: 'Prince',
    candidatAvatar: 'BP',
    dossierId: 'DOS-2026-001',
    formation: 'Licence Info - GL',
    objet: 'Confirmation de votre inscription 2026-2027',
    derniereDate: '05/06/2026 11:00',
    nonLu: 1,
    statut: 'actif',
    messages: [
      { id: 'msg-005', sender: 'admin', text: "Félicitations M. Prince ! Votre dossier progresse bien. Nous vous confirmons que votre inscription pour l'année académique 2026-2027 en Licence Informatique - Génie Logiciel est en bonne voie. Il ne manque plus que les relevés de notes et le paiement des frais.", date: '05/06/2026 10:45', lu: true },
      { id: 'msg-006', sender: 'admin', text: "Petit rappel : la date limite de dépôt complet du dossier est fixée au 15 juillet 2026. N'attendez pas le dernier moment !", date: '05/06/2026 11:00', lu: false },
    ],
  },
  {
    id: 'conv-003',
    candidatId: 'candidat-002',
    candidatNom: 'Zaninka',
    candidatPrenom: 'Rose',
    candidatAvatar: 'ZR',
    dossierId: 'DOS-2026-002',
    formation: 'Master Biotech',
    objet: 'Validation finale de votre dossier',
    derniereDate: '01/06/2026 08:30',
    nonLu: 0,
    statut: 'resolu',
    messages: [
      { id: 'msg-007', sender: 'admin', text: "Bonjour Mme Rose, excellente nouvelle ! Votre dossier a été entièrement validé et votre paiement confirmé. Vous êtes officiellement inscrite au Master en Biotechnologie pour l'année 2026-2027. La rentrée est prévue le 15 septembre 2026.", date: '01/06/2026 08:30', lu: true },
      { id: 'msg-008', sender: 'candidat', text: "Merci beaucoup ! Je suis ravie. J'attends la rentrée avec impatience. Y a-t-il des documents supplémentaires à prévoir avant la rentrée ?", date: '01/06/2026 09:00', lu: true },
      { id: 'msg-009', sender: 'admin', text: "Non, tout est en ordre. Vous recevrez par email votre carte d'étudiante et le calendrier académique une semaine avant la rentrée. Bienvenue à PKFokam !", date: '01/06/2026 09:15', lu: true },
    ],
  },
];