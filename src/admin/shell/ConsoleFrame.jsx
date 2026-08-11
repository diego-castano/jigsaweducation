'use client';

// The console's outer frame, client-side so the sidebar can collapse to an
// icon rail. Everything inside stays server-rendered - this component only
// owns the collapsed flag and the widths that depend on it.

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileShell from './MobileShell';
import VersionWatcher from './VersionWatcher';

const STORAGE_KEY = 'jigsaw-admin:nav-collapsed';

export default function ConsoleFrame({ groups, session, draftCount, labels, children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Server renders expanded; the stored preference lands after mount.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') setCollapsed(true);
    } catch {
      // Preference simply is not remembered.
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, current ? '0' : '1');
      } catch {
        // Ignore.
      }
      return !current;
    });
  };

  const railWidth = collapsed ? 'w-[68px]' : 'w-[260px]';
  const contentPad = collapsed ? 'lg:pl-[68px]' : 'lg:pl-[260px]';

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-cream-50">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-cream-50"
      >
        Skip to content
      </a>

      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden lg:block ${railWidth} motion-safe:transition-[width] motion-safe:duration-300`}
      >
        <Sidebar
          groups={groups}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
        />
      </aside>

      <MobileShell groups={groups} session={session} draftCount={draftCount} />

      <div
        className={`flex min-h-0 flex-1 flex-col ${contentPad} motion-safe:transition-[padding] motion-safe:duration-300`}
      >
        <TopBar session={session} draftCount={draftCount} labels={labels} />
        <main
          id="admin-main"
          className="admin-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:py-10"
        >
          {children}
        </main>
        <VersionWatcher />
      </div>
    </div>
  );
}
