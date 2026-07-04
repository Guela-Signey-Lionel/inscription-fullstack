import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ToastContainer from '@/components/feature/ToastContainer';

interface CandidatLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const navLinks = [
  { label: 'Mon dossier', href: '/candidat/tableau-de-bord', icon: 'ri-folder-user-line' },
  { label: 'Inscription', href: '/candidat/inscription', icon: 'ri-edit-line' },
  { label: 'Mes documents', href: '/candidat/documents', icon: 'ri-file-copy-2-line' },
  { label: 'Paiement', href: '/candidat/tableau-de-bord', icon: 'ri-bank-card-line' },
  { label: 'Paramètres', href: '/candidat/parametres', icon: 'ri-settings-4-line' },
  { label: 'Aide', href: '/candidat/faq', icon: 'ri-question-line' },
];

export default function CandidatLayout({ children, title, subtitle }: CandidatLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-background-200/70">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Brand */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
                <i className="ri-graduation-cap-fill text-white text-lg w-5 h-5 flex items-center justify-center"></i>
              </div>
              <span className="text-lg font-bold text-foreground-950 font-heading tracking-tight hidden sm:block">
                PKFokam
              </span>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-primary-500 text-white font-semibold'
                        : 'text-foreground-600 hover:text-foreground-900 hover:bg-background-100 font-body'
                    }`}
                  >
                    <i className={`${link.icon} text-sm w-4 h-4 flex items-center justify-center`}></i>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: User Area + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Messages */}
              {user && (
                <Link
                  to="/candidat/messages"
                  className="w-10 h-10 rounded-xl bg-background-100 flex items-center justify-center text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer relative hidden sm:flex"
                >
                  <i className="ri-mail-line text-lg w-5 h-5 flex items-center justify-center"></i>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center font-label">3</span>
                </Link>
              )}

              {/* Logout Button - always visible when logged in */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap font-body"
                  title="Se déconnecter"
                >
                  <i className="ri-logout-box-r-line w-4 h-4 flex items-center justify-center"></i>
                  <span>Déconnexion</span>
                </button>
              )}

              {/* Profile / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-foreground-800 font-body leading-tight">{user.prenom}</p>
                      <p className="text-xs text-foreground-400 font-body">Candidat</p>
                    </div>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-100 border-2 border-primary-200 flex-shrink-0">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-sm font-label">
                          {user.prenom[0]}{user.nom[0]}
                        </div>
                      )}
                    </div>
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                      <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-background-200/70 overflow-hidden z-20">
                        <div className="px-4 py-4 border-b border-background-100">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-primary-100 border-2 border-primary-200">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold font-label">
                                  {user.prenom[0]}{user.nom[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground-800 font-body">{user.prenom} {user.nom}</p>
                              <p className="text-xs text-foreground-400 font-body">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/candidat/profil"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-700 hover:bg-background-50 transition-colors font-body"
                          >
                            <i className="ri-user-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                            Mon profil
                          </Link>
                          <Link
                            to="/candidat/parametres"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-700 hover:bg-background-50 transition-colors font-body"
                          >
                            <i className="ri-settings-4-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                            Paramètres
                          </Link>
                          <div className="h-px bg-background-100 my-1"></div>
                          <button
                            onClick={() => { setProfileOpen(false); handleLogout(); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 transition-colors w-full text-left font-body cursor-pointer"
                          >
                            <i className="ri-logout-box-r-line w-4 h-4 flex items-center justify-center"></i>
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/connexion"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
                >
                  <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                  Se connecter
                </Link>
              )}

              {/* Hamburger Mobile */}
              <button
                onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setProfileOpen(false); }}
                className="md:hidden w-10 h-10 rounded-xl bg-background-100 flex items-center justify-center text-foreground-600 cursor-pointer"
              >
                <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-lg w-5 h-5 flex items-center justify-center`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-background-200/70 bg-white">
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-foreground-600 hover:bg-background-50 font-body'
                    }`}
                  >
                    <i className={`${link.icon} w-4 h-4 flex items-center justify-center`}></i>
                    {link.label}
                  </Link>
                );
              })}

              {/* Messages on mobile */}
              {user && (
                <Link
                  to="/candidat/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground-600 hover:bg-background-50 font-body"
                >
                  <i className="ri-mail-line w-4 h-4 flex items-center justify-center"></i>
                  Messages
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center font-label">3</span>
                </Link>
              )}

              <div className="h-px bg-background-100 my-1"></div>

              {user ? (
                <>
                  <Link
                    to="/candidat/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground-600 hover:bg-background-50 font-body"
                  >
                    <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                    Mon profil
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-600 hover:bg-primary-50 w-full text-left font-body cursor-pointer"
                  >
                    <i className="ri-logout-box-r-line w-4 h-4 flex items-center justify-center"></i>
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary-500 text-white justify-center font-label"
                >
                  <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                  Se connecter
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Title Bar */}
      <div className="bg-white border-b border-background-200/70 px-4 md:px-6 py-4">
        <h1 className="text-lg font-bold text-foreground-950 font-heading">{title}</h1>
        {subtitle && <p className="text-xs text-foreground-500 font-body mt-0.5">{subtitle}</p>}
      </div>

      {/* Page Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Click outside profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
      )}
    </div>
  );
}