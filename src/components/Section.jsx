export default function Section({ title, description, children, kicker }) {
  return (
    <section className="mb-20 reveal">
      {kicker && (
        <div className="text-[11px] uppercase tracking-[0.2em] text-sea-500 font-bold mb-3">
          {kicker}
        </div>
      )}
      <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl text-navy-900 mb-3">{title}</h2>
      {description && (
        <p className="text-base text-ink-700 leading-relaxed mb-8 max-w-2xl">{description}</p>
      )}
      {children}
    </section>
  );
}
