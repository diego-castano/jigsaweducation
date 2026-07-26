'use client';

import { useEffect, useState } from 'react';
import ServiceRow from './ServiceRow';

// The six services as a numbered index rather than six cards. One row open at
// a time keeps the page short, which the client asked for twice, and the first
// row opens on load so nobody meets a column of closed titles.
//
// Each row carries id={slug}, so /services#technical-assistance-and-evidence-
// synthesis is a real address: case-study pages link their method straight to
// the service it names, per the brief's "linked to service page". On arrival
// the hash's row opens and scrolls into place under the sticky header.
export default function ServiceIndex({ services }) {
  const [openSlug, setOpenSlug] = useState(services[0]?.slug ?? null);

  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (!slug || !services.some((s) => s.slug === slug)) return;
    setOpenSlug(slug);
    // After the .expand-grid transition (500ms) settles — scrolling earlier
    // measures the row before the opened panel has pushed the layout, and the
    // browser's own hash scroll has already fought us once by then.
    const t = setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ block: 'start' });
    }, 560);
    return () => clearTimeout(t);
  }, [services]);

  return (
    <ul className="-mx-4 border-b border-cream-300 sm:-mx-6">
      {services.map((service, i) => (
        <ServiceRow
          key={service.slug}
          service={service}
          index={i}
          delay={i * 60}
          open={openSlug === service.slug}
          onToggle={() => setOpenSlug((current) => (current === service.slug ? null : service.slug))}
        />
      ))}
    </ul>
  );
}
