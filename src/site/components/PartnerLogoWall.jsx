import { PARTNER_LOGO_DIMS } from '../../data/partner-logo-dims';

// The partner organisations, in the client's specified order - the list
// arrives ordered from the partners collection.
//
// Logos are sized by visual area from their intrinsic dims (partner-logo-dims.js).
// A partner without a logo falls back to a typographic plate.
//
// The wall moves as two slow bands (60s a cycle, the second one running the
// other way). Motion belongs to presentation only: both tracks are aria-hidden
// and hold nothing focusable, and the real list for assistive tech is the
// static sr-only one below. Under prefers-reduced-motion globals.css stops the
// animation and lets the tracks wrap into a plain grid, so the mask and the
// duplicate copy have to go with it. That is what the scoped rule below does.
const MASK_CSS = `
.jw-marquee-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .jw-marquee-mask { -webkit-mask-image: none; mask-image: none; }
  .jw-marquee-dupe { display: none; }
}
`;


function logoHeight(src) {
  const d = PARTNER_LOGO_DIMS[src];
  if (!d) return null;
  return Math.min(60, Math.max(26, Math.round(72 / Math.sqrt(d[0] / d[1]))));
}

function Plate({ partner, duplicate = false }) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center h-20 px-8 lg:px-12 border-l border-cream-300 ${
        duplicate ? 'jw-marquee-dupe' : ''
      }`}
    >
      {partner.logo ? (
        <img
          src={partner.logo}
          alt=""
          style={logoHeight(partner.logo) ? { '--logo-h': `${logoHeight(partner.logo)}px` } : undefined}
          className={`${
            logoHeight(partner.logo)
              ? 'h-[calc(var(--logo-h)*0.8)] lg:h-[var(--logo-h)] max-w-[11rem]'
              : 'h-9 lg:h-11 max-w-[8.5rem] lg:max-w-[10rem]'
          } w-auto object-contain grayscale opacity-70 transition duration-500 hover:grayscale-0 hover:opacity-100`}
          loading="lazy"
        />
      ) : (
        <span className="font-display text-lg lg:text-xl leading-none text-ink-600 whitespace-nowrap transition-colors duration-300 hover:text-navy-900">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export default function PartnerLogoWall({ partners = [], pendingNote = null }) {
  // Two near-equal bands however long the list grows: a hardcoded slice at 9
  // unbalanced the marquees the moment the collection passed 18 entries.
  const splitAt = Math.ceil(partners.length / 2);
  const rows = [partners.slice(0, splitAt), partners.slice(splitAt)];

  return (
    <div>
      <style href="jw-partner-marquee" precedence="default" dangerouslySetInnerHTML={{ __html: MASK_CSS }} />

      <div className="border-t border-b border-cream-300 py-6 space-y-2">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="marquee jw-marquee-mask"
            aria-hidden="true"
          >
            <div
              className="marquee-track"
              style={rowIndex === 1 ? { animationDirection: 'reverse' } : undefined}
            >
              {/* Duplicated so the loop meets itself; the CSS translates -50%.
                  The second copy is dropped when the track stops moving. */}
              {[...row, ...row].map((partner, i) => (
                <Plate
                  key={`${partner.name}-${i}`}
                  partner={partner}
                  duplicate={i >= row.length}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* The list that actually gets read out and indexed. */}
      <ul className="sr-only">
        {partners.map((p) => (
          <li key={p.name}>{p.full}</li>
        ))}
      </ul>

      {/* Review-phase note: the page only passes it while Site settings has
          "Show review notes" switched on. */}
      {pendingNote && (
        <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-500">
          {pendingNote}
        </p>
      )}
    </div>
  );
}
