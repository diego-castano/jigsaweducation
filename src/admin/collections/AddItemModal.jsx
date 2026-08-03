'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, useToast } from '../ui.jsx';
import FieldRenderer from '../editor/FieldRenderer.jsx';
import { validateFieldValue } from '../editor/validate.js';
import { createItem } from '../../cms/actions/content.js';

// The "Add <itemLabel>" flow: a modal asking only for the title field, then
// straight into the new item's editor. Items are created hidden, so nothing
// half-finished can reach the site.
//
// `field` is the schema declaration of the collection's titleField — rendered
// through FieldRenderer so its label, help text and any warning (the
// case-study address lock, say) appear here too.

export default function AddItemModal({ collection, itemLabel, field }) {
  const router = useRouter();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const formId = `add-${collection}-form`;

  const openModal = () => {
    setValue('');
    setErrors({});
    setCreating(false);
    setOpen(true);
  };

  const close = () => {
    if (!creating) setOpen(false);
  };

  const setError = (path, message) => {
    setErrors((current) => {
      if (!message) {
        if (!current[path]) return current;
        const next = { ...current };
        delete next[path];
        return next;
      }
      return { ...current, [path]: message };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = typeof value === 'string' ? value.trim() : value;
    const message = validateFieldValue(field, trimmed);
    if (message) {
      setError(field.name, message);
      return;
    }
    setCreating(true);
    try {
      const created = await createItem(collection, { [field.name]: trimmed });
      toast.success('Created as hidden — publish when ready.');
      router.push(`/admin/collections/${collection}/${created.id}`);
      // The modal stays up, spinner running, until the editor route lands.
    } catch {
      toast.error(`The ${itemLabel} could not be created. Try again.`);
      setCreating(false);
    }
  };

  return (
    <>
      <Button icon="plus" size="sm" onClick={openModal}>
        Add {itemLabel}
      </Button>

      <Modal
        open={open}
        onClose={close}
        title={`New ${itemLabel}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={close} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" form={formId} loading={creating}>
              Create
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={handleSubmit} className="space-y-4">
          <FieldRenderer
            field={field}
            path={field.name}
            value={value}
            onChange={setValue}
            errors={errors}
            setError={setError}
          />
          <p className="text-sm text-ink-600">
            It starts hidden, so you can fill everything in and publish when ready.
          </p>
        </form>
      </Modal>
    </>
  );
}
