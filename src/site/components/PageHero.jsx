import Placeholder from './Placeholder';

// The statement hero, applied as the default for content pages.
// Site modules 01 feedback: the blobs are kept but reduced to a single hue.
// "We're happy with the faint colour blobs, but would prefer them to be the
// same colour (probably orange), as we find the mix of colours distracting."
export default function PageHero({ kicker, title, lede: ledeIn, more: moreIn, meta, children }) {
  let lede = ledeIn;
  let more = moreIn;
  if (typeof ledeIn === 'string' && !/<[a-z][^>]*>/i.test(ledeIn) && ledeIn.trim().split(/\s+/).length > 45) {
    const m = /\. /.exec(ledeIn.slice(19));
    if (m) {
      const cut = 19 + m.index + 1;
      lede = ledeIn.slice(0, cut);
      const rest = ledeIn.slice(cut).trim();
      more = (
        <>
          <p>{rest}</p>
          {moreIn}
        </>
      );
    }
  }
  return (
    <section className="relative overflow-hidden border-b border-cream-300">
      <span
        className="blob"
        style={{ width: 460, height: 460, top: -200, right: -120, background: '#ffb077' }}
        aria-hidden="true"
      />
      <span
        className="blob"
        style={{ width: 320, height: 320, bottom: -200, left: -100, background: '#ffcca8' }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-14 lg:pt-24 lg:pb-20">
        {kicker && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4 reveal">
            {kicker}
          </p>
        )}
        <h1 className="font-display display-l text-5xl sm:text-6xl lg:text-[4rem] leading-[1.02] text-navy-900 max-w-4xl reveal reveal-1">
          {title}
        </h1>
        {lede &&
          (typeof lede === 'string' ? (
            <Placeholder className="mt-6 text-xl lg:text-2xl text-navy-900 leading-relaxed max-w-[62ch] reveal reveal-2">
              {lede}
            </Placeholder>
          ) : (
            <div className="mt-6 text-xl lg:text-2xl text-navy-900 leading-relaxed max-w-[62ch] reveal reveal-2">
              {lede}
            </div>
          ))}
        {/* Every further intro paragraph sits below the lede in one column. */}
        {more && (
          <div className="mt-5 space-y-4 text-base lg:text-lg text-ink-700 leading-relaxed max-w-[65ch] reveal reveal-2">
            {more}
          </div>
        )}
        {meta && (
          <p className="mt-8 border-t border-cream-300 pt-4 text-sm text-ink-500 reveal reveal-3">{meta}</p>
        )}
        {children && <div className="mt-8 reveal reveal-3">{children}</div>}
      </div>
    </section>
  );
}
