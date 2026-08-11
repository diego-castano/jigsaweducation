'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Switch, useConfirm, useToast } from '../ui.jsx';
import { setItemStatus } from '../../cms/actions/content.js';

// Visible/Hidden for one collection item. Hiding something the public can see
// asks first, in plain language; making it visible again is a single flip.
// The parent owns the status value so the rest of the editor (the hidden
// hint, the "Publish and make visible" button) follows the same state.

export default function StatusSwitch({ collection, id, title, itemLabel, status, onChange }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);

  const visible = status === 'published';

  const toggle = async (makeVisible) => {
    if (!makeVisible) {
      const ok = await confirm({
        title: `Hide “${title}”?`,
        body:
          `It disappears from the public site straight away. Nothing is deleted: ` +
          `you can make this ${itemLabel} visible again whenever you like.`,
        confirmLabel: 'Hide it',
      });
      if (!ok) return;
    }
    setBusy(true);
    try {
      const next = makeVisible ? 'published' : 'hidden';
      await setItemStatus(collection, id, next);
      onChange?.(next);
      toast.success(
        makeVisible
          ? `Visible: the ${itemLabel} is shown on the site again.`
          : `Hidden: visitors can no longer see this ${itemLabel}.`
      );
      router.refresh();
    } catch {
      toast.error('The change did not go through. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Switch
      checked={visible}
      disabled={busy}
      onChange={toggle}
      label={visible ? 'Visible' : 'Hidden'}
    />
  );
}
