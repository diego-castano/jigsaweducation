import Icon from '../components/Icon';
import Btn from '../components/Btn';
import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';

export default function FeedbackPage() {
  const alerts = [
    { variant: 'info', icon: 'info', title: 'Concept note received', body: "We've received the project concept note from your team. Review begins shortly.", bg: 'bg-sea-50 border-sea-300', icBg: 'bg-sea-200 text-sea-700', t: 'text-sea-800' },
    { variant: 'success', icon: 'check-circle', title: 'Publication added', body: '"Learning at scale: A 2025 review of EdTech in East Africa" is now live in the Evidence Library.', bg: 'bg-emerald-50 border-emerald-200', icBg: 'bg-emerald-100 text-emerald-700', t: 'text-emerald-900' },
    { variant: 'warning', icon: 'alert', title: 'Review needed', body: 'Three publications are missing summary text. Add summaries to make them discoverable.', bg: 'bg-amber-50 border-amber-200', icBg: 'bg-amber-100 text-amber-800', t: 'text-amber-900' },
    { variant: 'error', icon: 'alert', title: 'Translation failed', body: 'The Arabic translation could not complete. Original English is shown below.', bg: 'bg-red-50 border-red-200', icBg: 'bg-red-100 text-red-700', t: 'text-red-900' }
  ];

  return (
    <div>
      <PageHeader
        kicker="Components · 06"
        title="Feedback"
        lede="Alerts, toasts, and progress states. Calm, clear, never alarming."
      />
      <Section title="Alerts">
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div key={i} className={`flex gap-4 p-4 rounded-xl border ${a.bg}`}>
              <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${a.icBg}`}>
                <Icon name={a.icon} size={18} />
              </div>
              <div className="flex-1">
                <div className={`font-bold mb-0.5 ${a.t}`}>{a.title}</div>
                <div className={`text-sm ${a.t} opacity-90`}>{a.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Toast notification" description="Temporary, auto-dismissing. Slides in from bottom-right.">
        <Card className="relative h-32 bg-cream-200">
          <div className="absolute bottom-4 right-4 slide-in flex items-center gap-3 px-4 py-3 bg-navy-900 text-cream-50 rounded-xl shadow-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Icon name="check" size={14} />
            </div>
            <div>
              <div className="text-sm font-bold">Publication saved</div>
              <div className="text-xs text-cream-300">Draft saved · just now</div>
            </div>
            <button className="text-cream-300 hover:text-cream-50">
              <Icon name="x" size={16} />
            </button>
          </div>
        </Card>
      </Section>
      <Section title="Progress">
        <Card>
          <div className="flex justify-between text-xs text-ink-700 mb-2">
            <span>Uploading PDF…</span>
            <span className="font-mono">67%</span>
          </div>
          <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: '67%' }} />
          </div>
        </Card>
      </Section>
      <Section title="Skeleton loader" description="For content loading states in the Evidence Library.">
        <div className="grid lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <div className="shimmer h-3 w-20 rounded mb-3" />
              <div className="shimmer h-6 w-full rounded mb-2" />
              <div className="shimmer h-6 w-4/5 rounded mb-4" />
              <div className="shimmer h-3 w-32 rounded mb-2" />
              <div className="shimmer h-3 w-full rounded" />
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Empty state">
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-cream-200 mx-auto mb-4 flex items-center justify-center text-ink-500">
            <Icon name="search" size={24} />
          </div>
          <h3 className="text-xl mb-2 text-navy-900">No publications match</h3>
          <p className="text-sm text-ink-700 max-w-sm mx-auto mb-4">Try removing some filters or broadening your search terms.</p>
          <Btn variant="tertiary" size="sm">Clear all filters</Btn>
        </Card>
      </Section>
    </div>
  );
}
