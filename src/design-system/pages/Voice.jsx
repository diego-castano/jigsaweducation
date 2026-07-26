import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function Voice() {
  return (
    <div>
      <PageHeader
        kicker="Documentation · 02"
        title="Voice & tone"
        lede={"Jigsaw's voice is rigorous, warm, clear, and grounded. The same voice runs through a research report, a Tweet, and a 404 page — only the tone shifts to match the moment."}
      />
      <Section title="Voice attributes">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { word: 'Rigorous', desc: "Precise, evidence-led, intellectually honest. We don't overclaim." },
            { word: 'Warm', desc: 'Human, accessible, humble. We are people, not an institution.' },
            { word: 'Clear', desc: 'Plain English. Technical when necessary, never to impress.' },
            { word: 'Grounded', desc: 'Local context first. Global generalisations second, with caution.' }
          ].map(v => (
            <Card key={v.word}>
              <div className="font-display text-3xl text-navy-900 mb-2">{v.word}</div>
              <div className="text-sm text-ink-700 leading-relaxed">{v.desc}</div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Tone shifts by context" description="The voice stays constant. The tone adjusts to what the moment needs.">
        <div className="space-y-3">
          {[
            { ctx: 'Research output', tone: 'Formal, structured, citation-heavy', ex: 'This brief synthesises evidence from twelve country studies conducted between 2020 and 2025.' },
            { ctx: 'Team page', tone: 'Personable, individual, specific', ex: 'David has spent fifteen years researching education in low and middle-income contexts. He travels too much and reads more than is healthy.' },
            { ctx: 'Case study', tone: 'Narrative, contextual, learning-oriented', ex: 'The programme launched in 2022 with three schools. By the time we finished our evaluation, eleven were on the waiting list.' },
            { ctx: 'Empty state / error', tone: 'Helpful, brief, never apologetic', ex: 'No publications match those filters yet. Try removing one or two.' }
          ].map(t => (
            <Card key={t.ctx} className="grid lg:grid-cols-[180px_180px_1fr] gap-4">
              <div className="text-sm font-bold text-navy-900">{t.ctx}</div>
              <div className="text-xs text-ink-600">{t.tone}</div>
              <div className="text-sm text-ink-700 italic font-display" style={{ fontVariationSettings: "'opsz' 24" }}>{'"' + t.ex + '"'}</div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Word choices" description="Small lexical choices reflect the values. We pay attention.">
        <Card>
          <div className="space-y-3">
            {[
              ['communities', 'beneficiaries'],
              ['evidence', 'data points'],
              ['locally-led', 'in-country'],
              ['research participants', 'subjects'],
              ['low and middle-income contexts', 'developing countries'],
              ['partners', 'recipients']
            ].map(([yes, no]) => (
              <div key={yes} className="flex items-center gap-3 py-2 border-b border-cream-300 last:border-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                  <Icon name="check" size={12} />
                  {yes}
                </span>
                <span className="text-ink-500">over</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-mono line-through">{no}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}
