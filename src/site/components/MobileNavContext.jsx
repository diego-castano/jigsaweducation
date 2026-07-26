'use client';

import { createContext, useContext, useState } from 'react';

// One drawer, two triggers: the header hamburger and the tab bar's Menu slot
// both drive the same state, so the site never grows a second competing menu.
const Ctx = createContext(null);

export function MobileNavProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <Ctx.Provider value={{ menuOpen, setMenuOpen }}>{children}</Ctx.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMobileNav requires MobileNavProvider');
  return ctx;
}
