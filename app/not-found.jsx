import Link from 'next/link';
import SiteHeader from '../src/site/components/SiteHeader';
import { MobileNavProvider } from '../src/site/components/MobileNavContext';
import SiteFooter from '../src/site/components/SiteFooter';
import Icon from '../src/components/Icon';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true }
};

// Lives at the root rather than inside the (site) group so it also catches
// unmatched URLs outside it. Carries the chrome itself for that reason.
export default function NotFound() {
  return (
    <MobileNavProvider>
      <SiteHeader />
      <main id="main">
        <section className="relative overflow-hidden">
          <span
            className="blob"
            style={{ width: 460, height: 460, top: -180, right: -120, background: '#ffb077' }}
            aria-hidden="true"
          />
          <div className="relative max-w-[760px] mx-auto px-6 py-24 lg:py-32 text-center">
            <p
              className="font-display text-7xl sm:text-8xl text-cream-400 leading-none"
              style={{ fontVariationSettings: "'opsz' 72" }}
            >
              404
            </p>
            <h1 className="font-display display-m text-3xl sm:text-4xl lg:text-5xl text-navy-900 mt-6 leading-tight">
              We can&rsquo;t find that piece.
            </h1>
            <p className="mt-5 text-lg text-ink-700">
              The page you were looking for has moved or never existed. The links below cover most
              of what is here.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-bold transition-colors"
              >
                Back to home
                <Icon name="arrow-right" size={16} />
              </Link>
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 px-6 py-3 border border-sea-500 text-sea-700 hover:bg-sea-50 rounded-full text-sm font-bold transition-colors"
              >
                Evidence library
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-cream-400 text-ink-700 hover:bg-cream-100 rounded-full text-sm font-bold transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </MobileNavProvider>
  );
}
