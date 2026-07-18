'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { CloseIcon } from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Must be unique per page for aria-labelledby */
  titleId: string;
  title: string;
  children: ReactNode;
  /** Optional class for the panel (e.g. max-h, rounded). */
  panelClassName?: string;
  /** Image / promo layouts — close button only, no title bar. */
  hideHeader?: boolean;
  /** Override close control when `hideHeader` (default is a low-contrast control). */
  closeButtonClassName?: string;
  /** `bottom` = sheet on mobile (default). `center` = vertically centered on all viewports. */
  align?: 'bottom' | 'center';
}

/** Modal wrapper: overlay, focus trap, Escape to close, and accessible dialog. */
export default function Modal({
  isOpen,
  onClose,
  titleId,
  title,
  children,
  panelClassName = '',
  hideHeader = false,
  closeButtonClassName,
  align = 'bottom',
}: ModalProps) {
  const isCentered = align === 'center';
  const promoCloseClass =
    closeButtonClassName ??
    'absolute end-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full text-gray-400/80 transition-colors hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300/80';
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    if (first) {
      first.focus();
    }
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={
        isCentered
          ? 'fixed inset-0 z-[110] flex items-center justify-center px-4 py-6'
          : 'fixed inset-0 z-[110] flex items-end justify-center sm:items-center'
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby={hideHeader ? undefined : titleId}
      aria-label={hideHeader ? title : undefined}
    >
      <div
        className="absolute inset-0 bg-black/40 animate-[fade-in_200ms_ease-out]"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Enter' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />
      <div
        ref={panelRef}
        className={`relative w-full max-w-[520px] bg-white shadow-2xl animate-[slide-up_250ms_ease-out] sm:animate-[fade-in-up_200ms_ease-out] ${
          isCentered ? 'rounded-2xl' : 'rounded-t-2xl sm:rounded-2xl'
        } ${panelClassName}`}
      >
        {hideHeader ? (
          <>
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={promoCloseClass}
            >
              <CloseIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 id={titleId} className="text-lg font-bold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
