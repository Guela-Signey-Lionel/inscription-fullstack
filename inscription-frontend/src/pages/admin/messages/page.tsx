import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { messagesApi } from '@/api/messages';
import type { ConversationSummary, ConversationDetail } from '@/api/types';

const adminNavItems = [
  { label: 'Tableau de bord', href: '/admin/tableau-de-bord', icon: 'ri-dashboard-line' },
  { label: 'Dossiers', href: '/admin/dossiers', icon: 'ri-folder-line' },
  { label: 'Messages', href: '/admin/messages', icon: 'ri-message-2-line' },
  { label: 'Statistiques', href: '/admin/statistiques', icon: 'ri-bar-chart-box-line' },
  { label: 'Paramètres', href: '/admin/parametres', icon: 'ri-settings-4-line' },
];

const statutFilterLabels = ['Tous', 'Actifs', 'Résolus', 'Fermés'] as const;
type StatutFilter = typeof statutFilterLabels[number];

export default function AdminMessages() {
  const { isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const { addToast } = useNotifications();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [statutFilter, setStatutFilter] = useState<StatutFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      messagesApi.toutesConversations()
        .then(setConversations)
        .catch(() => setConversations([]))
        .finally(() => setLoadingConvs(false));
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/connexion" replace />;
  }

  const filtered = conversations.filter((c) => {
    if (statutFilter === 'Actifs' && c.statut !== 'actif') return false;
    if (statutFilter === 'Résolus' && c.statut !== 'resolu') return false;
    if (statutFilter === 'Fermés' && c.statut !== 'ferme') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.candidatNom.toLowerCase().includes(q) ||
        c.candidatPrenom.toLowerCase().includes(q) ||
        c.formation.toLowerCase().includes(q) ||
        c.objet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalNonLu = filtered.reduce((acc, c) => acc + c.nonLu, 0);

  const handleSelectConv = async (conv: ConversationSummary) => {
    const detail = await messagesApi.detail(conv.id);
    setSelectedConv(detail);
    await messagesApi.marquerLus(conv.id);
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, nonLu: 0 } : c));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    try {
      const msg = await messagesApi.envoyer({ conversationId: selectedConv.id, contenu: newMessage });
      setSelectedConv(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      addToast('Message envoyé avec succès', 'success');
      setNewMessage('');
    } catch {
      addToast('Erreur lors de l\'envoi', 'error');
    }
  };

  const handleResoudre = async (conv: ConversationDetail) => {
    try {
      await messagesApi.updateStatut(conv.id, 'resolu');
      setSelectedConv(prev => prev ? { ...prev, statut: 'resolu' } : prev);
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, statut: 'resolu' } : c));
      addToast('Conversation résolue', 'success');
    } catch {
      addToast('Erreur lors de la résolution', 'error');
    }
  };

  return (
    <DashboardLayout navItems={adminNavItems} title="Messagerie" subtitle="Échangez avec les candidats concernant leurs dossiers">
      <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar - Conversations list */}
        <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-background-100 flex-shrink-0`}>
          <div className="p-4 border-b border-background-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground-700 font-label">Conversations</h3>
              {totalNonLu > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold font-label">
                  {totalNonLu} non lu{totalNonLu > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="relative mb-3">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm w-4 h-4 flex items-center justify-center"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un candidat..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background-100 border border-background-200 text-xs text-foreground-800 placeholder:text-foreground-400 font-body focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
              />
            </div>
            <div className="flex items-center gap-1">
              {statutFilterLabels.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatutFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer font-label whitespace-nowrap ${
                    statutFilter === f ? 'bg-primary-100 text-primary-700' : 'text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="text-center py-10 text-xs text-foreground-400 font-body">
                <i className="ri-loader-4-line animate-spin mr-2"></i>Chargement...
              </div>
            ) : filtered.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className={`px-4 py-3.5 border-b border-background-100 cursor-pointer transition-colors hover:bg-background-50 ${
                  selectedConv?.id === conv.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                } ${conv.nonLu > 0 ? 'bg-amber-50/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0 font-label">
                    {(conv.candidatPrenom?.[0] || '') + (conv.candidatNom?.[0] || '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-foreground-800 font-body truncate">
                        {conv.candidatPrenom} {conv.candidatNom}
                      </span>
                      <span className="text-[10px] text-foreground-400 font-body whitespace-nowrap ml-2">
                        {conv.derniereDate ? new Date(conv.derniereDate).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground-600 font-body truncate">{conv.objet}</p>
                    <p className="text-[10px] text-foreground-400 font-body mt-0.5">
                      {conv.formation || 'Général'}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold font-label ${
                        conv.statut === 'actif' ? 'bg-amber-100 text-amber-700' :
                        conv.statut === 'resolu' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-background-200 text-foreground-500'
                      }`}>
                        {conv.statut === 'actif' ? 'Actif' : conv.statut === 'resolu' ? 'Résolu' : 'Fermé'}
                      </span>
                      {conv.nonLu > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center font-label">
                          {conv.nonLu}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10">
                <i className="ri-message-2-line text-3xl text-foreground-300 w-8 h-8 flex items-center justify-center mx-auto mb-2"></i>
                <p className="text-xs text-foreground-400 font-body">Aucune conversation</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`${selectedConv ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3 border-b border-background-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden w-8 h-8 rounded-lg bg-background-100 flex items-center justify-center text-foreground-500 cursor-pointer"
                  >
                    <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs font-label">
                    {(selectedConv.candidatPrenom?.[0] || '') + (selectedConv.candidatNom?.[0] || '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground-800 font-body">
                        {selectedConv.candidatPrenom} {selectedConv.candidatNom}
                      </p>
                    </div>
                    <p className="text-[10px] text-foreground-400 font-body">{selectedConv.formation || 'Général'} — {selectedConv.objet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-label ${
                    selectedConv.statut === 'resolu' ? 'bg-emerald-100 text-emerald-700' :
                    selectedConv.statut === 'ferme' ? 'bg-background-200 text-foreground-500' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedConv.statut === 'resolu' ? 'Résolu' : selectedConv.statut === 'ferme' ? 'Fermé' : 'En cours'}
                  </span>
                  {selectedConv.statut === 'actif' && (
                    <button
                      onClick={() => handleResoudre(selectedConv)}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold hover:bg-emerald-100 transition-colors cursor-pointer font-label"
                    >
                      <i className="ri-check-line w-3 h-3 inline-flex items-center justify-center mr-1"></i>
                      Résoudre
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-background-50/50">
                {selectedConv.messages.map((msg) => {
                  const isMe = msg.expediteurRole === 'admin';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? 'bg-primary-500 text-white rounded-br-md'
                            : 'bg-white text-foreground-800 rounded-bl-md border border-background-200'
                        }`}>
                          <p className="text-sm font-body leading-relaxed">{msg.contenu}</p>
                          {msg.pieceJointeNom && (
                            <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <i className="ri-file-pdf-line w-4 h-4 flex items-center justify-center"></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{msg.pieceJointeNom}</p>
                                {msg.pieceJointeUrl && (
                                  <a href={msg.pieceJointeUrl} target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] text-white/80 hover:text-white cursor-pointer font-label">
                                    Télécharger
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className={`text-[10px] text-foreground-400 mt-1 font-body ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.dateEnvoi ? new Date(msg.dateEnvoi).toLocaleString('fr-FR') : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              {selectedConv.statut === 'actif' && (
                <div className="px-5 py-3 border-t border-background-100 bg-white">
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center text-foreground-500 hover:bg-background-200 transition-colors cursor-pointer flex-shrink-0">
                      <i className="ri-attachment-2 w-4 h-4 flex items-center justify-center"></i>
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Écrivez votre message au candidat..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-background-100 border border-background-200 text-sm text-foreground-800 placeholder:text-foreground-400 font-body focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <i className="ri-send-plane-fill w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              )}
              {selectedConv.statut !== 'actif' && (
                <div className="px-5 py-3 border-t border-background-100 bg-emerald-50 text-center">
                  <p className="text-xs text-emerald-700 font-body">
                    <i className="ri-check-double-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                    Cette conversation est {selectedConv.statut === 'resolu' ? 'résolue' : 'fermée'}. Les messages ne peuvent plus être envoyés.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-message-2-line text-primary-500 text-3xl w-10 h-10 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground-800 mb-2">Messagerie candidats</h3>
                <p className="text-sm text-foreground-500 font-body max-w-xs">
                  Sélectionnez une conversation pour échanger avec un candidat concernant son dossier.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}