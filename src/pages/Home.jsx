import Icon from '../components/Icon';
import LogoMark from '../components/LogoMark';

export default function HomePage({ onNav }) {
  const sections = [
    { id: 'colors', icon: 'palette', label: 'Foundations', sub: 'Tokens, type, space' },
    { id: 'buttons', icon: 'square', label: 'Components', sub: 'Buttons, forms, cards' },
    { id: 'motion', icon: 'zap', label: 'Motion', sub: 'Curves & patterns' },
    { id: 'heroes', icon: 'rocket', label: 'Site Modules', sub: 'Heroes, footers, cards' },
    { id: 'principles', icon: 'compass', label: 'Documentation', sub: 'Principles & voice' }
  ];

  return (
    <div className="relative min-h-[calc(100vh-128px)]">
      <div className="blob bg-sea-300" style={{ top: '-100px', right: '-100px', width: '500px', height: '500px' }} />
      <div className="blob bg-orange-300" style={{ bottom: '0px', left: '-150px', width: '400px', height: '400px' }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(44,83,104,0.18) 1px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)'
        }}
      />
      <div className="relative z-10 pt-12 pb-20">
        <div className="flex items-center gap-3 mb-12 reveal">
          <LogoMark size={48} />
          <div className="flex flex-col">
            <span className="font-display text-xl font-medium text-navy-900 leading-none">Jigsaw Education Evidence</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-600 mt-1">{"Design System · v1.0"}</span>
          </div>
        </div>
        <h1
          className="font-display display-xl text-[clamp(56px,12vw,160px)] leading-[0.85] tracking-[-0.04em] text-navy-900 mb-8 reveal reveal-1"
          style={{ fontVariationSettings: "'opsz' 144, 'WONK' 1, 'SOFT' 100" }}
        >
          {"Jigsaw "}
          <span
            className="italic text-orange-500"
            style={{ fontVariationSettings: "'opsz' 144, 'WONK' 1, 'SOFT' 100" }}
          >
            2026.
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-ink-700 leading-relaxed max-w-2xl mb-12 reveal reveal-2">
          A design system for an evidence-driven brand. Foundations, components, and patterns evolved for clarity, dignity, and quiet credibility.
        </p>
        <div className="flex flex-wrap gap-3 mb-20 reveal reveal-3">
          <button
            onClick={() => onNav('colors')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-cream-50 rounded-full font-bold text-sm transition-colors"
          >
            Explore foundations
            <Icon name="arrow-right" size={16} />
          </button>
          <button
            onClick={() => onNav('principles')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cream-200 hover:bg-cream-300 text-navy-900 rounded-full font-bold text-sm transition-colors"
          >
            Read the principles
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 reveal reveal-4">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNav(s.id)}
              className="group text-left bg-cream-100 hover:bg-cream-200 border border-cream-300 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-sea-100 group-hover:bg-orange-100 flex items-center justify-center mb-4 text-sea-600 group-hover:text-orange-500 transition-colors">
                <Icon name={s.icon} size={20} />
              </div>
              <div className="font-display text-lg text-navy-900 leading-tight mb-1">{s.label}</div>
              <div className="text-xs text-ink-600">{s.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
