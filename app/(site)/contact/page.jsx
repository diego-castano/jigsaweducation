import PageHero from '../../../src/site/components/PageHero';
import Section, { SectionHeading } from '../../../src/site/components/Section';
import MailingListForm from '../../../src/site/components/MailingListForm';
import LocatorMap from '../../../src/site/components/LocatorMap';
import Icon from '../../../src/components/Icon';
import { OFFICES } from '../../../src/data/site';

export const metadata = {
  title: 'Contact',
  description:
    'Get in touch with Jigsaw about building and using evidence for education. Offices in London, United Kingdom and Lusaka, Zambia.',
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Get in touch"
        title="Contact"
        lede="Get in touch with us to talk about building and using evidence for education in your work."
      />

      <Section width="narrow" className="pb-0">
        <div className="bg-navy-900 text-cream-50 rounded-2xl p-8 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl text-cream-50">
            Sign up for occasional updates
          </h2>
          <p className="mt-3 text-cream-200">
            Sign up here if you would like to receive occasional updates about Jigsaw&rsquo;s work.
          </p>
          <div className="mt-6 max-w-md">
            <MailingListForm reversed />
          </div>
        </div>
      </Section>

      {/* Side by side, deliberately equal. The brief is explicit that neither
          office outranks the other, and the headings frame each by scope of
          work rather than by headquarters and branch. */}
      <Section>
        <SectionHeading kicker="Our offices" title="Two offices, one team" />

        <ul className="grid md:grid-cols-2 gap-6 mt-10">
          {OFFICES.map((office) => (
            <li
              key={office.id}
              className="bg-cream-100 border border-cream-300 rounded-2xl overflow-hidden flex flex-col"
            >
              <LocatorMap
                countryId={office.countryId}
                coords={office.coords}
                label={`Map showing ${office.city}, ${office.country}`}
              />

              <div className="p-7 flex-1 flex flex-col">
                <h3 className="font-display text-xl text-navy-900 leading-snug">
                  {office.heading}
                </h3>

                <dl className="mt-5 space-y-4 text-sm flex-1">
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${office.email}`}
                        className="inline-flex items-center gap-2 text-sea-700 hover:text-orange-600 underline underline-offset-4 break-all"
                      >
                        <Icon name="mail" size={15} className="shrink-0" />
                        {office.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-bold mb-2">
                      {office.addressLabel}
                    </dt>
                    <dd className="text-ink-700 not-italic">
                      <address className="not-italic">
                        {office.org}
                        <br />
                        {office.address.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                        {office.country}
                      </address>
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
