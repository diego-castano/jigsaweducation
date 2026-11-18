import Reveal from '../Reveal';
import FocusTile from './FocusTile';

// Seven areas, seven cells. Rows run 7+5 (taller) / 4+4+4 / 5+7 at lg, and
// tile 1 spans the pair at sm. Tones are picked so no two neighbours match at
// any breakpoint. Every title uses one size so no area reads as more
// important (client feedback, round 2).
const TITLE = 'display-s text-xl lg:text-2xl';
const TALL = 'min-h-[220px] lg:min-h-[300px]';
const MID = 'min-h-[200px] lg:min-h-[230px]';

export const FOCUS_TONES = ['navy', 'orange', 'sea', 'sun', 'sky', 'orange-strong', 'navy'];

const LAYOUT = [
  { span: 'sm:col-span-2 lg:col-span-7', height: TALL, ghostSize: 150 },
  { span: 'lg:col-span-5', height: TALL, ghostSize: 140 },
  { span: 'lg:col-span-4', height: MID, ghostSize: 124 },
  { span: 'lg:col-span-4', height: MID, ghostSize: 124 },
  { span: 'lg:col-span-4', height: MID, ghostSize: 124 },
  { span: 'lg:col-span-5', height: MID, ghostSize: 124 },
  { span: 'lg:col-span-7', height: MID, ghostSize: 130 }
];

export default function FocusMosaic({ areas }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
      {areas.map((area, i) => {
        const cell = LAYOUT[i % LAYOUT.length];
        return (
          <Reveal key={area.slug} delay={i * 60} className={`flex ${cell.span}`}>
            <FocusTile
              area={area}
              tone={FOCUS_TONES[i % FOCUS_TONES.length]}
              height={cell.height}
              titleClass={TITLE}
              ghostSize={cell.ghostSize}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
