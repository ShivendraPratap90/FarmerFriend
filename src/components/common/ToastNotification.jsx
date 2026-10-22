import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ICONS = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info };
const STYLES = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-600 text-white',
};

export const ToastNotification = () => {
  const { toasts, removeToast } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg font-medium text-sm animate-slide-up ${STYLES[toast.type] || STYLES.info} min-w-[280px] max-w-[380px]`}>
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-75 transition-opacity">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;
