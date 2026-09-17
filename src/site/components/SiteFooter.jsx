'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteLogo from './SiteLogo';
import MailingListForm from './MailingListForm';

// The footer, cut down to what the client asked to keep (design feedback,
// 15 September 2026): "LinkedIn URL, Policies page, Work for us page, x2
// contact boxes, possibly the mailing list signup, but only if there's space."
// One navy band instead of three: identity and links, the two office boxes,
// the signup; then the legal line, which stays because UK company law wants
// the registration details on the website.
//
// Client component for one reason: Contact and Work for us embed their own
// signup, so on those routes the band drops the form and the other columns
// widen instead of leaving a hole.
const ROUTES_WITH_OWN_SIGNUP = ['/contact', '/work-for-us'];

const DEFAULT_FOOTER_NAV = [
  { href: '/policies', label: 'Policies' },
  { href: '/work-for-us', label: 'Work for us' }
];

const DEFAULT_OFFICES = [
  { id: 'uk', org: 'Jigsaw', city: 'London', email: 'info@jigsaweducation.org' },
  { id: 'zm', org: 'Jigsaw Zambia', city: 'Lusaka', email: 'zambiateam@jigsaweducation.org' }
];

const DEFAULT_LEGAL_LINE =
  'Jigsaw Education Evidence Ltd. is a certified Social Enterprise and a company registered in England and Wales (company number 06844615 and VAT number GB173850004) and Zambia (company number 120251030229).';

const LINK =
  'link-sweep inline-block py-1 text-sm text-cream-200 hover:text-orange-400 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400';

export default function SiteFooter({
  footerNav = DEFAULT_FOOTER_NAV,
  offices = DEFAULT_OFFICES,
  legalLine = DEFAULT_LEGAL_LINE,
  linkedin = 'https://www.linkedin.com/company/jigsaw-education-org/',
  logoSrc = null,
  ui = {}
}) {
  const pathname = usePathname();
  const showSignup = !ROUTES_WITH_OWN_SIGNUP.includes(pathname);
  const year = new Date().getFullYear();

  return (
    // No top margin: every page's last section carries its own bottom padding.
    <footer className="bg-navy-900 text-cream-50">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid gap-y-4 py-8 sm:grid-cols-2 sm:items-start sm:gap-8 lg:grid-cols-12 lg:gap-x-8 lg:py-12">
          <div
            className={`flex flex-wrap items-start justify-between gap-x-8 gap-y-4 pb-2 sm:col-span-2 sm:pb-0 lg:flex-col lg:flex-nowrap lg:justify-start ${
              showSignup ? 'lg:col-span-2' : 'lg:col-span-4'
            }`}
          >
            <SiteLogo size={40} logoSrc={logoSrc} />
            <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:flex-col">
              <li>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {ui.linkedinLabel || 'LinkedIn'}
                </a>
              </li>
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={LINK}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The two contact boxes. The city is the label because it is what a
              reader scans for; <address> takes no headings, so it stays a p. */}
          {offices.map((office) => (
            <address
              key={office.id || office.city}
              className={`not-italic rounded-2xl border border-navy-800 bg-navy-800/40 p-4 sm:p-5 ${
                showSignup ? 'lg:col-span-3' : 'lg:col-span-4'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-400">
                {office.city}
              </p>
              <p className="mt-1.5 font-display text-base leading-snug text-cream-50 sm:mt-2 sm:text-lg">{office.org}</p>
              <a
                href={`mailto:${office.email}`}
                className="link-sweep inline-block mt-1 py-1 text-sm text-cream-200 hover:text-orange-400 transition-colors rounded-sm [overflow-wrap:anywhere] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                {office.email}
              </a>
            </address>
          ))}

          {showSignup && (
            <div className="pt-4 sm:col-span-2 sm:pt-0 lg:col-span-4">
              {ui.signupHeading && (
                <h2 className="font-display text-lg leading-snug text-cream-50">{ui.signupHeading}</h2>
              )}
              {ui.signupBlurb && (
                <p className="mt-1 mb-4 text-[13px] leading-relaxed text-cream-300">{ui.signupBlurb}</p>
              )}
              <MailingListForm
                reversed
                compact
                source="footer"
                emailPlaceholder={ui.emailPlaceholder}
                signupButton={ui.signupButton}
                signupErrorEmpty={ui.signupErrorEmpty}
                signupErrorInvalid={ui.signupErrorInvalid}
                signupSuccess={ui.signupSuccess}
              />
            </div>
          )}
        </div>

        <div
          className="border-t border-navy-800 py-5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
          style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        >
          <p className="pr-12 text-[11px] leading-relaxed text-cream-400 max-w-3xl lg:pr-0">{legalLine}</p>
          <p className="text-[11px] text-cream-400 shrink-0">© {year}</p>
        </div>
      </div>
    </footer>
  );
}
