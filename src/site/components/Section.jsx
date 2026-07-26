// Page section wrapper. One place to keep the vertical rhythm honest across
// every route, since the client's loudest structural complaint about their
// reference sites was "pages too long, too much content".
export default function Section({
  children,
  className = '',
  width = 'default',
  tone = 'cream',
  as: Tag = 'section',
  id
}) {
  const widths = {
    narrow: 'max-w-[760px]',
    default: 'max-w-[1240px]',
    wide: 'max-w-[1400px]'
  };
  const tones = {
    cream: '',
    // Feedback on Site templates 02: cards on cream were sitting on cream and
    // disappearing. Section surfaces go one step darker so cards lift off them.
    sunken: 'bg-cream-200',
    navy: 'bg-navy-900 text-cream-50'
  };

  return (
    <Tag id={id} className={`${tones[tone]} ${className}`}>
      <div className={`${widths[width]} mx-auto px-6 sm:px-8 lg:px-10 py-16 lg:py-24`}>
        {children}
      </div>
    </Tag>
  );
}

export function SectionHeading({ kicker, title, lede, className = '', reversed = false }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {kicker && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-3">
          {kicker}
        </p>
      )}
      <h2
        className={`font-display display-m text-3xl sm:text-4xl lg:text-5xl leading-[1.05] ${
          reversed ? 'text-cream-50' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p className={`mt-5 text-lg leading-relaxed ${reversed ? 'text-cream-200' : 'text-ink-700'}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
