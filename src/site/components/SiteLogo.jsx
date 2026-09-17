import Link from 'next/link';

// The official Jigsaw logo: the J mark and the JIGSAW name as one image.
// Design feedback, 15 September 2026: "Could we replace the 'Jigsaw Education
// Evidence' wording next to our logo with our combined image/word logo?"
//
// public/brand/jigsaw-logo.png is the client's transparent PNG trimmed to the
// artwork (2251x619) and exported 264px tall: sharp at a 44px logo on 3x
// screens, 16KB. `size` is the rendered height; the width follows the artwork.
//
// Site settings can replace the file (Organisation, "Logo"). A replacement
// has to be the same lockup, mark and name together, because nothing else is
// drawn beside it.
const DEFAULT_SRC = '/brand/jigsaw-logo.png';
const ASPECT = 960 / 264;

export default function SiteLogo({ size = 40, href = '/', logoSrc = null }) {
  return (
    <Link
      href={href}
      aria-label="Jigsaw Education Evidence, home"
      className="inline-flex shrink-0 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
    >
      <img
        src={logoSrc || DEFAULT_SRC}
        alt=""
        width={Math.round(size * ASPECT)}
        height={size}
        decoding="async"
        style={{ height: size, width: 'auto' }}
        className="block max-w-none"
      />
    </Link>
  );
}
