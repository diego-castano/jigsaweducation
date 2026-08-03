'use client';

import { usePathname } from 'next/navigation';
import SiteLogo from './SiteLogo';
import MailingListForm from './MailingListForm';

// The footer's whole top band, route-aware.
//
// Contact and Work for us carry their own signup per the client's brief, so
// the footer form would duplicate half a screen below. But simply dropping
// the form left the band as a logo beside seven empty columns. So the band
// itself recomposes: with the form, it is the 5/7 grid; without it, the same
// identity block runs as one full-width row with LinkedIn on the right edge,
// and no hole where the form used to be.
//
// Structural, not content: this list tracks which pages embed their own
// MailingListForm, so it stays hardcoded here.
const ROUTES_WITH_OWN_SIGNUP = ['/contact', '/work-for-us'];

function IdentityBlock({ tagline, wordmarkSrc }) {
  return (
    <div>
      <div>
        <SiteLogo size={44} reversed wordmarkSrc={wordmarkSrc} />
      </div>
      {/* The one line of voice in the footer: the client's own tagline. */}
      <p className="mt-6 max-w-[30ch] font-display text-lg text-cream-200 italic">
        {tagline}
      </p>
    </div>
  );
}

function LinkedInLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2.5 py-1.5 text-sm font-bold text-cream-50 hover:text-orange-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-full"
    >
      <span className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
        <span className="font-bold text-xs">in</span>
      </span>
      <span className="link-sweep">{label}</span>
    </a>
  );
}

// Copy arrives as plain props from the server layout (this is a client
// component and cannot call the loaders itself); the defaults mirror the seed
// so a missing prop never blanks the band.
export default function FooterTopBand({
  tagline = 'Rigorous evidence for lasting change in education',
  linkedin = 'https://www.linkedin.com/company/jigsaw-education-org/',
  wordmarkSrc = null,
  linkedinLabel = 'LinkedIn',
  signupHeading = 'Occasional updates about our work',
  signupBlurb = 'New case studies and publications, a few times a year. Nothing more frequent than that.',
  emailPlaceholder,
  signupButton,
  signupErrorEmpty,
  signupErrorInvalid,
  signupSuccess
}) {
  const pathname = usePathname();
  const pageHasOwnSignup = ROUTES_WITH_OWN_SIGNUP.includes(pathname);

  if (pageHasOwnSignup) {
    return (
      <div className="py-14 lg:py-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <IdentityBlock tagline={tagline} wordmarkSrc={wordmarkSrc} />
        <LinkedInLink href={linkedin} label={linkedinLabel} />
      </div>
    );
  }

  return (
    <div className="py-14 lg:py-16 grid gap-10 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-5">
        <IdentityBlock tagline={tagline} wordmarkSrc={wordmarkSrc} />
        <div className="mt-8">
          <LinkedInLink href={linkedin} label={linkedinLabel} />
        </div>
      </div>

      <div className="lg:col-span-7">
        <h2 className="font-display text-xl text-cream-50 mb-1.5">
          {signupHeading}
        </h2>
        <p className="text-sm text-cream-300 mb-5 max-w-md">
          {signupBlurb}
        </p>
        <div className="max-w-md">
          <MailingListForm
            reversed
            source="footer"
            emailPlaceholder={emailPlaceholder}
            signupButton={signupButton}
            signupErrorEmpty={signupErrorEmpty}
            signupErrorInvalid={signupErrorInvalid}
            signupSuccess={signupSuccess}
          />
        </div>
      </div>
    </div>
  );
}
