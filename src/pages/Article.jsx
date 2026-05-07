import Btn from '../components/Btn';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import PublicationCard from '../components/PublicationCard';
import { PUBLICATIONS } from '../data/publications';

export default function Article() {
  return (
    <div>
      <PageHeader
        kicker="Site Templates · 01"
        title="Article page"
        lede="How a Learning Brief renders end-to-end. Eyebrow, Fraunces title, author row, lede image, body with pull-quote, citation, and related publications."
      />
      <article className="bg-cream-100 border border-cream-300 rounded-3xl overflow-hidden">
        <div className="relative h-72 lg:h-96 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1600&q=80"
            alt="Children studying"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(0.55) contrast(1.05)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,51,64,0.25) 0%, rgba(26,51,64,0.75) 100%)' }} />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12 text-cream-50">
            <Badge variant="orange">Learning Brief</Badge>
            <h1 className="font-display text-3xl lg:text-5xl mt-4 max-w-3xl leading-tight text-cream-50">
              Learning at scale: A 2026 review of EdTech in East Africa
            </h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr_220px] gap-10 px-8 lg:px-12 py-10 lg:py-14">
          <div className="prose-jigsaw max-w-none">
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-cream-300">
              <div className="flex -space-x-2">
                {['#407c9b', '#2c5368', '#ff7816'].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-cream-100 flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: `linear-gradient(135deg, ${c}, #1a3340)` }}
                  >
                    {['DH', 'SK', 'AI'][i]}
                  </div>
                ))}
              </div>
              <div className="text-[12px] text-ink-700">
                <div className="font-bold text-navy-900">Hollow, Koomar, Iyer</div>
                <div className="font-mono text-ink-500">March 2026 · 14 min read</div>
              </div>
              <div className="ml-auto flex gap-2">
                <Btn size="sm" icon="download" iconPos="left">PDF</Btn>
                <Btn size="sm" variant="tertiary" icon="send" iconPos="left">Cite</Btn>
              </div>
            </div>
            <p className="font-display text-2xl text-navy-900 leading-snug mb-6" style={{ fontVariationSettings: "'opsz' 36" }}>
              After a decade of EdTech investment in East Africa, what holds when funding ends and pilots scale? A synthesis of twelve country studies suggests the answer turns less on the technology than on the systems that surround it.
            </p>
            <h2 className="text-2xl mt-10 mb-3 text-navy-900">What we found</h2>
            <p className="text-base text-ink-800 leading-[1.75] mb-5">
              Across the twelve studies, three patterns emerged. First, where teachers were brought into design from the start, sustained use was three to four times higher than where they were trained on a finished product. Second, infrastructure assumptions consistently overestimated bandwidth and electricity reliability — a third of programmes had to redesign delivery within eighteen months.
            </p>
            <p className="text-base text-ink-800 leading-[1.75] mb-8">
              Third, and most important: programmes that integrated with existing assessment and reporting cycles outlived those that did not. Standalone pilots, however well-executed, struggled to outlast the funding window.
            </p>
            <blockquote className="relative my-10 pl-8 pr-6 py-6 border-l-4 border-orange-500 bg-cream-50 rounded-r-2xl">
              <p
                className="font-display text-xl lg:text-2xl text-navy-900 italic leading-snug"
                style={{ fontVariationSettings: "'opsz' 36, 'SOFT' 80" }}
              >
                "The most useful evidence travels — across borders, across institutions, and across the gaps between what is known and what gets done."
              </p>
              <div className="mt-3 text-xs font-mono text-ink-500">— Year in Review, Jigsaw 2025</div>
            </blockquote>
            <h2 className="text-2xl mt-10 mb-3 text-navy-900">What it means for funders</h2>
            <p className="text-base text-ink-800 leading-[1.75] mb-5">
              Three implications follow. Budget for teacher co-design as a first-class line item, not an afterthought. Plan delivery against the worst infrastructure case, not the average. And design for handover from day one — the question is not whether the funder will leave, but how the programme survives the leaving.
            </p>
            <div className="mt-10 p-5 bg-cream-200 rounded-xl border border-cream-300">
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-600 font-bold mb-2">Cite this brief</div>
              <div className="font-mono text-[12.5px] text-ink-800 leading-relaxed">
                Hollow, D., Koomar, S. & Iyer, A. (2026). <em>Learning at scale: A 2026 review of EdTech in East Africa</em>. Jigsaw Education Evidence. Available at jigsaweducation.org.
              </div>
            </div>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-600 font-bold mb-3">In this brief</div>
              <ul className="space-y-2 border-l border-cream-300 pl-3">
                {['Lede', 'What we found', 'What it means for funders', 'Cite'].map((t, i) => (
                  <li key={i}>
                    <a className={`text-[12px] ${i === 1 ? 'text-orange-500 font-bold' : 'text-ink-700 hover:text-orange-500'}`}>{t}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
      <div className="mt-10">
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-600 font-bold mb-4">Related publications</div>
        <div className="grid md:grid-cols-2 gap-4">
          {PUBLICATIONS.slice(1, 3).map((p, i) => (
            <PublicationCard key={i} pub={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
