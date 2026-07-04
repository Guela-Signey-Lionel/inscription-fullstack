import { useState } from 'react';

const testimonials = [
  {
    quote: 'EduRegister a transformé notre processus d\'admission. Les dossiers arrivent complets et le gain de temps est considérable pour notre équipe de scolarité. Nos candidats nous le disent : l\'interface est intuitive et rassurante.',
    author: 'Dr. Sophie Mercier',
    role: 'Directrice de la Scolarité',
    institution: 'Université Catholique d\'Afrique Centrale',
    avatarUrl: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%20with%20warm%20expression%2C%20minimalist%20cream%20studio%20background%2C%20soft%20natural%20lighting%2C%20clean%20professional%20headshot%2C%20modern%20aesthetic%2C%20confident%20and%20approachable%20look&width=200&height=200&seq=avatar-sophie-v2&orientation=squarish',
  },
  {
    quote: 'Le wizard en 5 étapes est un vrai game-changer. Le taux d\'abandon a chuté de moitié depuis la migration. La validation automatique des documents nous fait gagner des heures chaque semaine.',
    author: 'Prof. Marc Dubois',
    role: 'Responsable Admissions',
    institution: 'Institut Supérieur de Technologie',
    avatarUrl: 'https://readdy.ai/api/search-image?query=Professional%20African%20man%20portrait%20with%20warm%20expression%2C%20minimalist%20cream%20studio%20background%2C%20soft%20lighting%2C%20clean%20professional%20headshot%2C%20modern%20aesthetic%2C%20friendly%20and%20confident&width=200&height=200&seq=avatar-marc-v2&orientation=squarish',
  },
  {
    quote: 'La validation automatique des documents, c\'est bluffant. Fini les allers-retours interminables pour des pièces manquantes ou mal formatées. Un vrai soulagement pour nos équipes administratives.',
    author: 'Mme Amina Benali',
    role: 'Cheffe de Projet Numérique',
    institution: 'Complexe Scolaire International',
    avatarUrl: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%20with%20confident%20smile%2C%20minimalist%20cream%20studio%20background%2C%20warm%20lighting%2C%20clean%20professional%20headshot%2C%20modern%20editorial%20style%2C%20elegant&width=200&height=200&seq=avatar-amina-v2&orientation=squarish',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  };

  const next = () => {
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  };

  const t = testimonials[current];

  return (
    <section id="temoignages" className="bg-background-50 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-accent-600 font-label mb-4">
            Témoignages
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
            Ils nous font
            <br />
            <span className="italic text-accent-600">confiance</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-12 items-start">
          <div>
            <div className="flex items-center gap-1.5 mb-6">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill text-accent-500 text-sm w-4 h-4 flex items-center justify-center"></i>
              ))}
              <span className="ml-2 text-sm font-semibold text-foreground-700 font-label">4.9</span>
              <span className="text-xs text-foreground-400 font-body">— 200+ avis</span>
            </div>

            <blockquote className="mb-8">
              <p className="text-xl md:text-2xl text-foreground-800 leading-relaxed font-heading italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-background-200 flex-shrink-0">
                  <img
                    src={t.avatarUrl}
                    alt={t.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-foreground-950 font-semibold text-sm font-body">
                    {t.author}
                  </p>
                  <p className="text-foreground-500 text-xs font-body">
                    {t.role}
                  </p>
                  <p className="text-primary-600 text-xs font-medium font-label mt-0.5">
                    {t.institution}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-background-300 flex items-center justify-center text-foreground-600 hover:bg-background-100 hover:border-primary-300 transition-all cursor-pointer"
                  aria-label="Témoignage précédent"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-all cursor-pointer"
                  aria-label="Témoignage suivant"
                >
                  <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === current
                      ? 'bg-primary-500 w-8'
                      : 'bg-background-300 w-4 hover:bg-background-400'
                  }`}
                  aria-label={`Témoignage ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            {testimonials.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? 'border-primary-400 bg-primary-50/50'
                    : 'border-background-200/70 bg-background-50 hover:border-background-300'
                }`}
              >
                <p className="text-xs font-semibold text-foreground-800 font-body mb-1">
                  {item.author}
                </p>
                <p className="text-[11px] text-foreground-500 font-body">
                  {item.institution}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}