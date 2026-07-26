import Placeholder from './Placeholder';

// The statement hero, applied as the default for content pages.
// Site modules 01 feedback: the blobs are kept but reduced to a single hue.
// "We're happy with the faint colour blobs, but would prefer them to be the
// same colour (probably orange), as we find the mix of colours distracting."
export default function PageHero({ kicker, title, lede, children }) {
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
        <h1 className="font-display display-l text-4xl sm:text-5xl lg:text-6xl text-navy-900 leading-[1.02] max-w-4xl reveal reveal-1">
          {title}
        </h1>
        {lede &&
          (typeof lede === 'string' ? (
            <Placeholder className="mt-6 text-lg sm:text-xl text-ink-700 leading-relaxed max-w-3xl reveal reveal-2">
              {lede}
            </Placeholder>
          ) : (
            <div className="mt-6 text-lg sm:text-xl text-ink-700 leading-relaxed max-w-3xl reveal reveal-2">
              {lede}
            </div>
          ))}
        {children && <div className="mt-8 reveal reveal-3">{children}</div>}
      </div>
    </section>
  );
}
