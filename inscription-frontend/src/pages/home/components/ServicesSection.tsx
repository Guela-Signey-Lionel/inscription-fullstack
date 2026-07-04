import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const services = [
  {
    href: '/candidat/formations',
    icon: 'ri-book-open-line',
    title: 'Formations',
    desc: 'Explorez notre catalogue de formations : Licence, Master, BTS. Trouvez celle qui correspond à votre projet.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    href: '/candidat/inscription',
    icon: 'ri-edit-line',
    title: 'Inscription',
    desc: 'Complétez votre dossier en 5 étapes simples. Informations, documents, paiement, tout est guidé.',
    color: 'bg-accent-100 text-accent-600',
  },
  {
    href: '/candidat/documents',
    icon: 'ri-file-copy-2-line',
    title: 'Mes documents',
    desc: 'Téléversez et gérez vos pièces justificatives. Suivez leur statut de validation en temps réel.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    href: '/candidat/parametres',
    icon: 'ri-settings-4-line',
    title: 'Paramètres',
    desc: 'Personnalisez vos préférences : notifications, langue, fuseau horaire et confidentialité.',
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    href: '/candidat/faq',
    icon: 'ri-question-line',
    title: 'Aide & FAQ',
    desc: 'Besoin d\'aide ? Consultez nos questions fréquentes ou contactez notre support.',
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function ServicesSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section id="services" className="py-16 md:py-20 bg-background-50">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold font-label mb-4">
            <i className="ri-user-line w-3.5 h-3.5 flex items-center justify-center"></i>
            Espace Candidat
          </div>
          <h2 className="text-2xl md:text-4xl font-bold font-heading text-foreground-950 mb-4">
            Préparez votre avenir dès maintenant
          </h2>
          <p className="text-sm md:text-base text-foreground-600 font-body max-w-2xl mx-auto">
            Accédez à tous les services nécessaires pour votre inscription. Explorez les formations, 
            constituez votre dossier et suivez votre candidature, le tout sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <Link
              key={service.href}
              to={service.href}
              className="group bg-white rounded-2xl border border-background-200/70 p-6 hover:border-background-300/70 transition-all cursor-pointer flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`${service.icon} w-6 h-6 flex items-center justify-center`}></i>
              </div>
              <h3 className="text-base font-bold font-heading text-foreground-950 mb-2 group-hover:text-primary-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-foreground-500 font-body leading-relaxed flex-1">
                {service.desc}
              </p>
              <div className="mt-4 pt-4 border-t border-background-100 flex items-center gap-2 text-xs font-semibold text-primary-600 font-label group-hover:gap-3 transition-all">
                <span>Accéder</span>
                <i className="ri-arrow-right-line w-3.5 h-3.5 flex items-center justify-center"></i>
              </div>
            </Link>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="mt-10 text-center">
            <p className="text-sm text-foreground-500 font-body mb-4">
              Vous avez déjà un compte ? Connectez-vous pour suivre votre dossier.
            </p>
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
            >
              <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
              Connexion Étudiant
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}