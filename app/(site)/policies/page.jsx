import PageHero from '../../../src/site/components/PageHero';
import Section from '../../../src/site/components/Section';
import Icon from '../../../src/components/Icon';
import { getSingleton, getCollection } from '../../../src/lib/content';
import { pageMetadata } from '../../../src/lib/page-metadata';

export async function generateMetadata() {
  const page = await getSingleton('page-policies');
  return pageMetadata(page, { canonical: '/policies' });
}

function PolicyRow({ policy, ui }) {
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
          {ui.awaitingDocumentBadge}
        </span>
      ) : (
        <span className="flex items-center gap-2 font-mono text-[11px] text-ink-500 shrink-0">
          {policy.fileSize ? ui.pdfSizeTemplate.replace('{size}', policy.fileSize) : 'PDF'}
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

export default async function PoliciesPage() {
  const [page, settings, ui, policies] = await Promise.all([
    getSingleton('page-policies'),
    getSingleton('site-settings'),
    getSingleton('ui-strings'),
    getCollection('policies')
  ]);

  const core = policies.filter((p) => p.group === 'core');
  const additional = policies.filter((p) => p.group === 'additional');

  return (
    <>
      <PageHero kicker={page.kicker} title={page.heading} lede={page.lede} />

      <Section width="narrow">
        <ul className="border border-cream-300 rounded-2xl overflow-hidden">
          {core.map((p) => (
            <PolicyRow key={p.slug} policy={p} ui={ui} />
          ))}
        </ul>

        {settings.showReviewNotes && page.pendingNote && (
          <p className="mt-4 text-sm text-ink-600">{page.pendingNote}</p>
        )}

        <h2 className="font-display text-2xl text-navy-900 mt-14 mb-5">
          {page.alsoPublishedHeading}
        </h2>
        {settings.showReviewNotes && page.carriedOverNote && (
          <p className="text-sm text-ink-600 mb-5">{page.carriedOverNote}</p>
        )}
        <ul className="border border-cream-300 rounded-2xl overflow-hidden">
          {additional.map((p) => (
            <PolicyRow key={p.slug} policy={p} ui={ui} />
          ))}
        </ul>

        <h2 className="font-display text-2xl text-navy-900 mt-14 mb-5">{page.standardsHeading}</h2>
        <p className="text-ink-700 mb-5">{page.standardsIntro}</p>
        <ul className="space-y-3">
          {page.standards.map((s) => (
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
          <h2 className="font-display text-xl text-navy-900 mb-2">{page.concernsHeading}</h2>
          {page.concernsContact ? (
            <p className="text-ink-700">
              To report any concerns about Jigsaw&rsquo;s work please contact{' '}
              <a
                href={`mailto:${page.concernsContact}`}
                className="text-sea-700 hover:text-orange-600 underline underline-offset-4"
              >
                {page.concernsContact}
              </a>
              .
            </p>
          ) : settings.showReviewNotes ? (
            // Review-phase note: without an address the whistleblowing route
            // is a real gap, but the reminder is for the team, not visitors.
            <p className="text-ink-500 italic border-l-2 border-dashed border-cream-400 pl-3">
              Reporting route to be confirmed by the Jigsaw team. A whistleblowing policy without a
              route to use it does not work.
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}
