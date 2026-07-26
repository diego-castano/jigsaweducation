import Btn from '../../components/Btn';
import PageHeader from '../../components/PageHeader';
import LogoMark from '../../components/LogoMark';

export default function NotFound() {
  return (
    <div>
      <PageHeader
        kicker="Site Templates · 04"
        title="404 page"
        lede="The page-not-found state. Calm, helpful, never apologetic. The J pulses subtly to acknowledge the moment."
      />
      <div className="relative bg-cream-100 border border-cream-300 rounded-3xl py-20 px-8 text-center overflow-hidden">
        <div className="blob bg-sea-300" style={{ top: '-80px', right: '10%', width: '260px', height: '260px' }} />
        <div className="blob bg-orange-300" style={{ bottom: '-60px', left: '15%', width: '220px', height: '220px' }} />
        <div className="relative z-10">
          <div className="mx-auto mb-6 flex items-center justify-center" style={{ animation: 'splashScale 1.2s var(--ease-decelerate)' }}>
            <LogoMark size={96} />
          </div>
          <div className="font-display text-7xl lg:text-8xl text-navy-900 mb-3 leading-none" style={{ fontVariationSettings: "'opsz' 72" }}>404</div>
          <h2 className="font-display text-3xl text-navy-900 mb-3">{"We can't find that piece."}</h2>
          <p className="text-base text-ink-700 max-w-md mx-auto mb-8">
            {"The page you're looking for might have moved or never existed. The Evidence Library is a good place to start."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Btn icon="arrow-right">Back to home</Btn>
            <Btn variant="tertiary" icon="book-open" iconPos="left">Evidence Library</Btn>
            <Btn variant="ghost">Contact us</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
