const VARIANTS = {
  orange: 'bg-orange-100 text-orange-700',
  sea: 'bg-sea-100 text-sea-700',
  navy: 'bg-navy-100 text-navy-800',
  cream: 'bg-cream-200 text-ink-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-800',
  error: 'bg-red-50 text-red-700'
};

export default function Badge({ children, variant = 'sea', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${VARIANTS[variant] || VARIANTS.sea} ${className}`}>
      {children}
    </span>
  );
}
