import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function TypographyPage() {
  // Sizes below are what the build actually renders, not aspirations. The v1
  // page claimed 88/96 for Display XL while Tailwind rendered 72/72.
  const scaleItems = [
    { name: 'Display XL', cls: 'font-display display-xl text-7xl', sample: 'Evidence', meta: '72px / 72px · Literata 400' },
    { name: 'Display L', cls: 'font-display display-l text-6xl', sample: 'Evidence at scale', meta: '60px / 60px · Literata 400' },
    { name: 'Display M', cls: 'font-display display-m text-5xl', sample: 'Research that travels', meta: '48px / 48px · Literata 400' },
    { name: 'Heading 1', cls: 'font-display text-4xl', sample: 'Education in emergencies', meta: '36px / 40px · Literata 400' },
    { name: 'Heading 2', cls: 'font-display text-3xl', sample: 'Fifteen years of practice', meta: '30px / 36px · Literata 400' },
    { name: 'Heading 3', cls: 'font-display text-2xl', sample: 'Methodology', meta: '24px / 32px · Literata 400' },
    { name: 'Body Large', cls: 'font-body text-lg', sample: 'Jigsaw works alongside governments and INGOs to produce rigorous evidence in low and middle-income contexts.', meta: '18px / 28px · Lato 400' },
    { name: 'Body', cls: 'font-body text-base', sample: 'Across more than 50 organisations and 150 assignments, our work informs how decisions get made.', meta: '16px / 24px · Lato 400' },
    { name: 'Caption', cls: 'font-body text-xs uppercase tracking-[0.15em] text-ink-600 font-bold', sample: 'Learning Brief · March 2026', meta: '12px / 16px · Lato 700' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Foundations · 02"
        title="Typography"
        lede="Literata for editorial weight, Lato for clarity. A pairing that gives Jigsaw the gravitas of a research journal with the warmth of a long-form magazine."
      />
      <Section
        title="The pairing"
        description="Literata is a variable serif with optical sizing — at display sizes it opens up, at small sizes it tightens to stay readable. Lato (kept from the existing brand) brings continuity and a humanist sans-serif voice for body copy."
      >
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">Display &amp; Headlines</div>
            <div
              className="font-display text-7xl text-navy-900 leading-[0.9] mb-4"
              style={{ fontVariationSettings: "'opsz' 72, 'wght' 400" }}
            >
              Literata
            </div>
            <div className="text-sm text-ink-700 mb-1">{'Variable serif · 200–900, roman and italic'}</div>
            <div className="text-xs text-ink-500">{'Optical sizing 7–72 · TypeTogether · OFL-1.1'}</div>
          </Card>
          <Card>
            <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-2">Body &amp; UI</div>
            <div className="font-body text-7xl font-bold text-navy-900 leading-[0.9] mb-4">Lato</div>
            <div className="text-sm text-ink-700 mb-1">{'Sans-serif · 300, 400, 700, 900'}</div>
            <div className="text-xs text-ink-500">Carried over from the existing brand for continuity</div>
          </Card>
        </div>
      </Section>

      <Section
        title="Why the display face changed"
        description="Version 1 used Fraunces. The change is a correction, not a rebrand — the body face, the scale and the colour are untouched."
      >
        <Card className="p-0 overflow-hidden">
          <div className="grid sm:grid-cols-2">
            <div className="p-8 border-b sm:border-b-0 sm:border-r border-cream-300">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold mb-4">Retired · Fraunces</div>
              <div className="text-sm text-ink-700 leading-relaxed">
                Fraunces closes its terminals in balls: the uppercase{' '}
                <span className="font-bold text-navy-900">J</span> ends in a bulbous hook, the{' '}
                <span className="font-bold text-navy-900">f</span> carries a heavy ball at the head and
                the <span className="font-bold text-navy-900">j</span> curls into another. The brand
                name starts with a J, so the letter appears in every headline that says Jigsaw.
              </div>
              <div className="text-xs text-ink-500 mt-4 font-mono">
                No stylistic set fixes it — Fraunces ships one alternate set and it only touches h, m, n, s.
              </div>
            </div>
            <div className="p-8 bg-cream-200">
              <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-4">Current · Literata</div>
              <div
                className="font-display text-6xl text-navy-900 leading-none mb-4"
                style={{ fontVariationSettings: "'opsz' 60" }}
              >
                J f j
              </div>
              <div className="text-sm text-ink-700 leading-relaxed">
                The J plants on the baseline and ends in a blunt, flat terminal. The f closes in a small
                contained flag. The j runs straight down and cuts at an angle. Same warm book serif,
                none of the flourish.
              </div>
            </div>
          </div>
        </Card>
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

      <Section title="Editorial pull quote" description="Literata italic at large sizes, with optical sizing pushed open. Use sparingly — once per page maximum.">
        <Card className="bg-navy-900 text-cream-50 border-navy-900 px-10 py-12">
          <div className="text-orange-400 mb-4">
            <Icon name="sparkles" size={28} />
          </div>
          <blockquote
            className="font-display text-3xl sm:text-4xl italic leading-[1.2] text-cream-50 max-w-3xl"
            style={{ fontVariationSettings: "'opsz' 72, 'wght' 400" }}
          >
            {'"The most useful evidence travels — across borders, across institutions, and across the gaps between what is known and what gets done."'}
          </blockquote>
          <div className="text-sm text-cream-300 mt-6 font-mono">— Year in Review, Jigsaw 2025</div>
        </Card>
      </Section>
    </div>
  );
}
