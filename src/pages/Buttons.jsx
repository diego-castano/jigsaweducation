import Icon from '../components/Icon';
import Btn from '../components/Btn';
import Card from '../components/Card';
import Section from '../components/Section';
import PageHeader from '../components/PageHeader';
import CodeBlock from '../components/CodeBlock';

export default function ButtonsPage() {
  return (
    <div>
      <PageHeader
        kicker="Components · 01"
        title="Buttons"
        lede="Pill-shaped, full-radius. The orange primary is reserved for the most important action on any given screen — typically one per page."
      />
      <Section title="Variants">
        <Card className="flex flex-wrap gap-3 items-center">
          <Btn variant="primary" icon="arrow-right">Primary</Btn>
          <Btn variant="secondary">Secondary</Btn>
          <Btn variant="tertiary">Tertiary</Btn>
          <Btn variant="ghost">Ghost</Btn>
          <Btn variant="destructive" icon="trash" iconPos="left">Delete</Btn>
        </Card>
      </Section>
      <Section title="Sizes" description="Five sizes from XS to XL. Default to MD for most contexts. XL is hero-CTA territory only.">
        <Card className="flex flex-wrap gap-3 items-center">
          <Btn size="xs">Extra small</Btn>
          <Btn size="sm">Small</Btn>
          <Btn size="md">Medium</Btn>
          <Btn size="lg">Large</Btn>
          <Btn size="xl">Extra large</Btn>
        </Card>
      </Section>
      <Section title="States">
        <Card className="flex flex-wrap gap-3 items-center">
          <Btn>Default</Btn>
          <Btn className="bg-orange-600 shadow-md">Hover</Btn>
          <Btn className="ring-2 ring-orange-500 ring-offset-2 ring-offset-cream-50">Focus</Btn>
          <Btn disabled>Disabled</Btn>
          <Btn variant="secondary">
            <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
            Loading
          </Btn>
        </Card>
      </Section>
      <Section title="With icons">
        <Card className="flex flex-wrap gap-3 items-center">
          <Btn icon="arrow-right">Continue</Btn>
          <Btn variant="tertiary" icon="download" iconPos="left">Download PDF</Btn>
          <Btn variant="secondary" icon="external">Open external</Btn>
          <button className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md transition-colors">
            <Icon name="plus" size={18} />
          </button>
        </Card>
      </Section>
      <Section title="Floating action button" description="For high-priority single actions in admin contexts (adding a publication, for example).">
        <Card className="relative h-32 bg-cream-200">
          <button className="absolute bottom-6 right-6 inline-flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg font-bold text-sm transition-all hover:-translate-y-0.5">
            <Icon name="plus" size={16} />
            Add publication
          </button>
        </Card>
      </Section>
      <Section title="Accessibility" description="Every button must meet a 44px minimum touch target, have a visible focus ring, and use real text or an aria-label.">
        <CodeBlock>{`<button
  className="inline-flex items-center gap-2 px-5 py-2.5
             rounded-full bg-orange-500 text-white font-bold
             focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
  aria-label="Download Learning Brief PDF">
  <Icon name="download" />
  Download
</button>`}</CodeBlock>
      </Section>
    </div>
  );
}
