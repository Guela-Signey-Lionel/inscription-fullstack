import { useState } from 'react';

const articles = [
  {
    id: 1,
    titre: 'Rentrée académique 2026-2027 : les dates clés à retenir',
    resume: 'L\'Institut PKFokam annonce les dates officielles de la rentrée pour l\'année académique 2026-2027. Les inscriptions sont déjà ouvertes.',
    categorie: 'Rentrée',
    date: '05 Juin 2026',
    image: 'https://readdy.ai/api/search-image?query=modern%20university%20campus%20with%20students%20walking%20through%20tree%20lined%20pathways%20in%20warm%20morning%20light%2C%20sage%20green%20and%20cream%20tones%2C%20soft%20natural%20lighting%2C%20editorial%20style%2C%20academic%20atmosphere%2C%20peaceful%20and%20inspiring%20scene%2C%20no%20people%20faces%20visible%2C%20architecture%20in%20background&width=800&height=500&seq=blog-rentree-2026&orientation=landscape',
    auteur: 'Administration',
  },
  {
    id: 2,
    titre: 'Nouveau Master en Intelligence Artificielle — ouverture des candidatures',
    resume: 'Un tout nouveau programme de Master en IA ouvre ses portes pour la rentrée 2026. Découvrez le programme, les débouchés et les conditions d\'admission.',
    categorie: 'Formation',
    date: '28 Mai 2026',
    image: 'https://readdy.ai/api/search-image?query=futuristic%20modern%20technology%20lab%20with%20students%20working%20on%20computers%2C%20artificial%20intelligence%20concept%2C%20warm%20ambient%20lighting%2C%20sage%20green%20and%20cream%20accents%2C%20editorial%20photography%2C%20clean%20minimalist%20aesthetic%2C%20collaborative%20learning%20environment&width=800&height=500&seq=blog-master-ia&orientation=landscape',
    auteur: 'Direction Pédagogique',
  },
  {
    id: 3,
    titre: 'Journée Portes Ouvertes — Samedi 20 Juin 2026',
    resume: 'L\'Institut PKFokam vous invite à sa journée portes ouvertes le samedi 20 juin. Venez découvrir le campus, rencontrer les professeurs et poser toutes vos questions.',
    categorie: 'Événement',
    date: '15 Mai 2026',
    image: 'https://readdy.ai/api/search-image?query=university%20open%20day%20event%20with%20prospective%20students%20and%20parents%20touring%20a%20modern%20campus%20building%2C%20friendly%20atmosphere%2C%20warm%20natural%20light%2C%20sage%20green%20and%20cream%20color%20palette%2C%20architectural%20details%2C%20editorial%20photography%20style%2C%20welcoming%20environment&width=800&height=500&seq=blog-portes-ouvertes&orientation=landscape',
    auteur: 'Administration',
  },
  {
    id: 4,
    titre: 'Bourses d\'excellence 2026 : comment postuler ?',
    resume: 'L\'Institut met en place un nouveau programme de bourses au mérite pour les meilleurs candidats. Découvrez les critères d\'éligibilité et le processus de candidature.',
    categorie: 'Bourses',
    date: '02 Mai 2026',
    image: 'https://readdy.ai/api/search-image?query=graduation%20caps%20and%20diplomas%20on%20a%20wooden%20table%20with%20warm%20sunlight%20streaming%20through%20window%2C%20academic%20achievement%20concept%2C%20sage%20green%20and%20cream%20tones%2C%20soft%20focus%20background%20with%20bookshelves%2C%20editorial%20still%20life%20photography%2C%20celebratory%20atmosphere&width=800&height=500&seq=blog-bourses&orientation=landscape',
    auteur: 'Service Scolarité',
  },
  {
    id: 5,
    titre: 'Partenariat avec l\'Université de Strasbourg — échanges internationaux',
    resume: 'Un nouvel accord de coopération signé avec l\'Université de Strasbourg permet aux étudiants de PKFokam de bénéficier d\'échanges académiques en Europe.',
    categorie: 'Partenariat',
    date: '18 Avril 2026',
    image: 'https://readdy.ai/api/search-image?query=two%20university%20administrators%20shaking%20hands%20in%20a%20modern%20office%20with%20international%20flags%20in%20background%2C%20professional%20atmosphere%2C%20warm%20natural%20lighting%2C%20sage%20green%20and%20cream%20interior%20palette%2C%20editorial%20corporate%20photography%2C%20diplomatic%20and%20friendly%20mood&width=800&height=500&seq=blog-partenariat&orientation=landscape',
    auteur: 'Relations Internationales',
  },
  {
    id: 6,
    titre: 'Calendrier des examens — Session de Septembre 2026',
    resume: 'Le calendrier des examens de la session de septembre est désormais disponible. Consultez les dates par filière et préparez-vous en conséquence.',
    categorie: 'Examens',
    date: '10 Avril 2026',
    image: 'https://readdy.ai/api/search-image?query=student%20studying%20at%20library%20desk%20with%20open%20books%20and%20laptop%2C%20focused%20atmosphere%2C%20warm%20desk%20lamp%20lighting%2C%20sage%20green%20and%20cream%20tones%2C%20quiet%20academic%20setting%2C%20editorial%20photography%20style%2C%20calm%20and%20concentrated%20mood&width=800&height=500&seq=blog-examens&orientation=landscape',
    auteur: 'Direction des Études',
  },
];

