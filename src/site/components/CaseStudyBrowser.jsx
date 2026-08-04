'use client';

import { useMemo, useState } from 'react';
import FilterBar from './FilterBar';
import CaseStudyCard from './CaseStudyCard';
import Icon from '../../components/Icon';

// The live site puts 17 case studies in one alphabetical grid with no filter,
// no taxonomy and no dates, so "show me your EdTech work in East Africa" is
// unanswerable. This is the fix.
//
// `ui` is the ui-strings singleton passed down from the server page. Every
// string destructures with the byte-exact default it replaced, so a missing
// document (or a page that never passes the prop) renders today's chrome.
export default function CaseStudyBrowser({ studies, facets, ui = {}, mediaMeta }) {
  const {
    caseStudySearchPlaceholder = 'Search case studies, partners or countries…',
    sortAZ = 'A–Z',
    sortZA = 'Z–A',
    emptyStateTitle = 'Nothing matches those filters',
    clearAllFilters = 'Clear all filters'
  } = ui;
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({ country: [], service: [], topic: [] });
  const [sort, setSort] = useState('az');

  const toggle = (key, value) =>
    setSelected((prev) => {
      const values = prev[key] || [];
      return {
        ...prev,
        [key]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
      };
    });

  const clear = () => {
    setSelected({ country: [], service: [], topic: [] });
    setSearch('');
  };

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = studies.filter((s) => {
      if (q) {
        const haystack = [s.title, s.summary, ...(s.partners || []), ...(s.countries || [])]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Within a facet the values are OR'd; across facets they are AND'd, which
      // is what people expect from a faceted list even if nobody says so.
      if (selected.country.length && !selected.country.some((c) => s.countries?.includes(c)))
        return false;
      if (selected.service.length && !selected.service.includes(s.service)) return false;
      if (selected.topic.length && !selected.topic.some((t) => s.topics?.includes(t))) return false;
      return true;
    });

    return [...filtered].sort((a, b) =>
      sort === 'za' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)
    );
  }, [studies, search, selected, sort]);

  return (
    <div>
      <FilterBar
        facets={facets}
        selected={selected}
        onToggle={toggle}
        onClear={clear}
        search={search}
        onSearch={setSearch}
        searchPlaceholder={caseStudySearchPlaceholder}
        resultCount={results.length}
        totalCount={studies.length}
        noun={results.length === 1 ? 'case study' : 'case studies'}
        ui={ui}
        sort={sort}
        onSort={setSort}
        sortOptions={[
          { value: 'az', label: sortAZ },
          { value: 'za', label: sortZA }
        ]}
      />

      {results.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {results.map((study) => (
            <CaseStudyCard key={study.slug} study={study} mediaMeta={mediaMeta} />
          ))}
        </ul>
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
