'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../../components/Icon.jsx';
import usePopover from '../usePopover.js';

// Styled listbox over `options`. With `allowCustom` it becomes a combobox:
// a filter input plus an "Add '<value>'" row that stores whatever the editor
// typed. `nullable` adds a None row that clears the field.

const OPTION_BASE =
  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-800 ' +
  'focus-visible:outline-none';

export default function SelectField({ field, value, onChange, onBlur, error, inputId }) {
  const { open, setOpen, close, rootRef, triggerRef } = usePopover();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);

  const options = field.options || [];
  const filtered = useMemo(() => {
    if (!field.allowCustom || !query.trim()) return options;
    const needle = query.trim().toLowerCase();
    return options.filter((option) => String(option).toLowerCase().includes(needle));
  }, [options, query, field.allowCustom]);

  const trimmed = query.trim();
  const showAddRow =
    field.allowCustom &&
    trimmed !== '' &&
    !options.some((option) => String(option).toLowerCase() === trimmed.toLowerCase());

  // The navigable rows in visual order: None? · options · add-custom?
  const rows = useMemo(() => {
    const list = [];
    if (field.nullable) list.push({ kind: 'none' });
    filtered.forEach((option) => list.push({ kind: 'option', option }));
    if (showAddRow) list.push({ kind: 'add', option: trimmed });
    return list;
  }, [field.nullable, filtered, showAddRow, trimmed]);

  // Plain listboxes have no filter input, so the list itself takes focus and
  // receives the arrow keys the moment the picker opens.
  useEffect(() => {
    if (open && !field.allowCustom) listRef.current?.focus();
  }, [open, field.allowCustom]);

  const openPicker = () => {
    setQuery('');
    const current = rows.findIndex((row) => row.kind === 'option' && row.option === value);
    setActiveIndex(current >= 0 ? current : 0);
    setOpen(true);
  };

  const pick = (row) => {
    if (!row) return;
    if (row.kind === 'none') onChange(null);
    else onChange(row.option);
    close();
    onBlur?.();
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(rows.length - 1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      pick(rows[Math.max(activeIndex, 0)]);
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={inputId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={error ? true : undefined}
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openPicker();
          }
        }}
        className={
          'flex w-full items-center justify-between gap-2 rounded-xl border bg-cream-50 px-3.5 py-2.5 text-left ' +
          'text-base text-ink-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ' +
          'focus-visible:ring-offset-2 focus-visible:outline-none ' +
          (error ? 'border-error-500' : 'border-cream-300 hover:border-cream-400')
        }
      >
        <span className={value ? '' : 'text-ink-500'}>{value || 'Choose…'}</span>
        <Icon name="chevron-down" size={16} className="shrink-0 text-ink-500" />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1.5 w-full rounded-xl border border-cream-300 bg-cream-50 p-1.5 shadow-lg"
          onKeyDown={onKeyDown}
        >
          {field.allowCustom && (
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
                placeholder="Search or add…"
                aria-label={`Search ${field.label}`}
                className="w-full rounded-lg border border-cream-300 bg-white py-1.5 pr-3 pl-8 text-sm text-ink-800 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              />
            </div>
          )}
          <ul
            ref={listRef}
            role="listbox"
            aria-label={field.label}
            tabIndex={field.allowCustom ? -1 : 0}
            className="max-h-64 overflow-auto overscroll-contain focus-visible:outline-none"
          >
            {rows.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-500">Nothing matches.</li>
            )}
            {rows.map((row, index) => {
              const active = index === activeIndex;
              const selected = row.kind === 'option' && row.option === value;
              return (
                <li key={row.kind === 'option' ? `o-${row.option}` : row.kind} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => pick(row)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={
                      OPTION_BASE +
                      (active ? ' bg-cream-200' : '') +
                      (row.kind === 'none' ? ' text-ink-500 italic' : '') +
                      (row.kind === 'add' ? ' text-sea-700' : '')
                    }
                  >
                    {row.kind === 'add' && <Icon name="plus" size={14} className="shrink-0" />}
                    <span className="min-w-0 flex-1 truncate">
                      {row.kind === 'none' && 'None'}
                      {row.kind === 'option' && row.option}
                      {row.kind === 'add' && `Add “${row.option}”`}
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
  );
}
