import Link from 'next/link';
import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import MailingListForm from '../../../src/site/components/MailingListForm';
import Icon from '../../../src/components/Icon';
import { JOBS, JOBS_EMPTY_MESSAGE } from '../../../src/data/jobs';

export const metadata = {
  title: 'Work for us',
  description:
    'Current opportunities at Jigsaw Education Evidence, an education research practice with offices in London and Lusaka.',
  alternates: { canonical: '/work-for-us' }
};

export default function WorkForUsPage() {
  return (
    <>
      {/* No lede: the brief specifies a simple holding page and supplies no
          intro copy for it. An invented paragraph here read as client voice
          nobody approved. */}
      <PageHero kicker="Careers" title="Work for us" />

      <Section width="narrow">
        <h2 className="font-display text-2xl text-navy-900 mb-6">Current opportunities</h2>

        {JOBS.length > 0 ? (
          <ul className="space-y-4">
            {JOBS.map((job) => (
              <li
                key={job.slug}
                className="bg-cream-100 border border-cream-300 rounded-2xl p-6"
              >
                <h3 className="font-display text-xl text-navy-900">{job.title}</h3>
                <p className="text-sm text-ink-600 mt-2">{job.location}</p>
              </li>
            ))}
          </ul>
        ) : (
          // The real state, not a placeholder: there are no vacancies, and the
          // brief writes the page that way.
          <div className="text-center py-16 bg-cream-100 border border-cream-300 rounded-2xl">
            <Icon name="briefcase" size={30} className="text-cream-400 mx-auto mb-4" />
            <p className="font-display text-xl text-navy-900">{JOBS_EMPTY_MESSAGE}</p>
          </div>
        )}

        {/* The client's sentence, verbatim including their "sign-up" hyphen —
            the first pass had quietly rewritten it. Their own phrases carry
            the two links. */}
        <p className="mt-10 text-lg text-ink-700 leading-relaxed">
          {'If you are interested in working at Jigsaw, please '}
          <Link
            href="/contact"
            className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
          >
            contact us
          </Link>
          {' or '}
          <a
            href="#signup"
            className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
          >
            sign-up
          </a>
          {' to receive updates.'}
        </p>

        <div id="signup" className="mt-8 max-w-md scroll-mt-28">
          <MailingListForm />
        </div>

        <p className="mt-4 text-sm text-ink-500 italic">
          Open question for the client: should vacancies use a separate mailing list, or the general
          updates list? This form currently points at the general one.
        </p>
      </Section>
    </>
  );
}
