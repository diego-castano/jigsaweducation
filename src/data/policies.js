// Policies hub, linked from the footer only.
//
// ASSET GAP: the brief lists six policies as [linked PDF]. None of the six are
// published today. The live site has a Privacy page (HTML, not PDF) plus two
// PDFs the brief does not mention — a language policy and an environmental
// policy — buried under /pages/social-impact. Those two are carried here as
// extras rather than dropped, since they are real published commitments.

const S3 = 'https://hubble-live-assets.s3.eu-west-1.amazonaws.com/jigsawconsult/file_asset/file';

export const POLICIES_INTRO =
  'Jigsaw’s work is based on a suite of policies which are publicly available and updated regularly.';

export const POLICIES = [
  { slug: 'privacy', title: 'Privacy', file: null, fileSize: null, awaitingFile: true },
  { slug: 'whistleblowing', title: 'Whistleblowing', file: null, fileSize: null, awaitingFile: true },
  { slug: 'ethics', title: 'Ethics', file: null, fileSize: null, awaitingFile: true },
  { slug: 'gdpr', title: 'GDPR / data protection', file: null, fileSize: null, awaitingFile: true },
  { slug: 'cybersecurity', title: 'Cybersecurity', file: null, fileSize: null, awaitingFile: true },
  { slug: 'safeguarding', title: 'Safeguarding', file: null, fileSize: null, awaitingFile: true }
];

// Published today but absent from the brief's list. Worth asking the client
// whether these belong on the Policies page or stay retired with the old site.
export const ADDITIONAL_POLICIES = [
  {
    slug: 'language',
    title: 'Language policy',
    // Filename typo is the client's: "Jigaw" rather than "Jigsaw".
    file: `${S3}/123/Jigaw_Language_Policy.pdf`,
    fileSize: '69.5 KB',
    awaitingFile: false
  },
  {
    slug: 'environmental',
    title: 'Environmental policy',
    file: `${S3}/169/Environment_policy_2023.pdf`,
    fileSize: '403 KB',
    awaitingFile: false
  }
];

export const STANDARDS_INTRO =
  'We are also committed to various standards that guide the way we work. These include:';

export const STANDARDS = [
  { title: 'The TRUST Global Code of Conduct', url: 'https://www.globalcodeofconduct.org/' },
  { title: 'Dignified Storytelling pledge', url: 'https://dignifiedstorytelling.com/' }
];

// The brief leaves the reporting route as [tbc].
export const CONCERNS_CONTACT = null;
