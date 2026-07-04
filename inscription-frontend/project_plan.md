# Plateforme d'Inscription Scolaire

## 1. Description du Projet
**Positionnement** : Plateforme web de digitalisation complète du processus d'inscription pour les établissements scolaires et universitaires.

**Utilisateurs cibles** :
- Candidats (étudiants/familles) qui souhaitent s'inscrire en ligne
- Administrateurs (scolarité, service financier) qui valident les dossiers

**Valeur ajoutée** : Remplacer les processus papier/email par un parcours 100% digital, traçable et automatisé, avec wizard guidé, validation documentaire automatique, paiement en ligne et tableau de bord administratif.

## 2. Structure des Pages

### Pages Publiques (accessibles sans authentification)
- `/` - Landing page (présentation, avantages, témoignages, services candidat)
- `/connexion` - Portail de connexion candidat (email, Google, Microsoft)
- `/connexion-admin` - Portail de connexion administrateur
- `/inscription-compte` - Création de compte candidat
- `/candidat/formations` - Catalogue des formations
- `/candidat/inscription` - Wizard d'inscription en 5 étapes avec checkout Stripe mocké
- `/candidat/documents` - Gestion des documents (téléversement, statuts)
- `/candidat/parametres` - Paramètres (notifications, affichage, confidentialité)
- `/candidat/faq` - Aide & FAQ

### Parcours Candidat (protégé - nécessite authentification)
- `/candidat/tableau-de-bord` - Tableau de bord candidat (suivi du dossier)
- `/candidat/profil` - Profil candidat (infos personnelles, mot de passe, 2FA)
- `/candidat/messages` - Messagerie interne candidat↔admin
- `/candidat/paiement/succes` - Paiement réussi
- `/candidat/paiement/echec` - Paiement échoué

### Administration (protégé - nécessite authentification)
- `/admin/tableau-de-bord` - Dashboard analytique temps réel
- `/admin/dossiers` - Gestion des dossiers candidats
- `/admin/dossiers/:id` - Détail d'un dossier
- `/admin/messages` - Messagerie admin↔candidats
- `/admin/statistiques` - Statistiques détaillées
- `/admin/parametres` - Configuration plateforme
- `/admin/profil` - Profil administrateur

### Sélecteur de rôle dans la Navbar
- La barre de navigation affiche un sélecteur "Étudiant | Administrateur"
- "Étudiant" → `/connexion` (identifiants démo : jean.dupont@email.fr / Candidat@123)
- "Administrateur" → `/connexion-admin` (identifiants démo : admin@pkfokam.cm / Admin@1234)

## 3. Fonctionnalités Clés
- [ ] Landing page avec présentation du processus
- [ ] Authentification multi-méthodes (email, Google, Microsoft)
- [ ] Wizard d'inscription 5 étapes avec React Hook Form + Zod
- [ ] Sauvegarde automatique du formulaire
- [ ] Upload et validation de documents (format, taille, type MIME)
- [ ] Paiement en ligne Stripe avec reçu PDF
- [ ] Workflow de validation administrative (7 états)
- [ ] Notifications email transactionnelles
- [ ] Tableau de bord admin avec statistiques
- [ ] Export massif Excel/CSV
- [ ] CAPTCHA et sécurité

## 4. Modèle de Données (Supabase)

### Table: candidats
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| email | text | Email du candidat |
| nom | text | Nom de famille |
| prenom | text | Prénom |
| telephone | text | Numéro de téléphone |
| date_naissance | date | Date de naissance |
| adresse | text | Adresse postale |
| auth_provider | text | email/google/microsoft |
| created_at | timestamptz | Date de création |

### Table: inscriptions
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| candidat_id | uuid | FK → candidats.id |
| formation_id | uuid | FK → formations.id |
| etat | text | brouillon/en_attente/en_cours_validation/validee_scolarite/validee_finance/en_attente_paiement/payee/refusee |
| etape_courante | int | Étape actuelle (1-5) |
| donnees_formulaire | jsonb | Données sauvegardées du formulaire |
| created_at | timestamptz | Date de création |
| updated_at | timestamptz | Dernière modification |

### Table: formations
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| nom | text | Nom de la formation |
| description | text | Description |
| niveau | text | Licence, Master, etc. |
| frais_inscription | decimal | Montant des frais |
| places_disponibles | int | Nombre de places restantes |

### Table: documents
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| inscription_id | uuid | FK → inscriptions.id |
| type_document | text | Type (diplome, identite, photo, etc.) |
| nom_fichier | text | Nom original |
| url_stockage | text | URL Supabase Storage |
| statut_validation | text | en_attente/valide/refuse |
| motif_refus | text | Raison du refus |
| created_at | timestamptz | Date d'upload |

