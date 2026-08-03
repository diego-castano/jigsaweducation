'use client';

// The console UI kit. Single file by design (docs/admin-ui-spec.md): every
// admin module imports these primitives blindly, so the exported contract —
// names and props — is fixed. Styling recomposes the site's own theme tokens
// as a console: cream surfaces, navy chrome, orange actions, error-500 for
// destruction (never coral), JetBrains Mono for statuses and counts.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import Icon from '../components/Icon';

/* ----------------------------------------------------------------- helpers */

const cx = (...parts) => parts.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ----------------------------------------------------------------- Spinner */

export function Spinner({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cx('animate-spin', className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ Button */

const BUTTON_VARIANTS = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xs',
  secondary:
    'bg-white border border-cream-300 hover:border-navy-300 text-navy-800 font-bold',
  ghost: 'text-ink-700 hover:bg-cream-200 hover:text-navy-900 font-bold',
  danger: 'border border-error-500 text-error-700 hover:bg-error-50 font-bold',
  // Filled destruction is reserved for the inside of ConfirmDialog.
  'danger-solid': 'bg-error-500 hover:bg-error-700 text-white font-bold'
};

const BUTTON_SIZES = {
  sm: 'px-4 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-[15px] gap-2',
  lg: 'px-6 py-3 text-base gap-2'
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cx(
        'tactile inline-flex items-center justify-center rounded-full transition-colors',
        'disabled:opacity-60 disabled:pointer-events-none',
        FOCUS_RING,
        BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary,
        BUTTON_SIZES[size] || BUTTON_SIZES.md,
        className
      )}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 14 : 16} />
      ) : (
        icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} className="shrink-0" />
      )}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------- IconButton */

export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  className = '',
  ...rest
}) {
  const pad = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2';
  const glyph = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const look =
    variant === 'danger'
      ? 'text-error-700 hover:bg-error-50'
      : variant === 'solid'
        ? 'bg-navy-900 text-cream-100 hover:bg-navy-800'
        : 'text-ink-600 hover:bg-cream-200 hover:text-navy-900';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cx(
        'tactile inline-flex items-center justify-center rounded-full transition-colors',
        'disabled:opacity-50 disabled:pointer-events-none',
        FOCUS_RING,
        pad,
        look,
        className
      )}
      {...rest}
    >
      <Icon name={icon} size={glyph} />
    </button>
  );
}

/* -------------------------------------------------------- Input / Textarea */

const FIELD_BASE =
  // text-base: anything under 16px makes iOS Safari zoom the page on focus.
  'w-full px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-base text-ink-900 ' +
  'placeholder:text-ink-500 transition-colors focus:outline-none focus:border-orange-500 ' +
  'focus-visible:ring-2 focus-visible:ring-orange-500/30 disabled:opacity-60 disabled:bg-cream-100';

export function Input({ invalid = false, className = '', ...rest }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cx(FIELD_BASE, invalid && 'border-error-500 focus:border-error-500', className)}
      {...rest}
    />
  );
}

export function Textarea({ invalid = false, className = '', onInput, rows = 3, ...rest }) {
  const ref = useRef(null);

  const grow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, []);

  // Auto-grow on mount and whenever a controlled value changes underneath us.
  useEffect(() => {
    grow();
  });

  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      onInput={(e) => {
        grow();
        onInput?.(e);
      }}
      className={cx(
        FIELD_BASE,
        'resize-none overflow-hidden leading-relaxed',
        invalid && 'border-error-500 focus:border-error-500',
        className
      )}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------ NativeSelect */

