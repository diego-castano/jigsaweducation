import Icon from './Icon';

export default function TeamCard({ p }) {
  const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const tint = ['#407c9b', '#2c5368', '#ff7816', '#1c998a'][p.name.charCodeAt(0) % 4];
  return (
    <article className="group bg-cream-100 border border-cream-300 rounded-2xl p-6 hover:bg-cream-50 hover:shadow-md transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div
          className="relative w-16 h-16 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-white font-[var(--font-display)] text-2xl"
          style={{ background: `linear-gradient(135deg, ${tint}, #1a3340)` }}
        >
          <span className="absolute inset-0 flex items-center justify-center text-cream-50">{initials}</span>
          {p.photo && (
            <>
              <img
                src={p.photo}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'grayscale(0.4) contrast(1.05)', mixBlendMode: 'luminosity', opacity: 0.95 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(64,124,155,0.25), rgba(26,51,64,0.45))', mixBlendMode: 'multiply' }}
              />
            </>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-navy-900 leading-tight mb-0.5">{p.name}</h3>
          <div className="text-sm text-ink-700 mb-1">{p.role}</div>
          <div className="text-[11px] font-[var(--font-mono)] text-ink-500 inline-flex items-center gap-1">
            <Icon name="map-pin" size={10} /> {p.loc}
          </div>
        </div>
      </div>
      <p className="text-sm text-ink-700 leading-relaxed mb-4">{p.bio}</p>
      <div className="flex items-center gap-2 pt-4 border-t border-cream-300">
        <a className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-200 hover:bg-sea-100 text-ink-700 hover:text-sea-700 rounded-full text-xs font-bold transition-colors cursor-pointer">LinkedIn</a>
        <a className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-200 hover:bg-sea-100 text-ink-700 hover:text-sea-700 rounded-full text-xs font-bold transition-colors cursor-pointer">ORCID</a>
      </div>
    </article>
  );
}
