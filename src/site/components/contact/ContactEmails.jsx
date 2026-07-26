import Icon from '../../../components/Icon';
import Reveal from '../Reveal';

// Jigsaw took a decision not to run a contact form: the only routes in are the
// two mailboxes and the mailing list. So the mailto is not a detail tucked into
// a card, it is the page. Each block is a full-bleed row, hairline above, the
// client's own framing line as its heading and the address set at display size.
//
// The rule under the address is thicker than `.link-sweep` gives (1px under
// 60px Literata disappears), and it has to survive the address wrapping onto a
// second line on a phone. A pseudo-element cannot do either, so the sweep is a
// background gradient with box-decoration-break: clone, which paints every line
// fragment and animates them together. Direction matches `.link-sweep`: in from
// the left, out to the right. The position flip is invisible because it only
// ever happens while the bar is at zero width.
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
@media (min-width:1024px){
  .jz-mail-line{background-size:0% 4px}
  .jz-mail:hover .jz-mail-line,
  .jz-mail:focus-visible .jz-mail-line{background-size:100% 4px}
}
@media (prefers-reduced-motion:reduce){.jz-mail-line{transition:none}}
`;

export default function ContactEmails({ offices }) {
  return (
    <section>
      <style>{CSS}</style>

      <ul>
        {offices.map((office, i) => {
          const at = office.email.indexOf('@');
          // Preferred break sits after the @, so a phone splits the address
          // where a reader expects it rather than mid-word. `overflow-wrap:
          // anywhere` below is the floor: at 320px even that split is too long,
          // and nothing may ever push the page sideways.
          const local = office.email.slice(0, at + 1);
          const domain = office.email.slice(at + 1);

          return (
            <Reveal as="li" key={office.id} delay={i * 110} className="border-t border-cream-300">
              <div className="mx-auto max-w-[1240px] px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
                <h2 className="max-w-[34ch] font-display text-lg leading-snug text-ink-700 lg:text-xl">
                  {office.heading}
                </h2>

                <a
                  href={`mailto:${office.email}`}
                  className="jz-mail group mt-6 inline-block max-w-full rounded-sm font-display display-l text-[28px] leading-[1.05] text-navy-900 [overflow-wrap:anywhere] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-cream-50 sm:text-[44px] lg:mt-8 lg:text-[60px]"
                >
                  <span className="jz-mail-line">
                    {local}
                    <wbr />
                    {domain}
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={28}
                    className="ml-3 inline-block h-6 w-6 text-sea-500 transition-transform duration-[250ms] ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1.5 group-focus-visible:-translate-y-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none sm:ml-4 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                  />
                </a>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
