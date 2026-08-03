'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../../../components/Icon.jsx';
import { Button, useConfirm } from '../../ui.jsx';
import FieldRenderer from '../FieldRenderer.jsx';
import { isBareStringList } from '../validate.js';

// Ordered rows as collapsible cards. Three shapes share this component:
//   - object rows (case-study links, offices) — each row edits its `of` fields;
//     rows may carry keys the schema never declared (office id/countryId), so
//     edits MERGE into the existing row object, never rebuild it.
//   - bare-string rows (countries, topics) — `of` is a single field named
//     `value` and the stored array holds plain strings.
//   - fixed lists — edit-only: no add, no remove, no drag.

let keySeq = 0;
const nextKey = () => `row-${(keySeq += 1)}`;

const emptyRow = (field, bare) => {
  if (bare) return field.of[0].type === 'select' && !field.of[0].allowCustom ? null : '';
  return {};
};

// The collapsed summary line: the first text field with content, then any
// other string (a country's name, a route) as fallback.
const rowSummary = (field, row, bare, index) => {
  if (bare) {
    const text = typeof row === 'string' ? row : row?.name || '';
    return text || `${field.itemLabel || 'Item'} ${index + 1}`;
  }
  const stringOf = (sub) => {
    const raw = row?.[sub.name];
    if (typeof raw === 'string' && raw.trim()) return raw.trim();
    if (raw && typeof raw === 'object' && typeof raw.name === 'string' && raw.name) return raw.name;
    return null;
  };
  for (const sub of field.of) {
    if (sub.type === 'text' || sub.type === 'textarea') {
      const text = stringOf(sub);
      if (text) return text;
    }
  }
  for (const sub of field.of) {
    const text = stringOf(sub);
    if (text) return text;
  }
  return `${field.itemLabel || 'Item'} ${index + 1}`;
};

function SortableRow({ id, draggable, children, renderHandle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !draggable,
  });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        'rounded-xl border bg-cream-50 ' +
        (isDragging ? 'z-10 border-sea-300 shadow-md' : 'border-cream-300')
      }
    >
      {children(draggable ? renderHandle(attributes, listeners) : null)}
    </li>
  );
}

