import Icon from '../../components/Icon';
import Btn from '../../components/Btn';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function HeroesPage() {
  return (
    <div>
      <PageHeader
        kicker="Site Modules · 01"
        title="Hero patterns"
        lede="Three hero variations covering the editorial, statement, and visual openings the site needs."
      />
      <Section
        title="Statement hero"
        description={'No photo. Big Literata title, single-colour orange blobs, dual CTA. The default for content pages. Blobs were sea-and-orange in the first draft; the client review simplified them to one hue so the orange accent stays the one colour that reads as "action" on the page, per the 3:1 sea/orange rule.'}
      >
        <div className="relative bg-cream-100 border border-cream-300 rounded-2xl px-8 py-16 lg:py-24 overflow-hidden">
          <div className="blob bg-orange-300" style={{ top: '-80px', right: '-80px', width: '300px', height: '300px' }} />
          <div className="blob bg-orange-200" style={{ bottom: '-50px', left: '-50px', width: '200px', height: '200px' }} />
          <div className="relative z-10 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">Education in Emergencies</div>
            <h1 className="font-display display-l text-5xl lg:text-6xl text-navy-900 leading-[0.95] mb-5">
              Learning continues, even when school does not.
            </h1>
            <p className="text-lg text-ink-700 leading-relaxed mb-7">A decade of research on how children learn through displacement, conflict, and crisis — and what works to keep them learning.</p>
            <div className="flex flex-wrap gap-3">
              <Btn icon="arrow-right">Read the latest brief</Btn>
              <Btn variant="ghost">Browse all publications</Btn>
            </div>
          </div>
        </div>
        <p className="text-sm text-ink-600 mt-4">
          Full-page variant, home only: the two blobs above are replaced by <code className="font-mono text-xs bg-cream-200 px-1.5 py-0.5 rounded">GlobeBackdrop</code>, an animated globe rendered with cobe behind the headline. It is a homepage-specific backdrop, not a general hero option.
        </p>
      </Section>
      <Section title="Editorial split hero" description="For homepage and major landing pages. Title left, featured publication right.">
        <div className="relative bg-navy-900 rounded-2xl p-8 lg:p-12 overflow-hidden text-cream-50">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center relative z-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-orange-400 font-bold mb-4">Jigsaw Education Evidence</div>
              <h1
                className="font-display text-4xl lg:text-6xl leading-[0.95] mb-6"
                style={{ fontVariationSettings: "'opsz' 72" }}
              >
                {"Evidence that "}
                <em className="italic text-orange-400" style={{ fontVariationSettings: "'opsz' 72, 'wght' 400" }}>travels.</em>
              </h1>
              <p className="text-base lg:text-lg text-cream-300 leading-relaxed mb-6 max-w-xl">We work with governments, INGOs, and donors to produce rigorous, locally-grounded research in low and middle-income contexts.</p>
              <div className="flex flex-wrap gap-3">
                <Btn className="bg-orange-500 hover:bg-orange-600 text-white">Our work</Btn>
                <button className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-cream-50 hover:text-orange-400 transition-colors">
                  Read the Year in Review
                  <Icon name="arrow-up-right" size={16} />
                </button>
              </div>
            </div>
            <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-cream-400 font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Latest publication
              </div>
              <h3 className="text-cream-50 text-2xl mb-2 leading-tight">Learning at scale: A 2026 review of EdTech in East Africa</h3>
              <p className="text-sm text-cream-300 mb-4 leading-relaxed">Synthesising evidence from 12 country studies on what makes EdTech investments stick.</p>
              <div className="flex items-center gap-2 text-xs text-cream-400 font-mono mb-5">
                <span>Hollow, Koomar, Iyer</span>
                <span>·</span>
                <span>March 2026</span>
              </div>
              <Btn size="sm" icon="download" iconPos="left" className="bg-cream-50 hover:bg-cream-100 text-navy-900">Download PDF</Btn>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Photo hero" description="Full-bleed photograph with navy duotone overlay. Used only with own-photo content (per the photo policy).">
        <div className="relative rounded-2xl overflow-hidden h-[460px] bg-navy-900">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80"
            alt="Classroom in Zambia"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(0.55) contrast(1.05)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(26,51,64,0.35) 0%, rgba(26,51,64,0.55) 50%, rgba(26,51,64,0.92) 100%)' }}
          />
          <div
            className="absolute top-0 right-0 w-1/2 h-1/2 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,120,22,0.22) 0%, transparent 55%)' }}
          />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-cream-50">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cream-50/15 backdrop-blur-sm border border-cream-50/25 text-cream-50 text-xs font-bold rounded-full mb-4 self-start">
              <Icon name="map-pin" size={12} />
              Lusaka, Zambia · Field study
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-cream-50 mb-3 max-w-2xl leading-tight">Strengthening evidence partnerships in southern Africa</h2>
            <p className="text-base text-cream-100 max-w-xl mb-6">Our newest entity in Zambia brings local research capacity and partnerships closer to the contexts we serve.</p>
            <Btn size="sm" className="bg-orange-500 hover:bg-orange-600 text-white self-start" icon="arrow-right">Read the case study</Btn>
          </div>
        </div>
      </Section>
    </div>
  );
}
