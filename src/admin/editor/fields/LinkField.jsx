'use client';

import { useMemo, useState } from 'react';
import Icon from '../../../components/Icon.jsx';
import { Input } from '../../ui.jsx';
import usePopover from '../usePopover.js';

// A link is one href string. The segmented control decides how it is edited:
// internal links come from the server-provided `linkTargets` list (static
// routes plus collection item routes) so no URL is ever typed by hand;
// external links are a validated absolute URL.

const isInternal = (href) =>
  typeof href === 'string' && (href.startsWith('/') || href.startsWith('#'));

const SEGMENT_BASE =
  'flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ' +
  'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none';

export default function LinkField({ field, value, onChange, onBlur, error, inputId, linkTargets }) {
  const [mode, setMode] = useState(() => (value && !isInternal(value) ? 'external' : 'internal'));
  const { open, setOpen, close, rootRef, triggerRef } = usePopover();
  const [query, setQuery] = useState('');
  const targets = linkTargets || [];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return targets;
    return targets.filter(
      (target) =>
        target.label.toLowerCase().includes(needle) || target.href.toLowerCase().includes(needle)
    );
  }, [targets, query]);

  const current = targets.find((target) => target.href === value);

  const pick = (target) => {
    onChange(target.href);
    close();
    onBlur?.();
  };

  return (
    <div className="space-y-2">
      <div
        role="radiogroup"
        aria-label={`${field.label}: link type`}
        className="flex gap-1 rounded-full border border-cream-300 bg-cream-200/60 p-1"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'internal'}
          onClick={() => setMode('internal')}
          className={
            SEGMENT_BASE +
            (mode === 'internal' ? ' bg-cream-50 text-ink-800 shadow-xs' : ' text-ink-600 hover:text-ink-800')
          }
        >
          Page on this site
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'external'}
          onClick={() => setMode('external')}
          className={
            SEGMENT_BASE +
            (mode === 'external' ? ' bg-cream-50 text-ink-800 shadow-xs' : ' text-ink-600 hover:text-ink-800')
          }
        >
          External URL
        </button>
      </div>

      {mode === 'external' ? (
        <Input
          id={inputId}
          type="url"
          inputMode="url"
          spellCheck={false}
          placeholder="https://"
          value={value && !isInternal(value) ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          invalid={Boolean(error)}
          className="font-mono text-sm"
        />
      ) : (
        <div ref={rootRef} className="relative">
          <button
            ref={triggerRef}
            id={inputId}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={error ? true : undefined}
            onClick={() => {
              if (open) close();
              else {
                setQuery('');
                setOpen(true);
              }
            }}
            className={
              'flex w-full items-center justify-between gap-2 rounded-xl border bg-cream-50 px-3.5 py-2.5 text-left ' +
              'transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ' +
              'focus-visible:outline-none ' +
              (error ? 'border-error-500' : 'border-cream-300 hover:border-cream-400')
            }
          >
            {value && isInternal(value) ? (
              <span className="flex min-w-0 items-baseline gap-2">
                {current && <span className="truncate text-base text-ink-800">{current.label}</span>}
                <span className="truncate font-mono text-xs text-ink-500">{value}</span>
              </span>
            ) : (
              <span className="text-base text-ink-500">Choose a page…</span>
            )}
            <Icon name="chevron-down" size={16} className="shrink-0 text-ink-500" />
          </button>

          {open && (
            <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-cream-300 bg-cream-50 p-1.5 shadow-lg">
              <div className="relative mb-1.5">
                <Icon
                  name="search"
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-500"
                />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages…"
                  aria-label="Search pages"
                  className="w-full rounded-lg border border-cream-300 bg-white py-1.5 pr-3 pl-8 text-sm text-ink-800 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
                />
              </div>
              <ul role="listbox" aria-label={field.label} className="max-h-64 overflow-auto overscroll-contain">
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-sm text-ink-500">
                    {targets.length === 0
                      ? 'No pages available to link to here.'
                      : 'No page matches.'}
                  </li>
                )}
                {filtered.map((target) => {
                  const selected = target.href === value;
                  return (
                    <li key={target.href} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => pick(target)}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-cream-200 focus-visible:bg-cream-200 focus-visible:outline-none"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-ink-800">{target.label}</span>
                          <span className="block truncate font-mono text-xs text-ink-500">{target.href}</span>
                        </span>
                        {selected && <Icon name="check" size={14} className="shrink-0 text-orange-600" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
