"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll to top only on in-app pathname changes (Next Link), not on the first
 * paint after a full load or refresh (avoids fighting scroll restoration).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (prevPathnameRef.current !== pathname) {
      window.scrollTo(0, 0);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  return null;
}
