import Link from 'next/link';
import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import MailingListForm from '../../../src/site/components/MailingListForm';
import Icon from '../../../src/components/Icon';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { pageMetadata } from '../../../src/lib/page-metadata';
import Prose from '../../../src/site/components/Prose';

export async function generateMetadata() {
  const page = await getSingleton('page-work-for-us');
  return pageMetadata(page, { canonical: '/work-for-us' });
}

// The client's sentence carries its two links on their own phrases — "contact
// us" opens the Contact page and "sign-up" (their hyphen, deliberately kept)
// jumps to the form below. The phrases are found inside the stored sentence;
// if an edit removes one, that part simply renders as plain text rather than
// crashing or appending a broken link.
const INTEREST_LINKS = [
  {
    phrase: 'contact us',
    render: (key) => (
      <Link
        key={key}
        href="/contact"
        className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
      >
        contact us
      </Link>
    )
  },
  {
    phrase: 'sign-up',
    render: (key) => (
      <a
        key={key}
        href="#signup"
        className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
      >
        sign-up
      </a>
    )
  }
];

function withInterestLinks(sentence) {
  const matches = INTEREST_LINKS.map((link) => ({
    ...link,
    index: sentence.indexOf(link.phrase)
  }))
    .filter((m) => m.index !== -1)
    .sort((a, b) => a.index - b.index);

  const nodes = [];
  let cursor = 0;
  matches.forEach((m) => {
    if (m.index < cursor) return;
    if (m.index > cursor) nodes.push(sentence.slice(cursor, m.index));
    nodes.push(m.render(m.phrase));
    cursor = m.index + m.phrase.length;
  });
  if (cursor < sentence.length) nodes.push(sentence.slice(cursor));
  return nodes;
}

export default async function WorkForUsPage() {
  const [page, settings, ui, jobs] = await Promise.all([
    getSingleton('page-work-for-us'),
    getSingleton('site-settings'),
    getSingleton('ui-strings'),
    getCollection('jobs')
  ]);

  return (
    <>
      {/* No lede: the brief specifies a simple holding page and supplies no
          intro copy for it. An invented paragraph here read as client voice
          nobody approved. */}
      <PageHero kicker={page.kicker} title={page.heading} />

      <Section width="narrow">
        <h2 className="font-display text-2xl text-navy-900 mb-6">{page.opportunitiesHeading}</h2>

        {jobs.length > 0 ? (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job.slug}
                className="bg-cream-100 border border-cream-300 rounded-2xl p-6"
              >
                <h3 className="font-display text-xl text-navy-900">{job.title}</h3>
                <p className="text-sm text-ink-600 mt-2">{job.location}</p>
                {job.description && (
                  <Prose text={job.description} className="mt-3 text-[15px] text-ink-700" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          // The real state, not a placeholder: there are no vacancies, and the
          // brief writes the page that way.
          <div className="text-center py-16 bg-cream-100 border border-cream-300 rounded-2xl">
            <Icon name="briefcase" size={30} className="text-cream-400 mx-auto mb-4" />
            <p className="font-display text-xl text-navy-900">{page.emptyMessage}</p>
          </div>
        )}

        {/* The client's sentence, verbatim including their "sign-up" hyphen —
            the first pass had quietly rewritten it. Their own phrases carry
            the two links. */}
        <p className="mt-10 text-lg text-ink-700 leading-relaxed">
          {withInterestLinks(page.interestSentence)}
        </p>

        <div id="signup" className="mt-8 max-w-md scroll-mt-28">
          <MailingListForm
            source="work-for-us"
            emailPlaceholder={ui.emailPlaceholder}
            signupButton={ui.signupButton}
            signupErrorEmpty={ui.signupErrorEmpty}
            signupErrorInvalid={ui.signupErrorInvalid}
            signupSuccess={ui.signupSuccess}
          />
        </div>

        {settings.showReviewNotes && page.openQuestionNote && (
          <p className="mt-4 text-sm text-ink-500 italic">{page.openQuestionNote}</p>
        )}
      </Section>
    </>
  );
}
