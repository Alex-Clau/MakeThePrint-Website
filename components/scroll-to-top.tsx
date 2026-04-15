"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Client navigations (Next Link) do not reset scroll by default. Scroll to top
 * on pathname change so long pages (e.g. account) do not keep prior offset.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
