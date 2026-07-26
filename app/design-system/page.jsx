'use client';

import DesignSystemApp from '../../src/design-system/App';

// The v1 design system document, preserved verbatim at its own route so the
// Railway preview the client reviewed stays reachable while the site is built.
// It opts out of the site chrome — no SiteHeader, no Footer — because it ships
// its own sidebar and splash.
export default function DesignSystemPage() {
  return <DesignSystemApp />;
}
