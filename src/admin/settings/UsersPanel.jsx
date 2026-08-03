'use client';

// Settings → Users: everyone who can sign into the console, plus the add
// and remove flows. Passwords are set here once and changed by each person
// from their own Account tab; the generate button proposes a strong one so
// nobody invents "jigsaw123".

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../../components/Icon.jsx';
import { Button, IconButton, Input, Modal, useConfirm, useToast } from '../ui.jsx';
import { createAdminUser, deleteAdminUser, updateAdminUser } from './actions.js';

const generatePassword = () => {
  // Readable-strong: three blocks of letters+digits, no lookalike characters.
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const pick = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  return Array.from({ length: 3 }, () => Array.from({ length: 5 }, pick).join('')).join('-');
};

// Edit one account: name, email, and optionally a fresh password (left
// empty, the current one stays).
function EditUserModal({ user, onClose }) {
  const router = useRouter();
  const toast = useToast();
  const formRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await updateAdminUser(user.id, new FormData(formRef.current));
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success(
          result.selfEmailChanged
            ? 'Saved. Use the new email address the next time you sign in.'
            : `Saved the changes to ${user.email}.`
        );
        router.refresh();
        onClose();
      }
    } catch {
      setError('The account could not be updated. Try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal open title={`Edit ${user.name || user.email}`} onClose={onClose}>
      <form ref={formRef} onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="edit-user-name" className="text-sm font-semibold text-ink-800">
            Name
          </label>
          <Input id="edit-user-name" name="name" defaultValue={user.name || ''} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-user-email" className="text-sm font-semibold text-ink-800">
            Email address
          </label>
          <Input
            id="edit-user-email"
            name="email"
            type="email"
            defaultValue={user.email}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-user-password" className="text-sm font-semibold text-ink-800">
            New password
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Input
                id="edit-user-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                placeholder="Leave empty to keep the current one"
                className="pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide the password' : 'Show the password'}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-ink-500 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Icon name="eye" size={16} />
              </button>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setNewPassword(generatePassword());
                setShowPassword(true);
              }}
            >
              Generate
            </Button>
          </div>
          <p className="text-sm text-ink-600">
            Setting one signs them out of nothing — they simply use it from their next
            sign-in. Pass it on securely.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-error-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function UsersPanel({ users, sessionId }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [editing, setEditing] = useState(null);

  const formRef = useRef(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await createAdminUser(new FormData(formRef.current));
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success(
          `Account created for ${result.email}. Pass the password on securely — it is not shown again.`
        );
        formRef.current.reset();
        setPassword('');
        router.refresh();
      }
    } catch {
      setError('The account could not be created. Try again.');
    } finally {
      setPending(false);
    }
  };

  const remove = async (user) => {
    const ok = await confirm({
      title: `Remove ${user.name || user.email}?`,
      body: `${user.email} will no longer be able to sign into the console. Nothing they edited is affected.`,
      confirmLabel: 'Remove account',
    });
    if (!ok) return;
    const result = await deleteAdminUser(user.id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Removed ${user.email}.`);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-cream-200 bg-cream-100 p-6 shadow-xs sm:p-8">
        <h2 className="font-display text-xl text-ink-900">Who can sign in</h2>
        <p className="mt-1.5 text-sm text-ink-600">
          Every account has the same access: edit anything, publish anything.
        </p>

        <ul className="mt-6 divide-y divide-cream-200 overflow-hidden rounded-xl border border-cream-200 bg-cream-50">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-sm text-cream-50">
                {(user.name || user.email).trim().charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy-900">
                  {user.name || 'Unnamed'}
                  {String(user.id) === String(sessionId) && (
                    <span className="ml-2 rounded-full bg-cream-200 px-2 py-0.5 font-mono text-[10px] font-normal text-ink-600">
                      you
                    </span>
                  )}
                </p>
                <p className="truncate font-mono text-xs text-ink-600">{user.email}</p>
              </div>
              <p className="hidden shrink-0 font-mono text-[11px] text-ink-500 sm:block">
                {user.lastLogin
                  ? `last signed in ${user.lastLogin}`
                  : 'never signed in'}
              </p>
              <IconButton
                icon="edit"
                label={`Edit ${user.email}`}
                size="sm"
                onClick={() => setEditing(user)}
              />
              {String(user.id) !== String(sessionId) && (
                <IconButton
                  icon="trash"
                  label={`Remove ${user.email}`}
                  size="sm"
                  variant="danger"
                  onClick={() => remove(user)}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      {editing && <EditUserModal user={editing} onClose={() => setEditing(null)} />}

      <section className="rounded-2xl border border-cream-200 bg-cream-100 p-6 shadow-xs sm:p-8">
        <h2 className="font-display text-xl text-ink-900">Add an account</h2>
        <p className="mt-1.5 text-sm text-ink-600">
          Set their first password here and pass it on securely — they can change it
          themselves under Settings → Account once signed in.
        </p>

        <form ref={formRef} onSubmit={submit} className="mt-6 max-w-md space-y-5">
          <div className="space-y-2">
            <label htmlFor="new-user-name" className="text-sm font-semibold text-ink-800">
              Name
            </label>
            <Input id="new-user-name" name="name" autoComplete="off" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-user-email" className="text-sm font-semibold text-ink-800">
              Email address
            </label>
            <Input id="new-user-email" name="email" type="email" autoComplete="off" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-user-password" className="text-sm font-semibold text-ink-800">
              First password
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Input
                  id="new-user-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={10}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide the password' : 'Show the password'}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-ink-500 hover:text-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPassword(generatePassword());
                  setShowPassword(true);
                }}
              >
                Generate
              </Button>
            </div>
            <p className="text-sm text-ink-600">At least 10 characters.</p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-error-700">
              {error}
            </p>
          )}

          <Button type="submit" loading={pending}>
            Create account
          </Button>
        </form>
      </section>
    </div>
  );
}
