'use client';

import { Textarea } from '../../ui.jsx';

// Multi-paragraph prose. The blank-line convention matches how src/data
// stores bios and section bodies, so the hint states it under every textarea.
// The live word count for maxWords lives in the FieldRenderer chrome, beside
// the label, so the counter never causes layout shift down here.
export default function TextareaField({ field, value, onChange, onBlur, error, inputId }) {
  return (
    <div className="space-y-1">
      <Textarea
        id={inputId}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        rows={3}
        invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      <p className="text-xs text-ink-500">Blank line starts a new paragraph.</p>
    </div>
  );
}
