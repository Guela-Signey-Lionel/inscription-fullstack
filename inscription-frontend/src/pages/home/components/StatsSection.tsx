const stats = [
  {
    value: '94%',
    label: 'de dossiers complets',
    description: 'Dès la première soumission grâce à la vérification automatique des pièces.',
    icon: 'ri-check-double-line',
  },
  {
    value: '-60%',
    label: 'de temps de traitement',
    description: 'Par rapport aux processus traditionnels papier et email.',
    icon: 'ri-timer-flash-line',
  },
  {
    value: '15 000+',
    label: 'candidats inscrits',
    description: 'Depuis le lancement de la plateforme en septembre 2024.',
    icon: 'ri-user-star-line',
  },
  {
    value: '48h',
    label: 'délai moyen de validation',
    description: 'Entre le dépôt du dossier complet et la décision finale.',
    icon: 'ri-speed-up-line',
  },
];

export default function StatsSection() {
  return (
    <section className="bg-background-100 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-12 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-secondary-600 font-label mb-4">
            Chiffres clés
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
            Des résultats qui
            <br />
            <span className="italic text-primary-600">parlent d&apos;eux-mêmes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-background-50 border border-background-200/70 p-6 md:p-8 flex flex-col group hover:border-primary-300 transition-colors duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-200 transition-colors">
                <i className={`${stat.icon} text-primary-600 text-lg w-5 h-5 flex items-center justify-center`}></i>
              </div>
              <span className="text-4xl md:text-5xl font-bold font-heading text-foreground-950 mb-2">
                {stat.value}
              </span>
              <p className="text-sm font-semibold text-foreground-800 mb-2 font-body">
                {stat.label}
              </p>
              <p className="text-xs text-foreground-500 leading-relaxed font-body">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}