import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CandidatLayout from '@/components/layout/CandidatLayout';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  // Inscription et dossier
  {
    category: 'Inscription et dossier',
    question: 'Comment créer un dossier de candidature ?',
    answer: 'Rendez-vous dans la section "Inscription" depuis votre tableau de bord. Vous serez guidé à travers un parcours en 5 étapes : informations personnelles, formation souhaitée, téléversement des documents, paiement des frais et confirmation. Chaque étape doit être complétée avant de passer à la suivante.',
  },
  {
    category: 'Inscription et dossier',
    question: 'Quels sont les prérequis pour postuler ?',
    answer: 'Les prérequis varient selon la formation. Pour les Licences, le Baccalauréat ou équivalent est requis. Pour les Masters, une Licence dans le domaine correspondant. Pour les BTS, le Baccalauréat ou un diplôme équivalent est nécessaire. Consultez la page "Formations" pour les détails spécifiques à chaque programme.',
  },
  {
    category: 'Inscription et dossier',
    question: 'Puis-je modifier mon dossier après soumission ?',
    answer: 'Une fois votre dossier soumis et en cours de validation, vous ne pouvez plus le modifier directement. Si vous devez apporter des corrections, contactez l\'administration via la messagerie interne. Un administrateur pourra rouvrir votre dossier pour modification.',
  },
  {
    category: 'Inscription et dossier',
    question: 'Comment suivre l\'avancement de mon dossier ?',
    answer: 'Depuis votre tableau de bord, vous voyez en temps réel le statut de chaque étape : dossier reçu, en cours d\'analyse, documents validés, en attente de paiement, ou admission confirmée. Vous recevez également des notifications pour chaque changement de statut.',
  },
  {
    category: 'Inscription et dossier',
    question: 'Quelle est la date limite de dépôt des dossiers ?',
    answer: 'La date limite de dépôt des dossiers est fixée au 30 Juin. Nous vous recommandons vivement de ne pas attendre la dernière minute, car le traitement des dossiers peut prendre plusieurs jours, surtout en période de forte affluence.',
  },

  // Paiement
  {
    category: 'Paiement',
    question: 'Quels sont les modes de paiement acceptés ?',
    answer: 'Nous acceptons trois modes de paiement : la carte bancaire (Visa, Mastercard) via Stripe, le Mobile Money (Orange Money, MTN Mobile Money, Moov Money) et le virement bancaire. Les détails du virement vous seront communiqués lors du choix de cette option.',
  },
  {
    category: 'Paiement',
    question: 'Les frais d\'inscription sont-ils remboursables ?',
    answer: 'Les frais d\'inscription de 50 000 FCFA ne sont pas remboursables, sauf en cas d\'erreur de notre part (double prélèvement, dossier refusé pour raisons administratives internes). En cas de non-admission, les frais d\'inscription restent acquis à l\'établissement pour couvrir les frais de traitement du dossier.',
  },
  {
    category: 'Paiement',
    question: 'Puis-je payer en plusieurs fois ?',
    answer: 'Les frais d\'inscription doivent être payés en une seule fois. Cependant, les frais de scolarité annuels peuvent faire l\'objet d\'un échéancier de paiement. Contactez le service financier via la messagerie pour discuter des modalités.',
  },
  {
    category: 'Paiement',
    question: 'Comment obtenir un reçu de paiement ?',
    answer: 'Après chaque paiement réussi, vous êtes automatiquement redirigé vers une page de confirmation. Sur cette page, vous pouvez télécharger votre reçu de paiement au format PDF. Ce reçu contient toutes les informations : référence de transaction, montant, date et mode de paiement.',
  },
  {
    category: 'Paiement',
    question: 'Que faire si mon paiement échoue ?',
    answer: 'Si votre paiement échoue, vérifiez d\'abord que votre solde est suffisant et que votre banque autorise les paiements en ligne. Vous pouvez réessayer immédiatement. Si le problème persiste, essayez un autre mode de paiement ou contactez le support via la messagerie interne.',
  },

  // Documents
  {
    category: 'Documents',
    question: 'Quels documents dois-je fournir ?',
    answer: 'Les documents requis incluent : une copie de votre pièce d\'identité, vos relevés de notes ou diplômes précédents, une photo d\'identité récente, un curriculum vitae (pour les Masters), et une lettre de motivation. La liste exacte s\'affiche dans votre espace "Mes Documents".',
  },
  {
    category: 'Documents',
    question: 'Quel format de fichier est accepté ?',
    answer: 'Nous acceptons les formats PDF pour tous les documents. Pour les photos d\'identité, les formats JPG et PNG sont également acceptés. La taille maximale par fichier est de 10 Mo. Assurez-vous que vos documents sont lisibles et bien orientés.',
  },
  {
    category: 'Documents',
    question: 'Que faire si un document est refusé ?',
    answer: 'Lorsqu\'un document est refusé, vous recevez une notification avec le motif du refus (document illisible, expiré, mauvais format, etc.). Vous pouvez alors téléverser un nouveau document conforme. Le statut du document passera de "Refusé" à "En attente" après votre nouveau téléversement.',
  },
  {
    category: 'Documents',
    question: 'Mes documents sont-ils sécurisés ?',
    answer: 'Oui, tous vos documents sont stockés de manière sécurisée et chiffrée. Seuls les administrateurs habilités ont accès à vos documents pour le processus de validation. Vos documents ne sont jamais partagés avec des tiers sans votre consentement explicite.',
  },

  // Admission
  {
    category: 'Admission',
    question: 'Quand recevrai-je la décision d\'admission ?',
    answer: 'Les décisions d\'admission sont communiquées à partir du 15 Juillet. Vous recevrez une notification par email et sur la plateforme. Les résultats sont publiés par vagues successives, ne vous inquiétez pas si vous ne recevez pas de réponse immédiate.',
  },
  {
    category: 'Admission',
    question: 'Que faire après avoir été admis ?',
    answer: 'Félicitations ! Après votre admission, vous devez confirmer votre place en effectuant le paiement des frais de scolarité avant le 1er Août. Vous recevrez ensuite votre certificat d\'inscription définitive et les informations pour la rentrée (emploi du temps, livret d\'accueil, etc.).',
  },
  {
    category: 'Admission',
    question: 'Puis-je postuler à plusieurs formations ?',
    answer: 'Oui, vous pouvez postuler à plusieurs formations. Chaque candidature fait l\'objet d\'un dossier séparé avec ses propres frais d\'inscription. Vous devrez indiquer votre ordre de préférence lors de l\'inscription.',
  },

  // Compte et sécurité
  {
    category: 'Compte et sécurité',
    question: 'Comment réinitialiser mon mot de passe ?',
    answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié ?". Vous recevrez un email à l\'adresse associée à votre compte avec un lien de réinitialisation. Ce lien est valable 24 heures.',
  },
  {
    category: 'Compte et sécurité',
    question: 'Puis-je changer mon adresse email ?',
    answer: 'Oui, vous pouvez modifier votre adresse email depuis la section "Paramètres" de votre compte. Un email de confirmation sera envoyé à votre nouvelle adresse pour valider le changement.',
  },
  {
    category: 'Compte et sécurité',
    question: 'Comment supprimer mon compte ?',
    answer: 'Vous pouvez demander la suppression de votre compte depuis la section "Paramètres" > "Confidentialité". La suppression est définitive et entraîne l\'effacement de toutes vos données personnelles. Les dossiers en cours de traitement seront annulés.',
  },
  {
    category: 'Compte et sécurité',
    question: 'Mes données personnelles sont-elles protégées ?',
    answer: 'Absolument. Nous respectons le RGPD et la législation camerounaise sur la protection des données. Vos données ne sont utilisées que dans le cadre de votre inscription et ne sont jamais vendues à des tiers. Vous pouvez à tout moment demander une copie de vos données ou leur suppression.',
  },

  // Support technique
  {
    category: 'Support technique',
    question: 'Le site ne s\'affiche pas correctement, que faire ?',
    answer: 'Essayez d\'abord de rafraîchir la page (F5). Si le problème persiste, videz le cache de votre navigateur et vos cookies. Vérifiez que vous utilisez un navigateur récent (Chrome, Firefox, Edge). Si rien n\'y fait, contactez-nous via la messagerie en décrivant le problème (navigateur utilisé, capture d\'écran si possible).',
  },
  {
    category: 'Support technique',
    question: 'Comment contacter le support ?',
    answer: 'Le moyen le plus rapide est d\'utiliser la messagerie interne accessible depuis votre tableau de bord (icône enveloppe). Vous pouvez également nous envoyer un email à support@pkfokam.cm. Notre équipe répond dans un délai de 24 à 48 heures ouvrées.',
  },
  {
    category: 'Support technique',
    question: 'Puis-je utiliser la plateforme sur mobile ?',
    answer: 'Oui, la plateforme est entièrement responsive et s\'adapte à tous les écrans : ordinateur, tablette et smartphone. Vous pouvez suivre votre dossier, téléverser des documents et communiquer avec l\'administration depuis n\'importe quel appareil.',
  },
];

