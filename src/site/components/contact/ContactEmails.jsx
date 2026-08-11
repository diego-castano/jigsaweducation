import Icon from '../../../components/Icon';
import Reveal from '../Reveal';

// Jigsaw took a decision not to run a contact form: the only routes in are the
// two mailboxes and the mailing list. So the mailto is not a detail tucked into
// a card, it is the page.
//
// SIDE BY SIDE, NOT STACKED. The brief's exact words are "deliberately
// side-by-side so that there is no hierarchy and with similar wording" - the
// first pass stacked the two rows full-width, which reinstated precisely the
// reading order the client wants gone. Two equal columns from lg, split by a
// hairline; below lg they stack because a phone gives no other option, with
// the hairline turning horizontal.
//
// The rule under the address is thicker than `.link-sweep` gives (1px under
// display Literata disappears), and it has to survive the address wrapping
// onto a second line. A pseudo-element can do neither, so the sweep is a
// background gradient with box-decoration-break: clone, which paints every
// line fragment and animates them together. Direction matches `.link-sweep`.
const CSS = `
.jz-mail-line{
  background-image:linear-gradient(currentColor,currentColor);
  background-repeat:no-repeat;
  background-position:100% 100%;
  background-size:0% 3px;
  padding-bottom:.1em;
  -webkit-box-decoration-break:clone;
  box-decoration-break:clone;
  transition:background-size .45s var(--ease-emphasized);
}
.jz-mail:hover .jz-mail-line,
.jz-mail:focus-visible .jz-mail-line{background-position:0 100%;background-size:100% 3px}
@media (prefers-reduced-motion:reduce){.jz-mail-line{transition:none}}
`;

export default function ContactEmails({ offices }) {
  return (
    <section className="border-t border-cream-300">
      <style>{CSS}</style>

      <div className="mx-auto max-w-[1240px] px-6 sm:px-8 lg:px-10">
        <ul className="grid lg:grid-cols-2">
          {offices.map((office, i) => {
            const at = office.email.indexOf('@');
            // Preferred break sits after the @, so a narrow column splits the
            // address where a reader expects it. `overflow-wrap: anywhere` is
            // the floor: nothing may ever push the page sideways.
            const local = office.email.slice(0, at + 1);
            const domain = office.email.slice(at + 1);

            return (
              <Reveal
                as="li"
                key={office.id}
                delay={i * 110}
                className={`py-12 lg:py-16 ${
                  i === 1
                    ? 'border-t border-cream-300 lg:border-t-0 lg:border-l lg:pl-12'
                    : 'lg:pr-12'
                }`}
              >
                <h2 className="max-w-[34ch] font-display text-lg leading-snug text-ink-700 lg:text-xl">
                  {office.heading}
                </h2>

                <a
                  href={`mailto:${office.email}`}
                  className="jz-mail group mt-6 inline-block max-w-full rounded-sm font-display display-m text-[26px] leading-[1.12] text-navy-900 [overflow-wrap:anywhere] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 sm:text-[32px] lg:mt-8 xl:text-[36px]"
                >
                  <span className="jz-mail-line">
                    {local}
                    <wbr />
                    {domain}
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={22}
                    className="ml-2.5 inline-block h-5 w-5 text-sea-500 transition-transform duration-[250ms] ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1 motion-reduce:transition-none sm:h-6 sm:w-6"
                  />
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
