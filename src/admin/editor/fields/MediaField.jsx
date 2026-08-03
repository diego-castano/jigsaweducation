'use client';

import { useState, useTransition } from 'react';
import Icon from '../../../components/Icon.jsx';
import { Button, Input, useToast } from '../../ui.jsx';
import MediaPicker from '../../media/MediaPicker.jsx';
import { listMedia, updateAlt } from '../../../cms/actions/media.js';

// image · file — the stored value is the media URL string ('/media/<key>').
// Everything flows through the MediaPicker; there is never a raw URL input.
// For images the alt text edits in place: selection hands us the full media
// record, and for values loaded from an existing document the record is
// looked up on demand by its key.

const basename = (url) => String(url || '').split('/').pop() || '';

export default function MediaField({ field, value, onChange, onBlur, error, inputId }) {
  const isImage = field.type === 'image';
  const toast = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [record, setRecord] = useState(null); // the media row behind `value`, once known
  const [alt, setAlt] = useState('');
  const [altOpen, setAltOpen] = useState(false);
  const [loadingAlt, startAltLookup] = useTransition();

  const inLibrary = typeof value === 'string' && value.startsWith('/media/');

  const select = (media) => {
    onChange(media.url);
    setRecord(media);
    setAlt(media.alt || '');
    setAltOpen(false);
    setPickerOpen(false);
    onBlur?.();
  };

  const remove = () => {
    onChange(null);
    setRecord(null);
    setAltOpen(false);
    onBlur?.();
  };

  const openAltEditor = () => {
    if (record) {
      setAlt(record.alt || '');
      setAltOpen(true);
      return;
    }
    const key = String(value).replace(/^\/media\//, '');
    startAltLookup(async () => {
      try {
        const { items } = await listMedia({ search: key, limit: 5 });
        const match = items.find((item) => item.key === key);
        if (!match) {
          toast.error('This image is not in the media library, so its alt text cannot be edited here.');
          return;
        }
        setRecord(match);
        setAlt(match.alt || '');
        setAltOpen(true);
      } catch {
        toast.error('The media library could not be reached. Try again.');
      }
    });
  };

  const saveAlt = async () => {
    if (!record) return;
    const result = await updateAlt(record.id, alt.trim());
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    setRecord({ ...record, alt: alt.trim() });
    toast.success('Alt text saved.');
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div
          className={
            'overflow-hidden rounded-xl border bg-cream-200/60 ' +
            (error ? 'border-error-500' : 'border-cream-300')
          }
        >
          {isImage ? (
            <img
              src={value}
              alt={record?.alt || ''}
              className="block max-h-56 w-full bg-cream-200 object-cover"
            />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-navy-900 text-cream-100">
                <Icon name="file-text" size={20} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-sm text-ink-800">
                  {record?.filename || basename(value)}
                </span>
                <span className="block text-xs text-ink-500">PDF document</span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          id={inputId}
          onClick={() => setPickerOpen(true)}
          aria-invalid={error ? true : undefined}
          className={
            'grid w-full place-items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-8 text-center ' +
            'transition-colors hover:border-sea-300 hover:bg-sea-50/40 focus-visible:ring-2 ' +
            'focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none ' +
            (error ? 'border-error-500' : 'border-cream-400')
          }
        >
          <Icon name={isImage ? 'eye' : 'file-text'} size={22} className="text-ink-500" />
          <span className="text-sm font-medium text-ink-700">
            {isImage ? 'No image yet' : 'No document yet'}
          </span>
          <span className="text-xs text-ink-500">Choose from the media library</span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
          {value ? 'Replace' : 'Choose'}
        </Button>
        {value && isImage && inLibrary && !altOpen && (
          <Button variant="ghost" size="sm" onClick={openAltEditor} loading={loadingAlt}>
            Edit alt text
          </Button>
        )}
        {value && field.nullable && (
          <Button variant="ghost" size="sm" onClick={remove}>
            Remove
          </Button>
        )}
      </div>

      {altOpen && record && (
        <div className="space-y-1.5 rounded-xl border border-cream-300 bg-cream-100 p-3">
          <label htmlFor={`${inputId}-alt`} className="text-sm font-semibold text-ink-800">
            Alt text
          </label>
          <p className="text-xs text-ink-600">
            What a screen reader says instead of the image. Applies everywhere this image appears.
          </p>
          <div className="flex gap-2">
            <Input
              id={`${inputId}-alt`}
              type="text"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  saveAlt();
                }
              }}
            />
            <Button variant="secondary" size="sm" onClick={saveAlt}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAltOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      )}

      {pickerOpen && (
        <MediaPicker
          open={pickerOpen}
          accept={isImage ? 'image' : 'pdf'}
          onClose={() => setPickerOpen(false)}
          onSelect={select}
        />
      )}
    </div>
  );
}
