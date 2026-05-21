"use client";

import { LayoutGroup } from "framer-motion";
import { NAV_ITEMS, type NavItemId } from "@/config/navigation";
import NavLink from "./NavLink";

interface NavbarDockProps {
  activeId: NavItemId;
}

export default function NavbarDock({ activeId }: NavbarDockProps) {
  return (
    <nav
      className="hidden md:flex items-center justify-center flex-1 min-w-0"
      aria-label="Main navigation"
    >
      <LayoutGroup id="navbar-dock">
        <ul className="flex items-center gap-0.5 px-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <NavLink item={item} isActive={activeId === item.id} />
            </li>
          ))}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
