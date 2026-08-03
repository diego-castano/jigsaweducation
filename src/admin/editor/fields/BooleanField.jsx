'use client';

import { Switch } from '../../ui.jsx';

// A toggle with its label inline. The FieldRenderer suppresses its own label
// row for booleans so the switch and the label read as one control.
export default function BooleanField({ field, value, onChange, inputId }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={inputId} className="text-sm font-semibold text-ink-800">
          {field.label}
        </label>
        {field.help && <p className="mt-0.5 text-sm text-ink-600">{field.help}</p>}
      </div>
      <Switch
        id={inputId}
        checked={Boolean(value)}
        onChange={(next) => onChange(Boolean(next))}
      />
    </div>
  );
}
