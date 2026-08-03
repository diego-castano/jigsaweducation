'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
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
import Icon from '../../components/Icon.jsx';
import { Badge, EmptyState, SearchInput, useToast } from '../ui.jsx';
import { reorderItems } from '../../cms/actions/content.js';

// The collection list body: client-side search, one row per item, and — when
// the schema says order matters — drag handles that persist the new order
// through reorderItems the moment the row is dropped. A failed save puts the
// old order straight back and says so; the button never dies silently.
//
// Row shape (built by the server page): { id, slug, title, hasDraft, hidden,
// columns: [{ name, type, value }] }.

function Row({ row, collection, orderable, draggable }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    disabled: !draggable,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        'relative bg-cream-100 transition-colors hover:bg-cream-50 focus-within:bg-cream-50 ' +
        (isDragging ? 'z-10 shadow-md' : '')
      }
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        {orderable && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={!draggable}
            aria-label={`Reorder “${row.title}”`}
            className="relative z-10 grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-ink-500 hover:bg-cream-200 hover:text-ink-700 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none active:cursor-grabbing disabled:cursor-default disabled:opacity-40"
          >
            <Icon name="menu" size={16} />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/collections/${collection}/${row.id}`}
            className={
              'font-bold focus:outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-orange-500 focus-visible:after:ring-inset ' +
              (row.hidden ? 'text-ink-600' : 'text-navy-900')
            }
          >
            {row.title}
          </Link>
        </div>

        {row.columns.length > 0 && (
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            {row.columns.map((column) =>
              column.value === '' ? null : column.type === 'icon' ? (
                <Icon
                  key={column.name}
                  name={column.value}
                  size={16}
                  className="text-ink-500"
                  title={column.value}
                />
              ) : (
                <span key={column.name} className="max-w-40 truncate text-sm text-ink-600">
                  {column.value}
                </span>
              )
            )}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {row.hasDraft && <Badge tone="amber">Draft edits</Badge>}
          {row.hidden && <Badge>Hidden</Badge>}
          <Icon name="chevron-right" size={16} className="text-ink-400" aria-hidden="true" />
        </div>
      </div>
    </li>
  );
}

export default function SortableList({ collection, itemLabel, orderable, rows }) {
  const toast = useToast();

  // Local order so a drop lands instantly; reset whenever the server sends a
  // fresh list (a revisit, or router.refresh from elsewhere on the page).
  const [items, setItems] = useState(rows);
  const lastRowsRef = useRef(rows);
  if (rows !== lastRowsRef.current) {
    lastRowsRef.current = rows;
    setItems(rows);
  }

  const [search, setSearch] = useState('');
  const needle = search.trim().toLowerCase();
  const visible = needle
    ? items.filter(
        (row) =>
          row.title.toLowerCase().includes(needle) ||
          row.slug.toLowerCase().includes(needle) ||
          row.columns.some((column) => String(column.value).toLowerCase().includes(needle))
      )
    : items;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reordering a filtered subset would scramble the hidden rows, so dragging
  // pauses while a search is active.
  const draggable = orderable && !needle && items.length > 1;

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((row) => row.id === active.id);
    const to = items.findIndex((row) => row.id === over.id);
    if (from < 0 || to < 0) return;
    const previous = items;
    const next = arrayMove(items, from, to);
    setItems(next);
    try {
      await reorderItems(collection, next.map((row) => row.id));
      toast.success('New order saved — the site follows it straight away.');
    } catch {
      setItems(previous);
      toast.error('The new order could not be saved, so it has been put back.');
    }
  };

  if (rows.length === 0) {
    return (
      <EmptyState
        icon="layers"
        title="Nothing here yet"
        body={`Add the first ${itemLabel} with the button above. New items start hidden, so you can take your time before publishing.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={`Search by ${itemLabel} name…`}
        aria-label={`Search this list of ${itemLabel}s`}
        className="max-w-sm"
      />

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream-300 px-4 py-8 text-center text-sm text-ink-600">
          Nothing matches “{search.trim()}”.
        </p>
      ) : (
        <DndContext
          // A stable id keeps dnd-kit's generated aria ids identical between
          // the server render and hydration.
          id={`dnd-${collection}`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={visible.map((row) => row.id)} strategy={verticalListSortingStrategy}>
            <ul className="divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-cream-100">
              {visible.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  collection={collection}
                  orderable={orderable}
                  draggable={draggable}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {orderable && needle && visible.length > 0 && (
        <p className="text-xs text-ink-500">Clear the search to change the order.</p>
      )}
    </div>
  );
}
