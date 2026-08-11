'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { Button, IconButton } from '../ui.jsx';
import SchemaForm from './SchemaForm.jsx';

// The live-preview half of the singleton editor, plus the client wrapper that
// wires it to SchemaForm. The pane is the real page in an iframe with Next
// draft mode on (/api/preview). Until the wiring phase teaches the public
// pages to read drafts, the iframe shows the live page; the reload plumbing
// is already correct, so drafts appear here the moment wiring lands.
//
//   <PreviewPane route lastSavedAt onClose>   the pane itself
//   <SingletonEditor schema targetKey value draft linkTargets>
//     owns SchemaForm + PreviewPane: passes onSaved into the form, feeds the
//     save timestamp into the pane, and manages where the pane lives -
//     a second grid column from xl: up, a full-screen overlay below.

const STORAGE_KEY = 'jigsaw-admin:preview-open';
const XL_QUERY = '(min-width: 80rem)'; // Tailwind xl:
const RELOAD_DELAY_MS = 1200;

// The pane column is ~600-700px wide, so an unscaled iframe shows the site's
// tablet layout while claiming to be "Desktop". Instead the frame renders at
// a real viewport width and scales down to fit the pane, like a monitor seen
// from further away.
const DEVICE_WIDTHS = { desktop: 1440, phone: 390 };

const previewUrl = (route) => `/api/preview?to=${encodeURIComponent(route)}`;

const SEGMENT_BASE =
  'rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ' +
  'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none';

