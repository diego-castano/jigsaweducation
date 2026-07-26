import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';
import Swatch, { Scale } from '../../components/Swatch';
import { SCALES } from '../../data/tokens';

export default function ColorsPage({ onCopy }) {
  const { orange, sea, navy, cream, ink, viz } = SCALES;

  return (
    <div>
      <PageHeader
        kicker="Foundations · 01"
        title="Colour"
        lede="A warm evolution of the existing brand. Sea blue and navy carry weight; cream replaces the cold grey neutral; orange remains the precious accent reserved for the moments that matter."
      />
      <Section
        title="Primary palette"
        description="The four core brand colours, each extended into a usable scale. Sea blue and navy lead. Cream provides warmth. Orange is the spark."
      >
        <Scale title="Orange · accent" prefix="orange" scale={orange} onCopy={onCopy} />
        <Scale title="Sea Blue · primary" prefix="sea" scale={sea} onCopy={onCopy} />
        <Scale title="Navy · deep primary" prefix="navy" scale={navy} onCopy={onCopy} />
      </Section>
      <Section
        title="Cream — the warm neutral"
        description="The single most important shift from the legacy guidelines. We replaced the cold grey #f0f2f2 with a warm cream that gives the brand its 2026 character."
      >
        <Scale title="Cream · backgrounds & surfaces" prefix="cream" scale={cream} onCopy={onCopy} />
        <Scale title="Ink · body text" prefix="ink" scale={ink} onCopy={onCopy} />
      </Section>
      <Section
        title="Extended palette"
        description="Reserved for data visualisation, illustrations, and graphic elements. Pulled directly from the existing brand guidelines."
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(viz).map(([name, hex]) => (
            <Swatch key={name} name={`viz-${name}`} hex={hex} onCopy={onCopy} />
          ))}
        </div>
      </Section>
      <Section
        title="The 3:1 rule"
        description="From the original brand guidelines: sea blue and cream should appear three times as often as orange and navy. Orange is precious. Use it for primary CTAs and moments of emphasis only."
      >
        <Card>
          <div className="flex h-12 rounded-lg overflow-hidden border border-cream-300">
            <div className="flex-[6]" style={{ background: '#407c9b' }} />
            <div className="flex-[6]" style={{ background: '#FAF6EE' }} />
            <div className="flex-[2]" style={{ background: '#2c5368' }} />
            <div className="flex-[1]" style={{ background: '#ff7816' }} />
          </div>
          <div className="flex justify-between mt-3 text-[11px] font-mono text-ink-600">
            <span>Sea & Cream — 6 parts</span>
            <span>Navy — 2</span>
            <span>Orange — 1</span>
          </div>
        </Card>
      </Section>
      <Section
        title="Semantic states"
        description="Functional colours for system feedback, derived from the extended palette to maintain harmony."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Success', hex: '#1c998a', use: 'Confirmation, completion' },
            { label: 'Warning', hex: '#f9b233', use: 'Caution, pending action' },
            { label: 'Error', hex: '#d63a1a', use: 'Validation, destructive' },
            { label: 'Info', hex: '#407c9b', use: 'Notice, neutral feedback' }
          ].map((s) => (
            <Card key={s.label} className="p-0 overflow-hidden">
              <div className="h-20" style={{ background: s.hex }} />
              <div className="p-4">
                <div className="font-display text-lg text-navy-900">{s.label}</div>
                <div className="text-[11px] font-mono text-ink-600 mb-1">{s.hex}</div>
                <div className="text-xs text-ink-700">{s.use}</div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
