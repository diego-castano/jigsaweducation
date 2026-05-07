/**
 * Jigsaw J badge — uses /public/logo.png (the official orange J mark).
 * The PNG is 600x150 with the badge on the left. We render it 4x wide
 * relative to the rounded container so only the J portion is visible.
 */
export default function LogoMark({ size = 32, alt = 'Jigsaw' }) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0"
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      <img
        src="/logo.png"
        alt={alt}
        loading="eager"
        decoding="async"
        style={{
          width: size * 4,
          height: size,
          maxWidth: 'none',
          objectFit: 'cover',
          objectPosition: 'left center',
          display: 'block'
        }}
      />
    </div>
  );
}

/** Reversed J on cream — for navy or photo backgrounds (used on Brand page) */
export function LogoMarkReversed({ size = 32 }) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0 bg-cream-50 flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label="Jigsaw"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 100 100" fill="#ff7816">
        <path d="M38 22 H50 V30 H56 V52 H38 Z" />
        <path d="M22 60 a28 22 0 0 0 56 0 Z" />
      </svg>
    </div>
  );
}
