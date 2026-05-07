export default function Splash() {
  return (
    <div className="splash no-print" aria-hidden="true">
      <div className="splash-mark">
        <svg width="56" height="56" viewBox="0 0 100 100" fill="white">
          <path d="M38 22 H50 V30 H56 V52 H38 Z" />
          <path d="M22 60 a28 22 0 0 0 56 0 Z" />
        </svg>
      </div>
      <div className="font-[var(--font-display)] text-2xl text-navy-900">Jigsaw 2026</div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-ink-600 font-bold">Design System</div>
    </div>
  );
}
