"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItemId } from "@/config/navigation";
import { NAV_ITEMS, SECTION_IDS } from "@/config/navigation";

const SECTION_TO_NAV = Object.fromEntries(
  NAV_ITEMS.filter((item) => item.sectionId).map((item) => [
    item.sectionId!,
    item.id,
  ])
) as Record<string, NavItemId>;

const ROUTE_TO_NAV: Partial<Record<string, NavItemId>> = {
  "/projects": "projects",
  "/projects/videos": "experiments",
  "/projects/case-study": "case-studies",
  "/projects/ui-ux-product-design": "process",
  "/projects/graphic-design": "projects",
  "/projects/powerpoint-design": "projects",
};

function getActiveFromPath(pathname: string): NavItemId | null {
  if (pathname === "/") return null;
  if (ROUTE_TO_NAV[pathname]) return ROUTE_TO_NAV[pathname]!;
  if (pathname.startsWith("/projects/case-study")) return "case-studies";
  if (pathname.startsWith("/projects/videos")) return "experiments";
  if (pathname.startsWith("/projects/ui-ux")) return "process";
  if (pathname.startsWith("/projects")) return "projects";
  return null;
}

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

export function useActiveSection() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<NavItemId>("home");

  useEffect(() => {
    const routeActive = getActiveFromPath(pathname);
    if (routeActive) {
      setActiveId(routeActive);
      return;
    }

    if (pathname !== "/") {
      setActiveId("home");
      return;
    }

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
  }, [pathname]);

  return activeId;
}
