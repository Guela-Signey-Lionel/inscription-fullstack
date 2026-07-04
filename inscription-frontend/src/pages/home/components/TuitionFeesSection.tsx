import { useState } from 'react';

const formations = [
  {
    id: 'licence-info',
    nom: 'Licence en Informatique — Génie Logiciel',
    niveau: 'Licence (Bac+3)',
    fraisInscription: 50000,
    fraisScolarite: 350000,
    duree: '3 ans',
    places: 60,
  },
  {
    id: 'licence-reseaux',
    nom: 'Licence en Informatique — Réseaux & Sécurité',
    niveau: 'Licence (Bac+3)',
    fraisInscription: 50000,
    fraisScolarite: 350000,
    duree: '3 ans',
    places: 40,
  },
  {
    id: 'master-bio',
    nom: 'Master en Biotechnologie',
    niveau: 'Master (Bac+5)',
    fraisInscription: 75000,
    fraisScolarite: 500000,
    duree: '2 ans',
    places: 30,
  },
  {
    id: 'master-info',
    nom: 'Master en Informatique — Intelligence Artificielle',
    niveau: 'Master (Bac+5)',
    fraisInscription: 75000,
    fraisScolarite: 500000,
    duree: '2 ans',
    places: 25,
  },
  {
    id: 'bts-compta',
    nom: 'BTS en Comptabilité & Gestion',
    niveau: 'BTS (Bac+2)',
    fraisInscription: 40000,
    fraisScolarite: 250000,
    duree: '2 ans',
    places: 50,
  },
  {
    id: 'bts-marketing',
    nom: 'BTS en Marketing & Communication',
    niveau: 'BTS (Bac+2)',
    fraisInscription: 40000,
    fraisScolarite: 250000,
    duree: '2 ans',
    places: 45,
  },
  {
    id: 'doctorat-bio',
    nom: 'Doctorat en Biotechnologie',
    niveau: 'Doctorat (Bac+8)',
    fraisInscription: 100000,
    fraisScolarite: 750000,
    duree: '3 ans',
    places: 15,
  },
  {
    id: 'doctorat-info',
    nom: 'Doctorat en Informatique',
    niveau: 'Doctorat (Bac+8)',
    fraisInscription: 100000,
    fraisScolarite: 750000,
    duree: '3 ans',
    places: 15,
  },
];

function formatFCFA(montant: number): string {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}

export default function TuitionFeesSection() {
  const [selectedNiveau, setSelectedNiveau] = useState<string>('all');

  const niveaux = ['all', 'BTS (Bac+2)', 'Licence (Bac+3)', 'Master (Bac+5)', 'Doctorat (Bac+8)'];

  const filtered = selectedNiveau === 'all'
    ? formations
    : formations.filter((f) => f.niveau === selectedNiveau);

  return (
    <section id="frais-scolarite" className="bg-background-50 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-accent-600 font-label mb-4">
            Financement
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
            Frais de
            <br />
            <span className="italic text-accent-600">scolarité</span>
          </h2>
          <p className="mt-4 text-foreground-600 text-sm md:text-base font-body leading-relaxed">
            Des tarifs adaptés à chaque parcours. Les frais d&apos;inscription sont payables en une fois,
            les frais de scolarité peuvent être échelonnés sur l&apos;année.
          </p>
        </div>

        {/* Filtres par niveau */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {niveaux.map((niveau) => (
            <button
              key={niveau}
              type="button"
              onClick={() => setSelectedNiveau(niveau)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap font-label border ${
                selectedNiveau === niveau
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'bg-background-50 text-foreground-600 border-background-300 hover:border-accent-300 hover:text-accent-600'
              }`}
            >
              {niveau === 'all' ? 'Toutes les formations' : niveau}
            </button>
          ))}
        </div>

        {/* Grille des formations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((formation) => (
            <div
              key={formation.id}
              className="bg-background-50 border border-background-200/70 rounded-2xl p-6 flex flex-col hover:border-accent-200/70 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-book-open-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                </div>
                <span className="text-[11px] font-semibold text-accent-600 font-label bg-accent-50 px-3 py-1 rounded-full">
                  {formation.duree}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-foreground-950 font-heading mb-1 leading-snug">
                {formation.nom}
              </h3>
              <p className="text-xs text-foreground-400 font-body mb-5">{formation.niveau}</p>

              <div className="flex-1"></div>

              <div className="border-t border-background-200 pt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-500 font-body">Frais d&apos;inscription</span>
                  <span className="text-sm font-semibold text-foreground-800 font-label">{formatFCFA(formation.fraisInscription)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-500 font-body">Frais de scolarité / an</span>
                  <span className="text-base font-bold text-accent-600 font-heading">{formatFCFA(formation.fraisScolarite)}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-foreground-400 font-body">Places disponibles</span>
                  <span className={`text-xs font-semibold font-label ${formation.places <= 20 ? 'text-primary-500' : 'text-foreground-600'}`}>
                    {formation.places} places
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-accent-50 border border-accent-200/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
              <i className="ri-information-line text-accent-600 text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground-950 font-heading mb-1">
                Modalités de paiement
              </h4>
              <p className="text-xs text-foreground-600 font-body leading-relaxed">
                Les frais d&apos;inscription sont payables en ligne au moment de l&apos;inscription.
                Les frais de scolarité peuvent être réglés en 3 échéances : 50% à la rentrée,
                25% en janvier, 25% en avril. Des facilités de paiement sont possibles sur demande
                auprès du service de la scolarité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}