import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  closeAriaLabel?: string;
  maxWidthClass?: string;
  id?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  closeAriaLabel = 'Fechar modal',
  maxWidthClass = 'max-w-xl',
  id = 'accessible-modal'
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Store trigger element and manage focus trap
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      // Focus first focusable element inside modal after open
      const focusTimer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);

      // Disable body scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = originalOverflow;
        if (previouslyFocusedElementRef.current && previouslyFocusedElementRef.current.focus) {
          previouslyFocusedElementRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle Tab key trap and Escape key dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Backward tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Forward tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? `${id}-title` : undefined}
          aria-describedby={description ? `${id}-desc` : undefined}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto my-auto bg-surface-container border border-primary/20 rounded-2xl shadow-2xl z-10 scrollbar-thin outline-none`}
          >
            {/* Header (if title or close button) */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 border-b border-primary/10 bg-surface-container/95 backdrop-blur-md">
              <div>
                {title && (
                  <h2
                    id={`${id}-title`}
                    className="font-serif text-lg sm:text-xl font-bold text-on-surface tracking-wide"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={`${id}-desc`} className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    {description}
                  </p>
                )}
              </div>

              {/* Close button with min 44x44px touch area */}
              <button
                type="button"
                onClick={onClose}
                aria-label={closeAriaLabel}
                title={closeAriaLabel}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-container"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            {/* Content body */}
            <div className="p-4 sm:p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
