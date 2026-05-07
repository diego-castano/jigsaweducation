import Icon from './Icon';

export default function Swatch({ name, hex, className = '', onCopy }) {
  return (
    <button
      type="button"
      onClick={() => onCopy && onCopy(hex, `${hex} copied — ${name}`)}
      title={`Click to copy ${hex}`}
      className="group text-left w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-cream-50 rounded-xl"
    >
      <div
        className={`${className} relative aspect-[4/3] rounded-xl border border-cream-300 mb-2 transition-transform group-hover:-translate-y-0.5 overflow-hidden`}
        style={{ background: hex }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-navy-900 text-[10px] font-bold">
            <Icon name="copy" size={10} /> Copy
          </span>
        </div>
      </div>
      <div className="text-[12.5px] font-[var(--font-mono)] text-ink-700 mb-0.5">{name}</div>
      <div className="text-[11px] font-[var(--font-mono)] text-ink-500">{hex}</div>
    </button>
  );
}

export function Scale({ title, prefix, scale, onCopy }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg mb-4 text-navy-900">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
        {Object.entries(scale).map(([step, hex]) => (
          <Swatch key={step} name={`${prefix}-${step}`} hex={hex} onCopy={onCopy} />
        ))}
      </div>
    </div>
  );
}
