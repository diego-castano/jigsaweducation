import { ICON_PATHS } from '../icons';

// An icon entry is either a single path string or an array of path strings.
// v1 only ever rendered one <path>, which capped every glyph at a single
// stroke — no separate dots, no detached counters. The custom set needs both.
export default function Icon({ name, size = 20, className = '', strokeWidth = 1.5, title }) {
  const entry = ICON_PATHS[name] || ICON_PATHS.circle;
  const paths = Array.isArray(entry) ? entry : [entry];

  // An icon with a title is meaningful content and needs a name in the
  // accessibility tree. Without one it is decoration and should be skipped.
  const labelled = Boolean(title);

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
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : 'true'}
    >
      {labelled && <title>{title}</title>}
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
