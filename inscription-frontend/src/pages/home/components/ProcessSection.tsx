import { useRef, useState, useEffect } from 'react';

const steps = [
  {
    number: '01',
    title: 'Informations personnelles',
    description: 'Saisissez vos données civiles, coordonnées et informations de contact. Sauvegarde automatique à chaque champ.',
    icon: 'ri-user-settings-line',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    number: '02',
    title: 'Choix de la formation',
    description: 'Parcourez le catalogue des formations disponibles et sélectionnez celle qui correspond à votre projet.',
    icon: 'ri-book-open-line',
    color: 'bg-accent-100 text-accent-600',
  },
  {
    number: '03',
    title: 'Documents justificatifs',
    description: 'Déposez vos diplômes, pièce d\'identité et photo. Validation automatique du format et de la qualité.',
    icon: 'ri-file-copy-2-line',
    color: 'bg-secondary-100 text-secondary-700',
  },
  {
    number: '04',
    title: 'Paiement des frais',
    description: 'Réglez vos frais d\'inscription en ligne de manière sécurisée. Reçu PDF généré instantanément.',
    icon: 'ri-secure-payment-line',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    number: '05',
    title: 'Confirmation finale',
    description: 'Recevez la confirmation de votre inscription et suivez l\'avancement de votre dossier en temps réel.',
    icon: 'ri-verified-badge-line',
    color: 'bg-accent-100 text-accent-600',
  },
];

export default function ProcessSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 380;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="processus" className="bg-background-100 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-secondary-600 font-label mb-4">
              Comment ça marche
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
              Votre inscription
              <br />
              <span className="italic text-primary-600">en 5 étapes</span>
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-background-300 flex items-center justify-center text-foreground-600 hover:bg-background-50 hover:border-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              aria-label="Défiler vers la gauche"
            >
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              aria-label="Défiler vers la droite"
            >
              <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[300px] md:w-[340px] rounded-2xl bg-background-50 border border-background-200/70 p-6 md:p-7 group hover:border-primary-300 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-50 to-transparent rounded-bl-3xl -mr-2 -mt-2"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                    <i className={`${step.icon} text-xl w-5 h-5 flex items-center justify-center`}></i>
                  </div>
                  <span className="text-5xl font-bold font-heading text-foreground-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-semibold text-foreground-950 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground-600 leading-relaxed font-body">
                  {step.description}
                </p>

                {idx < steps.length - 1 && (
                  <div className="mt-5 flex items-center gap-2 text-xs text-primary-600 font-medium font-label">
                    <span>Étape suivante</span>
                    <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex md:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="w-11 h-11 rounded-full border border-background-300 flex items-center justify-center text-foreground-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Défiler vers la gauche"
          >
            <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center"></i>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Défiler vers la droite"
          >
            <i className="ri-arrow-right-line w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
      </div>
    </section>
  );
}