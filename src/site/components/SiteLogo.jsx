import Link from 'next/link';

// AWAITING CLIENT ASSET.
// Brand 01 feedback: "if we are using the word 'Jigsaw' next to or in lieu of
// the circular logo, please can we ensure we use the official logo/font, rather
// than the website heading font." Becky's comment: "Provide logo with the word
// as PNG SVG."
//
// /public/logo.png is 600x150 and contains the J badge alone — the right two
// thirds are empty. There is no wordmark asset anywhere on the live site.
//
// So the wordmark below is set in Lato, the brand's own body typeface, NOT in
// Literata. That respects the instruction (no heading font) without leaving the
// header as a bare orange circle. When the official wordmark arrives, set
// WORDMARK_SRC and the component renders the real asset instead — one line.
const WORDMARK_SRC = null;

export default function SiteLogo({ size = 40, reversed = false, href = '/' }) {
  const label = 'Jigsaw Education Evidence — home';

  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center gap-3 group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      <span
        className="rounded-full overflow-hidden shrink-0 block"
        style={{ width: size, height: size }}
      >
        {/* Rendered 4x wide and cropped left, because the badge sits in the
            leftmost quarter of the source PNG. */}
        <img
          src="/logo.png"
          alt=""
          width={size * 4}
          height={size}
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
      </span>

      {WORDMARK_SRC ? (
        <img src={WORDMARK_SRC} alt="Jigsaw" style={{ height: size * 0.5 }} />
      ) : (
        <span className="leading-none">
          <span
            className={`font-body font-black tracking-tight block ${
              reversed ? 'text-cream-50' : 'text-navy-900'
            }`}
            style={{ fontSize: size * 0.52 }}
          >
            Jigsaw
          </span>
          <span
            className={`font-body text-[10px] uppercase tracking-[0.18em] block mt-1 ${
              reversed ? 'text-cream-300' : 'text-ink-600'
            }`}
          >
            Education Evidence
          </span>
        </span>
      )}
    </Link>
  );
}
