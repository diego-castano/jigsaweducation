'use client';

import { Input } from '../../ui.jsx';

// text · email · url · number — one Input, tuned per type. Numbers come back
// out of the field as real numbers (or null when cleared) so the stored
// document matches what src/data kept.
const TYPE_PROPS = {
  text: { type: 'text' },
  email: { type: 'email', inputMode: 'email', autoComplete: 'off', placeholder: 'name@example.org' },
  url: { type: 'url', inputMode: 'url', autoComplete: 'off', placeholder: 'https://', spellCheck: false },
  number: { type: 'number', inputMode: 'numeric', step: 1 },
};

export default function TextField({ field, value, onChange, onBlur, error, inputId }) {
  const props = TYPE_PROPS[field.type] || TYPE_PROPS.text;

  const handleChange = (event) => {
    const raw = event.target.value;
    if (field.type === 'number') {
      onChange(raw === '' ? null : Number(raw));
    } else {
      onChange(raw);
    }
  };

  return (
    <Input
      id={inputId}
      {...props}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={onBlur}
      invalid={Boolean(error)}
      aria-describedby={error ? `${inputId}-error` : undefined}
      className={field.type === 'url' || field.type === 'email' ? 'font-mono text-sm' : undefined}
    />
  );
}