export function NativeSelect({ invalid = false, className = '', children, ...rest }) {
  return (
    <span className={cx('relative inline-block w-full', className)}>
      <select
        aria-invalid={invalid || undefined}
        className={cx(
          FIELD_BASE,
          'appearance-none pr-10 cursor-pointer',
          invalid && 'border-error-500 focus:border-error-500'
        )}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ Switch */

export function Switch({ checked = false, onChange, label, disabled = false, id, className = '' }) {
  const autoId = useId();
  const switchId = id || autoId;

  return (
    <span className={cx('inline-flex items-center gap-3', className)}>
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cx(
          'tactile relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          'disabled:opacity-50 disabled:pointer-events-none',
          FOCUS_RING,
          checked ? 'bg-orange-500' : 'bg-cream-400'
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={switchId}
          className={cx('text-sm text-ink-800 select-none', !disabled && 'cursor-pointer')}
          onClick={() => !disabled && onChange?.(!checked)}
        >
          {label}
        </label>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------- Badge */

const BADGE_TONES = {
  neutral: 'bg-cream-200 text-ink-700',
  amber: 'bg-orange-100 text-orange-700',
  navy: 'bg-navy-100 text-navy-800',
  sea: 'bg-sea-100 text-sea-700',
  success: 'bg-sea-100 text-sea-700',
  error: 'bg-error-50 text-error-700',
  orange: 'bg-orange-500 text-white'
};

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5',
        'font-mono text-[11px] uppercase tracking-wider whitespace-nowrap',
        BADGE_TONES[tone] || BADGE_TONES.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------------- Kbd */

export function Kbd({ children, className = '' }) {
  return (
    <kbd
      className={cx(
        'inline-flex items-center rounded-md border border-cream-300 bg-cream-100 px-1.5 py-0.5',
        'font-mono text-[11px] text-ink-700 shadow-xs',
        className
      )}
    >
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------- Modal */

const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl'
};

export function Modal({ open, onClose, title, footer, size = 'md', children }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock, Escape, and a focus trap: focus moves into the panel on
  // open, Tab cycles inside it, and whoever opened it gets focus back.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      (nodes?.[0] || panelRef.current)?.focus?.();
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes?.length) return;
      const list = [...nodes];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-navy-900/50 motion-safe:animate-[fadeUp_0.15s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cx(
          'relative w-full flex flex-col bg-cream-50 shadow-xl slide-in',
          'rounded-t-3xl sm:rounded-3xl border border-cream-200',
          'max-h-[92dvh] sm:max-h-[85dvh]',
          MODAL_SIZES[size] || MODAL_SIZES.md
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-cream-200 shrink-0">
          {title && (
            <h2 id={titleId} className="font-display display-s text-xl text-navy-900">
              {title}
            </h2>
          )}
          <IconButton icon="x" label="Close" onClick={onClose} className="-mr-2" />
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">{children}</div>

        {footer && (
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-200 shrink-0"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ----------------------------------------------- ConfirmDialog + useConfirm */

export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            // The one place destructive actions render filled.
            variant={tone === 'danger' ? 'danger-solid' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {typeof body === 'string' ? (
        <p className="text-[15px] leading-relaxed text-ink-800">{body}</p>
      ) : (
        body
      )}
    </Modal>
  );
}

const ConfirmContext = createContext(null);

function ConfirmHost({ children }) {
  const [request, setRequest] = useState(null);

  const confirm = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        setRequest({ options, resolve });
      }),
    []
  );

  const settle = (answer) => {
    request?.resolve(answer);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={Boolean(request)}
        {...(request?.options || {})}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  );
}

// const confirm = useConfirm();
// if (await confirm({ title: 'Delete "Priya Sharma"?', body: '…', confirmLabel: 'Delete' })) { … }
export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm needs the ToastProvider above it in the tree.');
  return confirm;
}

/* ---------------------------------------------------- ToastProvider + useToast */

const ToastContext = createContext(null);

let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pending = timers.current;
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const show = useCallback(
    ({ message, tone = 'success', duration }) => {
      const id = ++toastSeq;
      setToasts((list) => [...list.slice(-3), { id, message, tone }]);
      const ms = duration ?? (tone === 'error' ? 6000 : 4000);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), ms)
      );
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      show,
      dismiss,
      success: (message) => show({ message, tone: 'success' }),
      error: (message) => show({ message, tone: 'error' })
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      <ConfirmHost>{children}</ConfirmHost>

      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-2 max-w-[min(24rem,calc(100vw-2.5rem))]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {toasts.map((toast) => (
              <div
                key={toast.id}
                role="status"
                className={cx(
                  'slide-in flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg text-sm leading-snug',
                  toast.tone === 'error'
                    ? 'bg-error-700 text-white'
                    : 'bg-navy-900 text-cream-100'
                )}
              >
                <Icon
                  name={toast.tone === 'error' ? 'alert' : 'check-circle'}
                  size={18}
                  className={cx(
                    'shrink-0 mt-px',
                    toast.tone === 'error' ? 'text-white' : 'text-orange-400'
                  )}
                />
                <p className="flex-1 pt-px">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="tactile -mr-1 -mt-0.5 rounded-full p-1 opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cream-100"
                >
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast needs the ToastProvider above it in the tree.');
  return api;
}

/* -------------------------------------------------------------- EmptyState */

export function EmptyState({ icon = 'sparkles', title, body, action = null }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-cream-300 bg-cream-100/60 px-8 py-14">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-200 text-navy-700">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="mt-4 font-display display-s text-lg text-navy-900">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-600">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- SearchInput */

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '', ...rest }) {
  return (
    <span className={cx('relative inline-block w-full', className)}>
      <Icon
        name="search"
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500"
      />
      <input
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cx(
          FIELD_BASE,
          'rounded-full pl-10',
          value ? 'pr-10' : 'pr-4',
          '[&::-webkit-search-cancel-button]:hidden'
        )}
        {...rest}
      />
      {value ? (
        <IconButton
          icon="x"
          size="sm"
          label="Clear search"
          onClick={() => onChange?.('')}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        />
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------- Tabs */

// tabs: [{ id, label, count? }] — count renders mono, per the Look rules.
export function Tabs({ tabs, active, onChange, label = 'Sections', className = '' }) {
  const refs = useRef([]);

  const onKeyDown = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + delta + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange?.(tabs[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx(
        'flex items-center gap-1 border-b border-cream-300 overflow-x-auto',
        className
      )}
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange?.(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cx(
              'relative shrink-0 px-4 py-2.5 text-sm rounded-t-lg transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset',
              selected
                ? 'font-bold text-navy-900'
                : 'text-ink-600 hover:text-navy-900 hover:bg-cream-100'
            )}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ml-1.5 font-mono text-xs text-ink-500">{tab.count}</span>
            )}
            {selected && (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-orange-500"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- Tooltip */

export function Tooltip({ label, side = 'top', className = '', children }) {
  const id = useId();
  const position =
    side === 'bottom'
      ? 'top-full mt-2 left-1/2 -translate-x-1/2'
      : side === 'right'
        ? 'left-full ml-2 top-1/2 -translate-y-1/2'
        : side === 'left'
          ? 'right-full mr-2 top-1/2 -translate-y-1/2'
          : 'bottom-full mb-2 left-1/2 -translate-x-1/2';

  return (
    <span className={cx('relative inline-flex group/tip', className)} aria-describedby={id}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={cx(
          'pointer-events-none absolute z-[80] whitespace-nowrap rounded-lg bg-navy-900 px-2.5 py-1.5',
          'text-xs text-cream-100 shadow-md opacity-0 transition-opacity duration-150',
          'group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
          position
        )}
      >
        {label}
      </span>
    </span>
  );
}
