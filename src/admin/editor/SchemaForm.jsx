'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { discardDraft, publishContent, saveDraft } from '../../cms/actions/content.js';
import { Button, Spinner, useConfirm, useToast } from '../ui.jsx';
import Icon from '../../components/Icon.jsx';
import useScrollSpy from '../../hooks/useScrollSpy.js';
import FieldRenderer from './FieldRenderer.jsx';
import { collectErrors, fieldDomId, getPath, setPath, topKeyOf } from './validate.js';

// The generic editor. Renders any singleton or collection-item schema as
// anchored section cards, autosaves the draft 800ms after the last change,
// and owns the action bar (status pill · Preview · Discard draft · Publish).
//
// Props:
//   schema         singleton schema (with .sections) or collection schema
//   targetType     'singleton' | collection key — first argument to the actions
//   targetKey      singleton key | item uuid
//   value          the published document (data column)
//   draft          the draft document or null
//   sections       optional override of schema.sections; collection items
//                  without sections render one card of schema.fields
//   linkTargets    [{ label, href }] for link fields (routes + item routes)
//   onTogglePreview  optional; when given, the Preview button appears
//
// Autosave sends ONLY the top-level keys that changed since the last save.
// Dotted field names (sections.criticalQuestion) always ship their whole
// top-level object, because saveDraft merges the patch shallowly in jsonb.

const AUTOSAVE_MS = 800;

const timeNow = () =>
  new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// Live "how it looks on Google" card inside every SEO section. Approximate
