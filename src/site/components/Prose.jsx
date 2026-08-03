// Renders CMS prose — plain seeded text or console-formatted HTML — with the
// site's typography. The wrapper takes the caller's text classes; paragraph
// rhythm, emphasis, links and lists are styled here so every prose field
// reads the same wherever it lands.

import { proseToHtml } from '../../lib/rich-text';

export default function Prose({ text, className = '' }) {
  const html = proseToHtml(text);
  if (!html) return null;

  return (
    <div
      className={
        'space-y-4 [&_p+p]:mt-4 [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic ' +
        '[&_a]:font-semibold [&_a]:text-sea-700 [&_a]:underline [&_a]:decoration-sea-300 [&_a]:underline-offset-2 hover:[&_a]:decoration-sea-700 ' +
        '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mt-1 ' +
        className
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
