'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../../components/Icon.jsx';
import { Button, ConfirmDialog, useToast } from '../ui.jsx';
import { deleteItem } from '../../cms/actions/content.js';

// The item editor's footer card: the locked slug, and Delete behind a
// ConfirmDialog that names the item and mentions the revision snapshot.
// Slugs never change from the console - other pages link by them.

export default function DangerZone({ collection, id, title, itemLabel, slug }) {
  const router = useRouter();
  const toast = useToast();

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItem(collection, id);
      toast.success(`“${title}” has been deleted.`);
      router.push(`/admin/collections/${collection}`);
      router.refresh();
    } catch {
      toast.error(`“${title}” could not be deleted. Try again.`);
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <section aria-labelledby="danger-zone-heading" className="mt-8">
      <h2 id="danger-zone-heading" className="font-display text-lg text-navy-900">
        Danger zone
      </h2>

      <div className="mt-3 rounded-2xl border border-error-500/30 bg-cream-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-800">Web address</p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-sm break-all text-ink-700">
              <Icon name="shield" size={14} className="shrink-0 text-ink-500" aria-hidden="true" />
              {slug}
            </p>
          </div>
          <p className="max-w-xs text-sm text-ink-600">
            Slug changes break links: contact your developer.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-cream-200 pt-4">
          <p className="max-w-md text-sm text-ink-600">
            Deleting removes this {itemLabel} from the site and the console. The last published
            version stays in the revision history.
          </p>
          <Button variant="danger" size="sm" icon="trash" onClick={() => setConfirming(true)}>
            Delete {itemLabel}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title={`Delete “${title}”?`}
        body={
          `This removes the ${itemLabel} from the public site and the console. ` +
          `A snapshot of the last published version is kept in the revision history, ` +
          `so your developer can bring it back if needed.`
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setConfirming(false)}
      />
    </section>
  );
}
