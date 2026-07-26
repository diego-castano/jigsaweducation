'use client';

import { useState } from 'react';
import ServiceRow from './ServiceRow';

// The six services as a numbered index rather than six cards. One row open at
// a time keeps the page short, which the client asked for twice, and the first
// row opens on load so nobody meets a column of closed titles.
export default function ServiceIndex({ services }) {
  const [openSlug, setOpenSlug] = useState(services[0]?.slug ?? null);

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