export default function ListField({ field, value, onChange, error, errors, setError, path, linkTargets }) {
  const bare = isBareStringList(field);
  const rows = Array.isArray(value) ? value : [];
  const fixed = Boolean(field.fixed);
  const confirm = useConfirm();

  // Stable identities for React keys and dnd — regenerated when the array
  // changes shape under us (a discarded draft resets the whole document).
  const [keys, setKeys] = useState(() => rows.map(nextKey));
  const [expanded, setExpanded] = useState(() => new Set());
  const lastRowsRef = useRef(rows);
  if (rows !== lastRowsRef.current) {
    lastRowsRef.current = rows;
    if (rows.length !== keys.length) setKeys(rows.map(nextKey));
  }

  // A publish attempt that finds errors inside collapsed rows opens them.
  useEffect(() => {
    if (!errors) return;
    const withErrors = new Set();
    Object.keys(errors).forEach((errorPath) => {
      if (!errors[errorPath] || !errorPath.startsWith(`${path}.`)) return;
      const index = Number(errorPath.slice(path.length + 1).split('.')[0]);
      if (Number.isInteger(index) && keys[index]) withErrors.add(keys[index]);
    });
    if (withErrors.size) {
      setExpanded((current) => new Set([...current, ...withErrors]));
    }
  }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const canAdd = !fixed && (!field.maxItems || rows.length < field.maxItems);
  const canRemove = !fixed && (!field.minItems || rows.length > field.minItems);
  const draggable = !fixed && rows.length > 1;

  const toggle = (key) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const updateRow = (index, subName, subValue) => {
    const next = rows.slice();
    // Bare lists store the value itself; object rows merge over what is there,
    // keeping undeclared keys (office id, countryId, coords) intact.
    next[index] = bare ? subValue : { ...(rows[index] || {}), [subName]: subValue };
    onChange(next);
  };

  const addRow = () => {
    const key = nextKey();
    setKeys((current) => [...current, key]);
    setExpanded((current) => new Set([...current, key]));
    onChange([...rows, emptyRow(field, bare)]);
  };

  const removeRow = async (index) => {
    const summary = rowSummary(field, rows[index], bare, index);
    const ok = await confirm({
      title: `Remove ${field.itemLabel || 'item'}?`,
      body: `“${summary}” will be removed from ${field.label}. Nothing changes on the live site until you publish.`,
      confirmLabel: 'Remove',
    });
    if (!ok) return;
    setKeys((current) => current.filter((_, i) => i !== index));
    onChange(rows.filter((_, i) => i !== index));
  };

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = keys.indexOf(active.id);
    const to = keys.indexOf(over.id);
    if (from < 0 || to < 0) return;
    setKeys((current) => arrayMove(current, from, to));
    onChange(arrayMove(rows, from, to));
  };

  const renderHandle = (attributes, listeners) => (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label={`Reorder this ${field.itemLabel || 'item'}`}
      className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-ink-500 hover:bg-cream-200 hover:text-ink-700 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none active:cursor-grabbing"
    >
      <Icon name="menu" size={16} />
    </button>
  );

  const structuralNote = (() => {
    if (fixed) return null;
    const parts = [];
    if (field.minItems) parts.push(`at least ${field.minItems}`);
    if (field.maxItems) parts.push(`at most ${field.maxItems}`);
    if (!parts.length) return null;
    return `This list needs ${parts.join(' and ')} ${
      (field.maxItems || field.minItems) === 1 ? (field.itemLabel || 'item') : `${field.itemLabel || 'item'}s`
    }.`;
  })();

  return (
    <div className="space-y-2">
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-cream-400 px-4 py-5 text-center text-sm text-ink-500">
          Nothing here yet.
        </p>
      ) : (
        <DndContext
          // A stable id keeps dnd-kit's generated aria ids identical between
          // the server render and hydration.
          id={`dnd-${path}`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={keys} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {rows.map((row, index) => {
                const key = keys[index] || `${index}`;
                const isOpen = expanded.has(key);
                const rowDoc = bare ? { value: row } : row || {};
                return (
                  <SortableRow key={key} id={key} draggable={draggable} renderHandle={renderHandle}>
                    {(handle) => (
                      <div>
                        <div className="flex items-center gap-1.5 p-2 pl-2.5">
                          {handle}
                          <button
                            type="button"
                            onClick={() => toggle(key)}
                            aria-expanded={isOpen}
                            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
                          >
                            <Icon
                              name="chevron-right"
                              size={14}
                              className={
                                'shrink-0 text-ink-500 transition-transform motion-safe:duration-150 ' +
                                (isOpen ? 'rotate-90' : '')
                              }
                            />
                            <span className="truncate text-sm font-medium text-ink-800">
                              {rowSummary(field, row, bare, index)}
                            </span>
                          </button>
                          {canRemove && (
                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              aria-label={`Remove ${rowSummary(field, row, bare, index)}`}
                              className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-500 hover:bg-error-50 hover:text-error-700 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          )}
                        </div>
                        {isOpen && (
                          <div className="space-y-5 border-t border-cream-200 p-4">
                            {field.of.map((sub) => (
                              <FieldRenderer
                                key={sub.name}
                                field={sub}
                                path={`${path}.${index}.${sub.name}`}
                                value={bare ? rowDoc.value : rowDoc[sub.name]}
                                onChange={(next) => updateRow(index, sub.name, next)}
                                errors={errors}
                                setError={setError}
                                linkTargets={linkTargets}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </SortableRow>
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {canAdd && (
        <Button variant="ghost" size="sm" icon="plus" onClick={addRow}>
          Add {field.itemLabel || 'item'}
        </Button>
      )}
      {structuralNote && <p className="text-xs text-ink-500">{structuralNote}</p>}
      {error && (
        <p role="alert" className="text-sm text-error-700">
          {error}
        </p>
      )}
    </div>
  );
}
