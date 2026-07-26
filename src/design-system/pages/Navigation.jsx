import Icon from '../../components/Icon';
import Btn from '../../components/Btn';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';
import LogoMark from '../../components/LogoMark';

export default function NavigationPage() {
  return (
    <div>
      <PageHeader
        kicker="Components · 05"
        title="Navigation"
        lede="A single-tier menu, no dropdowns. Two clicks maximum to anything on the site — a hard requirement from the client."
      />
      <Section title="Top navigation">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300">
            <div className="flex items-center gap-3">
              <LogoMark size={32} />
              <span className="font-display text-lg font-medium text-navy-900">Jigsaw</span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              {['Evidence', 'Services', 'About', 'Team', 'Contact'].map((l, i) => (
                <a
                  key={l}
                  className={`text-sm font-bold transition-colors ${i === 0 ? 'text-orange-500' : 'text-navy-900 hover:text-orange-500'}`}
                >
                  {l}
                </a>
              ))}
            </div>
            <Btn size="sm" variant="secondary">Get in touch</Btn>
          </div>
        </Card>
      </Section>
      <Section title="Breadcrumbs">
        <Card>
          <nav className="flex items-center gap-2 text-sm text-ink-700">
            <a className="hover:text-orange-500">Home</a>
            <Icon name="chevron-right" size={12} className="text-ink-500" />
            <a className="hover:text-orange-500">Evidence Library</a>
            <Icon name="chevron-right" size={12} className="text-ink-500" />
            <span className="text-navy-900 font-bold">Education Technology</span>
          </nav>
        </Card>
      </Section>
      <Section title="Tab navigation" description="For switching views inside the Evidence Library or Team page.">
        <Card>
          <div className="flex gap-1 border-b border-cream-300">
            {['All publications', 'Learning Briefs', 'Research Reports', 'Year in Review'].map((t, i) => (
              <button
                key={t}
                className={`px-4 py-3 text-sm font-bold relative transition-colors ${i === 0 ? 'text-navy-900' : 'text-ink-600 hover:text-navy-900'}`}
              >
                {t}
                {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
              </button>
            ))}
          </div>
        </Card>
      </Section>
      <Section title="Pagination">
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-ink-600">Showing 12 of 98 publications</div>
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-600 hover:bg-cream-200">
                <Icon name="chevron-left" size={16} />
              </button>
              {[1, 2, 3, '…', 9].map((p, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-lg text-sm font-bold ${p === 1 ? 'bg-navy-900 text-white' : 'text-ink-700 hover:bg-cream-200'}`}
                >
                  {p}
                </button>
              ))}
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-600 hover:bg-cream-200">
                <Icon name="chevron-right" size={16} />
              </button>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}
