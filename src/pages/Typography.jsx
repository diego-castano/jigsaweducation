import Icon from '../components/Icon';
import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';

export default function TypographyPage() {
  const scaleItems = [
    { name: 'Display XL', cls: 'font-display display-xl text-7xl', sample: 'Evidence', meta: '88px / 96px · Fraunces 400' },
    { name: 'Display L', cls: 'font-display display-l text-6xl', sample: 'Evidence at scale', meta: '64px / 72px · Fraunces 400' },
    { name: 'Display M', cls: 'font-display display-m text-5xl', sample: 'Research that travels', meta: '48px / 56px · Fraunces 400' },
    { name: 'Heading 1', cls: 'font-display text-4xl', sample: 'Education in emergencies', meta: '40px / 48px · Fraunces 400' },
    { name: 'Heading 2', cls: 'font-display text-3xl', sample: 'A decade of practice', meta: '32px / 40px · Fraunces 400' },
    { name: 'Heading 3', cls: 'font-display text-2xl', sample: 'Methodology', meta: '24px / 32px · Fraunces 500' },
    { name: 'Body Large', cls: 'font-body text-lg', sample: 'Jigsaw works alongside governments and INGOs to produce rigorous evidence in low and middle-income contexts.', meta: '18px / 30px · Lato 400' },
    { name: 'Body', cls: 'font-body text-base', sample: 'Across 60+ organisations and 30+ countries, our work informs how decisions get made.', meta: '16px / 26px · Lato 400' },
    { name: 'Caption', cls: 'font-body text-xs uppercase tracking-[0.15em] text-ink-600 font-bold', sample: 'Learning Brief · March 2026', meta: '12px · Lato 700' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Foundations · 02"
        title="Typography"
        lede="Fraunces for editorial weight, Lato for clarity. A pairing that gives Jigsaw the gravitas of a research journal with the warmth of a long-form magazine."
      />
      <Section
        title="The pairing"
        description="Fraunces is a variable serif with optical sizing — at display sizes it grows expressive, at small sizes it tightens to remain readable. Lato (kept from the existing brand) brings continuity and a humanist sans-serif voice for body copy."
      >
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">Display & Headlines</div>
            <div
              className="font-display text-7xl text-navy-900 leading-[0.9] mb-4"
              style={{ fontVariationSettings: "'opsz' 144, 'wght' 400" }}
            >
              Fraunces
            </div>
            <div className="text-sm text-ink-700 mb-1">{"Variable serif · 300–700"}</div>
            <div className="text-xs text-ink-500">Optical sizing 9–144 · soft & wonk axes available</div>
          </Card>
          <Card>
            <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">Body & UI</div>
            <div className="font-body text-7xl font-bold text-navy-900 leading-[0.9] mb-4">Lato</div>
            <div className="text-sm text-ink-700 mb-1">{"Sans-serif · 300, 400, 700, 900"}</div>
            <div className="text-xs text-ink-500">Carried over from the existing brand for continuity</div>
          </Card>
        </div>
      </Section>
      <Section title="Type scale" description="A modular scale calibrated for editorial reading on cream backgrounds.">
        <Card className="space-y-6">
          {scaleItems.map((t) => (
            <div key={t.name} className="grid lg:grid-cols-[180px_1fr] gap-4 lg:gap-8 pb-6 border-b border-cream-300 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-bold text-navy-900">{t.name}</div>
                <div className="text-[11px] font-mono text-ink-500 mt-1">{t.meta}</div>
              </div>
              <div className={`${t.cls} text-navy-900`}>{t.sample}</div>
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Editorial pull quote" description="Fraunces in italic at large sizes, with optical sizing pushed to expressive. Use sparingly — once per page maximum.">
        <Card className="bg-navy-900 text-cream-50 border-navy-900 px-10 py-12">
          <div className="text-orange-400 mb-4">
            <Icon name="sparkles" size={28} />
          </div>
          <blockquote
            className="font-display text-3xl sm:text-4xl italic leading-[1.2] text-cream-50 max-w-3xl"
            style={{ fontVariationSettings: "'opsz' 144, 'wght' 400, 'SOFT' 100" }}
          >
            {'"The most useful evidence travels — across borders, across institutions, and across the gaps between what is known and what gets done."'}
          </blockquote>
          <div className="text-sm text-cream-300 mt-6 font-mono">— Year in Review, Jigsaw 2025</div>
        </Card>
      </Section>
    </div>
  );
}
