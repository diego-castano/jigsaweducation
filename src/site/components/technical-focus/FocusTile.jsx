'use client';

import Icon from '../../../components/Icon';

// Surface treatments for the mosaic. The client's note was that Technical focus
// and Services read as the same page, so this one never renders a uniform card
// grid: five cream tiles carry two reversed tiles and one orange tint, and the
// widths change row by row.
//
// Contrast, measured against the tokens in globals.css:
//   cream-50  on sea-600   5.5:1   AA
//   cream-50  on navy-900  12.7:1  AAA
//   navy-900  on orange-100 11.2:1 AAA
//   navy-900  on cream-100  12.9:1 AAA
const TONES = {
  cream: {
    surface: 'bg-cream-100 hover:bg-cream-200',
    title: 'text-navy-900',
    plate: 'border-cream-400 text-sea-600 group-hover:border-orange-400 group-hover:text-orange-600',
    ghost: 'text-navy-900 opacity-[0.08]',
    mark: 'text-ink-600 group-hover:text-orange-600'
  },
  orange: {
    surface: 'bg-orange-100 hover:bg-orange-200',
    title: 'text-navy-900',
    plate: 'border-orange-300 text-orange-700 group-hover:border-orange-500',
    ghost: 'text-orange-700 opacity-[0.12]',
    mark: 'text-orange-700'
  },
  sea: {
    surface: 'bg-sea-600 hover:bg-sea-700',
    title: 'text-cream-50',
    plate: 'border-cream-50/40 text-cream-50 group-hover:border-cream-50',
    ghost: 'text-cream-50 opacity-[0.10]',
    mark: 'text-cream-100'
  },
  navy: {
    surface: 'bg-navy-900 hover:bg-navy-800',
    title: 'text-cream-50',
    plate: 'border-cream-50/30 text-cream-50 group-hover:border-orange-400',
    ghost: 'text-cream-50 opacity-[0.10]',
    mark: 'text-cream-100'
  }
};

export default function FocusTile({
  area,
  tone = 'cream',
  height,
  titleClass,
  ghostSize,
  selected,
  buttonId,
  panelId,
  onToggle,
  buttonRef
}) {
  const t = TONES[tone] || TONES.cream;

  return (
    <button
      ref={buttonRef}
      id={buttonId}
      type="button"
      aria-expanded={selected}
      aria-controls={panelId}
      onClick={onToggle}
      className={[
        'group relative w-full flex flex-col justify-between overflow-hidden rounded-2xl',
        'p-5 sm:p-6 text-left transition-colors duration-300',
        'focus:outline-none',
        'focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50',
        height,
        t.surface,
        selected ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-cream-50' : ''
      ].join(' ')}
    >
      {/* Ghost glyph: the icon again, oversized and cropped by the tile edge.
          Decorative, so it stays out of the accessibility tree. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-8 -right-8 transition-transform duration-500 ease-[var(--ease-emphasized)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:translate-x-1 ${t.ghost}`}
      >
        <Icon name={area.icon} size={ghostSize} strokeWidth={0.8} />
      </span>

      <span className="relative flex items-start justify-between gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${t.plate}`}
        >
          <Icon name={area.icon} size={28} strokeWidth={1.4} />
        </span>
        <span className={`mt-1 shrink-0 transition-colors duration-300 ${t.mark}`} aria-hidden="true">
          <Icon name={selected ? 'minus' : 'plus'} size={16} />
        </span>
      </span>

      <span
        className={`relative mt-10 block font-display ${titleClass} leading-[1.1] ${t.title}`}
      >
        {area.title}
      </span>
    </button>
  );
}
