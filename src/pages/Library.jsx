import { useState } from 'react';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import PublicationCard from '../components/PublicationCard';
import { PUBLICATIONS } from '../data/publications';

export default function Library() {
  const [active, setActive] = useState(['East Africa', 'EdTech']);
  const [page, setPage] = useState(1);
  return (
    <div>
      <PageHeader
        kicker="Site Templates · 02"
        title="Evidence Library"
        lede="The full library page assembled — header, search bar, filters, active chips, sort, grid, and pagination. The pattern Kara asked for: rigorous filtering without the visual noise of r4d.org."
      />
      <div className="bg-cream-100 border border-cream-300 rounded-3xl p-6 lg:p-10">
        <div className="mb-8">
          <h2 className="font-display text-3xl lg:text-4xl text-navy-900 mb-2">Evidence Library</h2>
          <p className="text-ink-700 max-w-2xl">A decade of research on what works in education across low and middle-income contexts. Free to download, indexed by region, type, and topic.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 mb-5">
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
        {active.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs uppercase tracking-[0.15em] text-ink-600 font-bold mr-1">Filtering by</span>
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
            <button onClick={() => setActive([])} className="text-xs font-bold text-orange-500 hover:underline ml-2">Clear all</button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-5 border-b border-cream-300">
          <div>
            <div className="text-2xl text-navy-900 font-display">14 publications</div>
            <div className="text-sm text-ink-600">{active.length > 0 ? `Filtered by ${active.length} criteria` : 'Showing all'}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-600">Sort</span>
            <select className="px-3 py-2 bg-cream-50 border border-cream-300 rounded-full text-sm font-bold text-navy-900">
              <option>Most recent</option>
              <option>Oldest</option>
              <option>A–Z</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {PUBLICATIONS.concat(PUBLICATIONS.slice(0, 2)).map((p, i) => (
            <PublicationCard key={i} pub={p} />
          ))}
        </div>
        <div className="flex items-center justify-between pt-5 border-t border-cream-300">
          <div className="text-sm text-ink-600">{`Page ${page} of 7 · 98 results`}</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-600 hover:bg-cream-200">
              <Icon name="chevron-left" size={16} />
            </button>
            {[1, 2, 3, '…', 7].map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-bold ${p === page ? 'bg-navy-900 text-white' : 'text-ink-700 hover:bg-cream-200'}`}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(7, page + 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-600 hover:bg-cream-200">
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
