"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * - Disables the browser’s default scroll restoration so a hard refresh does not
 *   jump from top back to the previous offset (awkward flash).
 * - Scrolls to top only on in-app pathname changes (Next Link), not on first paint.
 * Tradeoff: Back/Forward may not restore scroll position (same as many SPAs).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const { history } = window;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

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
