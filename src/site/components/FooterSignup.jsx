'use client';

import { usePathname } from 'next/navigation';
import SiteLogo from './SiteLogo';
import MailingListForm from './MailingListForm';
import { SITE } from '../../data/site';

// The footer's whole top band, route-aware.
//
// Contact and Work for us carry their own signup per the client's brief, so
// the footer form would duplicate half a screen below. But simply dropping
// the form left the band as a logo beside seven empty columns. So the band
// itself recomposes: with the form, it is the 5/7 grid; without it, the same
// identity block runs as one full-width row with LinkedIn on the right edge,
// and no hole where the form used to be.
const ROUTES_WITH_OWN_SIGNUP = ['/contact', '/work-for-us'];

function IdentityBlock() {
  return (
    <div>
      <div>
        <SiteLogo size={44} reversed />
      </div>
      {/* The one line of voice in the footer: the client's own tagline. */}
      <p className="mt-6 max-w-[30ch] font-display text-lg text-cream-200 italic">
        {SITE.tagline}
      </p>
    </div>
  );
}

function LinkedInLink() {
  return (
    <a
      href={SITE.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 py-1.5 text-sm font-bold text-cream-50 hover:text-orange-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-full"
    >
      <span className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
        <span className="font-bold text-xs">in</span>
      </span>
      <span className="link-sweep">LinkedIn</span>
    </a>
  );
}

export default function FooterTopBand() {
  const pathname = usePathname();
  const pageHasOwnSignup = ROUTES_WITH_OWN_SIGNUP.includes(pathname);

  if (pageHasOwnSignup) {
    return (
      <div className="py-14 lg:py-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <IdentityBlock />
        <LinkedInLink />
      </div>
    );
  }

  return (
    <div className="py-14 lg:py-16 grid gap-10 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-5">
        <IdentityBlock />
        <div className="mt-8">
          <LinkedInLink />
        </div>
      </div>

      <div className="lg:col-span-7">
        <h2 className="font-display text-xl text-cream-50 mb-1.5">
          Occasional updates about our work
        </h2>
        <p className="text-sm text-cream-300 mb-5 max-w-md">
          New case studies and publications, a few times a year. Nothing more frequent than that.
        </p>
        <div className="max-w-md">
          <MailingListForm reversed />
        </div>
      </div>
    </div>
  );
}
