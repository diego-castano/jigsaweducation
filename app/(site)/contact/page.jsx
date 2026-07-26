import Reveal from '../../../src/site/components/Reveal';
import MailingListForm from '../../../src/site/components/MailingListForm';
import LocatorMap from '../../../src/site/components/LocatorMap';
import ContactEmails from '../../../src/site/components/contact/ContactEmails';
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
      {/* Opener kept deliberately short. There is no contact form on this site
          and no reason to pretend otherwise, so the page says who to write to
          and then gets out of the way of the two addresses below. */}
      <section className="relative overflow-hidden">
        <span
          className="blob"
          style={{
            width: 480,
            height: 480,
            top: -250,
            right: -150,
            background: '#ffcca8',
            opacity: 0.26
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1240px] px-6 pt-14 pb-12 sm:px-8 lg:px-10 lg:pt-20 lg:pb-16">
          <div className="grid gap-y-7 lg:grid-cols-12 lg:items-end lg:gap-x-12">
            <Reveal className="lg:col-span-4">
              <h1 className="font-display display-xl text-5xl leading-[0.95] text-navy-900 sm:text-6xl lg:text-[68px]">
                Contact
              </h1>
            </Reveal>

            <Reveal delay={90} className="lg:col-span-7 lg:col-start-6 lg:self-end">
              <p className="max-w-[46ch] text-xl leading-[1.35] text-ink-800 sm:text-2xl lg:text-[26px]">
                Get in touch with us to talk about building and using evidence for education in your
                work.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mailing-list signup, first — the brief lists it as the first element
          of this page's structure. A compact strip rather than a closing band;
          the footer's own signup stands down on this route. */}
      <section className="border-t border-cream-300 bg-cream-100">
        <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
          <div className="grid gap-y-6 lg:grid-cols-12 lg:items-center lg:gap-x-12">
            <Reveal className="lg:col-span-6">
              <p className="max-w-[44ch] text-lg leading-relaxed text-ink-800">
                Sign up here if you would like to receive occasional updates about Jigsaw&rsquo;s
                work.
              </p>
            </Reveal>
            <Reveal delay={110} className="lg:col-span-5 lg:col-start-8">
              <MailingListForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The two mailboxes, side by side and equal — the brief's exact words
          are "deliberately side-by-side so that there is no hierarchy", and the
          client's own headings frame each by scope of work rather than by
          headquarters and branch. */}
      <ContactEmails offices={OFFICES} />

      {/* Postal detail, one surface step down. The locator maps stay because a
          server-rendered country plate beats an iframe that would set
          third-party cookies on a site whose Policies page leads on data
          protection, but they read as a small plan beside the address now
          rather than as the lid of a card. */}
      <section className="border-t border-cream-300 bg-cream-100">
        <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <Reveal>
            <h2 className="font-display display-m text-3xl leading-[1.05] text-navy-900 sm:text-4xl lg:text-[44px]">
              Two offices, one team
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-y-0 lg:mt-14 lg:grid-cols-2 lg:gap-x-12">
            {OFFICES.map((office, i) => (
              <Reveal
                as="li"
                key={office.id}
                delay={i * 110}
                className={
                  i === 1
                    ? 'mt-10 border-t border-cream-300 pt-10 lg:mt-0 lg:border-t-0 lg:border-l lg:border-cream-300 lg:pt-0 lg:pl-12'
                    : ''
                }
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                  <div className="w-full max-w-[210px] shrink-0 overflow-hidden rounded-xl">
                    <LocatorMap
                      countryId={office.countryId}
                      coords={office.coords}
                      label={`Map showing ${office.city}, ${office.country}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-xl leading-snug text-navy-900 lg:text-2xl">
                      {office.org}
                    </h3>
                    <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-ink-600 uppercase">
                      {office.addressLabel}
                    </p>
                    <address className="mt-2.5 text-base leading-relaxed text-ink-700 not-italic">
                      {office.address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      <span className="block">{office.country}</span>
                    </address>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
