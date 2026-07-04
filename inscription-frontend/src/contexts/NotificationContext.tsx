import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface AppNotification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationContextType {
  notifications: AppNotification[];
  toasts: Toast[];
  unreadCount: number;
  addNotification: (text: string, type?: AppNotification['type']) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  removeNotification: (id: string) => void;
  addToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

let notifCounter = 100;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', text: 'Nouveau dossier soumis par Marie Kamga', time: 'Il y a 2 min', unread: true, type: 'info' },
    { id: '2', text: 'Document validé : Jean Dupont — CNI', time: 'Il y a 15 min', unread: true, type: 'success' },
    { id: '3', text: 'Paiement reçu : Alice Njoya — 50 000 FCFA', time: 'Il y a 1h', unread: false, type: 'success' },
    { id: '4', text: 'Rappel : 5 dossiers en attente de validation', time: 'Il y a 3h', unread: false, type: 'warning' },
  ]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const addNotification = useCallback((text: string, type: AppNotification['type'] = 'info') => {
    const id = String(++notifCounter);
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setNotifications((prev) => [
      { id, text, time, unread: true, type },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = `toast-${++notifCounter}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        unreadCount,
        addNotification,
        markAllRead,
        markRead,
        removeNotification,
        addToast,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
}