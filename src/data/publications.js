import { placeholder } from './placeholder';

// The Evidence Library. Every entry is a real Jigsaw output pulled from the
// live site, with its actual PDF still on the legacy Hubble/S3 bucket.
//
// WHAT IS MISSING, AND WHY IT IS NULL RATHER THAN GUESSED:
// - `date` — the live site publishes no dates on any Learning Brief. For a
//   research practice this is a credibility gap, not a cosmetic one. Only the
//   Year in Review titles carry a period, so those are the only dated entries.
// - `authors` — no publication on the live site lists an author. Same problem.
// - `abstract` — the July brief requires one on each subpage. None exist yet.
// - `coverImage` — the brief asks for a portrait cover thumbnail on each card.
//   No cover images exist; the card falls back to a typographic plate.
// - `topic` / `method` — assigned only where the title states it outright.
//   Anything less certain is null so the client can classify it themselves.
//
// The client's Google Sheets log frame is meant to become the source of this
// file. Roughly 100 publications are expected; these ten are what is public today.

const S3 = 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file';

export const PUBLICATIONS_INTRO =
  'This publications library collates all the public outputs that members of the Jigsaw team has authored or co-authored. Many of the outputs from our work are confidential and cannot be shared. Whenever we are able to share outputs publicly we do so here. On our case studies page you can read more about the specific projects behind the publications.';

export const PUBLICATIONS = [
  {
    slug: 'pathways-to-research-employment',
    type: 'Learning Brief',
    title:
      'Pathways to Research Employment: Reflections and suggestions from a research organisation’s experience',
    authors: null,
    date: null,
    year: null,
    region: 'Global',
    countries: [],
    method: null,
    topic: 'Skills and pathways to employment',
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/265/Pathways_to_Research_Employment_Reflections_and_suggestions_from_a_research_organisation_s_experience.pdf`,
    fileSize: '302 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'edtech-within-limits',
    type: 'Learning Brief',
    title:
      'Building evidence for ‘EdTech within Limits’: engaging with the environment in issues of sustainability in EdTech',
    authors: null,
    date: null,
    year: null,
    region: 'Global',
    countries: [],
    method: null,
    topic: 'Technology and education',
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    // Two copies of this brief sit on S3 (file/225 and file/262) with the same
    // name and __1_ / __2_ suffixes. Using the later one.
    pdf: `${S3}/262/Building_evidence_for__EdTech_within_Limits__Engaging_with_the_environment_in_issues_of_sustainability_in_EdTech__2_.pdf`,
    fileSize: '210 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'language-policy-for-research-in-lmics',
    type: 'Learning Brief',
    title: 'Developing a language policy for research in LMICs',
    authors: null,
    date: null,
    year: null,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/180/Developing_a_language_policy_for_research_in_LMICs__2_.pdf`,
    fileSize: '441 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'eighteen-months-later-afghanistan',
    type: 'Learning Brief',
    title:
      'Eighteen months later: female undergraduates’ reflections on education since the 2021 regime change in Afghanistan',
    authors: null,
    date: null,
    year: null,
    region: 'South Asia',
    countries: ['Afghanistan'],
    method: null,
    topic: 'Education in crisis and conflict',
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/182/Eighteen_months_later_female_undergraduates__reflections_on_education_since_the_2021_regime_change_in_Afghanistan.pdf`,
    fileSize: '441 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'decade-in-review-2013-2023',
    type: 'Year in Review',
    title: 'Jigsaw Decade in Review 2013–2023',
    authors: null,
    date: '2023',
    year: 2023,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    // Flagged: this publication dates Jigsaw from 2013, while the July brief
    // says 15 years. The two cannot both be right on the same site.
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/261/Jigsaw_Decade_in_Review__1_.pdf`,
    fileSize: '917 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'year-in-review-2021-2022',
    type: 'Year in Review',
    title: 'Jigsaw Year in Review 2021–2022',
    authors: null,
    date: '2022',
    year: 2022,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/170/Jigsaw_Year_in_Review_2021_-_2022__2_.pdf`,
    fileSize: '2.47 MB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'year-in-review-2020-2021',
    type: 'Year in Review',
    title: 'Jigsaw Year in Review 2020–2021',
    authors: null,
    date: '2021',
    year: 2021,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/99/Jigsaw_Year_in_Review_2020_-_2021.pdf`,
    // 8.14 MB with no web version. Worth warning the reader before they tap
    // it on a phone in a low-bandwidth context, which is much of the audience.
    fileSize: '8.14 MB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'year-in-review-2019-2020',
    type: 'Year in Review',
    title: 'Jigsaw Year in Review 2019–2020',
    authors: null,
    date: '2020',
    year: 2020,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/85/Year_in_Review_2019-2020.pdf`,
    fileSize: '1.64 MB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'anti-racism-reading-list',
    type: 'Resource',
    title: 'Anti-racism reading list',
    authors: null,
    date: null,
    year: null,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/300/Anti-racism_reading_list__EXTERNAL___1_.pdf`,
    fileSize: '129 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  },
  {
    slug: 'inclusive-and-anti-racist-language',
    type: 'Resource',
    title: 'Inclusive and anti-racist language in development',
    authors: null,
    date: null,
    year: null,
    region: 'Global',
    countries: [],
    method: null,
    topic: null,
    summary: placeholder('one-sentence summary for the library card'),
    abstract: placeholder('abstract for the publication page'),
    pdf: `${S3}/299/Jigsaw_Inclusive_and_antiracist_language_in_development__EXTERNAL___1_.pdf`,
    fileSize: '153 KB',
    external: false,
    coverImage: null,
    caseStudySlug: null,
    needsReview: true
  }
];

// Filter facets, exactly as the July brief specifies: region/country,
// method/service, topic specialism. The earlier "year, type, language" set from
// the March calls was superseded. Year still shows on the tile, it just is not
// a filter.
export const PUBLICATION_FILTERS = ['region', 'method', 'topic'];

export const PUBLICATION_TYPES = [
  'Learning Brief',
  'Research Report',
  'Policy Brief',
  'Year in Review',
  'Resource'
];
