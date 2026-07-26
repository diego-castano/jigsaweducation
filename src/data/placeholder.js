// Placeholder copy for everything the client marked [tbc] in the July brief.
//
// The rule: placeholder must LOOK like placeholder. If it reads as finished
// copy, the client reviews it as finished copy and nobody notices it shipped.
// Anything rendered through <Placeholder> gets a dashed rule and muted colour,
// so a reviewer scanning the page can see the gaps without reading a word.

export const TBC = '[tbc]';

// Deliberately not lorem ipsum — naming the missing thing is more useful to the
// client than Latin. Each string says what belongs there and who owes it.
export const placeholder = (what) => `Placeholder — ${what}. Copy to come from the Jigsaw team.`;

export const isPlaceholder = (value) =>
  typeof value === 'string' && (value === TBC || value.startsWith('Placeholder —'));
