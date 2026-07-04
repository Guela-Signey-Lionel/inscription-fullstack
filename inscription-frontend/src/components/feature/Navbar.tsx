import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { i18n } = useTranslation();

  const [currentLang, setCurrentLang] = useState<'fr' | 'en'>(i18n.language?.startsWith('fr') ? 'fr' : 'en');

  const toggleLanguage = () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const transparentBg = isHome && !scrolled && !mobileOpen;

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Fonctionnalités', href: '/#fonctionnalites' },
    { label: 'Comment ça marche', href: '/#processus' },
    { label: 'Frais de scolarité', href: '/#frais-scolarite' },
    { label: 'Témoignages', href: '/#temoignages' },
    { label: 'Actualités', href: '/#actualites' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
  ];

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);

      if (href === '/') {
        if (isHome) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/');
        }
        return;
      }

      if (href.startsWith('/#')) {
        const sectionId = href.slice(2);
        if (isHome) {
          const target = document.getElementById(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          navigate('/#', { state: { scrollTo: sectionId } });
          setTimeout(() => {
            const target = document.getElementById(sectionId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      }
    },
    [isHome, navigate]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/tableau-de-bord';
    return '/candidat/tableau-de-bord';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparentBg
          ? 'bg-transparent'
          : 'bg-background-50 border-b border-background-200/70'
      }`}
    >
      <div className="flex items-center justify-between h-16 md:h-18 px-4 md:px-8 max-w-[1440px] mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <i className="ri-graduation-cap-fill text-white text-base w-4 h-4 flex items-center justify-center"></i>
          </div>
          <span
            className={`text-lg md:text-xl font-bold font-heading tracking-tight transition-colors duration-300 ${
              transparentBg ? 'text-foreground-950' : 'text-foreground-950'
            }`}
          >
            EduRegister
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary-500 font-body ${
                transparentBg ? 'text-foreground-700' : 'text-foreground-700'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={getDashboardLink()}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap font-label bg-primary-50 text-primary-700 hover:bg-primary-100"
              >
                <i className="ri-dashboard-line mr-1.5 text-sm w-4 h-4 inline-flex items-center justify-center"></i>
                Tableau de bord
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-background-300">
                <span className="text-xs font-medium font-body text-foreground-600">
                  {user?.prenom} {user?.nom}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer text-foreground-500 hover:text-foreground-800 hover:bg-background-100"
                  title="Déconnexion"
                >
                  <i className="ri-logout-box-r-line text-sm w-4 h-4 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <div className="inline-flex items-center rounded-full bg-background-100 p-0.5 border border-background-200/70">
                <Link
                  to="/connexion"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-label bg-primary-500 text-white shadow-sm"
                >
                  <i className="ri-user-line text-xs w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                  Étudiant
                </Link>
                <Link
                  to="/connexion-admin"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-label text-foreground-500 hover:text-foreground-700"
                >
                  <i className="ri-shield-check-line text-xs w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                  Administrateur
                </Link>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-label border border-background-200/70 bg-background-50 text-foreground-600 hover:bg-background-100 hover:border-background-300"
                title={currentLang === 'fr' ? 'Switch to English' : 'Passer en français'}
              >
                <i className="ri-global-line text-xs w-3.5 h-3.5 flex items-center justify-center"></i>
                <span className="flex items-center gap-1">
                  <span className={currentLang === 'fr' ? 'text-foreground-950 font-bold' : 'text-foreground-400'}>FR</span>
                  <span className="text-foreground-300">|</span>
                  <span className={currentLang === 'en' ? 'text-foreground-950 font-bold' : 'text-foreground-400'}>EN</span>
                </span>
              </button>
            </div>
          )}

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <i
              className={`text-xl w-5 h-5 flex items-center justify-center text-foreground-950 ${
                mobileOpen ? 'ri-close-line' : 'ri-menu-line'
              }`}
            ></i>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background-50 border-b border-background-200/70 px-4 py-5 flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-foreground-700 text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-background-100 hover:text-primary-600 transition-colors font-body"
            >
              {link.label}
            </a>
          ))}

          <div className="h-px bg-background-200 my-2"></div>

          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-label"
              >
                <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center"></i>
                Tableau de bord
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg text-foreground-600 hover:bg-background-100 transition-colors font-label cursor-pointer"
              >
                <i className="ri-logout-box-r-line w-4 h-4 flex items-center justify-center"></i>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/connexion"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors font-label"
              >
                <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                Connexion Étudiant
              </Link>
              <Link
                to="/connexion-admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg bg-background-100 text-foreground-700 hover:bg-background-200 transition-colors font-label"
              >
                <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center"></i>
                Connexion Administrateur
              </Link>
            </>
          )}

          <div className="h-px bg-background-200 my-2"></div>

          <button
            onClick={() => {
              toggleLanguage();
              setMobileOpen(false);
            }}
            className="flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-3 rounded-lg text-foreground-600 hover:bg-background-100 transition-colors font-label cursor-pointer"
          >
            <i className="ri-global-line w-4 h-4 flex items-center justify-center"></i>
            <span className="flex items-center gap-1">
              <span className={currentLang === 'fr' ? 'text-foreground-950 font-bold' : 'text-foreground-400'}>FR</span>
              <span className="text-foreground-300">|</span>
              <span className={currentLang === 'en' ? 'text-foreground-950 font-bold' : 'text-foreground-400'}>EN</span>
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}