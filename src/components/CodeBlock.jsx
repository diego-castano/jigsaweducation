export default function CodeBlock({ children }) {
  return (
    <pre className="font-[var(--font-mono)] text-[12.5px] bg-navy-900 text-cream-100 p-5 rounded-xl overflow-x-auto leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export function Code({ children, className = '' }) {
  return (
    <code className={`font-[var(--font-mono)] text-[12px] bg-cream-200 px-2 py-0.5 rounded text-ink-800 ${className}`}>
      {children}
    </code>
  );
}
