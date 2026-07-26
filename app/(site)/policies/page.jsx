import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import Icon from '../../../src/components/Icon';
import {
  POLICIES,
  ADDITIONAL_POLICIES,
  POLICIES_INTRO,
  STANDARDS,
  STANDARDS_INTRO,
  CONCERNS_CONTACT
} from '../../../src/data/policies';

export const metadata = {
  title: 'Policies',
  description:
    'Jigsaw’s publicly available policies covering privacy, whistleblowing, ethics, data protection, cybersecurity and safeguarding, plus the standards we commit to.',
  alternates: { canonical: '/policies' }
};

function PolicyRow({ policy }) {
  const content = (
    <>
      <span className="flex items-center gap-3 min-w-0">
        <Icon
          name="file-text"
          size={18}
          className={policy.awaitingFile ? 'text-cream-400 shrink-0' : 'text-sea-600 shrink-0'}
        />
        <span className={policy.awaitingFile ? 'text-ink-500' : 'text-navy-900 font-bold'}>
          {policy.title}
        </span>
      </span>
      {policy.awaitingFile ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-orange-600 shrink-0">
          Awaiting document
        </span>
      ) : (
        <span className="flex items-center gap-2 font-mono text-[11px] text-ink-500 shrink-0">
          PDF · {policy.fileSize}
          <Icon name="download" size={15} />
        </span>
      )}
    </>
  );

  return (
    <li>
      {policy.awaitingFile ? (
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-cream-50 border-b border-cream-300 last:border-0">
          {content}
        </div>
      ) : (
        <a
          href={policy.file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 px-6 py-4 bg-cream-50 hover:bg-cream-100 border-b border-cream-300 last:border-0 transition-colors group"
        >
          {content}
        </a>
      )}
    </li>
  );
}

export default function PoliciesPage() {
  return (
    <>
      <PageHero kicker="Governance" title="Policies" lede={POLICIES_INTRO} />

      <Section width="narrow">
        <ul className="border border-cream-300 rounded-2xl overflow-hidden">
          {POLICIES.map((p) => (
            <PolicyRow key={p.slug} policy={p} />
          ))}
        </ul>

        <p className="mt-4 text-sm text-ink-600">
          None of the six policies above are published on the current site. The documents need to
          come from the Jigsaw team before this page goes live.
        </p>

        <h2 className="font-display text-2xl text-navy-900 mt-14 mb-5">Also published</h2>
        <p className="text-sm text-ink-600 mb-5">
          These two are live on the current site but are not in the new brief&rsquo;s list. Carried
          over rather than dropped, since they are real published commitments.
        </p>
        <ul className="border border-cream-300 rounded-2xl overflow-hidden">
          {ADDITIONAL_POLICIES.map((p) => (
            <PolicyRow key={p.slug} policy={p} />
          ))}
        </ul>

        <h2 className="font-display text-2xl text-navy-900 mt-14 mb-5">Standards we commit to</h2>
        <p className="text-ink-700 mb-5">{STANDARDS_INTRO}</p>
        <ul className="space-y-3">
          {STANDARDS.map((s) => (
            <li key={s.title}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sea-700 hover:text-orange-600 underline underline-offset-4"
              >
                <Icon name="external" size={15} />
                {s.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 bg-cream-100 border border-cream-300 rounded-2xl p-6">
          <h2 className="font-display text-xl text-navy-900 mb-2">Reporting a concern</h2>
          {CONCERNS_CONTACT ? (
            <p className="text-ink-700">
              To report any concerns about Jigsaw&rsquo;s work please contact{' '}
              <a
                href={`mailto:${CONCERNS_CONTACT}`}
                className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
              >
                {CONCERNS_CONTACT}
              </a>
              .
            </p>
          ) : (
            <p className="text-ink-500 italic border-l-2 border-dashed border-cream-400 pl-3">
              Reporting route to be confirmed by the Jigsaw team. A whistleblowing policy without a
              route to use it does not work.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
