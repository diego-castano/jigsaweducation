import Icon from './Icon';
import Badge from './Badge';

export const PUB_TYPE_STYLE = {
  'Learning Brief':  { badge: 'orange', tile: '#FFE8DA', accent: '#FF7816', icon: 'lightbulb' },
  'Research Report': { badge: 'navy',   tile: '#E3EDF2', accent: '#2C5368', icon: 'flask' },
  'Policy Brief':    { badge: 'sea',    tile: '#D8E6EC', accent: '#407C9B', icon: 'file-text' },
  'Year in Review':  { badge: 'cream',  tile: '#F2EDE0', accent: '#9C9583', icon: 'book-open' }
};

export default function PublicationCard({ pub }) {
  const ts = PUB_TYPE_STYLE[pub.type] || PUB_TYPE_STYLE['Learning Brief'];
  return (
    <article className="group flex flex-col bg-cream-100 border border-cream-300 rounded-2xl p-5 hover:bg-cream-50 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div
        className="relative aspect-[16/7] rounded-xl mb-5 overflow-hidden flex items-center justify-center"
        style={{ background: ts.tile }}
      >
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30"
          style={{ background: ts.accent, filter: 'blur(20px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${ts.accent} 2px, transparent 3px), radial-gradient(circle at 70% 70%, ${ts.accent} 2px, transparent 3px)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div
          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: ts.accent, color: '#FDFAF4' }}
        >
          <Icon name={ts.icon} size={26} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={ts.badge}>{pub.type}</Badge>
        <span className="text-[11px] font-[var(--font-mono)] text-ink-500">{pub.region}</span>
      </div>
      <h3 className="text-xl text-navy-900 mb-3 leading-tight">{pub.title}</h3>
      <p className="text-sm text-ink-700 leading-relaxed mb-4 flex-1">{pub.summary}</p>
      <div className="flex items-center gap-2 text-xs text-ink-600 font-[var(--font-mono)] mb-5">
        <span>{pub.authors}</span>
        <span>·</span>
        <span>{pub.date}</span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-cream-300">
        <button className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:gap-3 transition-all">
          {pub.external ? 'View source' : 'Download PDF'}
          <Icon name={pub.external ? 'external' : 'download'} size={14} />
        </button>
        <button className="text-ink-500 hover:text-orange-500" aria-label="Save">
          <Icon name="star" size={16} />
        </button>
      </div>
    </article>
  );
}
