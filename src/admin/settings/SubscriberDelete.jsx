'use client';

// The per-row delete on /admin/subscribers: ConfirmDialog naming the exact
// address, then the deleteSubscriber action. Failures surface as a toast -
// the button never dies silently.

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton, useConfirm, useToast } from '../ui.jsx';
import { deleteSubscriber } from './actions.js';

export default function SubscriberDelete({ id, email }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const remove = async () => {
    const ok = await confirm({
      title: `Remove ${email}?`,
      body: `${email} comes off the mailing list and will not appear in future CSV exports. They can sign up again through the site at any time.`,
      confirmLabel: 'Remove subscriber'
    });
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteSubscriber(id);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${email} removed from the mailing list.`);
      router.refresh();
    });
  };

  return (
    <IconButton
      icon="trash"
      variant="danger"
      size="sm"
      label={`Remove ${email} from the mailing list`}
      onClick={remove}
      disabled={pending}
    />
  );
}