const categories = Array.from(new Set(faqData.map((item) => item.category)));

export default function CandidatFAQ() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFaqs = useMemo(() => {
    let result = faqData;
    if (activeCategory) {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }
    return result;
  }, [searchQuery, activeCategory]);

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

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== null || searchQuery.trim() !== '';

  return (
    <CandidatLayout title="Aide & FAQ" subtitle="Trouvez des réponses à vos questions">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero search */}
        <div className="bg-gradient-to-br from-primary-500/5 to-primary-500/10 rounded-2xl border border-primary-200/30 p-8 md:p-10">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <i className="ri-question-answer-line text-2xl text-primary-600 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground-950 font-heading mb-2">
              Comment pouvons-nous vous aider ?
            </h2>
            <p className="text-sm text-foreground-500 font-body max-w-md mx-auto">
              Recherchez parmi les questions fréquemment posées ou parcourez les catégories ci-dessous.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full pl-11 pr-12 py-3 rounded-xl bg-white border border-background-200 text-sm text-foreground-900 placeholder:text-foreground-400 font-body focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background-200 flex items-center justify-center text-foreground-400 hover:text-foreground-600 cursor-pointer"
              >
                <i className="ri-close-line text-[10px] w-3 h-3 flex items-center justify-center"></i>
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap font-label ${
              activeCategory === null
                ? 'bg-primary-500 text-white'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200'
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap font-label ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-background-100 text-foreground-600 hover:bg-background-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-background-100 flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-eye-line text-2xl text-foreground-300 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <h3 className="text-base font-semibold text-foreground-700 font-heading mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-sm text-foreground-500 font-body mb-4">
              Essayez avec d&apos;autres mots-clés ou parcourez les catégories.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {hasActiveFilters && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-foreground-500 font-body">
                  {filteredFaqs.length} résultat{filteredFaqs.length > 1 ? 's' : ''} trouvé{filteredFaqs.length > 1 ? 's' : ''}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 font-medium hover:text-primary-700 cursor-pointer font-label"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
            {filteredFaqs.map((item, idx) => {
              const isExpanded = expandedItems.has(idx);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-background-200/70 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleItem(idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isExpanded ? 'bg-primary-100 text-primary-600' : 'bg-background-100 text-foreground-400 group-hover:bg-primary-50 group-hover:text-primary-500'
                      }`}>
                        <i className={`${isExpanded ? 'ri-question-answer-line' : 'ri-question-line'} w-4 h-4 flex items-center justify-center`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md font-label">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground-800 font-heading leading-snug">
                          {item.question}
                        </p>
                      </div>
                    </div>
                    <i className={`ri-arrow-down-s-line text-foreground-400 transition-transform duration-300 w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}></i>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 pb-5">
                      <div className="h-px bg-background-100 mb-4"></div>
                      <p className="text-sm text-foreground-600 font-body leading-relaxed pl-12">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact help */}
        {filteredFaqs.length > 0 && (
          <div className="bg-secondary-50 rounded-2xl border border-secondary-200/70 p-6 md:p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center mx-auto mb-4">
              <i className="ri-customer-service-2-line text-xl text-secondary-600 w-5 h-5 flex items-center justify-center"></i>
            </div>
            <h3 className="text-base font-semibold text-foreground-800 font-heading mb-2">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h3>
            <p className="text-sm text-foreground-500 font-body mb-5 max-w-md mx-auto">
              Notre équipe est là pour vous aider. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
            </p>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/candidat/messages')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
              >
                <i className="ri-mail-send-line w-4 h-4 flex items-center justify-center"></i>
                Contacter le support
              </button>
            ) : (
              <button
                onClick={() => navigate('/connexion')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
              >
                <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                Connectez-vous pour contacter le support
              </button>
            )}
          </div>
        )}
      </div>
    </CandidatLayout>
  );
}