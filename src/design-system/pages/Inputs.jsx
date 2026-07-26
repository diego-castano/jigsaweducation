import Icon from '../../components/Icon';
import Card from '../../components/Card';
import Section from '../../components/Section';
import PageHeader from '../../components/PageHeader';

export default function InputsPage() {
  return (
    <div>
      <PageHeader
        kicker="Components · 02"
        title="Inputs & Forms"
        lede="Form fields that feel calm and considered. Generous touch targets, clear labels, never crowded."
      />
      <Section title="Text input">
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <label className="block text-sm font-bold text-navy-900 mb-2">Default</label>
            <input
              type="text"
              placeholder="researcher@jigsaweducation.org"
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-navy-900 placeholder:text-ink-500 focus:outline-none focus:border-sea-500 focus:ring-2 focus:ring-sea-100 transition-all"
            />
            <div className="text-xs text-ink-600 mt-2">Helper text appears here.</div>
          </Card>
          <Card>
            <label className="block text-sm font-bold text-navy-900 mb-2">With error</label>
            <input
              type="text"
              defaultValue="invalid-email"
              className="w-full px-4 py-3 bg-cream-50 border-2 border-red-500 rounded-xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
            />
            <div className="flex items-center gap-1.5 text-xs text-red-700 mt-2">
              <Icon name="alert" size={12} />
              Please enter a valid email address.
            </div>
          </Card>
        </div>
      </Section>
      <Section title="Search & textarea">
        <div className="space-y-4">
          <Card>
            <div className="relative">
              <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                type="text"
                placeholder="Search the Evidence Library…"
                className="w-full pl-11 pr-4 py-3 bg-cream-50 border border-cream-300 rounded-full text-navy-900 placeholder:text-ink-500 focus:outline-none focus:border-sea-500 focus:ring-2 focus:ring-sea-100"
              />
            </div>
          </Card>
          <Card>
            <label className="block text-sm font-bold text-navy-900 mb-2">Message</label>
            <textarea
              rows={4}
              placeholder="Tell us about your research need…"
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-navy-900 placeholder:text-ink-500 focus:outline-none focus:border-sea-500 focus:ring-2 focus:ring-sea-100 transition-all resize-none"
            />
          </Card>
        </div>
      </Section>
      <Section title="Selection controls">
        <Card>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5 w-5 h-5 rounded border-2 border-sea-500 bg-sea-500 flex items-center justify-center text-white">
                <Icon name="check" size={12} />
              </div>
              <div>
                <div className="font-bold text-navy-900 text-sm">Education Technology</div>
                <div className="text-xs text-ink-600">Filter by EdTech research</div>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5 w-5 h-5 rounded border-2 border-cream-400 bg-cream-50 flex items-center justify-center" />
              <div>
                <div className="font-bold text-navy-900 text-sm">Education in Emergencies</div>
                <div className="text-xs text-ink-600">Filter by emergency research</div>
              </div>
            </label>
            <hr className="border-cream-300 my-2" />
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-sea-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-sea-500" />
              </div>
              <span className="text-sm font-bold text-navy-900">English</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-cream-400" />
              <span className="text-sm text-ink-700">Français</span>
            </label>
            <hr className="border-cream-300 my-2" />
            <div className="flex items-center gap-3">
              <button className="relative w-12 h-6 rounded-full bg-sea-500 transition-colors">
                <div className="absolute top-0.5 left-[26px] w-5 h-5 bg-white rounded-full transition-transform" />
              </button>
              <span className="text-sm text-navy-900">{"Auto-translate to user's language"}</span>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}
