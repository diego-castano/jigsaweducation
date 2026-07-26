import { useState } from 'react';
import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function Filters() {
  const [active, setActive] = useState(['East Africa', 'EdTech']);
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 05"
        title="Filter system"
        lede={"The Evidence Library's filtering pattern: search, faceted dropdowns, active chips, sort, and pagination. Inspired by EdTech Hub's library, simplified to avoid the busyness Kara flagged in r4d.org. On the live site this is a working system, not a static mockup: search and facets query the publication data directly, chips and sort update the result set in place, and long result sets paginate."}
      />
      <Section title="Filter bar">
        <Card>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                type="text"
                placeholder="Search 98 publications…"
                className="w-full pl-11 pr-4 py-2.5 bg-cream-50 border border-cream-300 rounded-full text-sm focus:outline-none focus:border-sea-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Type', 'Region', 'Year', 'Language'].map(f => (
                <button
                  key={f}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-cream-50 border border-cream-300 rounded-full text-sm font-bold text-navy-900 hover:bg-cream-200 transition-colors"
                >
                  {f}
                  <Icon name="chevron-down" size={14} />
                </button>
              ))}
            </div>
          </div>
        </Card>
      </Section>
      <Section title="Active filter chips">
        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-ink-600 font-bold mr-2">Filtering by:</span>
            {active.map(f => (
              <span
                key={f}
                className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-sea-500 text-white text-xs font-bold"
              >
                {f}
                <button
                  onClick={() => setActive(active.filter(x => x !== f))}
                  className="w-5 h-5 rounded-full bg-sea-700 hover:bg-navy-900 flex items-center justify-center"
                >
                  <Icon name="x" size={10} />
                </button>
              </span>
            ))}
            {active.length > 0 && (
              <button
                onClick={() => setActive([])}
                className="text-xs font-bold text-orange-500 hover:underline ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        </Card>
      </Section>
      <Section title="Result header">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-2xl text-navy-900 font-display">14 publications</div>
              <div className="text-sm text-ink-600">{active.length > 0 ? `Filtered by ${active.length} criteria` : 'Showing all'}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-600">Sort:</span>
              <select className="px-3 py-2 bg-cream-50 border border-cream-300 rounded-full text-sm font-bold text-navy-900">
                <option>Most recent</option>
                <option>Oldest</option>
                <option>A–Z</option>
              </select>
            </div>
          </div>
        </Card>
      </Section>
      <Section
        title="Functional, not visual"
        description="Everything demonstrated above is wired to real data on the Evidence Library page: the search box filters the full publication set as you type, the facet dropdowns (region, method, topic) narrow it further, active chips reflect and clear the current query, sort re-orders the visible results, and pagination breaks a large result set into pages. This page exists to document the pattern, not to stand in for a feature that has not been built yet."
      />
    </div>
  );
}
