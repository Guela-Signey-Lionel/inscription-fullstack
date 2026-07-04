import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-28 px-4 md:px-8 bg-primary-600 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, transparent 30%, rgba(255,255,255,0.3) 70%)',
        }}></div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.05]">
            Prêt à simplifier
            <br />
            <span className="italic">vos inscriptions ?</span>
          </h2>
          <p className="mt-5 text-white/80 text-base md:text-lg leading-relaxed max-w-lg font-body">
            Rejoignez les établissements qui ont déjà digitalisé leur processus
            d&apos;admission. Déploiement en moins d&apos;une semaine.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-white text-primary-700 text-sm font-semibold hover:bg-white/95 transition-all duration-200 whitespace-nowrap font-label"
            >
              Commencer maintenant
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            </Link>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200 whitespace-nowrap font-body"
            >
              <i className="ri-phone-line w-4 h-4 flex items-center justify-center"></i>
              Demander une démo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}