import { useState, useEffect } from 'react';

/**
 * Returns false during SSR and the first client render,
 * then true after hydration is complete.
 * Use this to guard values that differ between server and client
 * (e.g. localStorage-persisted state).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
