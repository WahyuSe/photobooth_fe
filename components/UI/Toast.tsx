'use client';

import { useEffect } from 'react';
import { ToastItem } from '@/hooks/useToast';

interface Props {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <ToastMessage key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastMessage({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icon = toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️';

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <span>{icon}</span>
      <span>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ marginLeft: 'auto', opacity: 0.7, fontSize: 16, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
        aria-label="Tutup notifikasi"
      >
        ×
      </button>
    </div>
  );
}
