import Icon from '../components/Icon';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';
import LogoMark, { LogoMarkReversed } from '../components/LogoMark';

export default function Brand() {
  const photoRules = [
    { ok: true, url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80',
      label: 'Own photography', why: "From Jigsaw's own field work, with consent. Faces respected, not crowded." },
    { ok: true, url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
      label: 'Context-rich, consensual', why: 'A specific moment from real research, not posed.' },
    { ok: false, url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
      label: 'Stock or generic', why: 'Anonymous global-south imagery without provenance is off-limits.' },
    { ok: false, url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      label: 'Tightly cropped on faces', why: 'Crops that reduce people to subjects break the dignity rule.' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Brand · 01"
        title="Brand applications"
        lede="How the system applies beyond the screen. Logo lockups, photography rules, the pattern, and brand voice in context."
      />
      <Section title="Logo system" description="The J mark on its own, paired with the wordmark, and reversed for dark or photo backgrounds.">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-8 flex flex-col items-center gap-4">
            <LogoMark size={80} />
            <div className="text-center">
              <div className="text-[11px] font-mono text-ink-700">J mark</div>
              <div className="text-[10px] font-mono text-ink-500 mt-1">on cream</div>
            </div>
          </div>
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <LogoMark size={56} />
              <div className="flex flex-col leading-tight">
                <span className="font-display text-2xl text-navy-900">Jigsaw</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-600 mt-0.5">Education Evidence</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] font-mono text-ink-700">Lockup horizontal</div>
              <div className="text-[10px] font-mono text-ink-500 mt-1">on cream</div>
            </div>
          </div>
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 flex flex-col items-center gap-4">
            <LogoMarkReversed size={80} />
            <div className="text-center">
              <div className="text-[11px] font-mono text-cream-200">Reversed</div>
              <div className="text-[10px] font-mono text-cream-400 mt-1">on navy</div>
            </div>
          </div>
          <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <LogoMark size={56} />
              <div className="flex flex-col leading-tight">
                <span className="font-display text-2xl text-cream-50">Jigsaw</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-cream-300 mt-0.5">Education Evidence</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] font-mono text-cream-200">Lockup reversed</div>
              <div className="text-[10px] font-mono text-cream-400 mt-1">on navy</div>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">Clear space</div>
            <div className="relative w-full aspect-[2/1] flex items-center justify-center bg-cream-50 rounded-xl overflow-hidden">
              <div className="absolute border-2 border-dashed border-orange-300/60 rounded-full" style={{ width: 130, height: 130 }} />
              <LogoMark size={80} />
            </div>
            <p className="text-xs text-ink-700 mt-3">Reserve clear space equal to the height of the J mark on every side. No type, image, or graphic enters the dashed zone.</p>
          </div>
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">Minimum sizes</div>
            <div className="flex items-end gap-6 py-2">
              {[16, 24, 32, 48].map(s => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <LogoMark size={s} />
                  <span className="text-[10px] font-mono text-ink-500">{`${s}px`}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-700 mt-3">Never reproduce the J mark below 16px. Below 24px, omit the wordmark — use the J alone.</p>
          </div>
        </div>
      </Section>
      <Section title={"Photography do's and don'ts"} description="The photo policy in pictures. Own work, consensual context, dignified framing — never anonymous global-south imagery.">
        <div className="grid sm:grid-cols-2 gap-4">
          {photoRules.map((r, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden border-2 ${r.ok ? 'border-emerald-300' : 'border-red-300'}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={r.url} alt={r.label} loading="lazy" className="w-full h-full object-cover" />
                {!r.ok && <div className="absolute inset-0" style={{ background: 'rgba(214, 58, 26, 0.15)' }} />}
              </div>
              <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${r.ok ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'}`}>
                <Icon name={r.ok ? 'check' : 'x'} size={12} />
                {r.ok ? 'Do' : "Don't"}
              </div>
              <div className="p-4 bg-cream-100">
                <div className="font-bold text-navy-900 text-sm mb-1">{r.label}</div>
                <div className="text-xs text-ink-700 leading-relaxed">{r.why}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="The Jigsaw dot pattern" description="A subtle navy dot grid is the only approved decorative pattern. Use at 5–8% opacity, masked toward the edges. Never on top of body text.">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="relative bg-cream-100 border border-cream-300 rounded-2xl h-56 overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(44,83,104,0.22) 1px, transparent 1.5px)',
                backgroundSize: '20px 20px',
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, transparent 75%)'
              }}
            />
            <div className="relative z-10 text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-700 font-bold mb-2">Approved</div>
              <div className="text-sm text-ink-700">Background texture · 28px grid, 5–8% opacity</div>
            </div>
          </div>
          <div className="relative bg-cream-100 border border-cream-300 rounded-2xl h-56 overflow-hidden flex items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(44,83,104,0.6) 3px, transparent 4px)',
                backgroundSize: '14px 14px'
              }}
            />
            <div className="relative z-10 text-center bg-cream-50/85 rounded-xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-red-700 font-bold mb-2">Avoid</div>
              <div className="text-sm text-ink-700">Too dense, too dark, no fade-out</div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