### Table: paiements
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| inscription_id | uuid | FK → inscriptions.id |
| montant | decimal | Montant payé |
| stripe_session_id | text | ID session Stripe |
| statut | text | en_attente/reussi/echoue/rembourse |
| recu_url | text | URL du reçu PDF |
| created_at | timestamptz | Date du paiement |

### Table: logs_activite
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Identifiant unique |
| utilisateur_id | uuid | FK → candidats ou admin |
| action | text | Action effectuée |
| details | jsonb | Détails |
| ip | text | Adresse IP |
| created_at | timestamptz | Timestamp |

## 5. Plan d'Intégration Backend/Tiers
- **Supabase** : Authentification, base de données, stockage documents, edge functions
- **Stripe** : Paiement en ligne des frais d'inscription
- **Services externes** : API OCR (optionnel), Email (via Edge Functions + MJML)

## 6. Plan de Développement par Phases

### Phase 1 : Landing Page & Pages Publiques
- **Objectif** : Créer la landing page complète avec navigation, sections informatives et portail de connexion
- **Livrable** : Landing page responsive, page de connexion, squelette des pages publiques
- **Sans Supabase** : UI uniquement, mock data

### Phase 2 : Authentification & Espace Candidat
- **Objectif** : Mettre en place l'authentification et le tableau de bord candidat
- **Livrable** : Système d'auth complet, tableau de bord candidat avec suivi
- **Avec Supabase** : Auth + tables utilisateurs

### Phase 3 : Wizard d'Inscription (Étapes 1-3)
- **Objectif** : Créer les 3 premières étapes du wizard
- **Livrable** : Formulaire info perso, choix formation, upload documents avec validation

### Phase 4 : Wizard d'Inscription (Étapes 4-5) + Paiement
- **Objectif** : Finaliser le wizard avec paiement Stripe
- **Livrable** : Étape paiement, récapitulatif, reçu PDF

### Phase 5 : Workflow Admin & Dashboard
- **Objectif** : Interface admin complète
- **Livrable** : Tableau de bord stats, gestion dossiers, workflow validation

### Phase 6 : Notifications, Export & Sécurité
- **Objectif** : Finaliser avec emails, exports et sécurité
- **Livrable** : Notifications email, export CSV/Excel, CAPTCHA, logs

- **Espace Candidat (authentifié)** : Navigation standardisée à 6 items — Mon dossier, Inscription, Mes documents, Paiement, Paramètres, Aide. Pas de "Tableau de bord".

## État actuel (10/06/2026)

### Dernière modification majeure
- **Suppression totale de la sidebar candidat** : Remplacement du `DashboardLayout` (sidebar + topbar) par le nouveau `CandidatLayout` (top navigation uniquement, pas de sidebar)
- Les 10 pages candidat utilisent maintenant `CandidatLayout` avec une barre de navigation horizontale en haut
- Navigation responsive : liens horizontaux sur desktop, menu hamburger sur mobile
- 6 liens de navigation : Mon dossier, Inscription, Mes documents, Paiement, Paramètres, Aide

### Modifications du 10/06/2026 (session 2)
- **Géolocalisation** : Ajout d'une carte Google Maps à la section Contact montrant l'Institut PKFokam, Quartier Emana, Yaoundé
- **Coordonnées mises à jour** : Email signeylguela@gmail.com, téléphones +236 72 90 33 59 et +237 68 77 89 930 (section Contact + Footer)
- **Admin renommé** : Signey Guela (ex-PKFokam Administrateur) — mis à jour dans les mocks, login admin, page profil admin, logs admin
- **Lien Accueil** : Ajouté à la Navbar principale, redirige vers le hero (scroll top si déjà sur la page)
- **Lien Frais de scolarité** : Ajouté à la Navbar, ancre vers la nouvelle section
- **Système de Toasts** : Composant ToastContainer global + dans CandidatLayout. Utilise le NotificationContext existant. Types : success, error, warning, info. Animation slide-in. Fermeture manuelle ou automatique après 4s.
- **Page Mot de passe oublié** : `/mot-de-passe-oublie` — formulaire email, état de succès avec message, lien retour connexion. Accessible depuis les pages connexion candidat et admin.
- **Section Frais de scolarité** : Nouvelle section sur la page d'accueil entre Processus et Témoignages. Affiche 8 formations avec :
  - Filtres par niveau (BTS, Licence, Master, Doctorat)
  - Frais d'inscription, frais de scolarité/an, durée, places disponibles
  - Note d'information sur les modalités de paiement (3 échéances)
  - Montants réalistes : 250 000 à 750 000 FCFA selon le niveau