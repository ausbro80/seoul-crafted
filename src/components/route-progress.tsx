"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin progress bar at the top of the viewport that shows during route
 * navigations. Uses pathname+searchParams as the signal and a short
 * animated bar. Zero dependencies.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Intercept clicks on same-origin links to immediately show the bar.
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a || !a.href) return;
      try {
        const u = new URL(a.href);
        if (u.origin !== window.location.origin) return;
        if (a.target && a.target !== "" && a.target !== "_self") return;
        // Only show for navigations away from current path.
        if (u.pathname === window.location.pathname && u.search === window.location.search) return;
        setVisible(true);
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Hide whenever route actually changed (transition done).
  useEffect(() => {
    setVisible(false);
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms" }}
    >
      <div
        className="h-full"
        style={{
          width: visible ? "95%" : "0%",
          backgroundColor: "var(--brand, #C44536)",
          transition: visible
            ? "width 1.2s cubic-bezier(.2,.8,.2,1)"
            : "width 0.15s",
        }}
      />
    </div>
  );
}
