'use client';

// URL-addressable tabs for /admin/settings: the active tab lives in ?tab=,
// so every tab is linkable and survives a refresh. Switching replaces the
// URL (no history spam) and the server page renders the matching panel.

import { useRouter } from 'next/navigation';
import { Tabs } from '../ui.jsx';

export default function SettingsTabs({ tabs, active }) {
  const router = useRouter();

  return (
    <Tabs
      tabs={tabs}
      active={active}
      label="Settings areas"
      onChange={(id) => router.replace(`/admin/settings?tab=${id}`, { scroll: false })}
    />
  );
}