const categories = ['Tous', 'Rentrée', 'Formation', 'Événement', 'Bourses', 'Partenariat', 'Examens'];

export default function NewsSection() {
  const [selectedCategorie, setSelectedCategorie] = useState('Tous');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = selectedCategorie === 'Tous'
    ? articles
    : articles.filter((a) => a.categorie === selectedCategorie);

  return (
    <section id="actualites" className="bg-background-100 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-accent-600 font-label mb-4">
            Restez informé
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
            Actualités
            <br />
            <span className="italic text-accent-600">&amp; événements</span>
          </h2>
          <p className="mt-4 text-foreground-600 text-sm md:text-base font-body leading-relaxed">
            Retrouvez toutes les informations importantes : dates de rentrée, événements, nouvelles formations et annonces de l&apos;administration.
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategorie(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap font-label border ${
                selectedCategorie === cat
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-background-50 text-foreground-600 border-background-300 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="bg-background-50 rounded-2xl border border-background-200/70 overflow-hidden group hover:border-primary-200/70 transition-all cursor-pointer flex flex-col"
              onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.titre}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-background-50/90 text-xs font-semibold text-foreground-800 font-label backdrop-blur-sm">
                    {article.categorie}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Contenu */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-[10px] font-label">
                    {article.auteur.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-foreground-500 font-body">{article.auteur}</span>
                    <span className="text-[10px] text-foreground-300">·</span>
                    <span className="text-[11px] text-foreground-400 font-body">{article.date}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-foreground-950 font-heading leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                  {article.titre}
                </h3>

                <p className={`text-xs text-foreground-500 font-body leading-relaxed flex-1 ${
                  expandedId === article.id ? '' : 'line-clamp-3'
                }`}>
                  {article.resume}
                </p>

                {/* Expanded content */}
                {expandedId === article.id && (
                  <div className="mt-4 pt-4 border-t border-background-200 animate-in">
                    <p className="text-xs text-foreground-600 font-body leading-relaxed mb-4">
                      {article.resume} L&apos;Institut PKFokam met tout en œuvre pour offrir à ses étudiants un cadre d&apos;apprentissage optimal. 
                      Les inscriptions sont ouvertes et peuvent être effectuées directement en ligne via notre plateforme.
                      Pour plus d&apos;informations, n&apos;hésitez pas à contacter le service de la scolarité ou à consulter 
                      régulièrement cette section pour les mises à jour.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-foreground-400 font-body">
                        <i className="ri-time-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                        Lecture : 3 min
                      </span>
                      <span className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer font-label inline-flex items-center gap-1">
                        Lire plus
                        <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center"></i>
                      </span>
                    </div>
                  </div>
                )}

                {/* Lien "Lire plus" quand pas expanded */}
                {expandedId !== article.id && (
                  <div className="mt-4 pt-3 border-t border-background-200/70">
                    <span className="text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer font-label inline-flex items-center gap-1">
                      Lire l&apos;article
                      <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center"></i>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-background-200 flex items-center justify-center mx-auto mb-4">
              <i className="ri-newspaper-line text-foreground-400 text-2xl w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-sm text-foreground-500 font-body">Aucun article dans cette catégorie pour le moment.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 p-8 md:p-10 rounded-2xl bg-primary-50 border border-primary-200/50 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-5">
            <i className="ri-mail-send-line text-primary-600 text-2xl w-7 h-7 flex items-center justify-center"></i>
          </div>
          <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground-950 mb-3">
            Restez informé en temps réel
          </h3>
          <p className="text-sm text-foreground-600 font-body max-w-lg mx-auto mb-6">
            Recevez les actualités, dates de rentrée et événements directement par email. 
            Ne manquez plus aucune information importante.
          </p>
          <form
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            data-readdy-form
            id="newsletter-form"
          >
            <div className="relative flex-1 w-full">
              <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
              <input
                type="email"
                name="email"
                placeholder="votre@email.fr"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-background-300 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-body"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-send-plane-line w-4 h-4 inline-flex items-center justify-center mr-1.5"></i>
              S&apos;abonner
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}