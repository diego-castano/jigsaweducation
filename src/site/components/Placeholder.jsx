import { isPlaceholder } from '../../data/placeholder';

// Placeholder copy must stay visibly placeholder without wrecking the layout
// it sits in. v1 rendered a dashed bordered slab, which inside a card produced
// exactly the box-in-a-box look the client flagged as AI design. v2 is inline:
// a small "Copy tbc" chip plus muted italic text. Scannable in review, no
// nested container.
export default function Placeholder({ children, as: Tag = 'p', className = '' }) {
  if (!isPlaceholder(children)) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={`text-ink-500 italic ${className}`} data-placeholder="true">
      <span className="not-italic font-mono text-[9px] uppercase tracking-[0.16em] text-orange-600 border-b border-dashed border-orange-300 mr-2 pb-px align-middle whitespace-nowrap">
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
