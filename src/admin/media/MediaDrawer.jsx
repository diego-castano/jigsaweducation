'use client';

// The media detail drawer: large preview, file facts, alt text that autosaves,
// where the file is used, Copy URL and a guarded Delete. Slides in from the
// right over the library; Escape or the scrim closes it.

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../components/Icon.jsx';
import { Button, IconButton, Spinner, Textarea, useConfirm, useToast } from '../ui.jsx';
import { deleteMedia, getMediaUsage, setFocalPoint, updateAlt } from '../../cms/actions/media.js';
import { getCollectionSchema, getSingletonSchema } from '../../cms/schema.js';
import { fileExt, formatDate, formatSize, isImageMime } from './format.js';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MediaDrawer({ item, onClose, onAltSaved, onDeleted }) {
  // Inline onClose props change identity per render; the trap must not
  // re-run for that (re-running yanks focus mid-typing in the alt field).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const toast = useToast();
  const confirm = useConfirm();
  const altId = useId();
  const panelRef = useRef(null);
  const altTimer = useRef(null);
  const pendingAlt = useRef(null);
  const confirmOpen = useRef(false);

  const [usage, setUsage] = useState(null);
  const [usageError, setUsageError] = useState(false);
  const [alt, setAlt] = useState(item.alt || '');
  const [altStatus, setAltStatus] = useState('idle'); // idle | saving | saved
  const [deleting, setDeleting] = useState(false);
  const [focal, setFocal] = useState(
    item.focal_x != null ? { x: item.focal_x, y: item.focal_y } : null
  );

  const image = isImageMime(item.mime);

  // Fresh state when the drawer moves to another file.
  useEffect(() => {
    setAlt(item.alt || '');
    setAltStatus('idle');
    setFocal(item.focal_x != null ? { x: item.focal_x, y: item.focal_y } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  // Focal point: click the preview to mark the part of the image that must
  // stay in frame wherever the site crops it. Optimistic; a failed save
  // reverts and says so.
  const applyFocal = async (next) => {
    const previous = focal;
    setFocal(next);
    const result = await setFocalPoint(item.id, next?.x ?? null, next?.y ?? null);
    if (result?.error) {
      setFocal(previous);
      toast.error(result.error);
    } else {
      toast.success(next ? 'Focal point saved: crops now keep it in frame.' : 'Focal point cleared.');
    }
  };

  const onPreviewClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    applyFocal({ x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) });
  };

  // "Where it's used" loads on open. Delete stays locked until it answers.
  useEffect(() => {
    let cancelled = false;
    setUsage(null);
    setUsageError(false);
    getMediaUsage(item.id)
      .then((result) => {
        if (cancelled) return;
        if (result?.error) setUsageError(true);
        else setUsage(result);
      })
      .catch(() => {
        if (!cancelled) setUsageError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [item.id]);

  // Scroll lock, Escape and a focus trap, mirroring the UI kit's Modal. The
  // Escape guard steps aside while the delete ConfirmDialog is on top.
  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';

    const frame = requestAnimationFrame(() => {
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      (nodes?.[0] || panelRef.current)?.focus?.();
    });

    const onKey = (event) => {
      if (confirmOpen.current) return;
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes?.length) return;
      const list = [...nodes];
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
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
  }, []);

  const saveAlt = async (value) => {
    pendingAlt.current = null;
    const result = await updateAlt(item.id, value.trim());
    if (result?.error) {
      setAltStatus('idle');
      toast.error(result.error);
      return;
    }
    setAltStatus('saved');
    onAltSaved?.(item.id, value.trim());
  };

  const queueAltSave = (value) => {
    setAlt(value);
    setAltStatus('saving');
    pendingAlt.current = value;
    clearTimeout(altTimer.current);
    altTimer.current = setTimeout(() => saveAlt(value), 700);
  };

  // A pending edit still saves if the drawer closes mid-debounce.
  useEffect(
    () => () => {
      clearTimeout(altTimer.current);
      if (pendingAlt.current != null) updateAlt(item.id, pendingAlt.current.trim());
    },
    [item.id]
  );

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${item.url}`);
      toast.success('URL copied to the clipboard.');
    } catch {
      toast.error('Copying failed: use the path shown under the filename.');
    }
  };

  const inUse = usage ? usage.count > 0 : true; // unknown counts as in use
  const askDelete = async () => {
    confirmOpen.current = true;
    const ok = await confirm({
      title: `Delete “${item.filename}”?`,
      body: 'The file leaves the library and its address stops working. This cannot be undone.',
      confirmLabel: 'Delete file'
    });
    confirmOpen.current = false;
    if (!ok) return;
    setDeleting(true);
    const result = await deleteMedia(item.id);
    setDeleting(false);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(`Deleted ${item.filename}.`);
    onDeleted?.(item.id);
  };

  const facts = [
    ['Type', `${fileExt(item)}${image ? ' image' : ' document'}`],
    item.width && item.height ? ['Dimensions', `${item.width} × ${item.height} px`] : null,
    ['Size', formatSize(item.size)],
    ['Uploaded', formatDate(item.createdAt)]
  ].filter(Boolean);

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-navy-900/40 motion-safe:animate-[fadeUp_0.15s_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${item.filename}`}
        tabIndex={-1}
        className="slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-hidden border-l border-cream-200 bg-cream-50 shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-cream-200 px-5 pb-4 pt-5">
          <div className="min-w-0">
            <h2 className="truncate font-mono text-sm text-navy-900" title={item.filename}>
              {item.filename}
            </h2>
            <p className="mt-1 truncate font-mono text-xs text-ink-500" title={item.url}>
              {item.url}
            </p>
          </div>
          <IconButton icon="x" label="Close details" onClick={onClose} className="-mr-1 -mt-1" />
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
          {/* Preview */}
          {image ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={onPreviewClick}
                title="Click to set the focal point"
                aria-label="Set the focal point by clicking the important part of the image"
                className="relative block w-full cursor-crosshair overflow-hidden rounded-xl border border-cream-200 bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <img src={item.url} alt={alt || ''} className="max-h-72 w-full object-contain" />
                {focal && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
                    style={{ left: `${focal.x * 100}%`, top: `${focal.y * 100}%` }}
                  >
                    <span className="absolute inset-0 rounded-full border-2 border-white shadow-md" />
                    <span className="size-1.5 rounded-full bg-orange-500" />
                  </span>
                )}
              </button>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-ink-600">
                  {focal
                    ? 'Crops on the site keep the marked point in frame.'
                    : 'Click the important part of the image so crops never cut it off.'}
                </p>
                {focal && (
                  <button
                    type="button"
                    onClick={() => applyFocal(null)}
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-ink-600 transition-colors hover:bg-cream-200 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Reset to centre
                  </button>
                )}
              </div>
            </div>
          ) : (
            <a
              href={item.url}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-4 rounded-xl border border-cream-200 bg-cream-100 p-5 transition-colors hover:border-navy-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-navy-900 text-cream-100">
                <Icon name="file-text" size={26} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-navy-900">
                  Open the {fileExt(item)}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-600">
                  Opens in a new tab <Icon name="arrow-up-right" size={12} />
                </span>
              </span>
            </a>
          )}

          {/* Facts */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-500">{label}</dt>
                <dd className="mt-0.5 font-mono text-sm text-ink-800">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Alt text: images only, autosaved */}
          {image && (
            <section className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={altId} className="text-sm font-bold text-ink-800">
                  Alt text
                </label>
                <span
                  aria-live="polite"
                  className="font-mono text-[11px] uppercase tracking-wider text-ink-500"
                >
                  {altStatus === 'saving' ? 'Saving…' : altStatus === 'saved' ? 'Saved' : ''}
                </span>
              </div>
              <p className="text-xs leading-snug text-ink-600">
                What a screen reader says instead of the image. It applies everywhere the
                image appears, and saves as you type.
              </p>
              <Textarea
                id={altId}
                rows={2}
                value={alt}
                onChange={(event) => queueAltSave(event.target.value)}
              />
            </section>
          )}

          {/* Where it's used */}
          <section aria-busy={!usage && !usageError ? 'true' : undefined}>
            <h3 className="font-display display-s text-base text-navy-900">
              Where it&rsquo;s used
            </h3>
            <div className="mt-2">
              {usageError ? (
                <p className="text-sm text-ink-600">
                  The usage check failed. Close this panel and open it again to retry.
                </p>
              ) : !usage ? (
                <p className="flex items-center gap-2 text-sm text-ink-600">
                  <Spinner size={14} /> Checking the site…
                </p>
              ) : usage.count === 0 ? (
                <p className="text-sm text-ink-600">Not used on any page.</p>
              ) : (
                <ul className="space-y-1.5">
                  {usage.singletons.map((key) => {
                    const schema = getSingletonSchema(key);
                    return (
                      <li key={key} className="flex items-center gap-2 text-sm text-ink-800">
                        <Icon
                          name={schema?.icon || 'file-text'}
                          size={14}
                          className="shrink-0 text-ink-500"
                        />
                        <span className="truncate">{schema?.title || key}</span>
                      </li>
                    );
                  })}
                  {usage.items.map(({ collection, slug }) => {
                    const schema = getCollectionSchema(collection);
                    return (
                      <li
                        key={`${collection}/${slug}`}
                        className="flex items-center gap-2 text-sm text-ink-800"
                      >
                        <Icon
                          name={schema?.icon || 'layers'}
                          size={14}
                          className="shrink-0 text-ink-500"
                        />
                        <span className="min-w-0 truncate">
                          {schema?.title || collection}
                          <span className="text-ink-500"> · </span>
                          <span className="font-mono text-xs">{slug}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>

        <footer
          className="space-y-2 border-t border-cream-200 px-5 py-4"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon="copy" onClick={copyUrl}>
              Copy URL
            </Button>
            <Button
              variant="danger"
              icon="trash"
              onClick={askDelete}
              disabled={inUse}
              loading={deleting}
            >
              Delete
            </Button>
          </div>
          {usage && usage.count > 0 && (
            <p className="text-xs leading-snug text-ink-600">
              This file cannot be deleted while it is in use. Remove it from the{' '}
              {usage.count === 1 ? 'page' : 'pages'} listed above first.
            </p>
          )}
        </footer>
      </aside>
    </div>,
    document.body
  );
}
