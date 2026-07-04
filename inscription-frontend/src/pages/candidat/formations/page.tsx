import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CandidatLayout from '@/components/layout/CandidatLayout';
import { formationsApi } from '@/api/formations';
import type { Formation as ApiFormation } from '@/api/types';

interface Formation {
  id: string;
  nom: string;
  niveau: 'Licence' | 'Master' | 'BTS' | 'Doctorat';
  specialites: string[];
  duree: string;
  places: number;
  frais: number;
  description: string;
  objectifs: string[];
  debouches: string[];
  prerequis: string;
  imageCard: string;
  imageDetail: string;
}

const catalogueFormations: Formation[] = [
  {
    id: 'lic-info',
    nom: 'Licence en Informatique',
    niveau: 'Licence',
    specialites: ['Génie Logiciel', 'Réseaux & Sécurité', 'Intelligence Artificielle'],
    duree: '3 ans (6 semestres)',
    places: 120,
    frais: 350000,
    description: 'Formation complète en informatique couvrant la programmation, les bases de données, les réseaux et le développement logiciel. Prépare aux métiers du numérique en forte croissance au Cameroun et à l\'international.',
    objectifs: ['Maîtriser les langages de programmation modernes', 'Concevoir et déployer des applications web et mobiles', 'Administrer des systèmes d\'information', 'Comprendre les enjeux de la cybersécurité'],
    debouches: ['Développeur Full-Stack', 'Administrateur Réseaux', 'Analyste Cybersécurité', 'Chef de projet IT', 'Data Analyst'],
    prerequis: 'Baccalauréat série C, D ou TI',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20geometric%20shapes%2C%20university%20computer%20science%20atmosphere%2C%20soft%20cream%20and%20sage%20green%20tones%2C%20clean%20flat%20design%20with%20code%20elements%2C%20no%20text&width=600&height=280&seq=form-card-lic-info&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20computer%20science%20department%2C%20abstract%20tech%20shapes%20with%20circuit%20patterns%2C%20soft%20warm%20lighting%2C%20cream%20and%20sage%20green%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-lic-info&orientation=landscape',
  },
  {
    id: 'master-bio',
    nom: 'Master en Biotechnologie',
    niveau: 'Master',
    specialites: ['Génie Biologique', 'Bio-informatique', 'Biotechnologies Végétales'],
    duree: '2 ans (4 semestres)',
    places: 60,
    frais: 500000,
    description: 'Programme de pointe combinant biologie, chimie et informatique pour former des experts en biotechnologie. Accès à des laboratoires équipés et partenariats avec des instituts de recherche internationaux.',
    objectifs: ['Maîtriser les techniques de biologie moléculaire', 'Analyser et interpréter des données biologiques complexes', 'Conduire des projets de recherche en biotechnologie', 'Développer des solutions biotech innovantes'],
    debouches: ['Chercheur en Biotechnologie', 'Ingénieur Biomédical', 'Responsable R&D Pharmaceutique', 'Bio-informaticien', 'Consultant Environnement'],
    prerequis: 'Licence en Biologie, Biochimie ou équivalent',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20organic%20shapes%2C%20biotechnology%20laboratory%20atmosphere%2C%20soft%20cream%20and%20sage%20green%20tones%2C%20clean%20flat%20design%20with%20DNA%20helix%20elements%2C%20no%20text&width=600&height=280&seq=form-card-master-bio&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20biotechnology%20department%2C%20abstract%20organic%20molecular%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20sage%20green%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-master-bio&orientation=landscape',
  },
  {
    id: 'lic-eco',
    nom: 'Licence en Économie-Gestion',
    niveau: 'Licence',
    specialites: ['Finance', 'Marketing', 'Gestion des Ressources Humaines'],
    duree: '3 ans (6 semestres)',
    places: 150,
    frais: 300000,
    description: 'Formation polyvalente en sciences économiques et de gestion. Développe les compétences analytiques et décisionnelles nécessaires pour évoluer dans le monde des affaires.',
    objectifs: ['Analyser l\'environnement économique des organisations', 'Maîtriser les fondamentaux de la gestion d\'entreprise', 'Comprendre les mécanismes financiers et comptables', 'Développer des stratégies marketing efficaces'],
    debouches: ['Analyste Financier', 'Responsable Marketing', 'Gestionnaire RH', 'Conseiller en Gestion', 'Entrepreneur'],
    prerequis: 'Baccalauréat toutes séries',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20chart%20shapes%2C%20economics%20and%20business%20atmosphere%2C%20soft%20cream%20and%20warm%20gold%20tones%2C%20clean%20flat%20design%20with%20graph%20elements%2C%20no%20text&width=600&height=280&seq=form-card-lic-eco&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20economics%20and%20management%20department%2C%20abstract%20financial%20chart%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20gold%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-lic-eco&orientation=landscape',
  },
  {
    id: 'master-genie',
    nom: 'Master en Génie Civil',
    niveau: 'Master',
    specialites: ['Génie des Structures', 'BTP & Construction Durable'],
    duree: '2 ans (4 semestres)',
    places: 50,
    frais: 550000,
    description: 'Formation d\'excellence en génie civil axée sur les infrastructures durables et les nouvelles technologies de construction. Projets pratiques en partenariat avec des entreprises du BTP.',
    objectifs: ['Concevoir des structures résistantes et durables', 'Maîtriser les logiciels de CAO/DAO', 'Gérer des projets de construction complexes', 'Appliquer les normes environnementales'],
    debouches: ['Ingénieur Structures', 'Conducteur de Travaux', 'Chef de Projet BTP', 'Ingénieur Bureau d\'Études', 'Expert en Construction Durable'],
    prerequis: 'Licence en Génie Civil ou équivalent',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20architectural%20shapes%2C%20civil%20engineering%20atmosphere%2C%20soft%20cream%20and%20muted%20terracotta%20tones%2C%20clean%20flat%20design%20with%20blueprint%20elements%2C%20no%20text&width=600&height=280&seq=form-card-master-genie&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20civil%20engineering%20department%2C%20abstract%20architectural%20blueprint%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20terracotta%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-master-genie&orientation=landscape',
  },
  {
    id: 'bts-compta',
    nom: 'BTS Comptabilité-Gestion',
    niveau: 'BTS',
    specialites: ['Comptabilité', 'Gestion Financière'],
    duree: '2 ans (4 semestres)',
    places: 100,
    frais: 250000,
    description: 'Formation professionnalisante aux métiers de la comptabilité et de la gestion. Prépare à l\'insertion rapide dans les PME, cabinets comptables et services financiers.',
    objectifs: ['Tenir une comptabilité complète', 'Établir les déclarations fiscales', 'Utiliser les logiciels comptables professionnels', 'Participer à la gestion budgétaire'],
    debouches: ['Comptable', 'Assistant de Gestion', 'Aide-comptable', 'Contrôleur de Gestion Junior', 'Responsable Paie'],
    prerequis: 'Baccalauréat toutes séries',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20ledger%20book%20shapes%2C%20accounting%20and%20finance%20atmosphere%2C%20soft%20cream%20and%20warm%20olive%20tones%2C%20clean%20flat%20design%20with%20calculator%20elements%2C%20no%20text&width=600&height=280&seq=form-card-bts-compta&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20accounting%20and%20management%20department%2C%20abstract%20financial%20ledger%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20olive%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-bts-compta&orientation=landscape',
  },
  {
    id: 'lic-droit',
    nom: 'Licence en Droit',
    niveau: 'Licence',
    specialites: ['Droit Public', 'Droit Privé', 'Droit International'],
    duree: '3 ans (6 semestres)',
    places: 130,
    frais: 300000,
    description: 'Formation juridique complète couvrant les fondamentaux du droit civil, pénal, administratif et international. Prépare aux carrières juridiques et aux concours de la fonction publique.',
    objectifs: ['Maîtriser les principes fondamentaux du droit', 'Analyser des cas juridiques complexes', 'Rédiger des actes et consultations juridiques', 'Comprendre le système judiciaire camerounais et international'],
    debouches: ['Avocat', 'Juriste d\'Entreprise', 'Magistrat', 'Notaire', 'Conseiller Juridique'],
    prerequis: 'Baccalauréat toutes séries',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20law%20scale%20shapes%2C%20legal%20studies%20atmosphere%2C%20soft%20cream%20and%20muted%20burgundy%20tones%2C%20clean%20flat%20design%20with%20columns%20elements%2C%20no%20text&width=600&height=280&seq=form-card-lic-droit&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20law%20department%2C%20abstract%20justice%20scale%20and%20column%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20burgundy%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-lic-droit&orientation=landscape',
  },
  {
    id: 'master-data',
    nom: 'Master en Data Science',
    niveau: 'Master',
    specialites: ['Big Data', 'Machine Learning', 'Business Intelligence'],
    duree: '2 ans (4 semestres)',
    places: 40,
    frais: 600000,
    description: 'Formation d\'avenir formant des experts en analyse de données massives et intelligence artificielle. Programme en collaboration avec des entreprises tech pour des projets concrets.',
    objectifs: ['Collecter et traiter des données massives', 'Concevoir des modèles de Machine Learning', 'Développer des solutions de Business Intelligence', 'Communiquer efficacement les résultats d\'analyses'],
    debouches: ['Data Scientist', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Data Engineer', 'Consultant Big Data'],
    prerequis: 'Licence en Informatique, Mathématiques ou Statistiques',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20data%20flow%20shapes%2C%20data%20science%20atmosphere%2C%20soft%20cream%20and%20muted%20teal%20tones%2C%20clean%20flat%20design%20with%20network%20nodes%20elements%2C%20no%20text&width=600&height=280&seq=form-card-master-data&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20data%20science%20department%2C%20abstract%20network%20node%20and%20data%20flow%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20teal%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-master-data&orientation=landscape',
  },
  {
    id: 'bts-marketing',
    nom: 'BTS Marketing & Communication',
    niveau: 'BTS',
    specialites: ['Marketing Digital', 'Communication'],
    duree: '2 ans (4 semestres)',
    places: 80,
    frais: 250000,
    description: 'Formation moderne aux techniques de marketing digital et de communication. Stage obligatoire en entreprise pour une immersion professionnelle dès la première année.',
    objectifs: ['Élaborer des stratégies marketing', 'Maîtriser les outils de communication digitale', 'Gérer les réseaux sociaux professionnels', 'Analyser les performances des campagnes'],
    debouches: ['Community Manager', 'Assistant Marketing', 'Chargé de Communication', 'Traffic Manager', 'Responsable E-commerce'],
    prerequis: 'Baccalauréat toutes séries',
    imageCard: 'https://readdy.ai/api/search-image?query=Modern%20minimalist%20academic%20scene%20with%20abstract%20megaphone%20and%20social%20shapes%2C%20marketing%20and%20communication%20atmosphere%2C%20soft%20cream%20and%20warm%20coral%20tones%2C%20clean%20flat%20design%20with%20chat%20bubble%20elements%2C%20no%20text&width=600&height=280&seq=form-card-bts-marketing&orientation=landscape',
    imageDetail: 'https://readdy.ai/api/search-image?query=Wide%20modern%20university%20banner%20for%20marketing%20and%20communication%20department%2C%20abstract%20social%20media%20and%20megaphone%20shapes%2C%20soft%20warm%20lighting%2C%20cream%20and%20coral%20aesthetic%2C%20minimalist%20flat%20design%2C%20clean%20composition&width=1200&height=400&seq=form-detail-bts-marketing&orientation=landscape',
  },
];

const niveauFilters = ['Tous', 'Licence', 'Master', 'BTS', 'Doctorat'] as const;

export default function FormationsCatalogue() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]         = useState('');
  const [niveauFilter, setNiveauFilter]     = useState('Tous');
  const [selectedFormation, setSelectedFormation] = useState<(typeof catalogueFormations)[0] | null>(null);
  const [apiFormations, setApiFormations]   = useState<ApiFormation[]>([]);

  useEffect(() => {
    formationsApi.getAll()
      .then(setApiFormations)
      .catch(() => {/* utiliser catalogue local si API indispo */});
  }, []);

  // Fusionne les formations API avec le catalogue local (les API priment si id match)
  const allFormations = useMemo(() => {
    if (apiFormations.length === 0) return catalogueFormations;
    return catalogueFormations.map(local => {
      const api = apiFormations.find(a => a.code === local.id || a.nom === local.nom);
      if (!api) return local;
      return {
        ...local,
        id: api.id,
        nom: api.nom,
        places: api.placesDisponibles,
        frais: api.fraisInscription,
      };
    });
  }, [apiFormations]);

  const filteredFormations = useMemo(() => {
    let list = allFormations;
    if (niveauFilter !== 'Tous') {
      list = list.filter((f) => f.niveau === niveauFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (f) =>
          f.nom.toLowerCase().includes(q) ||
          f.specialites.some((s) => s.toLowerCase().includes(q)) ||
          f.debouches.some((d) => d.toLowerCase().includes(q)) ||
          f.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchTerm, niveauFilter]);

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

  return (
    <CandidatLayout title="Catalogue des formations" subtitle="Découvrez toutes nos formations pour l'année 2026-2027">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold font-heading mb-2">Trouvez votre formation idéale</h2>
            <p className="text-white/80 text-sm font-body max-w-lg">
              Explorez nos <strong className="text-white">8 formations</strong> réparties en Licence, Master et BTS. Sélectionnez celle qui correspond à votre projet professionnel.
            </p>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://readdy.ai/api/search-image?query=Minimalist%20flat%20illustration%20of%20diverse%20students%20browsing%20a%20university%20course%20catalog%20on%20a%20large%20screen%2C%20with%20graduation%20caps%20and%20books%20floating%20around%2C%20soft%20sage%20green%20and%20cream%20palette%2C%20clean%20modern%20academic%20aesthetic&width=300&height=200&seq=formations-hero-v2&orientation=landscape"
              alt="Formations illustration"
              className="w-48 h-32 object-contain rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl border border-background-200/70 p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une formation, spécialité ou débouché..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background-100 border border-background-200 text-sm text-foreground-800 placeholder:text-foreground-400 font-body focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground-400 font-body whitespace-nowrap">Niveau :</span>
          <div className="inline-flex items-center rounded-full bg-background-100 p-0.5">
            {niveauFilters.map((n) => (
              <button
                key={n}
                onClick={() => setNiveauFilter(n)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer font-label whitespace-nowrap ${
                  niveauFilter === n ? 'bg-white text-foreground-900 shadow-sm' : 'text-foreground-500 hover:text-foreground-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-foreground-400 font-body whitespace-nowrap">
          {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFormations.map((formation) => (
          <div
            key={formation.id}
            className="bg-white rounded-2xl border border-background-200/70 overflow-hidden hover:border-background-300/70 transition-all group cursor-pointer"
            onClick={() => setSelectedFormation(formation)}
          >
            <div className="h-36 relative overflow-hidden">
              <img
                src={formation.imageCard}
                alt={formation.nom}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-white/90 text-xs font-semibold text-foreground-800 font-label backdrop-blur-sm">
                  {formation.niveau}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold font-label backdrop-blur-sm">
                  {formation.places} places
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-bold font-heading text-foreground-950 mb-2">{formation.nom}</h3>
              <p className="text-xs text-foreground-500 font-body line-clamp-2 mb-3">{formation.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {formation.specialites.map((spec) => (
                  <span key={spec} className="px-2 py-0.5 rounded-md bg-accent-100 text-accent-700 text-[10px] font-medium font-label">
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-background-100">
                <div>
                  <span className="text-xs text-foreground-400 font-body">{formation.duree}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-heading text-primary-600">
                    {formation.frais.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="text-[10px] text-foreground-400 font-body block">/an</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFormations.length === 0 && (
        <div className="text-center py-16">
          <i className="ri-search-line text-4xl text-foreground-300 w-12 h-12 flex items-center justify-center mx-auto mb-3"></i>
          <p className="text-sm text-foreground-500 font-body">Aucune formation trouvée pour ces critères</p>
          <button
            onClick={() => { setSearchTerm(''); setNiveauFilter('Tous'); }}
            className="mt-3 text-xs font-medium text-primary-600 hover:text-primary-700 font-label cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* CTA */}
      {isAuthenticated && (
        <div className="mt-8 bg-accent-50 rounded-2xl border border-accent-200/70 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-heading text-accent-800">Prêt à vous inscrire ?</h3>
            <p className="text-sm text-accent-600 font-body mt-1">
              Une fois votre formation choisie, lancez votre dossier d&apos;inscription en quelques clics.
            </p>
          </div>
          <button
            onClick={() => navigate('/candidat/inscription')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-all cursor-pointer whitespace-nowrap font-label"
          >
            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
            Démarrer l&apos;inscription
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="mt-8 bg-primary-50 rounded-2xl border border-primary-200/70 p-6 text-center">
          <h3 className="text-base font-bold font-heading text-primary-800 mb-2">Intéressé par une formation ?</h3>
          <p className="text-sm text-primary-600 font-body mb-4">
            Créez votre compte pour démarrer votre inscription.
          </p>
          <Link
            to="/inscription-compte"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
          >
            <i className="ri-user-add-line w-4 h-4 flex items-center justify-center"></i>
            Créer un compte
          </Link>
        </div>
      )}

      {/* Modal Detail */}
      {selectedFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedFormation(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10">
            <button
              onClick={() => setSelectedFormation(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-background-100 flex items-center justify-center text-foreground-500 hover:bg-background-200 transition-colors cursor-pointer z-20"
            >
              <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
            </button>

            <div className="h-44 relative overflow-hidden">
              <img
                src={selectedFormation.imageDetail}
                alt={selectedFormation.nom}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 text-xs font-semibold text-foreground-800 font-label backdrop-blur-sm">
                    {selectedFormation.niveau}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold font-label backdrop-blur-sm">
                    {selectedFormation.places} places
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-heading text-white">{selectedFormation.nom}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background-50 rounded-xl p-4 text-center">
                  <i className="ri-time-line text-2xl text-primary-600 w-8 h-8 flex items-center justify-center mx-auto mb-1"></i>
                  <p className="text-xs text-foreground-400 font-body">Durée</p>
                  <p className="text-sm font-semibold text-foreground-800 font-body">{selectedFormation.duree}</p>
                </div>
                <div className="bg-background-50 rounded-xl p-4 text-center">
                  <i className="ri-money-dollar-circle-line text-2xl text-primary-600 w-8 h-8 flex items-center justify-center mx-auto mb-1"></i>
                  <p className="text-xs text-foreground-400 font-body">Frais / an</p>
                  <p className="text-sm font-bold font-heading text-primary-600">{selectedFormation.frais.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className="bg-background-50 rounded-xl p-4 text-center">
                  <i className="ri-group-line text-2xl text-primary-600 w-8 h-8 flex items-center justify-center mx-auto mb-1"></i>
                  <p className="text-xs text-foreground-400 font-body">Places</p>
                  <p className="text-sm font-semibold text-foreground-800 font-body">{selectedFormation.places}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-2 font-label">Description</h4>
                <p className="text-sm text-foreground-600 font-body leading-relaxed">{selectedFormation.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-2 font-label">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFormation.specialites.map((spec) => (
                      <span key={spec} className="px-3 py-1 rounded-lg bg-accent-100 text-accent-700 text-xs font-medium font-label">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-2 font-label">Prérequis</h4>
                  <div className="flex items-start gap-2">
                    <i className="ri-information-line text-accent-500 w-4 h-4 flex items-center justify-center mt-0.5"></i>
                    <p className="text-sm text-foreground-600 font-body">{selectedFormation.prerequis}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-3 font-label">
                    <i className="ri-focus-2-line w-4 h-4 inline-flex items-center justify-center mr-1 text-primary-500"></i>
                    Objectifs
                  </h4>
                  <ul className="space-y-2">
                    {selectedFormation.objectifs.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <i className="ri-checkbox-circle-line text-emerald-500 w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
                        <span className="text-sm text-foreground-600 font-body">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground-700 uppercase tracking-wider mb-3 font-label">
                    <i className="ri-briefcase-line w-4 h-4 inline-flex items-center justify-center mr-1 text-primary-500"></i>
                    Débouchés
                  </h4>
                  <ul className="space-y-2">
                    {selectedFormation.debouches.map((deb, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <i className="ri-briefcase-line text-primary-500 w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"></i>
                        <span className="text-sm text-foreground-600 font-body">{deb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-background-200">
                {isAuthenticated ? (
                  <button
                    onClick={() => { setSelectedFormation(null); navigate('/candidat/inscription'); }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    M&apos;inscrire à cette formation
                  </button>
                ) : (
                  <Link
                    to="/inscription-compte"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
                  >
                    <i className="ri-user-add-line w-4 h-4 flex items-center justify-center"></i>
                    Créer un compte pour postuler
                  </Link>
                )}
                <button
                  onClick={() => setSelectedFormation(null)}
                  className="px-4 py-3 rounded-xl bg-background-100 text-foreground-600 text-sm font-medium hover:bg-background-200 transition-colors cursor-pointer font-label whitespace-nowrap"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CandidatLayout>
  );
}