import { useState } from 'react';
import Icon from '../../components/Icon';
import Btn from '../../components/Btn';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function MotionPage() {
  const [pulse, setPulse] = useState(false);

  return (
    <div>
      <PageHeader
        kicker="Foundations · 06"
        title="Motion"
        lede="Subtle, purposeful, and short. Every transition exists to clarify a relationship or signal a state change — never to entertain."
      />
      <Section title="Easing curves" description="The four motion curves used across the system. Each ball runs the same distance — only the timing function differs.">
        <Card>
          {['standard', 'decelerate', 'accelerate', 'emphasized'].map((c) => (
            <div key={c} className="mb-6 last:mb-0">
              <div className="flex justify-between text-xs font-mono text-ink-700 mb-2">
                <span className="font-bold text-navy-900">{`ease-${c}`}</span>
                <span className="text-ink-500">
                  {c === 'standard' ? 'cubic-bezier(0.4, 0, 0.2, 1)' :
                   c === 'decelerate' ? 'cubic-bezier(0, 0, 0.2, 1)' :
                   c === 'accelerate' ? 'cubic-bezier(0.4, 0, 1, 1)' :
                   'cubic-bezier(0.2, 0, 0, 1)'}
                </span>
              </div>
              <div className="h-8 bg-cream-200 rounded-full relative overflow-hidden">
                <div className={`ease-demo ease-${c} absolute top-1 left-1 w-6 h-6 rounded-full bg-orange-500`} />
              </div>
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Duration scale" description="From instant to slower. Most UI transitions sit at 200–300ms. Page-level transitions go to 500ms.">
        <Card>
          <div className="space-y-3">
            {[
              { token: 'instant', ms: 100, use: 'Hover state changes' },
              { token: 'fast', ms: 200, use: 'Default UI transition' },
              { token: 'base', ms: 300, use: 'Card lift, dropdown' },
              { token: 'slow', ms: 500, use: 'Page-level transitions' },
              { token: 'slower', ms: 800, use: 'Stat counter animations' }
            ].map((d) => (
              <div key={d.token} className="flex items-center gap-4">
                <div className="w-24 text-xs font-mono text-navy-900 font-bold">{d.token}</div>
                <div className="w-16 text-[11px] font-mono text-ink-500">{`${d.ms}ms`}</div>
                <button
                  onClick={() => { setPulse(d.token); setTimeout(() => setPulse(null), d.ms + 100); }}
                  className={`w-8 h-8 rounded-full bg-sea-500 transition-transform ${pulse === d.token ? 'scale-150' : 'scale-100'}`}
                  style={{ transitionDuration: `${d.ms}ms` }}
                />
                <div className="flex-1 text-xs text-ink-700">{d.use}</div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
      <Section
        title="Site motion utilities"
        description="A small shared vocabulary in globals.css, used across every page so the site moves the same way everywhere. Every one of these collapses under prefers-reduced-motion: transforms are removed and elements simply render in their end state."
      >
        <Card>
          <div className="space-y-5">
            {[
              {
                token: '.rv + <Reveal>',
                spec: '700ms emphasized',
                use: 'Reveal-on-scroll. <Reveal delay={80}> staggers a group of children as they enter the viewport; the class fades in and lifts 22px, driven by an IntersectionObserver in Reveal.jsx.'
              },
              {
                token: '.link-sweep',
                spec: '350ms emphasized',
                use: 'Directional underline sweep on inline links: enters from the left on hover/focus, exits to the right on leave. Never a static underline.'
              },
              {
                token: '.row-sweep',
                spec: '450ms emphasized',
                use: 'Full-row background sweep for list rows and nav items. Colour is set per use with --sweep; content needs relative z-[1] to sit above the sweep layer.'
              },
              {
                token: '.expand-grid',
                spec: '500ms emphasized',
                use: 'Smooth height expansion for accordions and detail panels, animating grid-template-rows from 0fr to 1fr with the .open class rather than animating height or max-height.'
              },
              {
                token: '.marquee',
                spec: '60s linear, loops',
                use: 'Slow infinite band for the partner-logo wall, pausing on hover. 60 seconds reads premium; anything faster reads like an ad banner. One marquee on the whole site.'
              }
            ].map((d) => (
              <div key={d.token} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <div className="w-40 shrink-0 text-xs font-mono text-navy-900 font-bold">{d.token}</div>
                <div className="w-32 shrink-0 text-[11px] font-mono text-ink-500">{d.spec}</div>
                <div className="flex-1 text-sm text-ink-700 leading-relaxed">{d.use}</div>
              </div>
            ))}
          </div>
        </Card>
      </Section>
      <Section title="Microinteractions" description="The small moments that make the system feel considered.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="group cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="text-xs uppercase tracking-[0.15em] text-orange-500 font-bold mb-2">Hover lift</div>
            <div className="text-sm text-ink-700">Hover this card. shadow-sm → md, translateY -4px.</div>
          </Card>
          <Card>
            <div className="text-xs uppercase tracking-[0.15em] text-orange-500 font-bold mb-2">Button press</div>
            <Btn className="active:scale-95 transition-transform" size="sm">Click me</Btn>
          </Card>
          <Card>
            <div className="text-xs uppercase tracking-[0.15em] text-orange-500 font-bold mb-2">Focus ring</div>
            <input
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-lg focus:outline-none focus:border-sea-500 focus:ring-2 focus:ring-sea-100 transition-all"
              placeholder="Click me"
            />
          </Card>
          <Card>
            <div className="text-xs uppercase tracking-[0.15em] text-orange-500 font-bold mb-2">Skeleton</div>
            <div className="shimmer h-4 rounded mb-1.5" />
            <div className="shimmer h-4 rounded w-2/3" />
          </Card>
        </div>
      </Section>
      <Section title="Principles">
        <Card>
          <ul className="space-y-3 text-sm text-ink-700">
            {[
              'Motion clarifies relationships and state changes. It is never decorative.',
              'Default to fade-in-up. Stagger children at 50ms intervals.',
              'Respect prefers-reduced-motion. Replace transforms with fades or remove animation entirely.',
              'Page entrance: 200ms decelerate. Page exit: 150ms accelerate.',
              'Loading states should appear within 200ms or not appear at all.'
            ].map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-orange-500 mt-0.5">
                  <Icon name="check" size={14} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}
