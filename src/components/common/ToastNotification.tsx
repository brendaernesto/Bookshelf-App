import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface ToastData {
  message: string;
  isError?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
  closeAriaLabel?: string;
}

export default function ToastNotification({
  toast,
  onClose,
  closeAriaLabel = 'Fechar notificação'
}: ToastNotificationProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-md px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.isError
                ? 'bg-[#291014]/95 text-red-200 border-red-500/30'
                : 'bg-surface-container/95 text-on-surface border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`material-symbols-outlined text-xl shrink-0 ${
                  toast.isError ? 'text-red-400' : 'text-primary'
                }`}
                aria-hidden="true"
              >
                {toast.isError ? 'error' : 'check_circle'}
              </span>
              <p className="text-sm font-medium leading-snug break-words">
                {toast.message}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={toast.onAction}
                  className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                >
                  {toast.actionLabel}
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label={closeAriaLabel}
                title={closeAriaLabel}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
