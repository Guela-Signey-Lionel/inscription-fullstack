import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CandidatLayout from '@/components/layout/CandidatLayout';
import { messagesApi } from '@/api/messages';
import type { ConversationSummary, ConversationDetail } from '@/api/types';

export default function CandidatMessages() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      messagesApi.mesConversations()
        .then(setConversations)
        .catch(() => setConversations([]))
        .finally(() => setLoadingConvs(false));
    }
  }, [authLoading, isAuthenticated]);

  const handleSelectConv = async (conv: ConversationSummary) => {
    const detail = await messagesApi.detail(conv.id);
    setSelectedConv(detail);
    await messagesApi.marquerLus(conv.id);
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, nonLu: 0 } : c));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    const msg = await messagesApi.envoyer({ conversationId: selectedConv.id, contenu: newMessage });
    setSelectedConv(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
    setNewMessage('');
  };

  if (authLoading || loadingConvs) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-500 w-8 h-8 flex items-center justify-center"></i>
          <p className="text-sm text-foreground-500 font-body">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/connexion" replace />;
  }

  const totalNonLu = conversations.reduce((acc, c) => acc + c.nonLu, 0);

  return (
    <CandidatLayout title="Messages" subtitle="Échangez avec l'administration concernant votre dossier">
      <div className="bg-white rounded-2xl border border-background-200/70 overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar - Conversations list */}
        <div className={`${selectedConv ? 'hidden md:flex' : 'flex'} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-background-100 flex-shrink-0`}>
          <div className="p-4 border-b border-background-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground-700 font-label">Conversations</h3>
              {totalNonLu > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 text-[10px] font-bold font-label">
                  {totalNonLu} non lu{totalNonLu > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="inline-flex items-center rounded-full bg-background-100 p-0.5 w-full">
              {['actif', 'resolu'].map((f) => (
                <button
                  key={f}
                  className={`flex-1 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer font-label ${
                    'actif' === f ? 'bg-white text-foreground-900 shadow-sm' : 'text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  {f === 'actif' ? 'Actifs' : 'Résolus'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className={`px-4 py-3.5 border-b border-background-100 cursor-pointer transition-colors hover:bg-background-50 ${
                  selectedConv?.id === conv.id ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                } ${conv.nonLu > 0 ? 'bg-background-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0 font-label">
                    PK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-foreground-800 font-body truncate">
                        Administration PKFokam
                      </span>
                      <span className="text-[10px] text-foreground-400 font-body whitespace-nowrap ml-2">
                        {conv.derniereDate
                          ? new Date(conv.derniereDate).toLocaleDateString('fr-FR')
                          : ''}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground-700 font-body truncate">{conv.objet}</p>
                    <p className="text-[11px] text-foreground-400 font-body truncate mt-0.5">
                      {conv.dernierMessage?.contenu || ''}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {conv.formation && (
                        <span className="text-[10px] text-foreground-400 font-body">{conv.formation}</span>
                      )}
                      {conv.nonLu > 0 && (
                        <span className="w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center font-label">
                          {conv.nonLu}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                    AP
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground-800 font-body">Admin PKFokam</p>
                    <p className="text-[10px] text-foreground-400 font-body">{selectedConv.formation} — {selectedConv.objet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-label ${
                    selectedConv.statut === 'resolu' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedConv.statut === 'resolu' ? 'Résolu' : 'En cours'}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-background-50/50">
                {selectedConv.messages.map((msg) => {
                  const isMe = msg.expediteurRole === 'candidat';
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
              {selectedConv.statut !== 'resolu' && (
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
                      placeholder="Écrivez votre message..."
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
              {selectedConv.statut === 'resolu' && (
                <div className="px-5 py-3 border-t border-background-100 bg-emerald-50 text-center">
                  <p className="text-xs text-emerald-700 font-body">
                    <i className="ri-check-double-line w-3.5 h-3.5 inline-flex items-center justify-center mr-1"></i>
                    Cette conversation est résolue. Les messages ne peuvent plus être envoyés.
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
                <h3 className="text-lg font-bold font-heading text-foreground-800 mb-2">Vos messages</h3>
                <p className="text-sm text-foreground-500 font-body max-w-xs">
                  Sélectionnez une conversation pour voir les échanges avec l&apos;administration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CandidatLayout>
  );
}