import { useState } from 'react';
import Icon from '../components/Icon';
import Btn from '../components/Btn';
import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';

export default function ContainersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(0);
  const faqs = [
    { q: 'How long does a typical engagement take?', a: 'Most studies run between 6 and 18 months, depending on scope. Smaller advisory engagements can be completed in 4–8 weeks.' },
    { q: 'Do you work in person or remotely?', a: 'Both. Our team is split between London and Lusaka, and we travel to research contexts when fieldwork requires it. Remote-first methods are designed in from the start where appropriate.' },
    { q: 'Can you support our internal research team?', a: 'Yes. We frequently embed alongside in-house teams to provide methodological support, coaching, or capacity-building.' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Components · 07"
        title="Containers"
        lede="Modals, drawers, and accordions. The structural elements that hold longer-form content."
      />
      <Section title="Modal">
        <Card>
          <Btn onClick={() => setModalOpen(true)}>Open modal</Btn>
          {modalOpen && (
            <div
              className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="bg-cream-50 rounded-2xl shadow-xl max-w-md w-full p-8 slide-in"
                onClick={(ev) => ev.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl text-navy-900">Subscribe to updates</h3>
                  <button onClick={() => setModalOpen(false)} className="text-ink-500 hover:text-navy-900">
                    <Icon name="x" size={20} />
                  </button>
                </div>
                <p className="text-sm text-ink-700 mb-5">{"We'll send you the Year in Review and notable Learning Briefs. No spam, unsubscribe anytime."}</p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl mb-4 focus:outline-none focus:border-sea-500"
                />
                <div className="flex gap-2 justify-end">
                  <Btn variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Btn>
                  <Btn size="sm" onClick={() => setModalOpen(false)}>Subscribe</Btn>
                </div>
              </div>
            </div>
          )}
        </Card>
      </Section>
      <Section title="Accordion (FAQ)" description="Used for the FAQ page that lives in the footer — SEO-oriented, content-heavy.">
        <Card className="p-0 overflow-hidden">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-cream-300 last:border-0">
              <button
                onClick={() => setAccOpen(accOpen === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-cream-200 transition-colors"
              >
                <span className="font-bold text-navy-900">{f.q}</span>
                <Icon name="chevron-down" size={18} className={`text-ink-500 transition-transform ${accOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {accOpen === i && (
                <div className="px-6 pb-5 text-sm text-ink-700 leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </Card>
      </Section>
      <Section title="Tooltip">
        <Card>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-700">Hover the icon →</span>
            <div className="relative group">
              <button className="w-6 h-6 rounded-full bg-cream-200 text-ink-600 flex items-center justify-center hover:bg-sea-100">
                <Icon name="info" size={12} />
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-navy-900 text-cream-50 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Free to download as PDF
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}
