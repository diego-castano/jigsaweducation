'use client';

// The media library browser: tiles, tabs, search, drag-drop upload and
// "Load more" pagination. Two modes share the one component:
//   manage — /admin/media; a tile click opens the detail drawer.
//   select — inside MediaPicker; a tile click (or a finished upload) hands
//            the media record to `onPick`, filtered by `accept`.

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { Button, EmptyState, SearchInput, Spinner, Tabs, useToast } from '../ui.jsx';
import { listMedia, uploadMedia } from '../../cms/actions/media.js';
import MediaDrawer from './MediaDrawer.jsx';
import {
  IMAGE_MIMES,
  MAX_UPLOAD_BYTES,
  PDF_MIME,
  UPLOADABLE_MIMES,
  acceptAttr,
  fileExt,
  isImageMime
} from './format.js';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'pdf', label: 'Documents' }
];

const PHOTO_POLICY = 'Jigsaw’s own photography only — no stock imagery, no AI-generated people.';

let uploadSeq = 0;

const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes('Files');

// Client-side pre-check mirroring the server's rules; the server re-validates.
const rejectReason = (file, accept) => {
  if (accept === 'image' && !IMAGE_MIMES.includes(file.type)) {
    return 'is not an image. This field takes JPEG, PNG, WebP, GIF or SVG.';
  }
  if (accept === 'pdf' && file.type !== PDF_MIME) {
    return 'is not a PDF. This field takes PDF documents only.';
  }
  if (!UPLOADABLE_MIMES.includes(file.type)) {
    return 'is not a supported type. Upload a JPEG, PNG, WebP, GIF, SVG or PDF.';
  }
  if (file.size === 0) return 'is empty.';
  if (file.size > MAX_UPLOAD_BYTES) return 'is larger than 25 MB. Compress it and try again.';
  return null;
};

function Tile({ item, select, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={item.filename}
      aria-label={select ? `Choose ${item.filename}` : `Open details for ${item.filename}`}
      className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-cream-200 bg-cream-100 transition-[border-color,box-shadow] duration-200 hover:border-navy-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      {isImageMime(item.mime) ? (
        <img
          src={item.url}
          alt={item.alt || ''}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-navy-900 text-cream-100">
            <Icon name="file-text" size={22} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-600">
            {fileExt(item)}
          </span>
          <span className="line-clamp-2 w-full break-words text-xs leading-snug text-ink-700">
            {item.filename}
          </span>
        </span>
      )}
      {select && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-navy-900/80 py-1.5 text-xs font-bold text-cream-100 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Icon name="check" size={13} /> Choose
        </span>
      )}
    </button>
  );
}

