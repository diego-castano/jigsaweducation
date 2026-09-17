import { isPlaceholder } from '../../data/placeholder';

// Placeholder copy must stay visibly placeholder without wrecking the layout
// it sits in. v1 rendered a dashed bordered slab, which inside a card produced
// exactly the box-in-a-box look the client flagged as AI design. v2 is inline:
// a small "Copy tbc" chip plus muted italic text. Scannable in review, no
// nested container. `reversed` swaps the muted tones for ones that read on navy.
export default function Placeholder({ children, as: Tag = 'p', className = '', reversed = false }) {
  if (!isPlaceholder(children)) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={`${reversed ? '' : 'text-ink-500 '}italic ${className}`} data-placeholder="true">
      <span
        className={`not-italic font-mono text-[9px] uppercase tracking-[0.16em] border-b border-dashed mr-2 pb-px align-middle whitespace-nowrap ${
          reversed ? 'text-orange-300 border-orange-400/60' : 'text-orange-600 border-orange-300'
        }`}
      >
        Copy tbc
      </span>
      {children}
    </Tag>
  );
}

// Inline variant for fragments inside a sentence or heading.
export function PlaceholderInline({ children }) {
  if (!isPlaceholder(children)) return children;
  return (
    <span
      className="border-b border-dashed border-orange-400 text-ink-500 italic"
      data-placeholder="true"
    >
      {children}
    </span>
  );
}