// on purpose (Google renders however it likes) but honest about the two
// levers the editor controls: title and description, cut where Google cuts.
function SerpPreview({ schema, doc, brand }) {
  const isHome = schema?.key === 'page-home';
  const orgName = brand?.name || 'Jigsaw';
  const host = brand?.host || 'www.jigsaweducation.org';
  const bareHost = host.replace(/^www\./, '');
  const rawTitle = String(doc?.title || '').trim();
  const title = rawTitle ? (isHome ? rawTitle : `${rawTitle} — ${orgName}`) : 'Untitled page';
  const description = String(doc?.description || '').trim();
  const path = schema?.route && schema.route !== '/' ? schema.route : '';

  return (
    <div className="mt-6 rounded-xl border border-cream-300 bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        Search preview
      </p>
      <div className="mt-3">
        <p className="flex items-center gap-1.5 text-[13px] text-ink-700">
          <span className="grid size-6 place-items-center rounded-full bg-cream-200 font-display text-[11px] text-navy-900">
            {orgName.charAt(0).toUpperCase()}
          </span>
          <span className="leading-tight">
            {bareHost}
            <span className="block text-xs text-ink-500">
              {host}
              {path}
            </span>
          </span>
        </p>
        <p className="mt-1.5 truncate text-xl leading-snug text-[#1a0dab]">{title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-normal text-ink-700">
          {description || 'No description yet — search engines will pick their own text.'}
        </p>
      </div>
      {doc?.noIndex && (
        <p className="mt-3 rounded-lg bg-warning-50 px-3 py-2 text-xs text-warning-700">
          Hidden from search engines: this page will not appear in results at all.
        </p>
      )}
    </div>
  );
}

// The autosave voice. Everything saves by itself; this chip is how the
// editor KNOWS it did — so it speaks in full states, tinted and iconed,
// never just a coloured dot.
function StatusPill({ status, draftExists }) {
  let chip = 'bg-cream-200 text-ink-700';
  let icon = <Icon name="check" size={13} className="shrink-0" />;
  let label = 'Published — up to date';

  if (status.state === 'saving') {
    chip = 'bg-sea-100 text-sea-700';
    icon = <Spinner size={13} className="shrink-0" />;
    label = 'Saving…';
  } else if (status.state === 'saved') {
    chip = 'bg-success-50 text-success-700';
    icon = <Icon name="check-circle" size={13} className="shrink-0" />;
    label = `All changes saved ${status.at}`;
  } else if (status.state === 'error') {
    chip = 'bg-error-50 text-error-700';
    icon = <Icon name="alert" size={13} className="shrink-0" />;
    label = 'Not saved — check your connection and type again';
  } else if (draftExists) {
    chip = 'bg-warning-50 text-warning-700';
    icon = <Icon name="edit" size={13} className="shrink-0" />;
    label = 'Draft saved — not published yet';
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex min-w-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs ${chip}`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}

export default function SchemaForm({
  schema,
  targetType,
  targetKey,
  value,
  draft,
  sections: sectionsProp,
  linkTargets,
  brand,
  onTogglePreview,
}) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const sections = useMemo(() => {
    if (sectionsProp) return sectionsProp;
    if (schema.sections) return schema.sections;
    return [{ id: 'fields', title: schema.title, fields: schema.fields }];
  }, [sectionsProp, schema]);

  const allFields = useMemo(() => sections.flatMap((s) => s.fields), [sections]);

  // Form state: the draft merged over the published document. Draft rows are
  // whole top-level values (jsonb || is shallow), so a shallow merge is exact.
  const [doc, setDoc] = useState(() => ({ ...(value || {}), ...(draft || {}) }));
  const [errors, setErrors] = useState({});
  const [draftExists, setDraftExists] = useState(
    () => draft != null && Object.keys(draft).length > 0
  );
  const [status, setStatus] = useState({ state: 'idle', at: null });
  const [publishing, setPublishing] = useState(false);

  // --- Autosave machinery, all refs so no keystroke is ever lost -----------
  const docRef = useRef(doc);
  const pendingRef = useRef(new Set());
  const timerRef = useRef(null);
  const flushingRef = useRef(null);

  // One flush drains everything pending, including keys added while a save
  // is in flight. Errors requeue the keys and surface once.
  const flush = useCallback(() => {
    if (flushingRef.current) return flushingRef.current;
    flushingRef.current = (async () => {
      try {
        while (pendingRef.current.size > 0) {
          const keys = [...pendingRef.current];
          pendingRef.current.clear();
          const patch = {};
          keys.forEach((key) => {
            patch[key] = docRef.current[key];
          });
          setStatus({ state: 'saving', at: null });
          try {
            await saveDraft(targetType, targetKey, patch);
            setDraftExists(true);
            setStatus({ state: 'saved', at: timeNow() });
          } catch (err) {
            keys.forEach((key) => pendingRef.current.add(key));
            setStatus({ state: 'error', at: null });
            throw err;
          }
        }
      } finally {
        flushingRef.current = null;
      }
    })();
    return flushingRef.current;
  }, [targetType, targetKey]);

  const scheduleSave = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      flush().catch(() => {
        toast.error('Your latest change could not be saved. It is kept here — check your connection.');
        // Retry once the queue has settled; pending keys are still queued.
        timerRef.current = setTimeout(() => flush().catch(() => {}), 4000);
      });
    }, AUTOSAVE_MS);
  }, [flush, toast]);

  const handleFieldChange = useCallback(
    (name, fieldValue) => {
      const next = setPath(docRef.current, name, fieldValue);
      docRef.current = next;
      setDoc(next);
      pendingRef.current.add(topKeyOf(name));
      scheduleSave();
    },
    [scheduleSave]
  );

  // Unsent changes at navigation time deserve a browser warning.
  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (pendingRef.current.size > 0 || flushingRef.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      clearTimeout(timerRef.current);
    };
  }, []);

  // --- Validation ----------------------------------------------------------
  const setError = useCallback((path, message) => {
    setErrors((current) => {
      if (!message) {
        if (!current[path]) return current;
        const next = { ...current };
        delete next[path];
        return next;
      }
      if (current[path] === message) return current;
      return { ...current, [path]: message };
    });
  }, []);

  // --- Actions -------------------------------------------------------------
  const handlePublish = async () => {
    const found = collectErrors(allFields, docRef.current);
    if (found.length > 0) {
      setErrors((current) => {
        const next = { ...current };
        found.forEach((item) => {
          next[item.path] = item.message;
        });
        return next;
      });
      const first = found[0];
      toast.error(`Cannot publish yet — ${first.label}: ${first.message}`);
      // Collapsed list rows with errors expand on the errors update; scroll
      // once that render has landed.
      setTimeout(() => {
        document
          .getElementById(fieldDomId(first.path))
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      return;
    }

    setPublishing(true);
    try {
      clearTimeout(timerRef.current);
      if (pendingRef.current.size > 0 || flushingRef.current) await flush();
      await publishContent(targetType, targetKey);
      setDraftExists(false);
      setStatus({ state: 'idle', at: null });
      toast.success('Published — the site is live with your changes.');
      router.refresh();
    } catch {
      toast.error('Publishing failed. Your draft is safe — try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDiscard = async () => {
    const name = schema.title || 'this page';
    const ok = await confirm({
      title: 'Discard draft?',
      body: `Every unpublished change to ${name} will be thrown away. The live site is not affected.`,
      confirmLabel: 'Discard draft',
    });
    if (!ok) return;
    try {
      clearTimeout(timerRef.current);
      pendingRef.current.clear();
      // A save already on the wire would re-create the draft after the
      // discard; let it land first, then discard on top of it.
      if (flushingRef.current) await flushingRef.current.catch(() => {});
      await discardDraft(targetType, targetKey);
      const reset = { ...(value || {}) };
      docRef.current = reset;
      setDoc(reset);
      setErrors({});
      setDraftExists(false);
      setStatus({ state: 'idle', at: null });
      toast.success('Draft discarded.');
      router.refresh();
    } catch {
      toast.error('The draft could not be discarded. Try again.');
    }
  };

  // --- Section navigation --------------------------------------------------
  const showSectionNav = sections.length >= 3;
  const sectionIds = useMemo(() => sections.map((s) => `sec-${s.id}`), [sections]);
  const activeSection = useScrollSpy(showSectionNav ? sectionIds : []);

  return (
    <div>
      <div className={showSectionNav ? 'lg:flex lg:items-start lg:gap-8' : ''}>
      {showSectionNav && (
        <nav
          aria-label="Sections on this page"
          className="sticky top-2 hidden w-44 shrink-0 self-start lg:block"
        >
          <ul className="space-y-0.5 border-l border-cream-300">
            {sections.map((section) => {
              const active = activeSection === `sec-${section.id}`;
              return (
                <li key={section.id}>
                  <a
                    href={`#sec-${section.id}`}
                    onClick={(event) => {
                      // Animated glide instead of the browser's hard jump —
                      // unless the user asked for reduced motion.
                      event.preventDefault();
                      const target = document.getElementById(`sec-${section.id}`);
                      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                      window.history.replaceState(null, '', `#sec-${section.id}`);
                    }}
                    aria-current={active ? 'true' : undefined}
                    className={
                      '-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors ' +
                      'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none ' +
                      (active
                        ? 'border-orange-500 font-medium text-ink-900'
                        : 'border-transparent text-ink-600 hover:border-cream-400 hover:text-ink-800')
                    }
                  >
                    {section.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="min-w-0 flex-1">
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              id={`sec-${section.id}`}
              aria-labelledby={`sec-${section.id}-h`}
              className="scroll-mt-4 rounded-2xl border border-cream-200 bg-cream-100 p-6 shadow-xs sm:p-8"
            >
              <h2 id={`sec-${section.id}-h`} className="font-display text-xl text-ink-900">
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-1.5 text-sm text-ink-600">{section.description}</p>
              )}
              {section.id === 'seo' && <SerpPreview schema={schema} doc={doc} brand={brand} />}
              <div className="mt-7 space-y-8">
                {section.fields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    path={field.name}
                    value={getPath(doc, field.name)}
                    onChange={(next) => handleFieldChange(field.name, next)}
                    errors={errors}
                    setError={setError}
                    linkTargets={linkTargets}
                    onSiblingChange={handleFieldChange}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      </div>

      {/* Full form width — under the section rail as well, so the buttons
          never fight the fields for room. */}
      <div className="sticky bottom-0 z-20 mt-6 -mx-1 pb-2">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-cream-200 bg-cream-100/85 p-2.5 shadow-md backdrop-blur">
            <StatusPill status={status} draftExists={draftExists} />
            <span className="flex-1" />
            {onTogglePreview && (
              <Button variant="secondary" size="sm" icon="eye" onClick={onTogglePreview}>
                Preview
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleDiscard} disabled={!draftExists}>
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublish}
              disabled={!draftExists || publishing}
              loading={publishing}
            >
              Publish
            </Button>
        </div>
      </div>
    </div>
  );
}

export { FieldRenderer };
