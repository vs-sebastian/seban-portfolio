"use client";

import { useEffect, useState } from "react";
import type { NavItemId } from "@/config/navigation";
import { NAV_ITEMS, SECTION_IDS } from "@/config/navigation";

const SECTION_TO_NAV = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.sectionId, item.id])
) as Record<string, NavItemId>;

function getActiveSectionId(): NavItemId {
  const line = window.innerHeight * 0.35;
  let closestId = SECTION_IDS[0];
  let closestDistance = Infinity;

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - line);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestId = id;
    }
  }

  return SECTION_TO_NAV[closestId] ?? "home";
}

/**
 * Tracks active section from viewport position — single rAF-throttled
 * scroll listener, separate from the canvas render loop.
 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState<NavItemId>("home");

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setActiveId(getActiveSectionId());
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return activeId;
}
