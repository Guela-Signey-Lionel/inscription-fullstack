import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white">
      <div className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary-400/80 flex items-center justify-center">
                  <i className="ri-graduation-cap-fill text-white text-base w-4 h-4 flex items-center justify-center"></i>
                </div>
                <span className="text-xl font-bold font-heading text-white">
                  EduRegister
                </span>
              </Link>
              <p className="text-primary-200/70 text-sm leading-relaxed max-w-sm font-body">
                La plateforme qui digitalise l&apos;intégralité du processus d&apos;inscription
                scolaire et universitaire. Simple, rapide et sécurisée.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: 'ri-linkedin-fill', label: 'LinkedIn' },
                  { icon: 'ri-twitter-x-fill', label: 'Twitter' },
                  { icon: 'ri-instagram-line', label: 'Instagram' },
                  { icon: 'ri-facebook-fill', label: 'Facebook' },
                ].map((social) => (
                  <a
                    key={social.icon}
                    href="#"
                    className="w-9 h-9 rounded-lg border border-primary-400/30 flex items-center justify-center text-primary-200/70 hover:border-primary-300 hover:text-primary-200 transition-all cursor-pointer"
                    aria-label={social.label}
                  >
                    <i className={`${social.icon} text-sm w-4 h-4 flex items-center justify-center`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-300/60 mb-6 font-label">
                Plateforme
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Accueil', href: '/' },
                  { label: 'Fonctionnalités', href: '/#fonctionnalites' },
                  { label: 'Comment ça marche', href: '/#processus' },
                  { label: 'Témoignages', href: '/#temoignages' },
                  { label: 'Connexion', href: '/connexion' },
                  { label: 'Inscription', href: '/inscription-compte' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-primary-200/70 text-sm hover:text-white transition-colors font-body"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-300/60 mb-6 font-label">
                Légal
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  'Mentions légales',
                  'Politique de confidentialité',
                  'Conditions générales',
                  'Gestion des cookies',
                  'Accessibilité',
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-primary-200/70 text-sm hover:text-white transition-colors font-body"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-300/60 mb-6 font-label">
                Contact
              </h4>
              <div className="flex flex-col gap-3 text-primary-200/70 text-sm font-body">
                <div className="flex items-start gap-2.5">
                  <i className="ri-map-pin-line mt-0.5 w-4 h-4 flex items-center justify-center text-primary-300/60"></i>
                  <span>Institut PKFokam, Quartier Emana, Yaoundé, Cameroun</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="ri-phone-line w-4 h-4 flex items-center justify-center text-primary-300/60"></i>
                  <span>+236 72 90 33 59</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="ri-phone-line w-4 h-4 flex items-center justify-center text-primary-300/60"></i>
                  <span>+237 68 77 89 930</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="ri-mail-line w-4 h-4 flex items-center justify-center text-primary-300/60"></i>
                  <span>signeylguela@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-primary-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-300/50 text-xs font-body">
              &copy; {currentYear} EduRegister — PKFokam. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              {['Confidentialité', 'Conditions', 'Accessibilité'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-primary-300/50 text-xs hover:text-primary-200/80 transition-colors font-body"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}