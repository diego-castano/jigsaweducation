'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Badge, EmptyState, IconButton, SearchInput, useConfirm, useToast } from '../ui.jsx';
import { deleteItem, duplicateItem, reorderItems } from '../../cms/actions/content.js';

// The collection list body: client-side search, one row per item, and — when
// the schema says order matters — drag handles that persist the new order
// through reorderItems the moment the row is dropped. A failed save puts the
// old order straight back and says so; the button never dies silently.
//
// Each row carries its own actions (edit, duplicate, view, delete), so the
// everyday moves happen from the list without opening the editor. On fine
// pointers they fade in on hover or focus; on touch they are always there.
//
// Row shape (built by the server page): { id, slug, title, hasDraft, hidden,
// publicHref, columns: [{ name, type, value }] }.

function Row({ row, collection, orderable, draggable, busy, onDuplicate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    disabled: !draggable,
  });

  // Below lg the actions are always visible (touch has no hover); from lg
  // they fade in on hover or keyboard focus, keeping the rows quiet.
  const actionReveal =
    'transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100';

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        'group relative bg-cream-100 transition-colors hover:bg-cream-50 focus-within:bg-cream-50 ' +
        (isDragging ? 'z-10 shadow-md' : '')
      }
    >
      <div className="flex items-center gap-3 px-4 py-3">
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
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
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
          {row.needsReview && <Badge tone="amber">Needs review</Badge>}

          {/* The action cluster sits above the row's stretched edit link. */}
          <div className={`relative z-10 flex items-center gap-0.5 ${actionReveal}`}>
            <Link
              href={`/admin/collections/${collection}/${row.id}`}
              aria-label={`Edit “${row.title}”`}
              className="grid place-items-center rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-cream-200 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
            >
              <Icon name="edit" size={16} />
            </Link>
            <IconButton
              icon="copy"
              label={`Duplicate “${row.title}”`}
              size="sm"
              disabled={busy}
              onClick={() => onDuplicate(row)}
            />
            {row.publicHref && !row.hidden && (
              <a
                href={row.publicHref}
                target="_blank"
                rel="noopener"
                aria-label={`View “${row.title}” on the site`}
                className="grid place-items-center rounded-lg p-1.5 text-ink-600 transition-colors hover:bg-cream-200 hover:text-navy-900 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
              >
                <Icon name="external" size={16} />
              </a>
            )}
            <IconButton
              icon="trash"
              label={`Delete “${row.title}”`}
              size="sm"
              variant="danger"
              disabled={busy}
              onClick={() => onDelete(row)}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

export default function SortableList({ collection, itemLabel, orderable, rows }) {
  const toast = useToast();
  const confirm = useConfirm();
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);

  // Local order so a drop lands instantly; reset whenever the server sends a
  // fresh list (a revisit, or router.refresh from elsewhere on the page).
  const [items, setItems] = useState(rows);
  const lastRowsRef = useRef(rows);
  if (rows !== lastRowsRef.current) {
    lastRowsRef.current = rows;
    setItems(rows);
  }

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Instant, client-side: the whole collection is already in the row data.
  const FILTERS = [
    { id: 'all', label: 'All', match: () => true },
    { id: 'visible', label: 'Visible', match: (row) => !row.hidden },
    { id: 'hidden', label: 'Hidden', match: (row) => row.hidden },
    { id: 'draft', label: 'Draft edits', match: (row) => row.hasDraft },
    ...(items.some((row) => row.needsReview)
      ? [{ id: 'review', label: 'Needs review', match: (row) => row.needsReview }]
      : [])
  ];
  const activeFilter = FILTERS.find((f) => f.id === statusFilter) || FILTERS[0];

  const needle = search.trim().toLowerCase();
  const visible = items.filter(
    (row) =>
      activeFilter.match(row) &&
      (!needle ||
        row.title.toLowerCase().includes(needle) ||
        row.slug.toLowerCase().includes(needle) ||
        row.columns.some((column) => String(column.value).toLowerCase().includes(needle)))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Reordering a filtered subset would scramble the hidden rows, so dragging
  // pauses while a search or status filter is active.
  const filtering = Boolean(needle) || statusFilter !== 'all';
  const draggable = orderable && !filtering && items.length > 1;

  const handleDuplicate = async (row) => {
    setBusyId(row.id);
    try {
      const result = await duplicateItem(collection, row.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Duplicated — “${row.title} (copy)” was created hidden, ready to edit.`);
        router.refresh();
      }
    } catch {
      toast.error('The duplicate could not be created. Nothing changed — try again.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (row) => {
    const ok = await confirm({
      title: `Delete “${row.title}”?`,
      body: `The ${itemLabel} comes off the site straight away. A snapshot is kept in the revision history.`,
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    setBusyId(row.id);
    try {
      await deleteItem(collection, row.id);
      setItems((current) => current.filter((item) => item.id !== row.id));
      toast.success(`Deleted “${row.title}”.`);
      router.refresh();
    } catch {
      toast.error('The delete did not go through. Nothing changed — try again.');
    } finally {
      setBusyId(null);
    }
  };

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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={`Search by ${itemLabel} name…`}
          aria-label={`Search this list of ${itemLabel}s`}
          className="max-w-sm"
        />
        <div role="group" aria-label="Filter by status" className="flex flex-wrap items-center gap-1">
          {FILTERS.map((filter) => {
            const count = filter.id === 'all' ? items.length : items.filter(filter.match).length;
            const active = statusFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(filter.id)}
                className={
                  'rounded-full px-3 py-1.5 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none ' +
                  (active
                    ? 'bg-navy-900 text-cream-50'
                    : 'text-ink-600 hover:bg-cream-200 hover:text-navy-900')
                }
              >
                {filter.label}
                <span className={'ml-1.5 font-mono font-normal ' + (active ? 'text-cream-300' : 'text-ink-500')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-cream-300 px-4 py-8 text-center text-sm text-ink-600">
          {needle ? `Nothing matches “${search.trim()}”.` : `No ${itemLabel}s in this state.`}
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
                  busy={busyId === row.id}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {orderable && filtering && visible.length > 0 && (
        <p className="text-xs text-ink-500">Clear the search and filters to change the order.</p>
      )}
    </div>
  );
}
