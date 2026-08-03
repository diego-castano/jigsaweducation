'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '../../components/Icon.jsx';
import { Button, useToast } from '../ui.jsx';
import SchemaForm from '../editor/SchemaForm.jsx';
import PreviewPane from '../editor/PreviewPane.jsx';
import { fieldDomId } from '../editor/validate.js';
import { publishContent, setItemStatus } from '../../cms/actions/content.js';
import StatusSwitch from './StatusSwitch.jsx';
import DangerZone from './DangerZone.jsx';

// One collection item: header (back link, live title, Visible/Hidden switch),
// the same SchemaForm engine the pages use, the live preview pane, and the
// danger-zone footer. Publishing a hidden item deserves a single move, so the
// header offers "Publish and make visible" — publishContent then
// setItemStatus, because publish alone never flips visibility.
//
// The preview mirrors the singleton editor exactly: a second grid column from
// xl: up whose open state is remembered (same localStorage key, so the
// preference carries across the whole console), a full-screen overlay below.

const STORAGE_KEY = 'jigsaw-admin:preview-open';
const XL_QUERY = '(min-width: 80rem)'; // Tailwind xl:

export default function ItemEditor({
  meta, // { key, title, itemLabel, route, itemRoute, titleField }
  fields,
  itemId,
  slug,
  status: initialStatus,
  value,
  draft,
  initialTitle,
}) {
  const router = useRouter();
  const toast = useToast();

  const [status, setStatus] = useState(initialStatus);
  const [goingLive, setGoingLive] = useState(false);

  // The header title tracks the title field as it is typed: the form bubbles
  // input events up, and the title control's DOM id is deterministic.
  const [title, setTitle] = useState(initialTitle);
  const titleInputId = `${fieldDomId(meta.titleField)}-input`;
  const handleFormInput = (event) => {
    const target = event.target;
    if (target?.id === titleInputId) {
      setTitle(target.value.trim() || `Untitled ${meta.itemLabel}`);
    }
  };

  const publishAndShow = async () => {
    setGoingLive(true);
    try {
      // publishContent folds the draft into the live data but never touches
      // visibility; the status flip is a second, deliberate step.
      await publishContent(meta.key, itemId);
      await setItemStatus(meta.key, itemId, 'published');
      setStatus('published');
      toast.success(`Published and visible — the ${meta.itemLabel} is live on the site.`);
      router.refresh();
    } catch {
      toast.error('That did not go through. Nothing changed — try again.');
    } finally {
      setGoingLive(false);
    }
  };

  // --- Preview pane plumbing (mirrors SingletonEditor) ---------------------
  const previewRoute = meta.itemRoute ? meta.itemRoute.replace(':slug', slug) : meta.route;

  const [paneOpen, setPaneOpen] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(0);
  const overlayRef = useRef(null);
  const returnFocusRef = useRef(null);

  const handleSaved = useCallback(() => setLastSavedAt(Date.now()), []);

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

  const paneVisible = paneOpen || overlayOpen;

  return (
    <div className="space-y-6">
      <header className="reveal space-y-3">
        <Link
          href={`/admin/collections/${meta.key}`}
          className="inline-flex items-center gap-1 rounded-full text-sm font-bold text-ink-600 transition-colors hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
        >
          <Icon name="chevron-left" size={14} aria-hidden="true" />
          {meta.title}
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <h1 className="min-w-0 font-display display-s text-3xl break-words text-navy-900">
            {title}
          </h1>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <StatusSwitch
              collection={meta.key}
              id={itemId}
              title={title}
              itemLabel={meta.itemLabel}
              status={status}
              onChange={setStatus}
            />
            {status === 'hidden' && (
              <Button size="sm" onClick={publishAndShow} loading={goingLive}>
                Publish and make visible
              </Button>
            )}
          </div>
        </div>

        {status === 'hidden' && (
          <p className="text-sm text-ink-600">
            Hidden — visitors cannot see this {meta.itemLabel}. Publish alone keeps it hidden;
            “Publish and make visible” puts your latest edits live in one go.
          </p>
        )}
      </header>

      <div
        className={
          'reveal reveal-1 ' +
          (paneOpen
            ? 'xl:grid xl:grid-cols-[minmax(480px,1fr)_minmax(0,1fr)] xl:items-start xl:gap-6'
            : '')
        }
      >
        <div className="min-w-0" onInput={handleFormInput}>
          <SchemaForm
            schema={{ title: `this ${meta.itemLabel}`, fields }}
            sections={[{ id: 'details', title: 'Details', fields }]}
            targetType={meta.key}
            targetKey={itemId}
            value={value}
            draft={draft}
            onSaved={handleSaved}
            onTogglePreview={togglePreview}
          />

          <DangerZone
            collection={meta.key}
            id={itemId}
            title={title}
            itemLabel={meta.itemLabel}
            slug={slug}
          />
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
                ? 'fixed inset-0 z-50 flex flex-col bg-navy-900/50 p-3 backdrop-blur-sm outline-none sm:p-6'
                : 'hidden xl:sticky xl:top-24 xl:block xl:h-[calc(100dvh-8rem)]'
            }
          >
            <PreviewPane route={previewRoute} lastSavedAt={lastSavedAt} onClose={closePane} />
          </div>
        )}
      </div>
    </div>
  );
}
