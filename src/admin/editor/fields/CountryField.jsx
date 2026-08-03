'use client';

import { useMemo, useState } from 'react';
import Icon from '../../../components/Icon.jsx';
import { ISO_COUNTRIES } from '../../../cms/iso-countries.js';
import usePopover from '../usePopover.js';

// Searchable combobox over the world-atlas country list. Stores { name, id }
// with the id as a zero-padded string — the map keys on that id, so the
// picker is the only way in and the numeric code never leads the UI.
export default function CountryField({ field, value, onChange, onBlur, error, inputId }) {
  const { open, setOpen, close, rootRef, triggerRef } = usePopover();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return ISO_COUNTRIES;
    return ISO_COUNTRIES.filter((country) => country.name.toLowerCase().includes(needle));
  }, [query]);

  const pick = (country) => {
    onChange({ name: country.name, id: country.id });
    close();
    onBlur?.();
  };

  const clear = () => {
    onChange(null);
    onBlur?.();
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered[activeIndex]) pick(filtered[activeIndex]);
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center gap-1.5">
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
              setActiveIndex(0);
              setOpen(true);
            }
          }}
          className={
            'flex w-full items-center justify-between gap-2 rounded-xl border bg-cream-50 px-3.5 py-2.5 text-left ' +
            'text-base text-ink-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ' +
            'focus-visible:ring-offset-2 focus-visible:outline-none ' +
            (error ? 'border-error-500' : 'border-cream-300 hover:border-cream-400')
          }
        >
          <span className={'flex min-w-0 items-center gap-2 ' + (value?.name ? '' : 'text-ink-500')}>
            <Icon name="globe" size={16} className="shrink-0 text-sea-600" />
            <span className="truncate">{value?.name || 'Choose a country…'}</span>
          </span>
          <Icon name="chevron-down" size={16} className="shrink-0 text-ink-500" />
        </button>
        {field.nullable && value?.name && (
          <button
            type="button"
            onClick={clear}
            aria-label={`Clear ${field.label}`}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-cream-200 hover:text-ink-700 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      {open && (
        <div
          className="absolute z-30 mt-1.5 w-full rounded-xl border border-cream-300 bg-cream-50 p-1.5 shadow-lg"
          onKeyDown={onKeyDown}
        >
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
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search countries…"
              aria-label="Search countries"
              className="w-full rounded-lg border border-cream-300 bg-white py-1.5 pr-3 pl-8 text-sm text-ink-800 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
            />
          </div>
          <ul role="listbox" aria-label={field.label} className="max-h-64 overflow-auto overscroll-contain">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-500">
                No country matches — the list uses the map’s own names, e.g. “Türkiye”.
              </li>
            )}
            {filtered.map((country, index) => {
              const selected = value?.id === country.id;
              return (
                <li key={country.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => pick(country)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={
                      'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-800 focus-visible:outline-none ' +
                      (index === activeIndex ? 'bg-cream-200' : '')
                    }
                  >
                    <span className="truncate">{country.name}</span>
                    {selected && <Icon name="check" size={14} className="shrink-0 text-orange-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