function UploadTile({ upload, onDismiss }) {
  const failed = upload.status === 'error';
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-cream-400 bg-cream-100"
      role="status"
      aria-label={failed ? `${upload.name} failed to upload` : `Uploading ${upload.name}`}
    >
      {upload.preview && (
        <img src={upload.preview} alt="" className="h-full w-full object-cover opacity-40" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
        {failed ? (
          <Icon name="alert" size={22} className="text-error-700" />
        ) : (
          <Spinner size={22} className="text-orange-600" />
        )}
        <span className="line-clamp-2 w-full break-words text-xs leading-snug text-ink-700">
          {upload.name}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
          {failed ? 'Failed' : 'Uploading…'}
        </span>
        {failed && (
          <button
            type="button"
            onClick={onDismiss}
            className="tactile rounded-full px-3 py-1 text-xs font-bold text-ink-700 hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export default function MediaBrowser({
  mode = 'manage',
  accept = null,
  initialItems = null,
  initialTotal = 0,
  onPick = null,
  pageSize = 24,
  // URLs the content currently references; enables the Unused tab.
  usedUrls = null
}) {
  const manage = mode === 'manage';
  const toast = useToast();

  const [items, setItems] = useState(initialItems || []);
  const [total, setTotal] = useState(initialTotal);
  const [tab, setTab] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(!initialItems);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [openItem, setOpenItem] = useState(null);

  const inputRef = useRef(null);
  const seqRef = useRef(0);
  const firstRun = useRef(true);
  const dragDepth = useRef(0);
  const previews = useRef(new Map());
  const pickedRef = useRef(false);
  const typeFilterRef = useRef(null);

  // In select mode the type filter is fixed by `accept`; otherwise the tabs.
  // The Unused tab fetches every type and filters client-side against the
  // URLs the content references, so it loads the whole library at once.
  const unusedTab = tab === 'unused';
  const typeFilter = accept || (tab === 'all' || unusedTab ? undefined : tab);
  typeFilterRef.current = typeFilter;
  const usedSet = useMemo(() => new Set(usedUrls || []), [usedUrls]);

  // Debounced search: the input is instant, the query trails by 300ms.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch the first page whenever the filter changes. The manage page arrives
  // server-rendered with the unfiltered first page, so the first run skips.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      if (initialItems) return;
    }
    const seq = ++seqRef.current;
    setLoading(true);
    listMedia({ search: search || undefined, type: typeFilter, limit: unusedTab ? 500 : pageSize, offset: 0 })
      .then((result) => {
        if (seq !== seqRef.current) return;
        setItems(result.items);
        setTotal(result.total);
      })
      .catch(() => {
        if (seq === seqRef.current) {
          toast.error('The media library could not be loaded. Try again.');
        }
      })
      .finally(() => {
        if (seq === seqRef.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, pageSize, unusedTab]);

  // Revoke any leftover object URLs when the browser unmounts.
  useEffect(() => {
    const map = previews.current;
    return () => map.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await listMedia({
        search: search || undefined,
        type: typeFilter,
        limit: pageSize,
        offset: items.length
      });
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.id));
        return [...prev, ...result.items.filter((i) => !seen.has(i.id))];
      });
      setTotal(result.total);
    } catch {
      toast.error('More files could not be loaded. Try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const clearUpload = (uid) => {
    const url = previews.current.get(uid);
    if (url) {
      URL.revokeObjectURL(url);
      previews.current.delete(uid);
    }
    setUploads((list) => list.filter((u) => u.uid !== uid));
  };

  const runUpload = async (file, uid) => {
    const formData = new FormData();
    formData.append('file', file);
    let result;
    try {
      result = await uploadMedia(formData);
    } catch {
      result = { error: 'The upload failed. Check your connection and try again.' };
    }

    if (result?.error) {
      toast.error(`${file.name}: ${result.error}`);
      setUploads((list) =>
        list.map((u) => (u.uid === uid ? { ...u, status: 'error' } : u))
      );
      return;
    }

    clearUpload(uid);

    if (!manage) {
      // Finishing an upload in select mode is a selection.
      if (!pickedRef.current) {
        pickedRef.current = true;
        onPick?.(result);
      }
      return;
    }

    const filter = typeFilterRef.current;
    const matchesFilter =
      !filter || (filter === 'image' ? isImageMime(result.mime) : result.mime === PDF_MIME);
    if (matchesFilter) {
      setItems((prev) => [result, ...prev]);
      setTotal((t) => t + 1);
    } else {
      toast.success(
        `Uploaded ${result.filename} — find it under ${isImageMime(result.mime) ? 'Images' : 'Documents'}.`
      );
      setTotal((t) => t + 1);
    }
  };

  const startUploads = (fileList) => {
    for (const file of Array.from(fileList || [])) {
      const reason = rejectReason(file, accept);
      if (reason) {
        toast.error(`${file.name} ${reason}`);
        continue;
      }
      const uid = ++uploadSeq;
      let preview = null;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
        previews.current.set(uid, preview);
      }
      setUploads((list) => [{ uid, name: file.name, preview, status: 'uploading' }, ...list]);
      runUpload(file, uid);
    }
  };

  const onDragEnter = (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current += 1;
    setDragOver(true);
  };
  const onDragOver = (event) => {
    if (hasFiles(event)) event.preventDefault();
  };
  const onDragLeave = (event) => {
    if (!hasFiles(event)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragOver(false);
  };
  const onDrop = (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragOver(false);
    startUploads(event.dataTransfer.files);
  };

  const handleAltSaved = (id, alt) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, alt } : i)));
    setOpenItem((open) => (open && open.id === id ? { ...open, alt } : open));
  };

  const handleDeleted = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    setOpenItem(null);
  };

  const noun = accept === 'pdf' ? 'documents' : accept === 'image' ? 'images' : 'files';
  const filtered = Boolean(search) || tab !== 'all';
  const displayItems = tab === 'unused' ? items.filter((i) => !usedSet.has(i.url)) : items;
  const showEmpty = !loading && displayItems.length === 0 && uploads.length === 0;
  const gridClass = manage
    ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4';

  return (
    <div>
      {/* Toolbar: search left; upload + the photo policy right. */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search by filename or alt text…"
          aria-label="Search the media library"
          className="w-full sm:max-w-xs"
        />
        <div className="flex flex-col gap-1.5 sm:items-end">
          <Button icon="plus" onClick={() => inputRef.current?.click()}>
            Upload
          </Button>
          {(manage || accept !== 'pdf') && (
            <p className="max-w-[17rem] text-xs leading-snug text-ink-500 sm:text-right">
              {PHOTO_POLICY}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptAttr(accept)}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(event) => {
          startUploads(event.target.files);
          event.target.value = '';
        }}
      />

      {!accept && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            tabs={usedUrls ? [...TABS, { id: 'unused', label: 'Unused' }] : TABS}
            active={tab}
            onChange={setTab}
            label="File types"
          />
          {/* Client-side count: stays right after uploads and deletes, and
              reflects the active tab or search. */}
          <p className="font-mono text-xs text-ink-500" aria-live="polite">
            {loading ? '…' : `${total} ${total === 1 ? 'file' : 'files'}`}
          </p>
        </div>
      )}

      {/* The drop zone wraps the whole grid area, empty state included. */}
      <div
        className="relative mt-5"
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {dragOver && (
          <div className="pointer-events-none absolute -inset-2 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-orange-500 bg-cream-50/90">
            <p className="flex items-center gap-2 font-bold text-navy-900">
              <Icon name="plus" size={18} className="text-orange-600" />
              Drop {noun} to upload
            </p>
          </div>
        )}

        {loading ? (
          <div className={gridClass} aria-busy="true" aria-label="Loading media">
            {Array.from({ length: manage ? 10 : 8 }).map((_, i) => (
              <div key={i} className="shimmer aspect-square rounded-xl" />
            ))}
          </div>
        ) : showEmpty ? (
          filtered ? (
            <EmptyState
              icon="search"
              title="Nothing matches"
              body={
                search
                  ? `No ${noun} match “${search}”. Try different words, or check the other tabs.`
                  : tab === 'unused'
                    ? 'Every file in the library is used somewhere on the site. Nothing to clean up.'
                    : `There are no ${tab === 'image' ? 'images' : 'documents'} in the library yet.`
              }
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchInput('');
                    setTab('all');
                  }}
                >
                  Clear the search
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon="layers"
              title={`No ${noun} yet`}
              body={`Photography and PDF documents for the site live here. Upload ${noun} by dragging them onto this area, then place them from each page’s editor.`}
              action={
                <Button icon="plus" onClick={() => inputRef.current?.click()}>
                  Upload {noun}
                </Button>
              }
            />
          )
        ) : (
          <>
            <ul className={gridClass}>
              {uploads.map((upload) => (
                <li key={`upload-${upload.uid}`}>
                  <UploadTile upload={upload} onDismiss={() => clearUpload(upload.uid)} />
                </li>
              ))}
              {displayItems.map((item) => (
                <li key={item.id}>
                  <Tile
                    item={item}
                    select={!manage}
                    onClick={() => (manage ? setOpenItem(item) : onPick?.(item))}
                  />
                </li>
              ))}
            </ul>

            {tab !== 'unused' && items.length < total && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
                  Load more
                </Button>
                <p className="font-mono text-xs text-ink-500">
                  {items.length} of {total}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {manage && openItem && (
        <MediaDrawer
          item={openItem}
          onClose={() => setOpenItem(null)}
          onAltSaved={handleAltSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
