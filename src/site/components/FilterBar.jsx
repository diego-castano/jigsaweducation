'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon';

// A real filter, not the cosmetic one from the design system: the dropdowns
// open, the chips remove, and the counts come from the filtered set.
//
// The client's reference feedback was specific — docs.edtechhub.org/lib for
// "clear titles, filtering, functional"; r4d.org/resources marked down for
// "too many tags". So: few facets, visible active state, nothing decorative.

function Dropdown({ label, options, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!options.length) return null;
  const count = selected.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`tactile inline-flex items-center gap-2 pl-4 pr-3 py-3 sm:py-2.5 rounded-full border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
          count
            ? 'bg-sea-50 border-sea-300 text-navy-900 font-bold'
            : 'bg-cream-50 border-cream-300 text-ink-700 hover:border-cream-400'
        }`}
      >
        {label}
        {count > 0 && (
          <span className="w-5 h-5 rounded-full bg-sea-500 text-white text-[11px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
        <Icon name="chevron-down" size={15} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 w-72 max-w-[calc(100vw-3rem)] max-h-80 overflow-y-auto bg-cream-50 border border-cream-300 rounded-2xl shadow-lg p-2">
          <ul>
            {options.map((opt) => {
              const active = selected.includes(opt);
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => onToggle(opt)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-3 sm:py-2.5 rounded-xl text-sm transition-colors ${
                      active ? 'bg-cream-200 text-navy-900 font-bold' : 'text-ink-700 hover:bg-cream-100'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        active ? 'bg-orange-500 border-orange-500 text-white' : 'border-cream-400'
                      }`}
                      aria-hidden="true"
                    >
                      {active && <Icon name="check" size={11} strokeWidth={3} />}
                    </span>
                    {opt}
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

export default function FilterBar({
  facets,
  selected,
  onToggle,
  onClear,
  search,
  onSearch,
  searchPlaceholder = 'Search…',
  resultCount,
  totalCount,
  noun = 'results',
  sort,
  onSort,
  sortOptions
}) {
  const activeChips = Object.entries(selected).flatMap(([key, values]) =>
    values.map((value) => ({ key, value }))
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Icon
            name="search"
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
          />
          <label htmlFor="filter-search" className="sr-only">
            {searchPlaceholder}
          </label>
          <input
            id="filter-search"
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-2.5 bg-cream-50 border border-cream-300 rounded-full text-base sm:text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {Object.entries(facets).map(([key, options]) => (
          <Dropdown
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            options={options}
            selected={selected[key] || []}
            onToggle={(value) => onToggle(key, value)}
          />
        ))}
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {activeChips.map(({ key, value }) => (
            <button
              key={`${key}:${value}`}
              type="button"
              onClick={() => onToggle(key, value)}
              className="tactile inline-flex items-center gap-1.5 pl-3 pr-2 py-2.5 sm:py-1.5 bg-sea-100 hover:bg-sea-200 text-navy-800 rounded-full text-xs font-bold transition-colors"
            >
              {value}
              <Icon name="x" size={13} />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-ink-600 hover:text-orange-600 underline underline-offset-4 ml-1 py-2.5 sm:py-0"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-cream-300">
        {/* This is a real h2, not a paragraph: it labels the results list and
            keeps the page from jumping h1 → h3 straight into the cards. */}
        <h2 className="text-sm font-normal text-ink-700" role="status" aria-live="polite">
          <span className="font-bold text-navy-900">{resultCount}</span>
          {resultCount === totalCount ? ' ' : ` of ${totalCount} `}
          {noun}
        </h2>

        {sortOptions && (
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-ink-600">
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="bg-cream-50 border border-cream-300 rounded-full px-4 py-2.5 text-base sm:text-sm text-ink-800 focus:outline-none focus:border-orange-500"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
