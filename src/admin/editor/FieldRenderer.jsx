'use client';

import Icon from '../../components/Icon.jsx';
import TextField from './fields/TextField.jsx';
import TextareaField from './fields/TextareaField.jsx';
import RichTextField from './fields/RichTextField.jsx';
import SelectField from './fields/SelectField.jsx';
import IconField from './fields/IconField.jsx';
import BooleanField from './fields/BooleanField.jsx';
import CountryField from './fields/CountryField.jsx';
import LinkField from './fields/LinkField.jsx';
import ListField from './fields/ListField.jsx';
import MediaField from './fields/MediaField.jsx';
import { countWords, fieldDomId, isWiringField, validateFieldValue } from './validate.js';

// One schema field → label, control, counters, notices, inline error.
// Exported for reuse: the collection add-modal and settings forms render
// single fields through this without a full SchemaForm.
//
// Props:
//   field       the schema field declaration
//   path        dotted path of this field inside the document (row indexes
//               included for list rows) — drives error keys and DOM anchors
//   value       current value
//   onChange    (nextValue) => void
//   errors      { [path]: message } map owned by the form
//   setError    (path, message|null) => void
//   linkTargets [{ label, href }] for link fields, supplied by the route page

const INPUT_COMPONENTS = {
  text: TextField,
  email: TextField,
  url: TextField,
  number: TextField,
  textarea: TextareaField,
  richtext: RichTextField,
  select: SelectField,
  icon: IconField,
  boolean: BooleanField,
  country: CountryField,
  link: LinkField,
  list: ListField,
  image: MediaField,
  file: MediaField,
};

const Counter = ({ field, value }) => {
  if (typeof value !== 'string' && value != null) return null;
  if (field.maxWords) {
    const words = countWords(value);
    return (
      <span
        className={
          'font-mono text-xs tabular-nums ' +
          (words > field.maxWords ? 'font-semibold text-warning-700' : 'text-ink-500')
        }
      >
        {words}/{field.maxWords} words
      </span>
    );
  }
  if (field.maxLength) {
    const length = String(value || '').length;
    return (
      <span
        className={
          'font-mono text-xs tabular-nums ' +
          (length > field.maxLength ? 'font-semibold text-warning-700' : 'text-ink-500')
        }
      >
        {length}/{field.maxLength}
      </span>
    );
  }
  return null;
};

const VerbatimChip = () => (
  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-navy-900 px-2.5 py-1 font-mono text-[11px] leading-none text-cream-100">
    <Icon name="shield" size={11} />
    Client copy — supplied word-for-word
  </span>
);

const WarningNote = ({ children }) => (
  <div className="flex items-start gap-2 rounded-lg border border-warning-500/40 bg-warning-50 p-3 text-sm text-warning-700">
    <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
    <p>{children}</p>
  </div>
);

// Wiring fields (nav hrefs, office country codes and coordinates) show their
// value and the reason they are locked — no input at all.
const WiringValue = ({ field, value }) => (
  <div className="space-y-2">
    <div className="rounded-xl border border-cream-300 bg-cream-200/60 px-3.5 py-2.5">
      <span className="font-mono text-sm break-all text-ink-700">
        {value == null || value === '' ? '—' : Array.isArray(value) ? JSON.stringify(value) : String(value)}
      </span>
    </div>
    <WarningNote>{field.warning}</WarningNote>
  </div>
);

export default function FieldRenderer({ field, path, value, onChange, errors, setError, linkTargets }) {
  const domId = fieldDomId(path);
  const inputId = `${domId}-input`;
  const error = errors?.[path] || null;
  const wiring = isWiringField(field);
  const isBoolean = field.type === 'boolean';

  const handleBlur = () => {
    setError?.(path, validateFieldValue(field, value));
  };

  const handleChange = (next) => {
    // A visible error clears the moment the value passes again — leaving a
    // stale "required" note over a filled field reads as a broken form.
    if (error && !validateFieldValue(field, next)) setError?.(path, null);
    onChange(next);
  };

  if (wiring) {
    return (
      <div id={domId} className="space-y-1.5">
        <span className="text-sm font-semibold text-ink-800">{field.label}</span>
        <WiringValue field={field} value={value} />
      </div>
    );
  }

  const Control = INPUT_COMPONENTS[field.type];
  if (!Control) return null;

  return (
    <div id={domId} className="flex flex-col gap-2">
      {!isBoolean && (
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={inputId} className="text-sm font-semibold text-ink-800">
            {field.label}
            {field.required && (
              <span className="ml-1 text-orange-600" aria-hidden="true">
                *
              </span>
            )}
          </label>
          <Counter field={field} value={value} />
        </div>
      )}

      {field.verbatim && <VerbatimChip />}

      <Control
        field={field}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        inputId={inputId}
        path={path}
        errors={errors}
        setError={setError}
        linkTargets={linkTargets}
      />

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-sm text-error-700">
          {error}
        </p>
      )}

      {field.warning && <WarningNote>{field.warning}</WarningNote>}

      {field.help && !isBoolean && <p className="text-sm text-ink-600">{field.help}</p>}
    </div>
  );
}

export { FieldRenderer };
