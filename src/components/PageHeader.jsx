export default function PageHeader({ kicker, title, lede }) {
  return (
    <div className="mb-16 max-w-3xl">
      {kicker && (
        <div className="text-xs uppercase tracking-[0.2em] text-orange-500 font-bold mb-4 reveal">
          {kicker}
        </div>
      )}
      <h1 className="font-[var(--font-display)] display-l text-5xl sm:text-6xl lg:text-7xl text-navy-900 leading-[0.95] mb-6 reveal reveal-1">
        {title}
      </h1>
      {lede && (
        <p className="text-lg sm:text-xl text-ink-700 leading-relaxed reveal reveal-2">
          {lede}
        </p>
      )}
    </div>
  );
}