export default function PreviewPane({ route, lastSavedAt = 0, onClose }) {
  const [device, setDevice] = useState('desktop');
  const [fading, setFading] = useState(false);
  const [stage, setStage] = useState({ width: 0, height: 0 });

  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const scrollRef = useRef(null);
  const fadeGuardRef = useRef(null);

  // Track the stage size so the scaled frame always fits it exactly.
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStage({ width, height });
    });
    observer.observe(stageEl);
    return () => observer.disconnect();
  }, []);

  // Reload the framed page in place: remember its scroll position, dim it,
  // reload the window, then restore scroll once the fresh document lands.
  // Same-origin, so contentWindow is reachable; every touch is guarded
  // anyway in case the editor navigated the frame somewhere unexpected.
  const reload = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      scrollRef.current = frame.contentWindow.scrollY;
    } catch {
      scrollRef.current = null;
    }
    setFading(true);
    // A reload that never completes must not leave the pane dimmed forever.
    clearTimeout(fadeGuardRef.current);
    fadeGuardRef.current = setTimeout(() => setFading(false), 6000);
    try {
      frame.contentWindow.location.reload();
    } catch {
      frame.src = previewUrl(route);
    }
  }, [route]);

  const handleLoad = useCallback(() => {
    const frame = frameRef.current;
    if (frame && scrollRef.current != null) {
      try {
        frame.contentWindow.scrollTo(0, scrollRef.current);
      } catch {
        // Cross-origin or torn-down frame: the fade still clears below.
      }
      scrollRef.current = null;
    }
    clearTimeout(fadeGuardRef.current);
    setFading(false);
  }, []);

  // 1.2s after the LAST successful autosave: each new save timestamp clears
  // the previous timer, so a burst of saves triggers a single reload.
  useEffect(() => {
    if (!lastSavedAt) return undefined;
    const timer = setTimeout(reload, RELOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [lastSavedAt, reload]);

  useEffect(() => () => clearTimeout(fadeGuardRef.current), []);

  return (
    <section
      aria-label="Live page preview"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-100 shadow-sm"
    >
      <header className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 border-b border-cream-200 px-3 py-2">
        <span className="min-w-0 flex-1 basis-28 truncate font-mono text-xs text-ink-600" title={route}>
          {route}
        </span>

        <div
          role="group"
          aria-label="Preview width"
          className="flex items-center gap-0.5 rounded-full border border-cream-300 bg-cream-50 p-0.5"
        >
          <button
            type="button"
            aria-pressed={device === 'desktop'}
            onClick={() => setDevice('desktop')}
            className={
              SEGMENT_BASE +
              (device === 'desktop'
                ? ' bg-navy-900 text-cream-100'
                : ' text-ink-600 hover:text-navy-900')
            }
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={device === 'phone'}
            onClick={() => setDevice('phone')}
            className={
              SEGMENT_BASE +
              (device === 'phone'
                ? ' bg-navy-900 text-cream-100'
                : ' text-ink-600 hover:text-navy-900')
            }
          >
            Phone
          </button>
        </div>

        <button
          type="button"
          onClick={reload}
          className="tactile rounded-full px-2.5 py-1 text-xs font-bold text-ink-600 transition-colors hover:bg-cream-200 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
        >
          Refresh
        </button>

        <a
          href={previewUrl(route)}
          target="_blank"
          rel="noopener"
          className="tactile inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-ink-600 transition-colors hover:bg-cream-200 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
        >
          Open
          <Icon name="arrow-up-right" size={12} />
        </a>

        {onClose && <IconButton icon="x" label="Close the preview" size="sm" onClick={onClose} />}
      </header>

      {(() => {
        const viewportWidth = DEVICE_WIDTHS[device];
        const pad = device === 'phone' ? 16 : 12;
        const availableWidth = Math.max(stage.width - pad * 2, 0);
        const availableHeight = Math.max(stage.height - pad * 2, 0);
        // The iframe always renders at the full device width; the box shrinks
        // it to fit the pane. scale 1 means the pane is wider than the device.
        const scale = availableWidth > 0 ? Math.min(1, availableWidth / viewportWidth) : 1;
        const frameHeight = scale > 0 ? availableHeight / scale : availableHeight;

        return (
          <div ref={stageRef} className="min-h-0 flex-1 overflow-hidden bg-cream-200/60">
            {stage.width > 0 && (
              <div className="flex h-full items-start justify-center" style={{ padding: pad }}>
                <div
                  className={
                    'overflow-hidden bg-white ' +
                    (device === 'phone'
                      ? 'rounded-2xl border border-cream-300 shadow-md'
                      : 'rounded-lg border border-cream-300 shadow-sm')
                  }
                  style={{ width: viewportWidth * scale, height: availableHeight }}
                >
                  <iframe
                    ref={frameRef}
                    src={previewUrl(route)}
                    title={`Preview of ${route}`}
                    onLoad={handleLoad}
                    className={
                      'border-0 bg-white motion-safe:transition-opacity motion-safe:duration-300 ' +
                      (fading ? 'opacity-40' : 'opacity-100')
                    }
                    style={{
                      width: viewportWidth,
                      height: frameHeight,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </section>
  );
}

// The client wrapper the singleton page renders. Owns the save timestamp the
// pane reloads on, and the pane's two lives: a persistent second column at
// xl: (open state remembered in localStorage) and a full-screen overlay
// below xl: behind the action bar's Preview button.
export function SingletonEditor({ schema, targetKey, value, draft, linkTargets, brand }) {
  const route = schema.route;

  const [paneOpen, setPaneOpen] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(0);
  const overlayRef = useRef(null);
  const returnFocusRef = useRef(null);

  const handleSaved = useCallback(() => setLastSavedAt(Date.now()), []);

  // Hydrate the remembered state after mount - the server render cannot read
  // localStorage, so it always paints the default (open) two-pane layout.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === 'closed') setPaneOpen(false);
    } catch {
      // Storage blocked: the pane just defaults to open each visit.
    }
  }, []);

  const persistPane = (open) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, open ? 'open' : 'closed');
    } catch {
      // Ignore: preference simply is not remembered.
    }
  };

  const togglePreview = useCallback(() => {
    if (window.matchMedia(XL_QUERY).matches) {
      setPaneOpen((current) => {
        persistPane(!current);
        return !current;
      });
    } else {
      returnFocusRef.current = document.activeElement;
      setOverlayOpen(true);
    }
  }, []);

  const closePane = useCallback(() => {
    if (window.matchMedia(XL_QUERY).matches) {
      setPaneOpen(false);
      persistPane(false);
    }
    setOverlayOpen(false);
  }, []);

  // Overlay behaviour below xl:: lock the page scroll, close on Escape,
  // dissolve into the two-pane layout if the window grows past xl:.
  useEffect(() => {
    if (!overlayOpen) return undefined;

    overlayRef.current?.focus();

    const media = window.matchMedia(XL_QUERY);
    const onMediaChange = () => {
      if (media.matches) setOverlayOpen(false);
    };
    media.addEventListener('change', onMediaChange);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOverlayOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      media.removeEventListener('change', onMediaChange);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      const back = returnFocusRef.current;
      if (back && typeof back.focus === 'function') back.focus();
    };
  }, [overlayOpen]);

  const form = (
    <SchemaForm
      schema={schema}
      targetType="singleton"
      targetKey={targetKey}
      value={value}
      draft={draft}
      linkTargets={linkTargets}
      brand={brand}
      onSaved={route ? handleSaved : undefined}
      onTogglePreview={route ? togglePreview : undefined}
    />
  );

  // Singletons without a public route (settings groups) get no preview pane.
  if (!route) return form;

  const paneVisible = paneOpen || overlayOpen;

  return (
    <div
      className={
        paneOpen ? 'xl:grid xl:grid-cols-[minmax(480px,1fr)_minmax(0,1fr)] xl:items-start xl:gap-6' : ''
      }
    >
      <div className="min-w-0">
        {/* The toggle lives at the top of the form as well as in the action
            bar, so hiding the preview to work full-width is always one
            visible click away. */}
        <div className="mb-4 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon="eye"
            onClick={togglePreview}
            aria-pressed={paneOpen}
          >
            <span className="xl:hidden">Preview</span>
            <span className="hidden xl:inline">{paneOpen ? 'Hide preview' : 'Show preview'}</span>
          </Button>
        </div>
        {form}
      </div>

      {paneVisible && (
        <div
          ref={overlayRef}
          tabIndex={-1}
          role={overlayOpen ? 'dialog' : undefined}
          aria-modal={overlayOpen ? 'true' : undefined}
          aria-label={overlayOpen ? 'Live page preview' : undefined}
          className={
            overlayOpen
              ? 'overlay-backdrop-enter fixed inset-0 z-50 flex flex-col bg-navy-900/50 p-3 backdrop-blur-sm outline-none sm:p-6'
              : 'preview-pane-enter hidden xl:sticky xl:top-2 xl:block xl:h-[calc(100dvh-7rem)]'
          }
        >
          <div className={overlayOpen ? 'overlay-panel-enter flex min-h-0 flex-1 flex-col' : 'h-full'}>
            <PreviewPane route={route} lastSavedAt={lastSavedAt} onClose={closePane} />
          </div>
        </div>
      )}
    </div>
  );
}
