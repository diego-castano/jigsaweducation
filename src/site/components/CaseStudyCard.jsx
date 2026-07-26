import Link from 'next/link';
import Icon from '../../components/Icon';
import SmartImage from './SmartImage';

// Site modules 02 feedback: "Would the publication card design also be used for
// the case studies, or would that be something different?" → different, and
// landscape. Publications get a portrait cover; case studies keep the wide
// field photograph, because that is the asset the client actually has for them.
export default function CaseStudyCard({ study }) {
  return (
    <li className="group relative flex flex-col bg-cream-50 border border-cream-300 rounded-2xl overflow-hidden transition-shadow hover:shadow-md">
      {study.image ? (
        <div className="aspect-[16/9] relative overflow-hidden bg-cream-200">
          <SmartImage
            src={study.image}
            alt=""
            className="absolute inset-0 w-full h-full"
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        // No stock photography, per the client's photo policy. A typographic
        // plate is honest about the gap in a way a generic image is not.
        <div className="aspect-[16/9] bg-cream-200 flex items-center justify-center relative">
          <Icon name="microscope" size={32} className="text-cream-400" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {study.countries?.length > 0 && (
          <p className="font-mono text-[11px] text-ink-500 mb-3">
            {study.countries.join(' · ')}
          </p>
        )}

        <h3 className="font-display text-xl text-navy-900 leading-snug">
          <Link
            href={`/case-studies/${study.slug}`}
            className="after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-2xl"
          >
            {study.title}
          </Link>
        </h3>

        <p className="text-sm text-ink-700 leading-relaxed mt-3 flex-1">{study.summary}</p>

        <dl className="mt-5 pt-5 border-t border-cream-300 space-y-2 text-xs">
          {study.partners?.length > 0 && (
            <div className="flex gap-2">
              <dt className="text-ink-500 shrink-0 w-16">Partners</dt>
              <dd className="text-ink-700">{study.partners.join(', ')}</dd>
            </div>
          )}
          {study.service && (
            <div className="flex gap-2">
              <dt className="text-ink-500 shrink-0 w-16">Service</dt>
              <dd className="text-ink-700">{study.service}</dd>
            </div>
          )}
        </dl>
      </div>
    </li>
  );
}
