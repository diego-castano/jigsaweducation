'use client';

import { useMemo, useState } from 'react';
import Icon from '../../../components/Icon.jsx';
import { ICON_PATHS } from '../../../icons/index.js';
import usePopover from '../usePopover.js';

// Visual picker over the site's icon set, rendered live via the real Icon
// component so what the editor picks is exactly what the page draws.
const ICON_NAMES = Object.keys(ICON_PATHS);

export default function IconField({ field, value, onChange, onBlur, error, inputId }) {
  const { open, setOpen, close, rootRef, triggerRef } = usePopover();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return ICON_NAMES;
    return ICON_NAMES.filter((name) => name.includes(needle));
  }, [query]);

  const pick = (name) => {
    onChange(name);
    close();
    onBlur?.();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={inputId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        onClick={() => {
          if (open) close();
          else {
            setQuery('');
            setOpen(true);
          }
        }}
        className={
          'flex items-center gap-3 rounded-xl border bg-cream-50 px-3.5 py-2.5 text-left ' +
          'transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ' +
          'focus-visible:outline-none ' +
          (error ? 'border-error-500' : 'border-cream-300 hover:border-cream-400')
        }
      >
        {value ? (
          <>
            <span className="grid size-9 place-items-center rounded-lg bg-sea-50 text-sea-700">
              <Icon name={value} size={20} />
            </span>
            <span className="font-mono text-sm text-ink-800">{value}</span>
          </>
        ) : (
          <>
            <span className="grid size-9 place-items-center rounded-lg border border-dashed border-cream-400 text-ink-500">
              <Icon name="circle" size={18} />
            </span>
            <span className="text-sm text-ink-500">Choose an icon…</span>
          </>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`Choose ${field.label}`}
          className="absolute z-30 mt-1.5 w-full max-w-md min-w-72 rounded-xl border border-cream-300 bg-cream-50 p-3 shadow-lg"
        >
          <div className="relative mb-2.5">
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
              placeholder="Search icons…"
              aria-label="Search icons"
              className="w-full rounded-lg border border-cream-300 bg-white py-1.5 pr-3 pl-8 text-sm text-ink-800 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="px-1 py-3 text-sm text-ink-500">No icon matches “{query.trim()}”.</p>
          ) : (
            <ul className="grid max-h-64 grid-cols-6 gap-1 overflow-auto overscroll-contain" role="listbox" aria-label={field.label}>
              {filtered.map((name) => {
                const selected = name === value;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      title={name}
                      onClick={() => pick(name)}
                      className={
                        'grid aspect-square w-full place-items-center rounded-lg transition-colors ' +
                        'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none ' +
                        (selected
                          ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-400'
                          : 'text-ink-700 hover:bg-cream-200')
                      }
                    >
                      <Icon name={name} size={20} title={name} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
