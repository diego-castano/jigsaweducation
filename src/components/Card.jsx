export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-cream-100 border border-cream-300 rounded-2xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
