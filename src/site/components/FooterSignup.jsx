'use client';

import { usePathname } from 'next/navigation';
import MailingListForm from './MailingListForm';

// The footer's mailing-list block, route-aware: Contact and Work for us both
// carry their own signup per the client's brief (Contact with the verbatim
// updates copy, Work for us as the vacancies-notification route), so a second
// identical form in the footer half a screen below read as a mistake. On
// those routes this block stands down; everywhere else it is the site-wide
// capture point.
const ROUTES_WITH_OWN_SIGNUP = ['/contact', '/work-for-us'];

export default function FooterSignup() {
  const pathname = usePathname();
  if (ROUTES_WITH_OWN_SIGNUP.includes(pathname)) return null;

  return (
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
  );
}
