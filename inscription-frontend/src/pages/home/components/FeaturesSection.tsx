const features = [
  {
    icon: 'ri-file-list-3-line',
    title: 'Wizard en 5 étapes',
    description: 'Un parcours guidé pas à pas avec validation en temps réel. Sauvegarde automatique pour ne jamais perdre votre progression.',
    highlight: 'Guidé et intuitif',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Validation intelligente',
    description: 'Vérification automatique des formats, tailles et types de fichiers. Détection instantanée des pièces manquantes ou non conformes.',
    highlight: 'Zéro erreur',
  },
  {
    icon: 'ri-bank-card-line',
    title: 'Paiement sécurisé',
    description: 'Règlement des frais d\'inscription en ligne avec reçu PDF automatique. Gestion intégrée des échecs de paiement.',
    highlight: '100% sécurisé',
  },
  {
    icon: 'ri-dashboard-line',
    title: 'Suivi en temps réel',
    description: 'Tableau de bord personnalisé pour suivre l\'avancement de votre dossier. Notifications à chaque changement de statut.',
    highlight: 'Transparence totale',
  },
  {
    icon: 'ri-upload-cloud-2-line',
    title: 'Upload simplifié',
    description: 'Déposez vos documents par simple glisser-déposer. Formats acceptés : PDF, JPG, PNG. Compression automatique si nécessaire.',
    highlight: 'Glisser-déposer',
  },
  {
    icon: 'ri-smartphone-line',
    title: '100% responsive',
    description: 'Plateforme entièrement adaptée aux mobiles et tablettes. Effectuez votre inscription où que vous soyez, sur n\'importe quel appareil.',
    highlight: 'Mobile-friendly',
  },
];

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

export default function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="bg-background-50 py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-primary-600 font-label mb-4">
            Fonctionnalités
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
            Tout ce dont vous
            <br />
            avez <span className="italic text-primary-600">besoin</span>
          </h2>
          <p className="mt-4 text-foreground-600 text-sm md:text-base font-body leading-relaxed">
            Une plateforme complète pensée pour simplifier chaque étape de votre inscription académique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl bg-background-50 border border-background-200/70 p-6 md:p-7 hover:border-primary-300 hover:bg-background-50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-200 transition-colors">
                <i className={`${feature.icon} text-primary-600 text-xl w-5 h-5 flex items-center justify-center`}></i>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-heading font-semibold text-foreground-950">
                  {feature.title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-accent-100 text-accent-700 text-[10px] font-semibold font-label whitespace-nowrap">
                  {feature.highlight}
                </span>
              </div>

              <p className="text-sm text-foreground-600 leading-relaxed font-body">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section des 5 étapes fusionnée dans Fonctionnalités */}
        <div className="mt-20 md:mt-28">
          <div className="max-w-xl mb-12">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-secondary-600 font-label mb-4">
              Comment ça marche
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground-950 leading-tight">
              Votre inscription
              <br />
              <span className="italic text-primary-600">en 5 étapes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-background-50 border border-background-200/70 p-6 md:p-7 group hover:border-primary-300 transition-all duration-300 relative overflow-hidden"
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
        </div>
      </div>
    </section>
  );
}