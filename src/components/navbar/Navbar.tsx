"use client";

import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import type { NavItemId } from "@/config/navigation";
import NavbarLogo from "./NavbarLogo";
import NavbarDock from "./NavbarDock";
import NavbarCTA from "./NavbarCTA";
import NavbarMobile from "./NavbarMobile";

interface NavbarShellProps {
  activeId: NavItemId;
  intensity: MotionValue<number>;
  compact?: boolean;
}

function NavbarShell({ activeId, intensity, compact = false }: NavbarShellProps) {
  const background = useTransform(
    intensity,
    [0, 1],
    ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.45)"]
  );
  const borderOpacity = useTransform(intensity, [0, 1], [0.1, 0.18]);
  const blur = useTransform(intensity, [0, 1], ["24px", "40px"]);
  const shadow = useTransform(
    intensity,
    [0, 1],
    [
      "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
      "0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
    ]
  );

  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;
  const backdropFilter = useMotionTemplate`blur(${blur})`;

  return (
    <motion.div
      style={{
        backgroundColor: background,
        borderColor,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        boxShadow: shadow,
      }}
      className="relative flex items-center gap-3 md:gap-4 w-full max-w-[min(100%,72rem)] mx-auto px-3 md:px-4 py-2 md:py-2.5 rounded-full border"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent opacity-60"
        aria-hidden
      />
      <NavbarLogo />
      {!compact && <NavbarDock activeId={activeId} />}
      {!compact && (
        <div className="hidden md:block shrink-0">
          <NavbarCTA />
        </div>
      )}
      {compact && <div className="flex-1" />}
    </motion.div>
  );
}

export default function Navbar() {
  const activeId = useActiveSection();
  const { isVisible, intensity } = useNavbarScroll();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -120,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pt-4 md:pt-5 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-[min(100%,80rem)] flex items-center gap-2 md:gap-3">
        <div className="flex-1 min-w-0 hidden md:block">
          <NavbarShell activeId={activeId} intensity={intensity} />
        </div>

        <div className="flex-1 min-w-0 md:hidden">
          <NavbarShell activeId={activeId} intensity={intensity} compact />
        </div>

        <div className="md:hidden pointer-events-auto shrink-0">
          <NavbarMobile
            isOpen={mobileOpen}
            onToggle={() => setMobileOpen((o) => !o)}
            onClose={() => setMobileOpen(false)}
            activeId={activeId}
          />
        </div>
      </div>
    </motion.header>
  );
}
