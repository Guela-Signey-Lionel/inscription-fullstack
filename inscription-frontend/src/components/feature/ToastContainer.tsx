import { useNotifications } from '@/contexts/NotificationContext';

const typeStyles: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: 'bg-white',
    border: 'border-accent-200/70',
    icon: 'ri-checkbox-circle-fill text-accent-500',
    text: 'text-foreground-900',
  },
  error: {
    bg: 'bg-white',
    border: 'border-primary-200',
    icon: 'ri-close-circle-fill text-primary-500',
    text: 'text-foreground-900',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-amber-200',
    icon: 'ri-error-warning-fill text-amber-500',
    text: 'text-foreground-900',
  },
  info: {
    bg: 'bg-white',
    border: 'border-primary-200/70',
    icon: 'ri-information-fill text-primary-500',
    text: 'text-foreground-900',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const styles = typeStyles[toast.type] || typeStyles.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto ${styles.bg} border ${styles.border} rounded-xl p-4 shadow-lg animate-in flex items-start gap-3`}
            style={{
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <i className={`${styles.icon} text-lg w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5`}></i>
            <p className={`text-sm font-body flex-1 ${styles.text}`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer text-foreground-400 hover:text-foreground-600 hover:bg-background-100 transition-colors flex-shrink-0"
            >
              <i className="ri-close-line text-sm w-4 h-4 flex items-center justify-center"></i>
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}