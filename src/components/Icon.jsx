import { ICON_PATHS } from '../icons';

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.5 }) {
  const path = ICON_PATHS[name] || ICON_PATHS.circle;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
