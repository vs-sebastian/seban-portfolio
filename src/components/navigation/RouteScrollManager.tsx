"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyRouteScroll } from "@/lib/navigation/scroll";

/**
 * Ensures predictable scroll position after App Router navigations.
 * Fixes stale scroll restoration and hash targets when returning home.
 */
export default function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "";
    const frame = requestAnimationFrame(() => {
      applyRouteScroll(pathname);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => applyRouteScroll(pathname);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
