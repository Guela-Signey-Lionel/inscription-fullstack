import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-background-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-primary-100/30 via-background-50/80 to-background-50"></div>
        <img
          src="https://readdy.ai/api/search-image?query=Elegant%20modern%20university%20campus%20courtyard%20with%20glass%20and%20stone%20architecture%2C%20warm%20cream%20and%20sage%20green%20tones%2C%20soft%20natural%20daylight%2C%20minimalist%20architectural%20photography%2C%20clean%20lines%2C%20peaceful%20academic%20atmosphere%2C%20no%20people%2C%20no%20text%2C%20editorial%20style%2C%20sophisticated%20and%20calm%20aesthetic%2C%20geometric%20composition%20with%20trees%20and%20pathways&width=1200&height=1000&seq=hero-campus-2026&orientation=portrait"
          alt="Campus universitaire moderne"
          className="w-full h-full object-cover object-right"
        />
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 pt-20 pb-12 md:pt-0">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200/50 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary-500"></div>
              <span className="text-xs font-medium text-primary-700 font-label tracking-wide">
                INSCRIPTIONS 2026-2027 OUVERTES
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground-950 leading-[1.05] tracking-tight">
              Votre parcours
              <br />
              <span className="text-primary-600 italic">académique</span>
              <br />
              commence ici
            </h1>

            <p className="mt-6 md:mt-8 text-base md:text-lg text-foreground-600 leading-relaxed max-w-lg font-body">
              Une plateforme moderne qui digitalise l&apos;intégralité de votre inscription.
              Plus de paperasse, plus d&apos;attente : un parcours fluide en 5 étapes,
              entièrement en ligne.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8 md:mt-10">
              <Link
                to="/connexion"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all duration-200 whitespace-nowrap font-label shadow-[0_0_0_4px_rgba(72,104,64,0.1)]"
              >
                Démarrer mon inscription
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </Link>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-background-300 text-foreground-700 text-sm font-medium hover:border-primary-300 hover:text-primary-600 transition-all duration-200 whitespace-nowrap font-body"
              >
                <i className="ri-play-circle-line w-4 h-4 flex items-center justify-center"></i>
                Découvrir la plateforme
              </a>
            </div>

            <div className="flex items-center gap-8 mt-12 md:mt-16 pt-8 border-t border-background-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <i className="ri-shield-check-line text-accent-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground-500 font-label">Sécurisé</p>
                  <p className="text-sm font-semibold text-foreground-800 font-body">Données cryptées</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <i className="ri-flashlight-line text-primary-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground-500 font-label">Rapide</p>
                  <p className="text-sm font-semibold text-foreground-800 font-body">5 minutes top chrono</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <i className="ri-global-line text-secondary-600 text-lg w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground-500 font-label">Accessible</p>
                  <p className="text-sm font-semibold text-foreground-800 font-body">100% en ligne</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-50 to-transparent pointer-events-none"></div>
    </section>
  );
}