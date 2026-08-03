'use client';

import { useMemo, useState } from 'react';
import FilterBar from './FilterBar';
import PublicationCard from './PublicationCard';
import Icon from '../../components/Icon';

// Filters are the three the July brief names: region/country, method/service,
// topic specialism. The March call's "year, type, language" set was superseded.
// Year still appears on the tile, it just is not a facet.
export default function PublicationBrowser({ publications, facets, perPage = 8, ui = {}, mediaMeta }) {
  const {
    publicationSearchPlaceholder = 'Search publications…',
    sortRecent = 'Most recent',
    sortOldest = 'Oldest',
    sortAZ = 'A–Z',
    emptyStateTitle = 'Nothing matches those filters',
    clearAllFilters = 'Clear all filters',
    paginationPrevious = 'Previous',
    paginationNext = 'Next'
  } = ui;
  const pageSize = Number(perPage) > 0 ? Number(perPage) : 8;

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({
    region: [],
    country: [],
    method: [],
    topic: [],
    type: []
  });
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);

  const toggle = (key, value) => {
    setPage(1);
    setSelected((prev) => {
      const values = prev[key] || [];
      return {
        ...prev,
        [key]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
      };
    });
  };

  const clear = () => {
    setSelected({ region: [], country: [], method: [], topic: [], type: [] });
    setSearch('');
    setPage(1);
  };

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = publications.filter((p) => {
      if (q && !`${p.title} ${p.summary || ''} ${p.type}`.toLowerCase().includes(q)) return false;
      if (selected.region.length && !selected.region.includes(p.region)) return false;
      if (selected.country.length && !selected.country.some((c) => p.countries?.includes(c)))
        return false;
      if (selected.method.length && !selected.method.includes(p.method)) return false;
      if (selected.topic.length && !selected.topic.includes(p.topic)) return false;
      if (selected.type.length && !selected.type.includes(p.type)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'az') return a.title.localeCompare(b.title);
      // Undated publications sort last rather than being treated as year zero,
      // which would bury them under the oldest Year in Review.
      const ay = a.year ?? -Infinity;
      const by = b.year ?? -Infinity;
      return sort === 'oldest' ? ay - by : by - ay;
    });
  }, [publications, search, selected, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div>
      <FilterBar
        facets={facets}
        selected={selected}
        onToggle={toggle}
        onClear={clear}
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder={publicationSearchPlaceholder}
        resultCount={results.length}
        totalCount={publications.length}
        noun={results.length === 1 ? 'publication' : 'publications'}
        sort={sort}
        onSort={(v) => {
          setSort(v);
          setPage(1);
        }}
        sortOptions={[
          { value: 'recent', label: sortRecent },
          { value: 'oldest', label: sortOldest },
          { value: 'az', label: sortAZ }
        ]}
        ui={ui}
      />

      {visible.length > 0 ? (
        <>
          <ul className="grid lg:grid-cols-2 gap-5 mt-8">
            {visible.map((pub) => (
              <PublicationCard key={pub.slug} pub={pub} ui={ui} mediaMeta={mediaMeta} />
            ))}
          </ul>

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                className="tactile h-11 px-5 rounded-full border border-cream-300 text-sm text-ink-700 hover:border-cream-400 disabled:opacity-40 disabled:hover:border-cream-300 transition-colors"
              >
                {paginationPrevious}
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === current ? 'page' : undefined}
                  className={`tactile min-w-11 h-11 rounded-full text-sm transition-colors ${
                    n === current
                      ? 'bg-navy-900 text-cream-50 font-bold'
                      : 'text-ink-700 hover:bg-cream-200'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={current === pageCount}
                className="tactile h-11 px-5 rounded-full border border-cream-300 text-sm text-ink-700 hover:border-cream-400 disabled:opacity-40 disabled:hover:border-cream-300 transition-colors"
              >
                {paginationNext}
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="mt-12 text-center py-16 border border-dashed border-cream-400 rounded-2xl">
          <Icon name="search" size={28} className="text-cream-400 mx-auto mb-4" />
          <p className="font-display text-xl text-navy-900">{emptyStateTitle}</p>
          <button
            type="button"
            onClick={clear}
            className="mt-4 text-sm text-sea-700 hover:text-orange-600 underline underline-offset-4"
          >
            {clearAllFilters}
          </button>
        </div>
      )}
    </div>
  );
}
