import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, type AppNotification } from '@/contexts/NotificationContext';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  title: string;
  subtitle?: string;
}

const typeIcons: Record<AppNotification['type'], { icon: string; className: string }> = {
  success: { icon: 'ri-check-double-line', className: 'bg-emerald-100 text-emerald-600' },
  error: { icon: 'ri-close-circle-line', className: 'bg-primary-100 text-primary-600' },
  warning: { icon: 'ri-alert-line', className: 'bg-amber-100 text-amber-600' },
  info: { icon: 'ri-information-line', className: 'bg-primary-100 text-primary-600' },
};

const toastConfig: Record<string, { icon: string; className: string }> = {
  success: { icon: 'ri-check-line', className: 'bg-emerald-500 text-white' },
  error: { icon: 'ri-close-line', className: 'bg-primary-500 text-white' },
  warning: { icon: 'ri-alert-line', className: 'bg-amber-500 text-white' },
  info: { icon: 'ri-information-line', className: 'bg-primary-500 text-white' },
};

const adminImage = '/images/Sig.jpg';

export default function DashboardLayout({ children, navItems, title, subtitle }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const {
    notifications,
    toasts,
    unreadCount,
    markAllRead,
    removeNotification,
    removeToast,
  } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 bg-primary-600 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 gap-3">
          <div className="w-9 h-9 rounded-lg bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
            {isAdmin ? (
              <img src={adminImage} alt="Logo administrateur" className="w-full h-full object-cover" />
            ) : (
              <i className="ri-graduation-cap-fill text-primary-600 text-lg w-5 h-5 flex items-center justify-center"></i>
            )}
          </div>
          {!sidebarCollapsed && (
            <span className="text-white font-bold text-lg font-heading tracking-tight whitespace-nowrap">
              PKFokam
            </span>
          )}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-primary-200 flex items-center justify-center cursor-pointer shadow-sm z-50"
        >
          <i className={`${sidebarCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-primary-600 text-sm w-4 h-4 flex items-center justify-center`}></i>
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-primary-100' : 'bg-white/10'
                }`}>
                  <i className={`${item.icon} ${isActive ? 'text-primary-600' : 'text-white'} text-sm w-4 h-4 flex items-center justify-center`}></i>
                </div>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium font-body whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 w-full cursor-pointer"
            title={sidebarCollapsed ? 'Déconnexion' : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <i className="ri-logout-box-r-line text-white text-sm w-4 h-4 flex items-center justify-center"></i>
            </div>
            {!sidebarCollapsed && (
              <span className="text-sm font-medium font-body whitespace-nowrap">Déconnexion</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
      }`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-background-200/70 flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Left: Title */}
          <div>
            <h1 className="text-lg font-bold text-foreground-950 font-heading">{title}</h1>
            {subtitle && <p className="text-xs text-foreground-500 font-body">{subtitle}</p>}
          </div>

          {/* Right: Search + Notifications + Profile */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 rounded-xl bg-background-100 border border-background-200 text-sm text-foreground-800 placeholder:text-foreground-400 font-body w-64 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="w-10 h-10 rounded-xl bg-background-100 flex items-center justify-center text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer relative"
              >
                <i className="ri-notification-3-line text-lg w-5 h-5 flex items-center justify-center"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center font-label animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-background-200/70 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-background-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground-800 font-body">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary-600 font-medium hover:text-primary-700 cursor-pointer font-label"
                      >
                        Tout marquer lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <i className="ri-notification-off-line text-3xl text-foreground-300 w-8 h-8 flex items-center justify-center mx-auto mb-2"></i>
                        <p className="text-xs text-foreground-400 font-body">Aucune notification</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-background-100 hover:bg-background-50 transition-colors group cursor-pointer ${n.unread ? 'bg-primary-50/20' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-lg ${typeIcons[n.type].className} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <i className={`${typeIcons[n.type].icon} w-3.5 h-3.5 flex items-center justify-center`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-foreground-700 font-body leading-relaxed">{n.text}</p>
                              <p className="text-[10px] text-foreground-400 mt-1 font-body">{n.time}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center text-foreground-300 hover:text-primary-500 cursor-pointer"
                            >
                              <i className="ri-close-line text-xs w-3 h-3 flex items-center justify-center"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-background-100">
                    <button className="text-xs text-primary-600 font-medium hover:text-primary-700 font-label cursor-pointer">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <Link
              to={isAdmin ? '/admin/messages' : '/candidat/messages'}
              className="w-10 h-10 rounded-xl bg-background-100 flex items-center justify-center text-foreground-600 hover:bg-background-200 transition-colors cursor-pointer relative"
            >
              <i className="ri-mail-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center font-label">3</span>
            </Link>

            {/* Profile */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                    className="flex items-center gap-3 pl-3 border-l border-background-200 cursor-pointer"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-foreground-800 font-body leading-tight">{user?.prenom} {user?.nom}</p>
                      <p className="text-xs text-foreground-400 font-body">{isAdmin ? 'Administrateur' : 'Candidat'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 border-2 border-primary-200 flex-shrink-0">
                      {isAdmin ? (
                        <img src={adminImage} alt="Profil administrateur" className="w-full h-full object-cover" />
                      ) : user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-sm font-label">
                          {user?.prenom[0]}{user?.nom[0]}
                        </div>
                      )}
                    </div>
                    <i className="ri-arrow-down-s-line text-foreground-400 text-sm w-4 h-4 flex items-center justify-center hidden sm:block"></i>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-background-200/70 overflow-hidden z-50">
                      <div className="px-4 py-4 border-b border-background-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-100 border-2 border-primary-200">
                            {isAdmin ? (
                              <img src={adminImage} alt="Profil administrateur" className="w-full h-full object-cover" />
                            ) : user?.avatarUrl ? (
                              <img src={user.avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold font-label">
                                {user?.prenom[0]}{user?.nom[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground-800 font-body">{user?.prenom} {user?.nom}</p>
                            <p className="text-xs text-foreground-400 font-body">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          to={isAdmin ? '/admin/profil' : '/candidat/profil'}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-700 hover:bg-background-50 transition-colors font-body"
                        >
                          <i className="ri-user-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                          Mon profil
                        </Link>
                        <Link
                          to={isAdmin ? '/admin/parametres' : '/candidat/parametres'}
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
                  )}
                </>
              ) : (
                <Link
                  to="/connexion"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap font-label"
                >
                  <i className="ri-user-line w-4 h-4 flex items-center justify-center"></i>
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-20" onClick={() => { setNotifOpen(false); setProfileOpen(false); }}></div>
      )}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up ${toastConfig[toast.type].className} max-w-sm`}
          >
            <i className={`${toastConfig[toast.type].icon} w-5 h-5 flex items-center justify-center flex-shrink-0`}></i>
            <p className="text-sm font-medium font-body flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-5 h-5 rounded flex items-center justify-center text-white/70 hover:text-white cursor-pointer flex-shrink-0"
            >
              <i className="ri-close-line text-xs w-3 h-3 flex items-center justify-center"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
