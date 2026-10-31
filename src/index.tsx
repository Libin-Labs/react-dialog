'use client';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type CSSProperties,
} from 'react';
export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  closeLabel?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  onError?: (error: Error) => void;
  className?: string;
  style?: CSSProperties;
}
export function useDialog(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  return {
    open,
    setOpen,
    show: () => setOpen(true),
    close: () => setOpen(false),
    dialogProps: { open, onOpenChange: setOpen },
  };
}
export function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  title = 'Dialog',
  description,
  children,
  closeLabel = 'Close',
  closeOnEscape = true,
  closeOnBackdrop = true,
  initialFocus,
  onError,
  className,
  style,
}: DialogProps) {
  const [internal, setOpen] = useState(defaultOpen);
  const open = controlled ?? internal;
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const callback = useRef(onOpenChange);
  callback.current = onOpenChange;
  const change = (next: boolean) => {
    if (controlled === undefined) setOpen(next);
    callback.current?.(next);
  };
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    try {
      if (typeof dialog.showModal !== 'function')
        throw new Error('Native modal dialogs are unsupported in this browser.');
      if (!dialog.open) dialog.showModal();
      initialFocus?.current?.focus();
      setError(null);
    } catch (reason) {
      const failure = reason instanceof Error ? reason : new Error(String(reason));
      setError(failure.message);
      onError?.(failure);
    }
    return () => {
      if (dialog.open) dialog.close();
      if (previous?.isConnected) previous.focus();
    };
  }, [open, initialFocus]);
  return (
    <>
      {error && open && <p role="alert">{error}</p>}
      <dialog
        ref={ref}
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        className={className}
        style={{
          maxWidth: 'min(640px, calc(100vw - 32px))',
          maxHeight: 'calc(100dvh - 32px)',
          overflow: 'auto',
          border: '1px solid GrayText',
          borderRadius: 6,
          ...style,
        }}
        onKeyDown={(event) => {
          if (
            event.key === 'Escape' &&
            closeOnEscape &&
            !event.defaultPrevented &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            event.stopPropagation();
            change(false);
          }
        }}
        onCancel={(event) => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          event.stopPropagation();
          if (closeOnEscape) change(false);
        }}
        onClose={(event) => {
          if (event.target !== event.currentTarget) return;
          event.stopPropagation();
          if (open) change(false);
        }}
        onClick={(event) => {
          if (!closeOnBackdrop || event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            change(false);
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <h2 id={`${id}-title`} style={{ margin: 0, fontSize: '1.2rem' }}>
            {title}
          </h2>
          <button type="button" aria-label={closeLabel} onClick={() => change(false)}>
            {closeLabel}
          </button>
        </header>
        {description && <p id={`${id}-description`}>{description}</p>}
        {children}
      </dialog>
    </>
  );
}
export default Dialog;
